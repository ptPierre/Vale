const hre = require("hardhat");

async function main() {
    const VALE_TOKEN_ADDRESS = "0x40E0f2b9f03A9Df3fC7553a91bd239AA1748Df1f"; // Adresse du token ValeToken
    const USDC_ADDRESS = "0xb9284c55444a01ca79c9f839f53411f5e511ed3a"; // Adresse du token USDC

    const RewardManager = await hre.ethers.getContractFactory("RewardManager");

    // ✅ Passer les adresses au constructeur
    const rewardManager = await RewardManager.deploy(USDC_ADDRESS, VALE_TOKEN_ADDRESS);

    await rewardManager.waitForDeployment();
    const address = await rewardManager.getAddress();
    
    console.log(`RewardManager deployed to: ${address}`);

    const result = await rewardManager.testoracle();
    console.log(`🔍 testoracle result:`, result.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
