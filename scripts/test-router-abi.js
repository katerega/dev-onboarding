async function main() {
  console.log("🔍 Testing router ABI compatibility...");
  
  const [deployer] = await ethers.getSigners();
  
  // Load deployment info
  const deploymentInfo = require('../deployment-info.json');
  const ROUTER_ADDRESS = deploymentInfo.contracts.TradeSphereRouter;
  
  try {
    const router = await ethers.getContractAt("TradeSphereRouter", ROUTER_ADDRESS);
    
    console.log("✅ Router contract loaded successfully");
    
    // Test if specific functions exist
    console.log("\n📋 Testing function availability:");
    
    // Test quote functions
    try {
      const weth = await router.WETH();
      console.log("✅ WETH() function works:", weth);
    } catch (error) {
      console.log("❌ WETH() function failed:", error.message);
    }
    
    // Test swapExactETHForTokens exists
    try {
      const fragment = router.interface.getFunction("swapExactETHForTokens");
      console.log("✅ swapExactETHForTokens function exists in ABI");
      console.log("   Signature:", fragment.format());
    } catch (error) {
      console.log("❌ swapExactETHForTokens function not found in ABI");
    }
    
    // Test addLiquidityETH exists
    try {
      const fragment = router.interface.getFunction("addLiquidityETH");
      console.log("✅ addLiquidityETH function exists in ABI");
    } catch (error) {
      console.log("❌ addLiquidityETH function not found in ABI");
    }
    
    console.log("\n🎉 Router ABI compatibility test complete!");
    
  } catch (error) {
    console.log("❌ Router test failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
