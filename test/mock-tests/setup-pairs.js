const { ethers } = require("hardhat");

async function main() {
  console.log("Setting up initial trading pairs...");

  // Get the deployed contract addresses
  const deploymentInfo = require('../../deployment-info.json');
  const factoryAddress = deploymentInfo.contracts.TradeSphereFactory;
  const routerAddress = deploymentInfo.contracts.TradeSphereRouter;
  const wethAddress = deploymentInfo.contracts.WETH;

  // Get the signer
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Deploy mock ERC20 tokens for testing
  const USDCMock = await ethers.getContractFactory("USDCMock");
  const USDTMock = await ethers.getContractFactory("USDTMock");
  
  console.log("\n🪙 Deploying mock tokens...");
  
  // Deploy USDC mock
  const usdc = await USDCMock.deploy(deployer.address, ethers.utils.parseUnits("1000000", 6));
  await usdc.deployed();
  console.log("✅ USDC deployed at:", usdc.address);

  // Deploy USDT mock  
  const usdt = await USDTMock.deploy(deployer.address, ethers.utils.parseUnits("1000000", 6));
  await usdt.deployed();
  console.log("✅ USDT deployed at:", usdt.address);

  // Get contract instances
  const factory = await ethers.getContractAt("TradeSphereFactory", factoryAddress);
  const router = await ethers.getContractAt("TradeSphereRouter", routerAddress);
  const weth = await ethers.getContractAt("contracts/mocks/ERC20Mock.sol:ERC20Mock", wethAddress);

  console.log("\n💧 Setting up liquidity...");

  // Mint tokens to deployer
  const ethAmount = ethers.utils.parseEther("100"); // 100 ETH worth
  const usdcAmount = ethers.utils.parseUnits("200000", 6); // 200,000 USDC (6 decimals)
  const usdtAmount = ethers.utils.parseUnits("200000", 6); // 200,000 USDT (6 decimals)

  await usdc.mint(deployer.address, usdcAmount);
  await usdt.mint(deployer.address, usdtAmount);
  console.log("✅ Minted test tokens");

  // Approve tokens for router
  await usdc.approve(router.address, usdcAmount);
  await usdt.approve(router.address, usdtAmount);
  await weth.approve(router.address, ethAmount);
  console.log("✅ Approved tokens for router");

  const deadline = Math.floor(Date.now() / 1000) + (20 * 60); // 20 minutes

  // Add WETH/USDC liquidity (1 ETH = 2000 USDC)
  console.log("\n🔄 Adding WETH/USDC liquidity...");
  const ethForUsdc = ethers.utils.parseEther("50"); // 50 ETH
  const usdcForEth = ethers.utils.parseUnits("100000", 6); // 100,000 USDC

  await router.addLiquidity(
    weth.address,
    usdc.address,
    ethForUsdc,
    usdcForEth,
    ethers.utils.parseEther("49"), // min ETH
    ethers.utils.parseUnits("99000", 6), // min USDC
    deployer.address,
    deadline
  );
  console.log("✅ Added WETH/USDC liquidity");

  // Add WETH/USDT liquidity (1 ETH = 2000 USDT)
  console.log("\n🔄 Adding WETH/USDT liquidity...");
  const ethForUsdt = ethers.utils.parseEther("50"); // 50 ETH
  const usdtForEth = ethers.utils.parseUnits("100000", 6); // 100,000 USDT

  await router.addLiquidity(
    weth.address,
    usdt.address,
    ethForUsdt,
    usdtForEth,
    ethers.utils.parseEther("49"), // min ETH
    ethers.utils.parseUnits("99000", 6), // min USDT
    deployer.address,
    deadline
  );
  console.log("✅ Added WETH/USDT liquidity");

  // Get pair addresses
  const wethUsdcPair = await factory.getPair(weth.address, usdc.address);
  const wethUsdtPair = await factory.getPair(weth.address, usdt.address);

  console.log("\n📄 Pair addresses:");
  console.log("WETH/USDC pair:", wethUsdcPair);
  console.log("WETH/USDT pair:", wethUsdtPair);

  console.log("\n🪙 Token addresses for frontend:");
  console.log("WETH:", weth.address);
  console.log("USDC:", usdc.address);
  console.log("USDT:", usdt.address);

  console.log("\n✅ Setup complete! You can now test swaps in the frontend.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
