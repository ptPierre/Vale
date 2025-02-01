const hre = require("hardhat");

async function main() {

  const ValeToken = await hre.ethers.getContractFactory("ValeToken");
  const valeToken = await ValeToken.deploy();
  
  await valeToken.waitForDeployment();
  
  const address = await valeToken.getAddress();
  console.log(`ValeToken deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


