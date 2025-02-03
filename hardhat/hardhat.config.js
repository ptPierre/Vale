require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache"
  },
  networks: {
    hardhat: {
    },
    holesky: {
      url: "https://ethereum-holesky.publicnode.com",
      accounts: [PRIVATE_KEY],
      chainId: 17000,
      timeout: 60000,
      gasPrice: "auto",
      fallbackProvider: {
        urls: [
          "https://ethereum-holesky.publicnode.com",
          "https://1rpc.io/holesky",
          "https://holesky.beaconcha.in",
          "https://holesky.drpc.org"
        ]
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}; 