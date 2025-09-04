require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.6.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Evmos Testnet - Use this reliable RPC
    evmosTestnet: {
      url: "https://evmos-testnet.lava.build", // This one usually works
      accounts: [process.env.PRIVATE_KEY],
      chainId: 9000,
      gas: 2100000,
      gasPrice: 25000000000, // 25 Gwei
      timeout: 120000 // 2 minute timeout
    },
    // Local development
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  }
};