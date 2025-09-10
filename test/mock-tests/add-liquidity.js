async function main() {
  console.log("Adding initial liquidity...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Load deployment info
  const deploymentInfo = require('../../deployment-info.json');
  const ROUTER_ADDRESS = deploymentInfo.contracts.TradeSphereRouter;
  const WETH_ADDRESS = deploymentInfo.contracts.WETH;

  // Get deployed USDC from simple setup
  const USDC_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';

  // Get contract instances
  const router = await ethers.getContractAt("TradeSphereRouter", ROUTER_ADDRESS);
  const usdc = await ethers.getContractAt("USDCMock", USDC_ADDRESS);
  const weth = await ethers.getContractAt("IWETH", WETH_ADDRESS);

  console.log("\n💰 Current balances:");
  const usdcBalance = await usdc.balanceOf(deployer.address);
  const ethBalance = await deployer.getBalance();
  console.log("USDC:", ethers.utils.formatUnits(usdcBalance, 6));
  console.log("ETH:", ethers.utils.formatEther(ethBalance));

  // Prepare amounts
  const usdcAmount = ethers.utils.parseUnits("10000", 6); // 10,000 USDC
  const ethAmount = ethers.utils.parseEther("5"); // 5 ETH

  console.log("\n🔗 Adding liquidity...");
  
  // Approve USDC
  const approveTx = await usdc.approve(ROUTER_ADDRESS, usdcAmount);
  await approveTx.wait();
  console.log("✅ USDC approved");

  // Calculate deadline (20 minutes from now)
  const deadline = Math.floor(Date.now() / 1000) + 1200;

  // Add liquidity ETH/USDC
  const liquidityTx = await router.addLiquidityETH(
    USDC_ADDRESS,
    usdcAmount,
    ethers.utils.parseUnits("9000", 6), // min USDC
    ethers.utils.parseEther("4"), // min ETH
    deployer.address,
    deadline,
    { value: ethAmount }
  );
  
  await liquidityTx.wait();
  console.log("✅ Liquidity added successfully!");

  // Check pair reserves
  const factory = await ethers.getContractAt("TradeSphereFactory", deploymentInfo.contracts.TradeSphereFactory);
  const pairAddress = await factory.getPair(WETH_ADDRESS, USDC_ADDRESS);
  const pair = await ethers.getContractAt("ITradeSpherePair", pairAddress);
  
  const reserves = await pair.getReserves();
  console.log("\n📊 Pair reserves:");
  console.log("Reserve0:", ethers.utils.formatEther(reserves[0]));
  console.log("Reserve1:", ethers.utils.formatUnits(reserves[1], 6));
  
  console.log("\n🎉 Ready for testing swaps!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
