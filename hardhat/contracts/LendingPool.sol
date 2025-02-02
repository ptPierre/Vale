// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VaultManager.sol";
import "./BorrowerManager.sol";


import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingPool is Ownable {
    VaultManager public vaultManager;
    BorrowerManager public borrowerManager;

    constructor(
        address _usdc,
        address _validatorNFT,
        address _vaultmanager
    ) Ownable(msg.sender) {
        vaultManager = new VaultManager(_usdc);
        borrowerManager = new BorrowerManager(_validatorNFT, _usdc, _vaultmanager);
    }

    // Fonction pour les prêteurs
    function deposit(uint256 amount) external {
        vaultManager.deposit(amount, msg.sender);
    }

    function withdraw(uint256 amount) external {
        vaultManager.withdraw(amount, msg.sender, msg.sender);
    }

    function distributeinterests(address user) external{
        vaultManager.distributeinterests(msg.sender);
    }

    function claimPendingToShares(address user) external {
        vaultManager.claimPendingToShares(msg.sender);
    }    

    function getPendingAmount(address user) external{
        vaultManager.getPendingAmount(msg.sender);
    }

    // Fonction pour les emprunteurs
    function borrow(uint256 tokenId, address borrower) external {
        borrowerManager.borrow(tokenId, borrower);
    }

    function repay() external {
        borrowerManager.repay(msg.sender);
    }

    function canBeLiquidated(address borrower) external {
        borrowerManager.canBeLiquidated(borrower);
    }

    function liquidate(address borrower) external {
        borrowerManager.liquidate(borrower);
    }

} 