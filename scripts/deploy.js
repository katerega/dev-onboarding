const { ethers } = require("hardhat");
const fs = require("fs");

// Network configuration for multi-chain deployment
const NETWORK_CONFIG = {
  1: {
    name: "Ethereum Mainnet",
    currency: "ETH",
    explorer: "https://etherscan.io",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    minBalance: "0.5", // Higher for mainnet due to gas costs
    deployWETH: false
  },
  5: {
    name: "Ethereum Goerli",
    currency: "ETH", 
    explorer: "https://goerli.etherscan.io",
    weth: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    minBalance: "0.1",
    deployWETH: false
  },
  11155111: {
    name: "Ethereum Sepolia",
    currency: "ETH",
    explorer: "https://sepolia.etherscan.io", 
    weth: "0xD4DDB581B3A8732db2B8854f8D6331c0fB366DCE",
    minBalance: "0.1",
    deployWETH: false
  },
  137: {
    name: "Polygon Mainnet",
    currency: "MATIC",
    explorer: "https://polygonscan.com",
    weth: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
    minBalance: "5.0",
    deployWETH: false
  },
  80001: {
    name: "Polygon Mumbai",
    currency: "MATIC",
    explorer: "https://mumbai.polygonscan.com",
    weth: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", // WMATIC testnet
    minBalance: "1.0",
    deployWETH: false
  },
  42161: {
    name: "Arbitrum One",
    currency: "ETH",
    explorer: "https://arbiscan.io",
    weth: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    minBalance: "0.01",
    deployWETH: false
  },
  421613: {
    name: "Arbitrum Goerli",
    currency: "ETH",
    explorer: "https://goerli.arbiscan.io",
    weth: "0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",
    minBalance: "0.01",
    deployWETH: false
  },
  10: {
    name: "Optimism Mainnet",
    currency: "ETH",
    explorer: "https://optimistic.etherscan.io",
    weth: "0x4200000000000000000000000000000000000006",
    minBalance: "0.01",
    deployWETH: false
  },
  420: {
    name: "Optimism Goerli",
    currency: "ETH",
    explorer: "https://goerli-optimism.etherscan.io",
    weth: "0x4200000000000000000000000000000000000006",
    minBalance: "0.01",
    deployWETH: false
  },
  56: {
    name: "BNB Smart Chain",
    currency: "BNB",
    explorer: "https://bscscan.com",
    weth: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    minBalance: "0.1",
    deployWETH: false
  },
  97: {
    name: "BNB Testnet",
    currency: "BNB",
    explorer: "https://testnet.bscscan.com",
    weth: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", // WBNB testnet
    minBalance: "0.1",
    deployWETH: false
  },
  9001: {
    name: "Evmos Mainnet",
    currency: "EVMOS",
    explorer: "https://evm.evmos.org",
    weth: "0x5Ed91D8c5FcEcD4C7523916712D7AF4F2Bb7aEE4",
    minBalance: "0.1",
    deployWETH: false
  },
  9000: {
    name: "Evmos Testnet", 
    currency: "EVMOS",
    explorer: "https://evm.evmos.dev",
    weth: "0x5Ed91D8c5FcEcD4C7523916712D7AF4F2Bb7aEE4",
    minBalance: "0.1",
    deployWETH: false
  },
  31337: {
    name: "Localhost",
    currency: "ETH",
    explorer: "http://localhost:8545",
    weth: null, // Will be deployed
    minBalance: "0.0",
    deployWETH: true
  }
};

