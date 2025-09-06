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
    // Evmos Testnet - Multiple endpoints to try
    evmosTestnet: {
      url: "https://jsonrpc-t.evmos.nodestake.top",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 9000,
      timeout: 60000,
      gas: 2100000,
      gasPrice: 1000000000
    },
    evmosTestnet2: {
      url: "https://evmos-testnet-rpc.polkachu.com", 
      accounts: [process.env.PRIVATE_KEY],
      chainId: 9000,
      timeout: 60000,
      gas: 2100000,
      gasPrice: 1000000000
    },
    evmosTestnet3: {
      url: "https://evmos-testnet.lava.build",
      accounts: [process.env.PRIVATE_KEY], 
      chainId: 9000,
      timeout: 60000,
      gas: 2100000,
      gasPrice: 1000000000
    },
    // Backup networks for testing
    polygonMumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80001,
      timeout: 60000
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      timeout: 60000
    },
    // Local development
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  }
};