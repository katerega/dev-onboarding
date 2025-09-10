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
    address: import.meta.env.VITE_WEVMOS_ADDRESS || '0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00',
    decimals: 18,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x4c5859f0F772848b2D91F1D83E2Fe57935348029', // Latest deployed USDC with liquidity
    decimals: 6,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x4c5859f0F772848b2D91F1D83E2Fe57935348029', // Using same as USDC for testing
    decimals: 6,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  }
];