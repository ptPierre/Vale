const hre = require("hardhat");

async function main() {
//  Déploiement de ValeToken
  const VaultManager = await hre.ethers.getContractFactory("VaultManager");
  const vaultManager = await VaultManager.deploy(usdcAddress);
  await vaultManager.waitForDeployment();
  const vaultManagerAddress = await vaultManager.getAddress();
  console.log("✅ VaultManager déployé à : ${vaultManagerAddress}");

  //  Déploiement de BorrowerManager
  const BorrowerManager = await hre.ethers.getContractFactory("BorrowerManager");
  const borrowerManager = await BorrowerManager.deploy(valeTokenAddress, usdcAddress, vaultManagerAddress);
  await borrowerManager.waitForDeployment();
  const borrowerManagerAddress = await borrowerManager.getAddress();
  console.log("✅ BorrowerManager déployé à : ${borrowerManagerAddress}");

  // Déploiement de LendingPool
  const LendingPool = await hre.ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(usdcAddress, valeTokenAddress, vaultManagerAddress);
  await lendingPool.waitForDeployment();
  const lendingPoolAddress = await lendingPool.getAddress();
  console.log("✅ LendingPool déployé à : ${lendingPoolAddress}");

  // Approve BorrowerManager pour utiliser les tokens USDC depuis VaultManager
  const approveTx = await usdc.approve(borrowerManagerAddress, hre.ethers.parseUnits("1000000", 6)); // 1M USDC
  await approveTx.wait();
  console.log("✅ VaultManager a approuvé BorrowerManager pour 1M USDC");

  console.log("🚀 Tous les contrats ont été déployés avec succès !");
}

// Gestion des erreurs
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});