const hre = require("hardhat");

async function main() {

  const ValeToken = await hre.ethers.getContractFactory("ValeToken");
  const valeToken = await ValeToken.deploy();
  
  await valeToken.waitForDeployment();
  
  console.log(`ValeToken deploy at : ${await valeToken.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


