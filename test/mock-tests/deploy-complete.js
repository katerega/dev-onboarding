async function main() {
  console.log("🚀 Complete TradeSphere deployment with liquidity...");
  
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  // 1. Deploy WETH
  console.log("\n🏦 Step 1: Deploying WETH...");
  const WETH = await ethers.getContractFactory("WETH");
  const weth = await WETH.deploy();
  await weth.deployed();
  console.log("✅ WETH deployed to:", weth.address);

  // 2. Deploy Factory
  console.log("\n🏭 Step 2: Deploying TradeSphereFactory...");
  const Factory = await ethers.getContractFactory("TradeSphereFactory");
  const factory = await Factory.deploy(deployer.address);
  await factory.deployed();
  console.log("✅ Factory deployed to:", factory.address);

  // 3. Deploy Router
  console.log("\n🛣️  Step 3: Deploying TradeSphereRouter...");
  const Router = await ethers.getContractFactory("TradeSphereRouter");
  const router = await Router.deploy(factory.address, weth.address);
  await router.deployed();
  console.log("✅ Router deployed to:", router.address);

  // 4. Deploy mock USDC
  console.log("\n🪙 Step 4: Deploying mock USDC...");
  const USDC = await ethers.getContractFactory("USDCMock");
  const usdc = await USDC.deploy(deployer.address, ethers.utils.parseUnits("1000000", 6));
  await usdc.deployed();
  console.log("✅ USDC deployed to:", usdc.address);

  // 5. Create trading pair
  console.log("\n🔗 Step 5: Creating WETH/USDC pair...");
  const createPairTx = await factory.createPair(weth.address, usdc.address);
  await createPairTx.wait();
  
  const pairAddress = await factory.getPair(weth.address, usdc.address);
  console.log("✅ Pair created at:", pairAddress);

  // 6. Add liquidity
  console.log("\n💧 Step 6: Adding initial liquidity...");
  
  const usdcAmount = ethers.utils.parseUnits("10000", 6); // 10,000 USDC
  const ethAmount = ethers.utils.parseEther("5"); // 5 ETH
  
  // Approve USDC
  const approveTx = await usdc.approve(router.address, usdcAmount);
  await approveTx.wait();
  console.log("✅ USDC approved");

  // Calculate deadline (20 minutes from now)
  const deadline = Math.floor(Date.now() / 1000) + 1200;

  // Add liquidity ETH/USDC
  const liquidityTx = await router.addLiquidityETH(
    usdc.address,
    usdcAmount,
    ethers.utils.parseUnits("9000", 6), // min USDC
    ethers.utils.parseEther("4"), // min ETH
    deployer.address,
    deadline,
    { value: ethAmount }
  );
  
  await liquidityTx.wait();
  console.log("✅ Liquidity added successfully!");

  // 7. Check reserves
  const pair = await ethers.getContractAt("ITradeSpherePair", pairAddress);
  const reserves = await pair.getReserves();
  console.log("\n📊 Pair reserves:");
  console.log("Reserve0:", ethers.utils.formatEther(reserves[0]));
  console.log("Reserve1:", ethers.utils.formatUnits(reserves[1], 6));

  // 8. Save deployment info
  const deploymentInfo = {
    network: "Hardhat Local",
    chainId: 31337,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      WETH: weth.address,
      TradeSphereFactory: factory.address,
      TradeSphereRouter: router.address,
      USDC: usdc.address,
      WETHUSDCPair: pairAddress
    }
  };

  const fs = require('fs');
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to deployment-info.json");

  console.log("\n🎉 Complete deployment successful!");
  console.log("📋 Summary:");
  console.log("- WETH:", weth.address);
  console.log("- Factory:", factory.address);
  console.log("- Router:", router.address);
  console.log("- USDC:", usdc.address);
  console.log("- WETH/USDC Pair:", pairAddress);
  console.log("\n🔄 Ready for swaps!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
