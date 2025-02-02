// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ValeToken.sol";
import "./VaultManager.sol";

interface IDataStorage {
    struct ValidatorInfo {
        uint256 balance;
        uint256 rewards;
        uint256 lastTimestamp;
    }
    
    struct PriceInfo {
        uint256 price;  // ETH price in USD (with 8 decimals)
        uint256 lastTimestamp;
    }
    
    function getValidatorInfo(string memory _validatorId) external view returns (ValidatorInfo memory);
    function ethPrice() external view returns (PriceInfo memory);
}

contract BorrowerManager is ReentrancyGuard, Ownable {
     IDataStorage public oracle;
    
    struct CompleteValidatorInfo {
        uint256 balance;        // in wei
        uint256 rewards;        // in wei
        uint256 ethPrice;       // ETH/USD with 8 decimals
        uint256 balanceUSD;     // balance in USD with 8 decimals
        uint256 rewardsUSD;     // rewards in USD with 8 decimals
        uint256 validatorTimestamp;
        uint256 priceTimestamp;
    }
    ValeToken public valeToken;
    VaultManager public vaultmanager;
    IERC20 public usdc;
    
    uint256 public constant LTV_RATIO = 85;              // 85% rate loan/value max
    uint256 public constant RATIO_DENOMINATOR = 100;
    uint256 public constant LIQUIDATION_AMOUNT = 32 ether; 
    uint256 public lastMonthTotalRewards = 0;
    uint256[] public validatorTokenIds;


    struct BorrowerInfo {
        uint256 debt;
        uint256 validatorTokenId;
        uint256 borrowTimestamp;
        bool isLiquidated;
    }

    mapping(address => BorrowerInfo) public borrowers;
    mapping(uint256 => address) public validatorOwners;
    mapping(uint256 => uint256) public validatorPrices;  // Prix des validators


        event Liquidated(
        address indexed borrower,
        address indexed liquidator,
        uint256 tokenId,
        uint256 debt,
        uint256 bonus
    );

    constructor(address _valeToken, address _usdc, address _vaultmanager) Ownable(msg.sender) {
        valeToken = ValeToken(_valeToken);
        vaultmanager = VaultManager(_vaultmanager);
        usdc = IERC20(_usdc);
        oracle = IDataStorage(0x22Ba0717ff5b1382B92AbD1d07aD03639f5E2d9b);
    }

    function getCompleteValidatorInfo(string memory _validatorId) public view returns (CompleteValidatorInfo memory info) 
    {
        // Get validator data
        IDataStorage.ValidatorInfo memory validatorData = oracle.getValidatorInfo(_validatorId);
        
        // Get price data
        IDataStorage.PriceInfo memory priceData = oracle.ethPrice();
        
        // Calculate USD values (considering 18 decimals for ETH and 8 decimals for price)
        uint256 balanceUSD = (validatorData.balance * priceData.price) / 1e18;
        uint256 rewardsUSD = (validatorData.rewards * priceData.price) / 1e18;
        
        return CompleteValidatorInfo({
            balance: validatorData.balance,
            rewards: validatorData.rewards,
            ethPrice: priceData.price,
            balanceUSD: balanceUSD,
            rewardsUSD: rewardsUSD,
            validatorTimestamp: validatorData.lastTimestamp,
            priceTimestamp: priceData.lastTimestamp
        });
    }

    // Ajouter un validateur à la liste (appelé lors de l'ajout d'un NFT)
    function addValidator(uint256 tokenId) internal {
        validatorTokenIds.push(tokenId);
    }

    // Supprime un validateur (ex : en cas de liquidation)
    function removeValidator(uint256 tokenId) internal {
        for (uint256 i = 0; i < validatorTokenIds.length; i++) {
            if (validatorTokenIds[i] == tokenId) {
                validatorTokenIds[i] = validatorTokenIds[validatorTokenIds.length - 1]; // Remplace par le dernier élément
                validatorTokenIds.pop(); // Supprime le dernier élément
                break;
            }
        }
    }

    function borrow(uint256 tokenId, address borrower) external nonReentrant {
        // Fetch the balance of the validator and the ethprice
        CompleteValidatorInfo memory info = getCompleteValidatorInfo(valeToken.getPublicKey(tokenId));
        uint256 validatorValue = info.balance;
        uint256 amount = info.ethPrice* validatorValue;
        require(amount > 0, "Amount must be greater than 0");
        require(borrowers[borrower].debt == 0, "Existing debt must be repaid");

        //Calcul max Borrox
        uint256 maxBorrow = (validatorValue * LTV_RATIO) / RATIO_DENOMINATOR;
        require(amount <= maxBorrow, "Amount exceeds maximum borrowable value");

        //Depose the NFT on the contract 
        valeToken.transferFrom(borrower, address(this), tokenId);
        
        borrowers[borrower] = BorrowerInfo({
            debt: amount,
            validatorTokenId: tokenId,
            borrowTimestamp: block.timestamp,
            isLiquidated: false
        });
        validatorOwners[tokenId] = borrower;
        addValidator(tokenId);
        lastMonthTotalRewards += info.rewards;

        usdc.transferFrom(address(vaultmanager), borrower,amount); 
    }

    function repay(address borrower) external nonReentrant {
        BorrowerInfo storage info = borrowers[borrower];
        uint256 tokenId = info.validatorTokenId;
        CompleteValidatorInfo memory complete = getCompleteValidatorInfo(valeToken.getPublicKey(tokenId));

        require(info.debt > 0, "No debt to repay");
        require(!info.isLiquidated, "Position liquidated");

        uint256 amount = info.debt * complete.ethPrice;

        usdc.transferFrom(borrower, address(vaultmanager), amount);
        valeToken.transferFrom(address(this), borrower, tokenId);

        removeValidator(info.validatorTokenId);
        lastMonthTotalRewards-= complete.rewards;

        delete borrowers[borrower];
        delete validatorOwners[tokenId];
    }


    function canBeLiquidated(address borrower) public view returns (bool) {
        BorrowerInfo memory info = borrowers[borrower];
        uint256 tokenId = info.validatorTokenId;
        if (info.debt == 0 || info.isLiquidated) return false;
 
        CompleteValidatorInfo memory validator_info = getCompleteValidatorInfo(valeToken.getPublicKey(tokenId));
        uint256 validatorBalance = validator_info.balance;

        return validatorBalance >= LIQUIDATION_AMOUNT;
    }

    function liquidate(address borrower) external nonReentrant {
        BorrowerInfo storage info = borrowers[borrower];
        uint256 debt = info.debt;
        uint256 tokenId = info.validatorTokenId;
        require(canBeLiquidated(borrower), "Position not liquidatable");

        // Transférer le NFT à l'adresse du contrat (vaultManager)
        valeToken.transferFrom(address(this), msg.sender, tokenId);

        // Marquer la position comme liquidée
        info.isLiquidated = true;

        removeValidator(info.validatorTokenId);
        CompleteValidatorInfo memory toremove = getCompleteValidatorInfo(valeToken.getPublicKey(tokenId));
        
        lastMonthTotalRewards-= toremove.rewards;

        // Émettre l'événement de liquidation
        emit Liquidated(borrower, msg.sender, tokenId, debt, 0);  
    }

    function getTotalBorrowedTokens() public view returns (uint256) {
        uint256 totalBorrowed = 0;

        for (uint256 i = 0; i < validatorTokenIds.length; i++) {
            uint256 tokenId = validatorTokenIds[i];
            address borrower = validatorOwners[tokenId];

        if (borrower != address(0)) {  // Vérifier que le NFT est bien emprunté
            totalBorrowed += borrowers[borrower].debt;
        }}
        return totalBorrowed;
    }

    // Fonction pour calculer les rewards mensuels sans paramètre
    function calculateMonthlyRewards() public returns (uint256) {
        uint256 totalCurrentRewards = 0;

        // Parcours tous les validateurs enregistrés
        for (uint256 i = 0; i < validatorTokenIds.length; i++) {
            string memory publicKey = valeToken.getPublicKey(validatorTokenIds[i]);
            CompleteValidatorInfo memory info = getCompleteValidatorInfo(publicKey);
            totalCurrentRewards += info.rewards;
        }

        uint256 rate_loan_value = vaultmanager.getUtilizationRatio();
        
        // Calcul des nouveaux rewards gagnés ce mois-ci
        uint256 monthlyRewards = totalCurrentRewards - lastMonthTotalRewards;
        uint256 monthlyRewards_loaners = monthlyRewards*rate_loan_value;
        
        lastMonthTotalRewards = totalCurrentRewards;

        return monthlyRewards_loaners;  // Cette valeur sera redistribuée aux prêteurs
    }

}