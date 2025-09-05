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
    evmosTestnet: {
  url: process.env.RPC_URL_EVMOS,
  accounts: [process.env.PRIVATE_KEY],
  chainId: 9000,
  gas: 2100000,
  gasPrice: 25000000000,
  timeout: 180000 // 3 minutes
},
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  }
};
