const { ethers } = require("hardhat");

/**
 * Network verification and diagnostics script
 * Helps validate network configurations and WETH addresses
 */

const NETWORK_CONFIG = {
  1: { name: "Ethereum Mainnet", currency: "ETH", weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
  5: { name: "Ethereum Goerli", currency: "ETH", weth: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6" },
  11155111: { name: "Ethereum Sepolia", currency: "ETH", weth: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9" },
  137: { name: "Polygon Mainnet", currency: "MATIC", weth: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" },
  80001: { name: "Polygon Mumbai", currency: "MATIC", weth: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889" },
  42161: { name: "Arbitrum One", currency: "ETH", weth: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" },
  421613: { name: "Arbitrum Goerli", currency: "ETH", weth: "0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3" },
  10: { name: "Optimism Mainnet", currency: "ETH", weth: "0x4200000000000000000000000000000000000006" },
  420: { name: "Optimism Goerli", currency: "ETH", weth: "0x4200000000000000000000000000000000000006" },
  56: { name: "BNB Smart Chain", currency: "BNB", weth: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" },
  97: { name: "BNB Testnet", currency: "BNB", weth: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd" },
  9001: { name: "Evmos Mainnet", currency: "EVMOS", weth: "0x5Ed91D8c5FcEcD4C7523916712D7AF4F2Bb7aEE4" },
  9000: { name: "Evmos Testnet", currency: "EVMOS", weth: "0x5Ed91D8c5FcEcD4C7523916712D7AF4F2Bb7aEE4" },
  31337: { name: "Localhost", currency: "ETH", weth: null }
};

async function main() {
  console.log("🔍 Network Verification & Diagnostics\n");

  try {
    // Get network info
    const network = await ethers.provider.getNetwork();
    const chainId = Number(network.chainId);
    const config = NETWORK_CONFIG[chainId];

    console.log(`📡 Connected Network: ${config?.name || 'Unknown'} (Chain ID: ${chainId})`);

    if (!config) {
      console.log("❌ Unsupported network");
      return;
    }

    // Get account info
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`💰 Balance: ${ethers.utils.formatEther(balance)} ${config.currency}`);

    // Test network connectivity
    console.log("\n🧪 Testing Network Connectivity...");
    
    const latestBlock = await ethers.provider.getBlockNumber();
    console.log(`✅ Latest block: ${latestBlock}`);

    const gasPrice = await ethers.provider.getFeeData();
    console.log(`⛽ Gas price: ${ethers.formatUnits(gasPrice.gasPrice || gasPrice.maxFeePerGas, 'gwei')} gwei`);

    // Validate WETH if exists
    if (config.weth && chainId !== 31337) {
      console.log("\n🔍 Validating WETH Contract...");
      console.log(`WETH Address: ${config.weth}`);

      try {
        const code = await ethers.provider.getCode(config.weth);
        if (code === '0x') {
          console.log("❌ WETH contract not found at address");
        } else {
          console.log("✅ WETH contract exists");

          // Try to read WETH details
          const wethAbi = [
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function decimals() view returns (uint8)",
            "function totalSupply() view returns (uint256)"
          ];

          const wethContract = new ethers.Contract(config.weth, wethAbi, ethers.provider);
          
          try {
            const name = await wethContract.name();
            const symbol = await wethContract.symbol();
            const decimals = await wethContract.decimals();
            
            console.log(`   Name: ${name}`);
            console.log(`   Symbol: ${symbol}`);
            console.log(`   Decimals: ${decimals}`);
          } catch (error) {
            console.log("⚠️  WETH contract exists but may not be standard ERC20");
          }
        }
      } catch (error) {
        console.log("❌ Error validating WETH:", error.message);
      }
    }

    // Check deployment readiness
    console.log("\n📋 Deployment Readiness Check...");
    
    const requiredBalance = {
      1: "0.5",     // Ethereum mainnet
      137: "5.0",   // Polygon
      56: "0.1",    // BSC
      42161: "0.01", // Arbitrum
      10: "0.01",   // Optimism
    };

    const minBalance = requiredBalance[chainId] || "0.1";
    const hasEnoughBalance = balance >= ethers.utils.parseEther(minBalance);
    
    console.log(`Required balance: ${minBalance} ${config.currency}`);
    console.log(`${hasEnoughBalance ? '✅' : '❌'} Balance sufficient: ${hasEnoughBalance}`);

    // Network-specific recommendations
    console.log("\n💡 Network-Specific Notes:");
    
    if (chainId === 1) {
      console.log("   • High gas costs expected on Ethereum mainnet");
      console.log("   • Consider deploying during low network usage");
    } else if (chainId === 137) {
      console.log("   • MATIC tokens required for gas fees");
      console.log("   • Generally low gas costs");
    } else if (chainId === 56) {
      console.log("   • BNB tokens required for gas fees");
      console.log("   • Fast block times (~3 seconds)");
    } else if ([42161, 10].includes(chainId)) {
      console.log("   • Layer 2 solution - low gas costs");
      console.log("   • ETH required for gas fees");
    } else if ([9001, 9000].includes(chainId)) {
      console.log("   • EVMOS tokens required for gas fees");
      console.log("   • EVM-compatible Cosmos chain");
    } else if ([5, 11155111, 80001, 421613, 420, 97, 9000].includes(chainId)) {
      console.log("   • Testnet deployment - use test tokens");
      console.log("   • Get test tokens from faucets");
    } else if (chainId === 31337) {
      console.log("   • Local development network");
      console.log("   • WETH will be deployed fresh");
    }

    console.log(`\n🎯 Ready to deploy on ${config.name}!`);
    console.log(`Run: npm run deploy:${getDeployCommand(chainId)}`);

  } catch (error) {
    console.error("\n❌ Network verification failed:", error.message);
    
    if (error.message.includes("network")) {
      console.log("\n💡 Possible issues:");
      console.log("   • Check hardhat.config.js network configuration");
      console.log("   • Verify RPC endpoint is accessible");
      console.log("   • Check internet connection");
    }
  }
}

function getDeployCommand(chainId) {
  const commands = {
    1: "ethereum",
    5: "goerli", 
    11155111: "sepolia",
    137: "polygon",
    80001: "mumbai",
    42161: "arbitrum",
    421613: "arbitrum-goerli",
    10: "optimism",
    420: "optimism-goerli",
    56: "bsc",
    97: "bsc-testnet",
    9001: "evmos",
    9000: "evmos-testnet",
    31337: "localhost"
  };
  
  return commands[chainId] || "unknown";
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});