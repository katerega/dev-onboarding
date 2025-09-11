const { ethers } = require("hardhat");
const fs = require("fs");

async function completeFreshDeploy() {
  console.log("🧪 TradeSphere Post-Deployment Setup...");
  console.log("📋 Setting up mock tokens, pairs, and liquidity\n");

  // Check if core contracts are deployed
  let deploymentInfo;
  try {
    deploymentInfo = JSON.parse(fs.readFileSync('deployment-info.json', 'utf8'));
    console.log("✅ Found existing deployment info");
  } catch (error) {
    console.log("❌ No deployment-info.json found!");
    console.log("💡 Please run deployment first:");
    console.log("   npm run deploy:localhost");
    throw new Error("Core contracts not deployed");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Get deployed contract addresses
  const { contracts } = deploymentInfo;
  console.log("\n📋 Using deployed contracts:");
  console.log("Factory:", contracts.TradeSphereFactory);
  console.log("Router:", contracts.TradeSphereRouter);
  console.log("WETH:", contracts.WETH);

  // Get contract instances
  const factory = await ethers.getContractAt("TradeSphereFactory", contracts.TradeSphereFactory);
  const router = await ethers.getContractAt("TradeSphereRouter", contracts.TradeSphereRouter);
  const weth = await ethers.getContractAt("WETH", contracts.WETH);

  // Verify contracts are working
  console.log("\n🔧 Verifying contract connectivity...");
  const routerFactory = await router.factory();
  const routerWETH = await router.WETH();
  console.log("Router factory check:", routerFactory === factory.address ? "✅" : "❌");
  console.log("Router WETH check:", routerWETH === weth.address ? "✅" : "❌");

  // 1. Deploy Mock Tokens
  console.log("\n🪙 Step 1: Deploying Mock Tokens...");
  
  const USDCMock = await ethers.getContractFactory("USDCMock");
  const usdc = await USDCMock.deploy(deployer.address, ethers.utils.parseUnits("1000000", 6));
  await usdc.deployed();
  console.log("✅ USDC deployed to:", usdc.address);
  
  const USDTMock = await ethers.getContractFactory("USDTMock");
  const usdt = await USDTMock.deploy(deployer.address, ethers.utils.parseUnits("1000000", 6));
  await usdt.deployed();
  console.log("✅ USDT deployed to:", usdt.address);

  // Check token balances
  const usdcBalance = await usdc.balanceOf(deployer.address);
  const usdtBalance = await usdt.balanceOf(deployer.address);
  console.log("USDC balance:", ethers.utils.formatUnits(usdcBalance, 6));
  console.log("USDT balance:", ethers.utils.formatUnits(usdtBalance, 6));

  // 2. Setup WETH Balance
  console.log("\n💰 Step 2: Setting up WETH balance...");
  
  const currentWethBalance = await weth.balanceOf(deployer.address);
  console.log("Current WETH balance:", ethers.utils.formatEther(currentWethBalance));
  
  if (currentWethBalance.lt(ethers.utils.parseEther("100"))) {
    const depositAmount = ethers.utils.parseEther("100");
    const depositTx = await weth.deposit({ value: depositAmount });
    await depositTx.wait();
    console.log("✅ Deposited 100 ETH to WETH");
  }
  
  const finalWethBalance = await weth.balanceOf(deployer.address);
  console.log("Final WETH balance:", ethers.utils.formatEther(finalWethBalance));

  // 3. Setup Liquidity Pools
  console.log("\n💧 Step 3: Setting up liquidity pools...");

  // Approve tokens for router
  const wethAmount = ethers.utils.parseEther("50");
  const usdcAmount = ethers.utils.parseUnits("100000", 6);
  const usdtAmount = ethers.utils.parseUnits("100000", 6);

  await weth.approve(router.address, wethAmount.mul(2)); // Approve for both pairs
  await usdc.approve(router.address, usdcAmount);
  await usdt.approve(router.address, usdtAmount);
  console.log("✅ Tokens approved for router");

  const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 minutes

  // Add WETH/USDC liquidity
  console.log("\n💧 Adding WETH/USDC liquidity...");
  try {
    const tx1 = await router.addLiquidity(
      weth.address,
      usdc.address,
      wethAmount,
      usdcAmount,
      ethers.utils.parseEther("45"), // 90% min
      ethers.utils.parseUnits("90000", 6), // 90% min
      deployer.address,
      deadline,
      { gasLimit: 5000000 }
    );
    await tx1.wait();
    console.log("✅ WETH/USDC liquidity added");
  } catch (error) {
    console.log("❌ WETH/USDC liquidity failed:", error.message);
    throw error;
  }

  // Add WETH/USDT liquidity
  console.log("\n💧 Adding WETH/USDT liquidity...");
  try {
    const tx2 = await router.addLiquidity(
      weth.address,
      usdt.address,
      wethAmount,
      usdtAmount,
      ethers.utils.parseEther("45"), // 90% min
      ethers.utils.parseUnits("90000", 6), // 90% min
      deployer.address,
      deadline,
      { gasLimit: 5000000 }
    );
    await tx2.wait();
    console.log("✅ WETH/USDT liquidity added");
  } catch (error) {
    console.log("❌ WETH/USDT liquidity failed:", error.message);
    throw error;
  }

  // 4. Get pair addresses and verify
  console.log("\n🔗 Step 4: Verifying trading pairs...");
  const wethUsdcPair = await factory.getPair(weth.address, usdc.address);
  const wethUsdtPair = await factory.getPair(weth.address, usdt.address);

  console.log("WETH/USDC Pair:", wethUsdcPair);
  console.log("WETH/USDT Pair:", wethUsdtPair);

  // Check pair reserves
  if (wethUsdcPair !== ethers.constants.AddressZero) {
    const pair1 = await ethers.getContractAt("TradeSpherePair", wethUsdcPair);
    const reserves1 = await pair1.getReserves();
    console.log("WETH/USDC reserves:", ethers.utils.formatEther(reserves1[0]), "WETH,", ethers.utils.formatUnits(reserves1[1], 6), "USDC");
  }

  if (wethUsdtPair !== ethers.constants.AddressZero) {
    const pair2 = await ethers.getContractAt("TradeSpherePair", wethUsdtPair);
    const reserves2 = await pair2.getReserves();
    console.log("WETH/USDT reserves:", ethers.utils.formatEther(reserves2[0]), "WETH,", ethers.utils.formatUnits(reserves2[1], 6), "USDT");
  }

  // 5. Update deployment info
  console.log("\n💾 Step 5: Updating deployment info...");
  
  deploymentInfo.tokens = {
    WETH: {
      address: weth.address,
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18
    },
    USDC: {
      address: usdc.address,
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6
    },
    USDT: {
      address: usdt.address,
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6
    }
  };

  deploymentInfo.pairs = {
    "WETH/USDC": wethUsdcPair,
    "WETH/USDT": wethUsdtPair
  };

  deploymentInfo.setupComplete = true;
  deploymentInfo.setupTimestamp = new Date().toISOString();

  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 Post-deployment setup complete!");
  console.log("✅ Mock tokens deployed and funded");
  console.log("✅ Trading pairs created with liquidity");
  console.log("✅ Exchange rate: 1 WETH = 2,000 USDC/USDT");
  console.log("✅ Ready for frontend testing and swaps");

  console.log("\n📋 Frontend Configuration:");
  console.log("WETH:", weth.address);
  console.log("USDC:", usdc.address);  
  console.log("USDT:", usdt.address);
  console.log("Router:", router.address);

  return deploymentInfo;
}

async function main() {
  await completeFreshDeploy();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
