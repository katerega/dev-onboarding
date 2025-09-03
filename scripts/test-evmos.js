// scripts/test-evmos.js
const { ethers } = require("hardhat");

const RPC_ENDPOINTS = [
  "https://evmos-testnet.lava.build",
  "https://jsonrpc-evmos.testnet.aurora.dev", 
  "https://evmos-testnet.public.blastapi.io",
  "https://eth.bd.evmos.dev:8545"
];

async function testEvmos() {
  console.log("Testing Evmos RPC endpoints...");
  
  for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINTS[i]);
      const block = await provider.getBlockNumber();
      console.log(`✅ RPC ${i+1} (${RPC_ENDPOINTS[i]}): Connected! Block: ${block}`);
      return RPC_ENDPOINTS[i]; // Return the working endpoint
    } catch (error) {
      console.log(`RPC ${i+1} (${RPC_ENDPOINTS[i]}): Failed - ${error.message}`);
    }
  }
  
  throw new Error("All Evmos RPC endpoints failed");
}

testEvmos().then(workingRpc => {
  console.log("🎉 Working RPC found:", workingRpc);
  process.exit(0);
}).catch(error => {
  console.log("All RPC endpoints failed");
  process.exit(1);
});