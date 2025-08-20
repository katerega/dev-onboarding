const hre = require("hardhat");

async function main() {
  const SwapDex = await hre.ethers.getContractFactory("SwapDex");
  const swapDex = await SwapDex.deploy();
  await swapDex.deployed();
  console.log("SwapDex deployed to:", swapDex.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
