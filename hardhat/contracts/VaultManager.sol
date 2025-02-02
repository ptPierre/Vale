// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract VaultManager is ERC4626 {
    uint256 public constant MIN_DEPOSIT = 100 * 10**6;    // 100 USDC
    uint256 public constant LOCK_PERIOD = 30 days;
    
    // Pour le calcul des interests
    uint256 private totalInterestsEarned;      // Total des interests générés
    uint256 private interestsPerShare;         // interests accumulés par share
    uint256 private constant interestS_PRECISION = 1e12;

    mapping(address => uint256) public depositTimestamps;
    mapping(address => uint256) public interestDebt;        // Pour tracker les interests déjà payés

    event interestsDistributed(uint256 amount);
    event interestsClaimed(address indexed user, uint256 amount);

    constructor(address _usdc) ERC4626(IERC20(_usdc)) ERC20("Vale Part", "VP") {}

    // calculer les parts en tenant compte des interests accumulés
    function convertToShares(uint256 assets) public view virtual override returns (uint256) {
        uint256 supply = totalSupply();
        if (supply == 0) {
            return assets;
        }
        // Les nouveaux déposants reçoivent moins de parts si il y a des interests accumulés
        return (assets * supply) / (totalAssets() + totalInterestsEarned);
    }

    // Override pour calculer les assets en incluant les interests
    function convertToAssets(uint256 shares) public view virtual override returns (uint256) {
        uint256 supply = totalSupply();
        if (supply == 0) {
            return shares;
        }
        // La valeur des parts augmente avec les interests
        return (shares * (totalAssets() + totalInterestsEarned)) / supply;
    }

    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        require(assets >= MIN_DEPOSIT, "Minimum deposit is 100 USDC");
        depositTimestamps[receiver] = block.timestamp;

        // Mise à jour des interests avant le dépôt
        updateinterestDebt(receiver);
        
        uint256 shares = super.deposit(assets, receiver);
        interestDebt[receiver] = (shares * interestsPerShare) / interestS_PRECISION;
        
        return shares;
    }

    function withdraw(uint256 assets, address receiver, address owner) public override returns (uint256) {
        require(
            block.timestamp >= depositTimestamps[owner] + LOCK_PERIOD,
            "Funds are locked for 30 days"
        );

        // Claim des interests avant le retrait
        claiminterests(owner);
        
        return super.withdraw(assets, receiver, owner);
    }

    // Distribution des interests des validators
    function distributeinterests(uint256 amount) external {
        require(totalSupply() > 0, "No shares");
        
        totalInterestsEarned += amount;
        interestsPerShare += (amount * interestS_PRECISION) / totalSupply();
        
        emit interestsDistributed(amount);
    }

    // Calcul des interests en attente pour un utilisateur
    function pendinginterests(address user) public view returns (uint256) {
        uint256 shares = balanceOf(user);
        if (shares == 0) return 0;
        
        uint256 accumulatedinterests = (shares * interestsPerShare) / interestS_PRECISION;
        return accumulatedinterests - interestDebt[user];
    }

    // Claim des interests
    function claiminterests(address user) public returns (uint256) {
        uint256 pending = pendinginterests(user);
        if (pending > 0) {
            interestDebt[user] = (balanceOf(user) * interestsPerShare) / interestS_PRECISION;
            IERC20(asset()).transfer(user, pending);
            emit interestsClaimed(user, pending);
        }
        return pending;
    }

    // Mise à jour du interest debt
    function updateinterestDebt(address user) internal {
        if (balanceOf(user) > 0) {
            claiminterests(user);
        }
    }

    // Pour la compatibilité avec LendingPool
    function getTotalDeposits() external view returns (uint256) {
        return totalAssets();
    }
} 