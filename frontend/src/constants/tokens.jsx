// Token list for EVMOS and localhost
export const TOKEN_LIST = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Special address for native token
    decimals: 18,
    isNative: true,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    decimals: 18,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9', // Latest deployed USDC with liquidity
    decimals: 6,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707', // Using same as USDC for testing
    decimals: 6,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  }
];