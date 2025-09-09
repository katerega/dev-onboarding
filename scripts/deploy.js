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
      : `Unknown Network (${network.chainId})`;

  console.log(`📡 Network: ${networkName} (Chain ID: ${network.chainId})`);

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log(
    "💰 Account balance:",
    ethers.utils.formatEther(balance),
    "EVMOS"
  );

  // // Check minimum balance
  const minBalance = ethers.utils.parseEther("0.1");
  if (balance.lt(minBalance)) {
    throw new Error(
      "❌ Insufficient balance for deployment. Need at least 0.1 EVMOS"
    );
  }

  // Use correct WETH address for the network
  let WETH_ADDRESS;
  if (network.chainId === 9001) {
    // Evmos Mainnet WETH
    WETH_ADDRESS =
      process.env.WETH_ADDRESS || "0xD4949664cD82660AaE99bEdc034a0deA8A0bd517";
  } else if (network.chainId === 9000) {
    // Evmos Testnet WETH
    WETH_ADDRESS =
      process.env.WETH_ADDRESS || "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  } else {
    throw new Error("❌ Unsupported network for deployment");
  }

  console.log("🔗 Using WETH address:", WETH_ADDRESS);

  try {
    // 1. Deploy Factory
    console.log("\n🏭 Step 1: Deploying TradeSphereFactory...");
    const TradeSphereFactory = await ethers.getContractFactory(
      "TradeSphereFactory"
    );

    console.log("   Estimating gas...");
    const factoryDeployTx = TradeSphereFactory.getDeployTransaction(
      deployer.address
    );
    const factoryGasEstimate = await ethers.provider.estimateGas(
      factoryDeployTx
    );
    console.log("   Estimated gas:", factoryGasEstimate.toString());

    const factory = await TradeSphereFactory.deploy(deployer.address, {
      gasLimit: factoryGasEstimate.mul(120).div(100), // 20% buffer
    });

    console.log("   Waiting for confirmation...");
    await factory.deployed();
    console.log("✅ Factory deployed to:", factory.address);

    // 2. Deploy Router
    console.log("\n🛣️  Step 2: Deploying TradeSphereRouter...");
    const TradeSphereRouter = await ethers.getContractFactory(
      "TradeSphereRouter"
    );

    console.log("   Estimating gas...");
    const routerDeployTx = TradeSphereRouter.getDeployTransaction(
      factory.address,
      WETH_ADDRESS
    );
    const routerGasEstimate = await ethers.provider.estimateGas(routerDeployTx);
    console.log("   Estimated gas:", routerGasEstimate.toString());

    const router = await TradeSphereRouter.deploy(
      factory.address,
      WETH_ADDRESS,
      {
        gasLimit: routerGasEstimate.mul(120).div(100), // 20% buffer
      }
    );

    console.log("   Waiting for confirmation...");
    await router.deployed();
    console.log("✅ Router deployed to:", router.address);

    // 3. Save deployment info
    console.log("\n💾 Step 3: Saving deployment information...");
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
      },
      explorers: {
        factory: `https://evm.evmos.org/address/${factory.address}`,
        router: `https://evm.evmos.org/address/${router.address}`,
      },
    };

    fs.writeFileSync(
      "deployment-info.json",
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n🎉 TradeSphere DEX deployed successfully!");
    console.log("📄 Check deployment-info.json for full details");
    console.log(`🔍 Factory: ${deploymentInfo.explorers.factory}`);
    console.log(`🔍 Router: ${deploymentInfo.explorers.router}`);
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