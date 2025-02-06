async function main() {
  const DataStorage = await ethers.getContractFactory("DataStorage");
  const dataStorage = await DataStorage.deploy();

  // Wait for the deployment transaction to be mined
  await dataStorage.waitForDeployment();

  const deployedAddress = await dataStorage.getAddress();
  console.log("DataStorage deployed to:", deployedAddress);

  console.log("Waiting for block confirmations...");
  // Wait for few block confirmations
  const deploymentReceipt = await dataStorage.deploymentTransaction().wait(6);

  // Verify the contract
  console.log("Verifying contract...");
  await hre.run("verify:verify", {
    address: deployedAddress,
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 