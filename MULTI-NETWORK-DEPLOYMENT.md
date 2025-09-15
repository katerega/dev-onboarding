# Multi-Network Deployment Guide

This guide covers deploying TradeSphere DEX across multiple blockchain networks.

## Supported Networks

### Ethereum Networks
- **Ethereum Mainnet** (`chainId: 1`)
  - Command: `npm run deploy:ethereum`
  - Currency: ETH
  - Min Balance: 0.5 ETH
  - WETH: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`

- **Ethereum Goerli Testnet** (`chainId: 5`)
  - Command: `npm run deploy:goerli`
  - Currency: ETH (testnet)
  - Min Balance: 0.1 ETH
  - WETH: `0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6`

- **Ethereum Sepolia Testnet** (`chainId: 11155111`)
  - Command: `npm run deploy:sepolia`
  - Currency: ETH (testnet)
  - Min Balance: 0.1 ETH
  - WETH: `0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9`

### Polygon Networks
- **Polygon Mainnet** (`chainId: 137`)
  - Command: `npm run deploy:polygon`
  - Currency: MATIC
  - Min Balance: 5.0 MATIC
  - WETH: `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270` (WMATIC)

- **Polygon Mumbai Testnet** (`chainId: 80001`)
  - Command: `npm run deploy:mumbai`
  - Currency: MATIC (testnet)
  - Min Balance: 1.0 MATIC
  - WETH: `0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889`

### Arbitrum Networks
- **Arbitrum One** (`chainId: 42161`)
  - Command: `npm run deploy:arbitrum`
  - Currency: ETH
  - Min Balance: 0.01 ETH
  - WETH: `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1`

- **Arbitrum Goerli Testnet** (`chainId: 421613`)
  - Command: `npm run deploy:arbitrum-goerli`
  - Currency: ETH (testnet)
  - Min Balance: 0.01 ETH
  - WETH: `0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3`

### Optimism Networks
- **Optimism Mainnet** (`chainId: 10`)
  - Command: `npm run deploy:optimism`
  - Currency: ETH
  - Min Balance: 0.01 ETH
  - WETH: `0x4200000000000000000000000000000000000006`

- **Optimism Goerli Testnet** (`chainId: 420`)
  - Command: `npm run deploy:optimism-goerli`
  - Currency: ETH (testnet)
  - Min Balance: 0.01 ETH
  - WETH: `0x4200000000000000000000000000000000000006`

### BNB Smart Chain Networks
- **BNB Smart Chain Mainnet** (`chainId: 56`)
  - Command: `npm run deploy:bsc`
  - Currency: BNB
  - Min Balance: 0.1 BNB
  - WETH: `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c` (WBNB)

- **BNB Testnet** (`chainId: 97`)
  - Command: `npm run deploy:bsc-testnet`
  - Currency: BNB (testnet)
  - Min Balance: 0.1 BNB
  - WETH: `0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd`

### Evmos Networks
- **Evmos Mainnet** (`chainId: 9001`)
  - Command: `npm run deploy:evmos`
  - Currency: EVMOS
  - Min Balance: 0.1 EVMOS
  - WETH: `0x5Ed91D8c5FcEcD4C7523916712D7AF4F2Bb7aEE4`

- **Evmos Testnet** (`chainId: 9000`)
  - Command: `npm run deploy:evmos-testnet`
  - Currency: EVMOS (testnet)
  - Min Balance: 0.1 EVMOS
  - WETH: `0x5Ed91D8c5FcEcD4C7523916712D7AF4F2Bb7aEE4`

### Local Development
- **Localhost** (`chainId: 31337`)
  - Command: `npm run deploy:localhost`
  - Currency: ETH
  - WETH: Deployed fresh

## Pre-Deployment Steps

### 1. Network Verification
Run the network verification script to check connectivity and configuration:

```bash
npm run verify-network
```

This will:
- ✅ Verify network connectivity
- ✅ Check account balance
- ✅ Validate WETH contract
- ✅ Show deployment readiness

### 2. Configure Network in Hardhat
Ensure your `hardhat.config.js` has the network configured:

```javascript
module.exports = {
  networks: {
    mainnet: {
      url: process.env.ETHEREUM_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    // ... other networks
  }
};
```

### 3. Environment Variables
Set up your `.env` file:

```bash
# Private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URLs
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_KEY
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# Optional: Custom WETH addresses
WETH_ADDRESS=0x...

# API Keys
ETHERSCAN_API_KEY=your_etherscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key
```

## Deployment Process

### Step 1: Verify Network
```bash
# Check network configuration and readiness
npm run verify-network
```

### Step 2: Deploy Core Contracts
```bash
# Example: Deploy to Polygon mainnet
npm run deploy:polygon

# Example: Deploy to Arbitrum testnet  
npm run deploy:arbitrum-goerli
```

### Step 3: Verify Deployment
The script automatically saves deployment info to `deployment-info.json` and provides:
- ✅ Contract addresses
- ✅ Transaction hashes  
- ✅ Block explorer links
- ✅ Network configuration

### Step 4: Verify Contracts (Optional)
For supported networks, verify your contracts on block explorers:

```bash
# Ethereum networks
npx hardhat verify --network mainnet CONTRACT_ADDRESS "constructor_arg1" "constructor_arg2"

# Polygon networks  
npx hardhat verify --network polygon CONTRACT_ADDRESS "constructor_arg1" "constructor_arg2"
```

## Network-Specific Considerations

### Ethereum Mainnet
- **High Gas Costs**: Deploy during low network usage (weekends/early morning UTC)
- **Security**: Use multi-sig wallets for admin functions
- **Verification**: Verify contracts on Etherscan immediately

### Layer 2 Solutions (Arbitrum, Optimism)
- **Low Costs**: Generally affordable deployment
- **Bridging**: Consider token bridging strategies
- **Finality**: Understand withdrawal periods for mainnet

### Polygon
- **MATIC for Gas**: Ensure sufficient MATIC balance
- **Fast Blocks**: ~2 second block times
- **Bridges**: Plan for Ethereum ↔ Polygon asset movement

### BNB Smart Chain
- **Centralization**: Consider the more centralized nature
- **Speed**: Very fast transactions (~3 second blocks)
- **Ecosystem**: Large DeFi ecosystem

### Evmos
- **Cosmos Integration**: EVM-compatible but Cosmos-based
- **IBC**: Inter-blockchain communication capabilities
- **Staking**: EVMOS staking considerations

## Post-Deployment Checklist

### For Testnets
- [ ] Verify contracts on block explorer
- [ ] Set up test tokens and liquidity
- [ ] Test basic swap functionality
- [ ] Configure frontend for testnet

### For Mainnets  
- [ ] Verify contracts on block explorer
- [ ] Set up production tokens carefully
- [ ] Implement timelock for admin functions
- [ ] Configure monitoring and alerts
- [ ] Update frontend for mainnet
- [ ] Conduct security audit

## Troubleshooting

### Common Issues

**Network Error**
```
✗ Check internet connection
✗ Verify RPC endpoint in hardhat.config.js
✗ Try alternative RPC providers
```

**Insufficient Funds**
```
✗ Check minimum balance requirements
✗ Account for gas price fluctuations
✗ Use testnet faucets for testnets
```

**Nonce Issues**
```
✗ Reset wallet transaction history
✗ Wait for pending transactions to complete
✗ Check for stuck transactions
```

**Gas Estimation Failed**
```
✗ Network congestion - try again later
✗ Increase gas limit manually
✗ Check for contract compilation errors
```

## Support

For deployment issues:
1. Run `npm run verify-network` for diagnostics
2. Check the deployment logs in `deployment-info.json`
3. Verify network configuration in `hardhat.config.js`
4. Ensure sufficient balance for the target network

---

**Note**: Always test on testnets before mainnet deployment. Keep deployment info secure and backed up.