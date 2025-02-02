// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "./VaultManager.sol";
// import "./BorrowerManager.sol";
// import "./RewardManager.sol";


// import "@openzeppelin/contracts/access/Ownable.sol";

// contract LendingPool is Ownable {
//     VaultManager public vaultManager;
//     BorrowerManager public borrowerManager;
//     RewardManager public rewardManager;

//     constructor(
//         address _usdc,
//         address _validatorNFT
//     ) Ownable(msg.sender) {
//         vaultManager = new VaultManager(_usdc);
//         borrowerManager = new BorrowerManager(_validatorNFT, _usdc);
//         rewardManager = new RewardManager(_usdc, 0x40E0f2b9f03A9Df3fC7553a91bd239AA1748Df1f);
//     }

//     // Fonction pour les prêteurs
//     function deposit(uint256 amount) external {
//         vaultManager.deposit(amount, msg.sender);
//     }

//     function withdraw(uint256 amount) external {
//         vaultManager.withdraw(amount, msg.sender, msg.sender);
//     }

//     // Fonction pour les emprunteurs
//     function borrow(uint256 tokenId, uint256 amount) external {
//         borrowerManager.borrow(tokenId, amount, msg.sender);
//     }

//     function repay() external {
//         borrowerManager.repay(msg.sender);
//     }

//     // Fonction admin
//     function collectAndDistributeRewards() external onlyOwner {
//         rewardManager.collectAndDistribute(
//             borrowerManager.getLockedValidators(),
//             vaultManager.getTotalDeposits()
//         );
//     }
// } 