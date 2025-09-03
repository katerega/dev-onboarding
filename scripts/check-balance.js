const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  console.log("Account:", deployer.address);
  console.log("Balance:", ethers.utils.formatEther(balance), "EVMOS");
  
  if (balance.eq(0)) {
    console.log("❌ Get test tokens from: https://faucet.evmos.dev/");
  } else {
    console.log("✅ Sufficient balance for deployment");
  }
}

main().catch(console.error);