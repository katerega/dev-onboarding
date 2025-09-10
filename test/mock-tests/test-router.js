async function main() {
  console.log("Testing router deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Load deployment info
  const deploymentInfo = require('../../deployment-info.json');
  const ROUTER_ADDRESS = deploymentInfo.contracts.TradeSphereRouter;
  
  console.log("Router address:", ROUTER_ADDRESS);

  // Test basic router call
  try {
    const router = await ethers.getContractAt("TradeSphereRouter", ROUTER_ADDRESS);
    const wethAddress = await router.WETH();
    console.log("✅ Router working! WETH address:", wethAddress);
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
