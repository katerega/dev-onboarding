const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting TradeSphere DEX deployment to Evmos Testnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Use correct WETH address for Evmos Testnet
  const WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"; // Actual Evmos testnet WETH

  // 1. Deploy Factory
  console.log(" Step 1: Deploying TradeSphereFactory...");
  const TradeSphereFactory = await ethers.getContractFactory("TradeSphereFactory");
  const factory = await TradeSphereFactory.deploy(deployer.address);
  await factory.deployed();
  console.log("✅ Factory deployed to:", factory.address);

  // 2. Deploy Router
  console.log(" Step 2: Deploying TradeSphereRouter...");
  const TradeSphereRouter = await ethers.getContractFactory("TradeSphereRouter");
  const router = await TradeSphereRouter.deploy(factory.address, WETH_ADDRESS);
  await router.deployed();
  console.log("✅ Router deployed to:", router.address);

  // Save deployment info
  const deploymentInfo = {
    network: "Evmos Testnet",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      TradeSphereFactory: factory.address,
      TradeSphereRouter: router.address,
      WETH: WETH_ADDRESS
    },
    explorers: {
      factory: `https://evm.evmos.dev/address/${factory.address}`,
      router: `https://evm.evmos.dev/address/${router.address}`
    }
  };

  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("TradeSphere DEX deployed successfully to Evmos Testnet!");
  console.log("Check deployment-info.json for details");
}

main().catch(console.error);