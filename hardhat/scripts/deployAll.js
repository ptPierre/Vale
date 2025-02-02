const hre = require("hardhat");

async function main() {
  // 1️⃣ Déploiement du contrat USDC (si nécessaire)
  const Usdc = await hre.ethers.getContractFactory("Usdc");
  const usdc = await Usdc.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log(`✅ Usdc déployé à : ${usdcAddress}`);

  // 2️⃣ Déploiement de VaultManager
  const VaultManager = await hre.ethers.getContractFactory("VaultManager");
  const vaultManager = await VaultManager.deploy(usdcAddress);
  await vaultManager.waitForDeployment();
  const vaultManagerAddress = await vaultManager.getAddress();
  console.log(`✅ VaultManager déployé à : ${vaultManagerAddress}`);

  // 3️⃣ Déploiement de ValeToken (si nécessaire)
  const ValeToken = await hre.ethers.getContractFactory("ValeToken");
  const valeToken = await ValeToken.deploy();
  await valeToken.waitForDeployment();
  const valeTokenAddress = await valeToken.getAddress();
  console.log(`✅ ValeToken déployé à : ${valeTokenAddress}`);

  // 4️⃣ Déploiement de BorrowerManager
  const BorrowerManager = await hre.ethers.getContractFactory("BorrowerManager");
  const borrowerManager = await BorrowerManager.deploy(valeTokenAddress, usdcAddress, vaultManagerAddress);
  await borrowerManager.waitForDeployment();
  const borrowerManagerAddress = await borrowerManager.getAddress();
  console.log(`✅ BorrowerManager déployé à : ${borrowerManagerAddress}`);

  // 5️⃣ Déploiement de LendingPool
  const LendingPool = await hre.ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(usdcAddress, valeTokenAddress, vaultManagerAddress);
  await lendingPool.waitForDeployment();
  const lendingPoolAddress = await lendingPool.getAddress();
  console.log(`✅ LendingPool déployé à : ${lendingPoolAddress}`);

  // 6️⃣ Approve BorrowerManager pour utiliser les tokens USDC depuis VaultManager
  const approveTx = await usdc.approve(borrowerManagerAddress, hre.ethers.parseUnits("1000000", 6)); // 1M USDC
  await approveTx.wait();
  console.log(`✅ VaultManager a approuvé BorrowerManager pour 1M USDC`);

  console.log("🚀 Tous les contrats ont été déployés avec succès !");
}

// Gestion des erreurs
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
