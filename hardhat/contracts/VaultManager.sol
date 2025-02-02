// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./BorrowerManager.sol";


contract VaultManager is ERC4626 {
    uint256 private constant LOCK_PERIOD = 30 days;
    uint256 private constant MIN_DEPOSIT = 100e6; // 100 USDC (6 decimals)

    uint256 private totalInterestsEarned;      
    uint256 private interestsPerShare;         
    uint256 private constant interestS_PRECISION = 1e12;
    uint256 public totalWithdrawn;

    BorrowerManager public borrowerManager;

    mapping(address => uint256) public depositTimestamps;
    mapping(address => uint256) public interestDebt;    
    mapping(address => uint256) public pendingAmounts;    

    event interestsDistributed(uint256 amount);
    event interestsClaimed(address indexed user, uint256 amount);

    constructor(address _usdc) ERC4626(IERC20(_usdc)) ERC20("Vale Part", "VP") {}

    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        require(assets >= MIN_DEPOSIT, "Minimum deposit is 100 USDC");
        depositTimestamps[receiver] = block.timestamp;

        updateinterestDebt(receiver);
        
        uint256 shares = super.deposit(assets, receiver);
        interestDebt[receiver] = (shares * interestsPerShare) / interestS_PRECISION;
        
        return shares;
    }

   // withdraw to track withdrawals
function withdraw(uint256 assets, address receiver, address owner) public override returns (uint256) {
    require(
        block.timestamp >= depositTimestamps[owner] + LOCK_PERIOD,
        "Funds are locked for 30 days"
    );

    claimPendingToShares(owner);
    
    totalWithdrawn += assets;
    return super.withdraw(assets, receiver, owner);
}

    function getUserSharePercentage(address user) public view returns (uint256) {
        uint256 totalShares = totalSupply();
        if (totalShares == 0) return 0;
        return (balanceOf(user) * 10000) / totalShares;
    }

    function distributeinterests(address user) public {
     uint256 totalAmount= borrowerManager.calculateMonthlyRewards();
    // Get user share percentage (in basis points)
    uint256 userPercentage = getUserSharePercentage(user);
    require(userPercentage > 0, "No shares owned");
    
    // Calculate user's portion of amount
    uint256 userAmount = (totalAmount * userPercentage) / 10000;
    
    // Add to pending amounts
    pendingAmounts[user] += userAmount;
}

    function claimPendingToShares(address user) public returns (uint256) {
    uint256 pendingAmount = pendingAmounts[user];
    require(pendingAmount > 0, "No pending rewards");
    
    // Convert pending amount to shares
    uint256 newShares = convertToShares(pendingAmount);
    
    // Reset pending amount
    pendingAmounts[user] = 0;
    
    // Mint new shares to user
    _mint(user, newShares);
    
    return newShares;
}

function getPendingAmount(address user) public view returns (uint256) {
    return pendingAmounts[user];
}

// Add function to get current lending amount
function getCurrentLendingAmount() public view returns (uint256) {
    uint256 totalDeposited = totalAssets(); // From ERC4626
    return totalDeposited - totalWithdrawn;
}

function getUtilizationRatio() public view returns (uint256) {
        uint256 currentLending = getCurrentLendingAmount();
        if (currentLending == 0) return 0;
        
        uint256 totalBorrowed = borrowerManager.getTotalBorrowedTokens();
        return (totalBorrowed * 10000) / currentLending;
    }

    function updateinterestDebt(address user) internal {
        uint256 shares = balanceOf(user);
        if (shares > 0) {
            interestDebt[user] = (shares * interestsPerShare) / interestS_PRECISION;
        }
    }

    
}