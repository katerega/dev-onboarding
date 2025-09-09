const { ethers } = require("hardhat");
const https = require('https');

async function testRPCConnections() {
  console.log("🔍 Testing Evmos RPC Connections...\n");

  const endpoints = [
    { name: "Evmos Mainnet (Official)", url: "https://eth.bd.evmos.org:8545", chainId: 9001 },
    { name: "Evmos Mainnet (PublicNode)", url: "https://evmos-evm.publicnode.com", chainId: 9001 },
    { name: "Evmos Mainnet (Pokt)", url: "https://evmos-rpc.gateway.pokt.network", chainId: 9001 },
    { name: "Evmos Testnet (Official)", url: "https://eth.bd.evmos.dev:8545", chainId: 9000 },
    { name: "Evmos Testnet (PublicNode)", url: "https://evmos-testnet-evm.publicnode.com", chainId: 9000 }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      
      // Test basic connectivity
      const testPayload = JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1
      });

      const response = await new Promise((resolve, reject) => {
        const req = https.request(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(testPayload)
          },
          timeout: 10000
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data }));
        });

        req.on('error', reject);
        req.on('timeout', () => reject(new Error('Request timeout')));
        req.write(testPayload);
        req.end();
      });

      if (response.status === 200) {
        const result = JSON.parse(response.data);
        if (result.result) {
          const returnedChainId = parseInt(result.result, 16);
          if (returnedChainId === endpoint.chainId) {
            console.log(`✅ ${endpoint.name}: Working (Chain ID: ${returnedChainId})`);
          } else {
            console.log(`⚠️  ${endpoint.name}: Chain ID mismatch (Expected: ${endpoint.chainId}, Got: ${returnedChainId})`);
          }
        } else {
          console.log(`❌ ${endpoint.name}: Invalid response format`);
        }
      } else {
        console.log(`❌ ${endpoint.name}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
    }
    console.log();
  }

  // Test current Hardhat network configuration
  console.log("🔧 Testing Current Hardhat Network...");
  try {
    const [signer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    const balance = await signer.getBalance();
    
    console.log(`✅ Connected to Chain ID: ${network.chainId}`);
    console.log(`✅ Account: ${signer.address}`);
    console.log(`✅ Balance: ${ethers.utils.formatEther(balance)} EVMOS`);
  } catch (error) {
    console.log(`❌ Hardhat Network Test Failed: ${error.message}`);
  }
}

testRPCConnections().catch(console.error);