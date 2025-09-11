const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting TradeSphere DEX deployment...");

  // Get network info
  const network = await ethers.provider.getNetwork();
  const networkName =
    network.chainId === 9001
      ? "Evmos Mainnet"
      : network.chainId === 9000
      ? "Evmos Testnet"
      : network.chainId === 31337
      ? "Localhost"
      : `Unknown Network (${network.chainId})`;

  console.log(`📡 Network: ${networkName} (Chain ID: ${network.chainId})`);

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log(
    "💰 Account balance:",
    ethers.utils.formatEther(balance),
    network.chainId === 31337 ? "ETH" : "EVMOS"
  );

  // Check minimum balance (skip for localhost)
  if (network.chainId !== 31337) {
    const minBalance = ethers.utils.parseEther("0.1");
    if (balance.lt(minBalance)) {
      throw new Error(
        "❌ Insufficient balance for deployment. Need at least 0.1 EVMOS"
      );
    }
  }

  // Determine WETH strategy based on network
  let WETH_ADDRESS;
  let deployWETH = false;
  let weth = null;

  if (network.chainId === 9001) {
    // Evmos Mainnet - use existing WETH
    WETH_ADDRESS = process.env.WETH_ADDRESS || "0x778e5A0026BFB3283615861DF768072124FCd2f9";
    console.log("🔗 Using existing Mainnet WETH:", WETH_ADDRESS);
  } else if (network.chainId === 9000) {
    // Evmos Testnet - use existing WETH
    WETH_ADDRESS = process.env.WETH_ADDRESS || "0x778e5A0026BFB3283615861DF768072124FCd2f9";
    console.log("🔗 Using existing Testnet WETH:", WETH_ADDRESS);
  } else if (network.chainId === 31337) {
    // Localhost - deploy fresh WETH
    deployWETH = true;
    console.log("🏠 Localhost detected - will deploy fresh WETH");
  } else {
    throw new Error("❌ Unsupported network for deployment");
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
      const testDeposit = await weth.deposit({ value: ethers.utils.parseEther("1") });
      await testDeposit.wait();
      const testBalance = await weth.balanceOf(deployer.address);
      console.log("✅ WETH test successful, balance:", ethers.utils.formatEther(testBalance));
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
      network: networkName,
      chainId: network.chainId,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
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
        factory: network.chainId === 31337 
          ? `http://localhost:8545/address/${factory.address}`
          : `https://evm.evmos.org/address/${factory.address}`,
        router: network.chainId === 31337
          ? `http://localhost:8545/address/${router.address}`
          : `https://evm.evmos.org/address/${router.address}`,
      },
    };

    fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));

    console.log("\n🎉 TradeSphere DEX core contracts deployed successfully!");
    console.log("📄 Check deployment-info.json for full details");
    
    if (network.chainId === 31337) {
      console.log("\n💡 Next steps for localhost:");
      console.log("   Run: npm run setup:localhost");
      console.log("   This will set up mock tokens, pairs, and liquidity for testing");
    } else {
      console.log(`🔍 Factory: ${deploymentInfo.explorers.factory}`);
      console.log(`🔍 Router: ${deploymentInfo.explorers.router}`);
    }

  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);

    if (error.code === "NETWORK_ERROR") {
      console.log("\n💡 Troubleshooting tips:");
      console.log("   1. Check your internet connection");
      console.log("   2. Try a different RPC endpoint:");
      console.log("      npm run deploy:evmos2");
      console.log("      npm run deploy:evmos3");
      console.log("   3. Test RPC connectivity: npm run test-rpc");
    } else if (error.code === "INSUFFICIENT_FUNDS") {
      console.log("\n💡 Add more EVMOS to your wallet for gas fees");
    }

    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});