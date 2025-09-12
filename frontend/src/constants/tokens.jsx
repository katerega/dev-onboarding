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
    address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    decimals: 18,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6', // Latest deployed USDC with liquidity
    decimals: 6,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318', // Using same as USDC for testing
    decimals: 6,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  }
];