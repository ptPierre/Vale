const hre = require("hardhat");

async function main() {

  const BorrowerManager = await hre.ethers.getContractFactory("BorrowerManager");
  const borrowerManager = await BorrowerManager.deploy();
  
  await borrowerManager.waitForDeployment();
  
  const address = await borrowerManager.getAddress();
  console.log("BorrowerManager deployed to: ${address}");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});