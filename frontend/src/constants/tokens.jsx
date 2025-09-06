// Token list for EVMOS
export const TOKEN_LIST = [
  {
    symbol: 'EVMOS',
    name: 'Evmos',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH address
    decimals: 18,
    isNative: true,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'WEVMOS',
    name: 'Wrapped Evmos',
    address: import.meta.env.VITE_WEVMOS_ADDRESS || '',
    decimals: 18,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687', // Replace with actual USDC address
    decimals: 6,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xeceeefcee421d8062ef8d6b4d814efe4dc898265', // Replace with actual USDT address  
    decimals: 6,
    isNative: false,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  }
];