async function main() {
  console.log("🔍 Testing current contracts for frontend compatibility...");
  
  const [deployer] = await ethers.getSigners();
  console.log("👤 Using account:", deployer.address);

  // Load deployment info
  const deploymentInfo = require('../deployment-info.json');
  const ROUTER_ADDRESS = deploymentInfo.contracts.TradeSphereRouter;
  const WETH_ADDRESS = deploymentInfo.contracts.WETH;
  const USDC_ADDRESS = deploymentInfo.contracts.USDC;

  console.log("📋 Testing with addresses:");
  console.log("Router:", ROUTER_ADDRESS);
  console.log("WETH:", WETH_ADDRESS);
  console.log("USDC:", USDC_ADDRESS);

  try {
    // Test 1: Check if contracts exist
    const routerCode = await ethers.provider.getCode(ROUTER_ADDRESS);
    const wethCode = await ethers.provider.getCode(WETH_ADDRESS);
    const usdcCode = await ethers.provider.getCode(USDC_ADDRESS);
    
    console.log("\n📊 Contract verification:");
    console.log("Router deployed:", routerCode !== '0x');
    console.log("WETH deployed:", wethCode !== '0x');
    console.log("USDC deployed:", usdcCode !== '0x');

    if (routerCode === '0x' || wethCode === '0x' || usdcCode === '0x') {
      console.log("❌ Some contracts are not deployed!");
      return;
    }

    // Test 2: Basic contract interaction
    const router = await ethers.getContractAt("TradeSphereRouter", ROUTER_ADDRESS);
    const usdc = await ethers.getContractAt("USDCMock", USDC_ADDRESS);

    const routerWETH = await router.WETH();
    const usdcBalance = await usdc.balanceOf(deployer.address);
    
    console.log("\n✅ Contract interactions successful:");
    console.log("Router WETH:", routerWETH);
    console.log("USDC Balance:", ethers.utils.formatUnits(usdcBalance, 6));

    // Test 3: Check pair reserves
    const factory = await ethers.getContractAt("TradeSphereFactory", deploymentInfo.contracts.TradeSphereFactory);
    const pairAddress = await factory.getPair(WETH_ADDRESS, USDC_ADDRESS);
    
    if (pairAddress === ethers.constants.AddressZero) {
      console.log("❌ No pair exists!");
      return;
    }

    const pair = await ethers.getContractAt("ITradeSpherePair", pairAddress);
    const reserves = await pair.getReserves();
    
    console.log("\n💧 Liquidity check:");
    console.log("Pair address:", pairAddress);
    console.log("Reserve0:", ethers.utils.formatEther(reserves[0]));
    console.log("Reserve1:", ethers.utils.formatUnits(reserves[1], 6));
    
    if (reserves[0].eq(0) || reserves[1].eq(0)) {
      console.log("❌ No liquidity in pair!");
      return;
    }

    // Test 4: Quote test
    const amountIn = ethers.utils.parseEther("0.1");
    const path = [WETH_ADDRESS, USDC_ADDRESS];
    
    const amounts = await router.getAmountsOut(amountIn, path);
    console.log("\n📈 Quote test:");
    console.log("Input: 0.1 ETH");
    console.log("Output:", ethers.utils.formatUnits(amounts[1], 6), "USDC");

    console.log("\n🎉 All tests passed! Contracts are ready for frontend!");
    
  } catch (error) {
    console.log("❌ Test failed:", error.message);
    console.log("Full error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
