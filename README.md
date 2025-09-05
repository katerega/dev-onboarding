# TradeSphere DEX

A comprehensive developer toolkit for building decentralized exchanges (DEX) on the Evmos blockchain. This toolkit provides pre-built smart contracts, deployment scripts, and a production-ready frontend to help developers quickly create DEX applications without worrying about complex tooling and setup.

## 🌟 Features

- **Token Swapping**: Instant token-to-token exchanges
- **Liquidity Provision**: Add liquidity to earn trading fees
- **Pair Creation**: Create new trading pairs for any ERC-20 tokens
- **Evmos Integration**: Built specifically for the Evmos ecosystem

## 🏗️ Project Structure

```
TradeSphere-DEX/
├── contracts/              # Smart contracts
│   ├── TradeSphereFactory.sol
│   ├── TradeSphereRouter.sol
│   └── TradeSpherePair.sol
├── frontend/               # React frontend application
├── scripts/                # Deployment scripts
├── test/                   # Contract tests
└── hardhat.config.js       # Hardhat configuration
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **MetaMask** browser extension - [Install here](https://metamask.io/)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/WinfredWinfred/TradeSphere-DEX.git
cd TradeSphere-DEX

# Install project dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```properties
# ⚠️ NEVER COMMIT THIS FILE TO GIT ⚠️

# Wallet Configuration (Get a new private key from MetaMask)
PRIVATE_KEY="your_private_key_here_64_characters"

# Network Configuration
EVMOS_TESTNET_RPC="https://eth.bd.evmos.dev:8545"
EVMOS_MAINNET_RPC="https://eth.bd.evmos.org:8545"

# Contract Addresses (will be populated after deployment)
FACTORY_ADDRESS=""
ROUTER_ADDRESS=""
WETH_ADDRESS=""
```

### 3. MetaMask Network Setup

Add Evmos Testnet to MetaMask:

```
Network Name: Evmos Testnet
RPC URL: https://eth.bd.evmos.dev:8545
Chain ID: 9000
Currency Symbol: EVMOS
Block Explorer: https://evm.evmos.dev
```

### 4. Get Testnet Tokens

- Visit the [Evmos Testnet Faucet](https://faucet.evmos.dev/)
- Request testnet EVMOS tokens for your wallet address
- You'll need these for gas fees and testing

## 🔧 Smart Contract Development

### Compile Contracts

```bash
# Compile all smart contracts
npm run compile

# Clean and recompile
npx hardhat clean
npm run compile
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/TradeSphere.test.js
```

### Local Development

```bash
# Terminal 1 - Start local Hardhat node
npx hardhat node

# Terminal 2 - Deploy contracts to local network
npx hardhat run scripts/deploy.js --network localhost

# Verify deployment worked
npx hardhat run scripts/verify-deployment.js --network localhost
```

### Testnet Deployment

```bash
# Deploy to Evmos Testnet
npm run deploy:evmos

# Or manually deploy
npx hardhat run scripts/deploy.js --network evmosTestnet

# Verify contracts on explorer (optional)
npx hardhat verify --network evmosTestnet <CONTRACT_ADDRESS>
```

## 🎨 Frontend Development

### Start Development Server

```bash
# Navigate to frontend directory
cd frontend

# Start the development server
npm run dev

# The application will be available at:
# http://localhost:5173
```

### Frontend Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🌐 Network Configuration

### Supported Networks

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Evmos Testnet | 9000 | https://eth.bd.evmos.dev:8545 |
| Evmos Mainnet | 9001 | https://eth.bd.evmos.org:8545 |


## 📁 Project Scripts

### Root Level Scripts

```bash
# Smart contract operations
npm run compile          # Compile contracts
npm run test            # Run contract tests
npm run deploy:local    # Deploy to local network
npm run deploy:evmos    # Deploy to Evmos testnet
```

### Frontend Scripts

```bash
cd frontend

npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Check code quality
```

## 🔒 Security Best Practices

### Environment Variables

- **Never commit** your `.env` file to version control
- Use **separate wallets** for development and production
- Keep your **private keys secure** and never share them
- Use **testnet tokens** for all development and testing

## 🐛 Troubleshooting

### Common Issues

**"Network not supported" error:**
- Ensure you've added Evmos network to MetaMask
- Check that you're connected to the correct network

**Frontend not loading:**
- Check that the development server is running (`npm run dev`)
- Ensure all dependencies are installed (`npm install`)
- Clear browser cache and restart the development server

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

