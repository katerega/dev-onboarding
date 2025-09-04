## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Installation & Setup
# Clone the repository
git clone https://github.com/WinfredWinfred/TradeSphere-DEX.git
cd TradeSphere-DEX

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Run specific test file
npx hardhat test test/TradeSphere.test.js


Local Deployment
# Terminal 1 - Start local blockchain (keep running)
npx hardhat node

# Terminal 2 - Deploy contracts
npx hardhat run scripts/deploy.js --network localhost


Testnet Deployment
bash
# Deploy to Evmos Testnet
npm run deploy:evmos




# Verify deployment
npx hardhat run scripts/verify-deployment.js --network localhost