async function main() {
  console.log("🚀 Starting TradeSphere DEX deployment...");

  // Get network info
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const config = NETWORK_CONFIG[chainId];

  console.log(`📡 Network: ${network} (Chain ID: ${chainId})`);
  
  if (!config) {
    throw new Error(`❌ Unsupported network with chain ID: ${chainId}`);
  }

  console.log(`📡 Network: ${config.name} (Chain ID: ${chainId})`);

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log(
    "💰 Account balance:",
    ethers.formatEther(balance),
    config.currency
  );

  // Check minimum balance (skip for localhost)
  if (chainId !== 31337) {
    const minBalance = ethers.parseEther(config.minBalance);
    if (balance < minBalance) {
      throw new Error(
        `❌ Insufficient balance for deployment. Need at least ${config.minBalance} ${config.currency}`
      );
    }
  }

  // Determine WETH strategy based on network configuration
  let WETH_ADDRESS;
  let deployWETH = config.deployWETH;
  let weth = null;

  if (deployWETH) {
    console.log(`🏠 ${config.name} - will deploy fresh WETH`);
  } else {
    WETH_ADDRESS = process.env.WETH_ADDRESS || config.weth;
    console.log(`🔗 Using existing WETH on ${config.name}:`, WETH_ADDRESS);
    
    if (!WETH_ADDRESS) {
      throw new Error(`❌ No WETH address configured for ${config.name}. Set WETH_ADDRESS environment variable.`);
    }
  }

  try {
    // 1. Deploy WETH (localhost only)
    if (deployWETH) {
      console.log("\n🪙 Step 1: Deploying WETH...");
      const WETH = await ethers.getContractFactory("WETH");
      
      const wethDeployTx = WETH.getDeployTransaction();
      const wethGasEstimate = await ethers.provider.estimateGas(wethDeployTx);
      console.log("   Estimated gas:", wethGasEstimate.toString());

      weth = await WETH.deploy({
        gasLimit: wethGasEstimate.mul(120).div(100), // 20% buffer
      });

      console.log("   Waiting for confirmation...");
      await weth.deployed();
      WETH_ADDRESS = weth.address;
      console.log("✅ WETH deployed to:", WETH_ADDRESS);

      // Test WETH functionality
      const testDeposit = await weth.deposit({ value: ethers.parseEther("1") });
      await testDeposit.wait();
      const testBalance = await weth.balanceOf(deployer.address);
      console.log("✅ WETH test successful, balance:", ethers.formatEther(testBalance));
    }

    // 2. Deploy Factory
    console.log("\n🏭 Step 2: Deploying TradeSphereFactory...");
    const TradeSphereFactory = await ethers.getContractFactory("TradeSphereFactory");

    console.log("   Estimating gas...");
    const factoryDeployTx = TradeSphereFactory.getDeployTransaction(deployer.address);
    const factoryGasEstimate = await ethers.provider.estimateGas(factoryDeployTx);
    console.log("   Estimated gas:", factoryGasEstimate.toString());

    const factory = await TradeSphereFactory.deploy(deployer.address, {
      gasLimit: factoryGasEstimate.mul(120).div(100), // 20% buffer
    });

    console.log("   Waiting for confirmation...");
    await factory.deployed();
    console.log("✅ Factory deployed to:", factory.address);

    // 3. Deploy Router
    console.log("\n🛣️  Step 3: Deploying TradeSphereRouter...");
    const TradeSphereRouter = await ethers.getContractFactory("TradeSphereRouter");

    console.log("   Estimating gas...");
    const routerDeployTx = TradeSphereRouter.getDeployTransaction(factory.address, WETH_ADDRESS);
    const routerGasEstimate = await ethers.provider.estimateGas(routerDeployTx);
    console.log("   Estimated gas:", routerGasEstimate.toString());

    const router = await TradeSphereRouter.deploy(factory.address, WETH_ADDRESS, {
      gasLimit: routerGasEstimate.mul(120).div(100), // 20% buffer
    });

    console.log("   Waiting for confirmation...");
    await router.deployed();
    console.log("✅ Router deployed to:", router.address);

    // Verify router configuration
    const routerFactory = await router.factory();
    const routerWETH = await router.WETH();
    console.log("   Router factory check:", routerFactory === factory.address ? "✅" : "❌");
    console.log("   Router WETH check:", routerWETH === WETH_ADDRESS ? "✅" : "❌");

    // 4. Save deployment info
    console.log("\n💾 Step 4: Saving deployment information...");
    const deploymentInfo = {
      network: config.name,
      chainId: chainId,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      networkConfig: {
        currency: config.currency,
        explorer: config.explorer,
        isTestnet: chainId === 31337 || chainId === 5 || chainId === 11155111 || chainId === 80001 || chainId === 421613 || chainId === 420 || chainId === 97 || chainId === 9000
      },
      contracts: {
        TradeSphereFactory: factory.address,
        TradeSphereRouter: router.address,
        WETH: WETH_ADDRESS,
      },
      transactions: {
        factory: factory.deployTransaction.hash,
        router: router.deployTransaction.hash,
        ...(deployWETH && weth && { weth: weth.deployTransaction.hash }),
      },
      explorers: {
        factory: chainId === 31337 
          ? `${config.explorer}/address/${factory.address}`
          : `${config.explorer}/address/${factory.address}`,
        router: chainId === 31337
          ? `${config.explorer}/address/${router.address}`
          : `${config.explorer}/address/${router.address}`,
        weth: chainId === 31337
          ? `${config.explorer}/address/${WETH_ADDRESS}`
          : `${config.explorer}/address/${WETH_ADDRESS}`,
      },
    };

    fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));

    console.log(`\n🎉 TradeSphere DEX deployed successfully on ${config.name}!`);
    console.log("📄 Check deployment-info.json for full details");
    
    if (chainId === 31337) {
      console.log("\n💡 Next steps for localhost:");
      console.log("   Run: npm run setup:localhost");
      console.log("   This will set up mock tokens, pairs, and liquidity for testing");
    } else {
      console.log(`\n🔍 Deployed contracts on ${config.name}:`);
      console.log(`   Factory: ${deploymentInfo.explorers.factory}`);
      console.log(`   Router: ${deploymentInfo.explorers.router}`);
      console.log(`   WETH: ${deploymentInfo.explorers.weth}`);
      
      if (config.isTestnet || deploymentInfo.networkConfig.isTestnet) {
        console.log("\n💡 Testnet deployment complete!");
        console.log("   • Test your contracts on the block explorer");
        console.log("   • Set up test tokens and liquidity");
      } else {
        console.log("\n🚨 MAINNET deployment complete!");
        console.log("   • Verify contracts on the block explorer");
        console.log("   • Set up production tokens carefully");
        console.log("   • Consider implementing timelock for admin functions");
      }
    }

  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);

    if (error.code === "NETWORK_ERROR") {
      console.log("\n💡 Troubleshooting tips:");
      console.log("   1. Check your internet connection");
      console.log("   2. Verify RPC endpoint configuration in hardhat.config.js");
      console.log("   3. Try a different RPC provider if available");
      console.log("   4. Check if the network is experiencing downtime");
    } else if (error.code === "INSUFFICIENT_FUNDS") {
      console.log(`\n💡 Add more ${config.currency} to your wallet for gas fees`);
      console.log(`   Minimum required: ${config.minBalance} ${config.currency}`);
    } else if (error.message.includes("nonce")) {
      console.log("\n💡 Nonce error - try resetting your wallet transaction history");
    } else if (error.message.includes("gas")) {
      console.log("\n💡 Gas estimation failed - the network might be congested");
      console.log("   Try increasing gas limit or waiting for lower network usage");
    }

    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});