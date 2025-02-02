// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ValeToken.sol";

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

contract RewardManager is Ownable {
    IERC20 public usdc;
    ValeToken public valeToken;
    
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

    uint256 public totalRewardsCollected;
    uint256 public lastRewardDistribution;
    uint256 public constant REWARD_RATE = 500;           // 5% annuel
    uint256 public constant COMPANY_SHARE = 2000;        // 20% pour l'entreprise
    uint256 public constant TOTAL_BASIS_POINTS = 10000;  // 100%

    address public companyWallet;
    uint256 public companyRewards;

    event RewardsCollected(uint256 total, uint256 companyPart, uint256 lendersPart);
    event CompanyRewardsWithdrawn(uint256 amount);

    constructor(address _usdc, address _valeToken) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        oracle = IDataStorage(0x17BAa4ab9145654365cB6C87F1D3722e5b247900);
        lastRewardDistribution = block.timestamp;
        valeToken = ValeToken(_valeToken);
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

    function setCompanyWallet(address _wallet) external onlyOwner {
        companyWallet = _wallet;
    }

    function collectAndDistribute(uint256[] memory validators, uint256 totalDeposits) external {
        uint256 newRewards = calculateValidatorRewards(validators);
        
        // Part entreprise
        uint256 companyPart = (newRewards * COMPANY_SHARE) / TOTAL_BASIS_POINTS;
        companyRewards += companyPart;
        
        // Part prêteurs
        uint256 lendersPart = newRewards - companyPart;
        totalRewardsCollected += lendersPart;

        emit RewardsCollected(newRewards, companyPart, lendersPart);

        // Distribution aux prêteurs si il y a des dépôts
        if (totalDeposits > 0) {
            uint256 timeElapsed = block.timestamp - lastRewardDistribution;
            uint256 rewardsToDistribute = (totalDeposits * REWARD_RATE * timeElapsed) / (365 days * 10000);
            
            if (rewardsToDistribute > totalRewardsCollected) {
                rewardsToDistribute = totalRewardsCollected;
            }

            totalRewardsCollected -= rewardsToDistribute;
            lastRewardDistribution = block.timestamp;

            usdc.transfer(address(this), rewardsToDistribute);
        }
    }

    function withdrawCompanyRewards() external {
        require(msg.sender == companyWallet, "Only company wallet");
        require(companyRewards > 0, "No rewards to withdraw");

        uint256 amount = companyRewards;
        companyRewards = 0;
        
        require(usdc.transfer(companyWallet, amount), "Transfer failed");
        emit CompanyRewardsWithdrawn(amount);
    }

    function calculateValidatorRewards(uint256[] memory validators) internal view returns (uint256) {
        // À implémenter : calcul réel des rewards
        //return 0.1 ether * validators.length;
    }
    
    function testoracle() external view returns (uint256,uint256,uint256,uint256){ 
        CompleteValidatorInfo memory validator_info = getCompleteValidatorInfo(valeToken.getPublicKey(1));
        return (validator_info.balance, validator_info.rewards, validator_info.ethPrice, validator_info.validatorTimestamp);
    }

}