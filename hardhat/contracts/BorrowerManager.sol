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
    uint256 public constant LIQUIDATION_BONUS = 500;     // 5% bonus liquidation
    uint256 public constant TOTAL_BASIS_POINTS = 10000;

    struct BorrowerInfo {
        uint256 debt;
        uint256 validatorTokenId;
        uint256 borrowTimestamp;
        bool isLiquidated;
    }

    mapping(address => BorrowerInfo) public borrowers;
    mapping(uint256 => address) public validatorOwners;
    mapping(uint256 => uint256) public validatorPrices;  // Prix des validators


    
    event LiquidationRisk(address indexed borrower, uint256 tokenId);
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


    function borrow(uint256 tokenId, uint256 amount, address borrower) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(borrowers[borrower].debt == 0, "Existing debt must be repaid");

        // Fetch the balance of the validator 
        CompleteValidatorInfo memory info = getCompleteValidatorInfo(valeToken.getPublicKey(tokenId));
        uint256 validatorValue = info.balance;

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

        usdc.transferFrom(address(vaultmanager), borrower,amount); 
    }

    function repay(address borrower) external nonReentrant {
        BorrowerInfo storage info = borrowers[borrower];
        require(info.debt > 0, "No debt to repay");
        require(!info.isLiquidated, "Position liquidated");

        uint256 amount = info.debt;
        uint256 tokenId = info.validatorTokenId;

        usdc.transferFrom(borrower, address(vaultmanager), amount);
        valeToken.transferFrom(address(this), borrower, tokenId);

        delete borrowers[borrower];
        delete validatorOwners[tokenId];
    }


    function canBeLiquidated(address borrower, uint256 tokenId) public view returns (bool) {
        BorrowerInfo memory info = borrowers[borrower];
        if (info.debt == 0 || info.isLiquidated) return false;
 
        CompleteValidatorInfo memory validator_info = getCompleteValidatorInfo(valeToken.getPublicKey(tokenId));
        uint256 validatorBalance = validator_info.balance;

        return validatorBalance >= LIQUIDATION_AMOUNT;
    }

    function liquidate(address borrower) external nonReentrant {
        require(canBeLiquidated(borrower), "Position not liquidatable");
        BorrowerInfo storage info = borrowers[borrower];
        uint256 debt = info.debt;
        uint256 tokenId = info.validatorTokenId;

        // Transférer l'emprunt (USDC) du liquidateur vers le contrat
        require(usdc.transferFrom(msg.sender, address(vaultmanager), debt), "Transfer failed");

        // Transférer le NFT à l'adresse du contrat (vaultManager)
        valeToken.transferFrom(address(this), msg.sender, tokenId);

        // Marquer la position comme liquidée
        info.isLiquidated = true;
        // Émettre l'événement de liquidation
        emit Liquidated(borrower, msg.sender, tokenId, debt, 0);  
    }


} 