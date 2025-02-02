const hre = require("hardhat");

async function main() {

  const Usdc = await hre.ethers.getContractFactory("Usdc");
  const usdc = await Usdc.deploy();
  
  await usdc.waitForDeployment();
  
  const address = await usdc.getAddress();
  console.log("Usdc deployed to: ${address}");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});