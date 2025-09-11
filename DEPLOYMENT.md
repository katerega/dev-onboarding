# TradeSphere Deployment Architecture

## 🏗️ **Two-Step Deployment Strategy**

TradeSphere uses a clean separation between core contract deployment and development setup:

### **Step 1: Core Contract Deployment** (`scripts/deploy.js`)
- ✅ **Universal**: Works on localhost, testnet, and mainnet
- ✅ **WETH Strategy**: Deploys fresh WETH on localhost, uses existing on networks
- ✅ **Core Contracts**: TradeSphereFactory + TradeSphereRouter
- ✅ **Production Ready**: Gas estimation, error handling, network validation

### **Step 2: Development Setup** (`test/mock-tests/setup-tokens-liquidity.js`)
- ✅ **Post-Deployment**: Requires core contracts to be deployed first
- ✅ **Mock Tokens**: Deploys USDC + USDT with 1M supply each
- ✅ **Liquidity Pools**: Creates pairs with 50 WETH + 100K tokens
- ✅ **Exchange Rate**: Sets 1 ETH = 2,000 USDC/USDT
- ✅ **Frontend Ready**: Provides addresses for immediate testing

## 🚀 **Quick Start Commands**

### **Full Development Setup**
```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy everything for development
npm run dev:full
```

### **Manual Step-by-Step**
```bash
# Step 1: Deploy core contracts
npm run deploy:localhost     # or deploy:evmos / deploy:testnet

# Step 2: Setup development environment (localhost only)
npm run setup:localhost
```

### **Production Deployment**
```bash
# Mainnet
npm run deploy:evmos

# Testnet  
npm run deploy:testnet
```

## 📋 **Network Support**

| Network | Chain ID | WETH Strategy | Setup Script |
|---------|----------|---------------|--------------|
| **Localhost** | 31337 | Deploy fresh | ✅ Available |
| **Evmos Mainnet** | 9001 | Use existing | ❌ Manual setup |
| **Evmos Testnet** | 9000 | Use existing | ❌ Manual setup |

## 🔧 **Script Responsibilities**

### **[`scripts/deploy.js`](scripts/deploy.js)**
```javascript
// Responsibilities:
✅ Multi-network deployment (localhost/testnet/mainnet)
✅ WETH deployment (localhost only)
✅ TradeSphereFactory deployment
✅ TradeSphereRouter deployment
✅ Gas estimation & optimization
✅ Network validation & error handling
✅ deployment-info.json creation

// Does NOT handle:
❌ Mock token deployment
❌ Liquidity setup
❌ Trading pair creation
```

### **[`test/mock-tests/setup-tokens-liquidity.js`](test/mock-tests/setup-tokens-liquidity.js)**
```javascript
// Responsibilities:
✅ Mock token deployment (USDC, USDT)
✅ WETH balance setup
✅ Trading pair creation
✅ Initial liquidity addition
✅ Development environment preparation
✅ deployment-info.json updates

// Requires:
⚠️ Core contracts must be deployed first
⚠️ Localhost network only
⚠️ Valid deployment-info.json file
```

## 📊 **Output Structure**

### **After Core Deployment**
```json
{
  "contracts": {
    "TradeSphereFactory": "0x...",
    "TradeSphereRouter": "0x...", 
    "WETH": "0x..."
  }
}
```

### **After Development Setup**
```json
{
  "contracts": { /* core contracts */ },
  "tokens": {
    "WETH": { "address": "0x...", "decimals": 18 },
    "USDC": { "address": "0x...", "decimals": 6 },
    "USDT": { "address": "0x...", "decimals": 6 }
  },
  "pairs": {
    "WETH/USDC": "0x...",
    "WETH/USDT": "0x..."
  },
  "setupComplete": true
}
```

## 🎯 **Benefits of This Architecture**

### **Clean Separation**
- 🏗️ **Production deployments** are lightweight and focused
- 🧪 **Development setup** is comprehensive and automated
- 🔄 **Repeatable** - can redeploy setup without touching core contracts

### **Network Flexibility**
- 🌍 **Same deploy script** works across all networks
- 🏠 **Localhost gets fresh WETH** for testing
- 🌐 **Mainnet uses existing WETH** for efficiency

### **Developer Experience**
- ⚡ **One command** (`npm run dev:full`) for complete setup
- 📋 **Clear documentation** of what each script does
- 🔧 **Easy debugging** - can run steps independently

## 🚨 **Important Notes**

1. **Always run core deployment first** - setup script depends on it
2. **Setup script is localhost only** - production needs manual token setup
3. **Each setup run creates new tokens** - use same addresses in frontend
4. **deployment-info.json is updated** by both scripts - contains everything

This architecture ensures clean, maintainable, and flexible deployment across all environments! 🎉
