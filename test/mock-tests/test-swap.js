async function main() {
  console.log("🔄 Testing swap functionality...");
  
  const [deployer] = await ethers.getSigners();
  console.log("👤 Using account:", deployer.address);

  // Load deployment info
  const deploymentInfo = require('../../deployment-info.json');
  const ROUTER_ADDRESS = deploymentInfo.contracts.TradeSphereRouter;
  const WETH_ADDRESS = deploymentInfo.contracts.WETH;
  const USDC_ADDRESS = deploymentInfo.contracts.USDC;

  // Get contract instances
  const router = await ethers.getContractAt("TradeSphereRouter", ROUTER_ADDRESS);
  const weth = await ethers.getContractAt("WETH", WETH_ADDRESS);
  const usdc = await ethers.getContractAt("USDCMock", USDC_ADDRESS);

  console.log("\n💰 Current balances:");
  const ethBalance = await deployer.getBalance();
  const wethBalance = await weth.balanceOf(deployer.address);
  const usdcBalance = await usdc.balanceOf(deployer.address);
  
  console.log("ETH:", ethers.utils.formatEther(ethBalance));
  console.log("WETH:", ethers.utils.formatEther(wethBalance));
  console.log("USDC:", ethers.utils.formatUnits(usdcBalance, 6));

  // Test 1: Get quote for ETH to USDC
  console.log("\n📊 Test 1: Getting quote for 1 ETH -> USDC");
  try {
    const ethAmountIn = ethers.utils.parseEther("1");
    const path = [WETH_ADDRESS, USDC_ADDRESS];
    
    const amounts = await router.getAmountsOut(ethAmountIn, path);
    console.log("✅ Quote successful!");
    console.log("Input: 1 ETH");
    console.log("Output:", ethers.utils.formatUnits(amounts[1], 6), "USDC");
    
    // Calculate price
    const price = parseFloat(ethers.utils.formatUnits(amounts[1], 6));
    console.log("Price: 1 ETH =", price, "USDC");
    
  } catch (error) {
    console.log("❌ Quote failed:", error.message);
    return;
  }

  // Test 2: Perform actual swap
  console.log("\n💱 Test 2: Swapping 0.1 ETH for USDC");
  try {
    const swapAmount = ethers.utils.parseEther("0.1");
    const path = [WETH_ADDRESS, USDC_ADDRESS];
    
    // Get quote first
    const amounts = await router.getAmountsOut(swapAmount, path);
    const expectedOutput = amounts[1];
    const minOutput = expectedOutput.mul(97).div(100); // 3% slippage
    
    console.log("Expected output:", ethers.utils.formatUnits(expectedOutput, 6), "USDC");
    console.log("Min output (3% slippage):", ethers.utils.formatUnits(minOutput, 6), "USDC");
    
    const deadline = Math.floor(Date.now() / 1000) + 1200;
    
    // Perform swap
    const swapTx = await router.swapExactETHForTokens(
      minOutput,
      path,
      deployer.address,
      deadline,
      { value: swapAmount }
    );
    
    await swapTx.wait();
    console.log("✅ Swap successful!");
    
    // Check new balances
    const newUsdcBalance = await usdc.balanceOf(deployer.address);
    const usdcReceived = newUsdcBalance.sub(usdcBalance);
    console.log("USDC received:", ethers.utils.formatUnits(usdcReceived, 6));
    
  } catch (error) {
    console.log("❌ Swap failed:", error.message);
  }

  console.log("\n🎉 Swap testing complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
