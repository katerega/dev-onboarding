async function main() {
  console.log("Setting up simple trading pairs...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Load deployment info
  const deploymentInfo = require('../../deployment-info.json');
  const FACTORY_ADDRESS = deploymentInfo.contracts.TradeSphereFactory;
  const ROUTER_ADDRESS = deploymentInfo.contracts.TradeSphereRouter;
  const WETH_ADDRESS = deploymentInfo.contracts.WETH;

  // Get contract instances
  const factory = await ethers.getContractAt("TradeSphereFactory", FACTORY_ADDRESS);
  const router = await ethers.getContractAt("TradeSphereRouter", ROUTER_ADDRESS);
  
  // Deploy simple mock tokens
  console.log("\n🪙 Deploying mock tokens...");
  
  const USDCMock = await ethers.getContractFactory("USDCMock");
  const usdc = await USDCMock.deploy(deployer.address, ethers.utils.parseUnits("1000000", 6));
  await usdc.deployed();
  console.log("✅ USDC deployed at:", usdc.address);

  // Create a simple USDC/USDC trading pair (for testing)
  console.log("\n🔗 Creating trading pair...");
  
  const createPairTx = await factory.createPair(usdc.address, WETH_ADDRESS);
  await createPairTx.wait();
  
  const pairAddress = await factory.getPair(usdc.address, WETH_ADDRESS);
  console.log("✅ Pair created at:", pairAddress);
  
  console.log("\n✅ Simple setup complete!");
  console.log("📋 Summary:");
  console.log("- USDC:", usdc.address);
  console.log("- WETH:", WETH_ADDRESS);
  console.log("- Pair:", pairAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
