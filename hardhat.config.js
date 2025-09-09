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
    // Evmos Testnet - Updated working endpoints
    evmosTestnet: {
      url: process.env.EVMOS_TESTNET_RPC || "https://eth.bd.evmos.dev:8545",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 9000,
      timeout: 120000,
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1.2
    },
    evmosTestnet2: {
      url: "https://evmos-testnet-evm.publicnode.com", 
      accounts: [process.env.PRIVATE_KEY],
      chainId: 9000,
      timeout: 120000,
      gas: 'auto',
      gasPrice: 'auto'
    },
    // Evmos Mainnet - Working endpoints first
    evmosMainnet: {
      url: "https://evmos-evm.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 9001,
      timeout: 120000,
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1.2
    },
    evmosMainnet2: {
      url: process.env.EVMOS_MAINNET_RPC || "https://eth.bd.evmos.org:8545",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 9001,
      timeout: 120000,
      gas: 'auto',
      gasPrice: 'auto'
    },
    evmosMainnet3: {
      url: "https://evmos-rpc.gateway.pokt.network",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 9001,
      timeout: 120000,
      gas: 'auto',
      gasPrice: 'auto'
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