import { useState, useEffect, useCallback } from 'react'

// Multi-Network Configuration for TradeSphere DEX
const SUPPORTED_NETWORKS = {
  // Local Development
  localhost: {
    chainId: '0x7a69', // 31337 in hex (Hardhat)
    chainName: 'Localhost 8545',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: ['http://localhost:8545'],
    isTestnet: true,
    isLocal: true
  },

  // Ethereum Networks
  ethereum: {
    chainId: '0x1', // 1 in hex
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://etherscan.io'],
    isTestnet: false
  },
  sepolia: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    isTestnet: true
  },
  goerli: {
    chainId: '0x5', // 5 in hex
    chainName: 'Goerli Testnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
    isTestnet: true
  },

  // Polygon Networks
  polygon: {
    chainId: '0x89', // 137 in hex
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
    isTestnet: false
  },
  mumbai: {
    chainId: '0x13881', // 80001 in hex
    chainName: 'Polygon Mumbai',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    isTestnet: true
  },

  // Arbitrum Networks
  arbitrum: {
    chainId: '0xa4b1', // 42161 in hex
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
    isTestnet: false
  },
  arbitrumGoerli: {
    chainId: '0x66eed', // 421613 in hex
    chainName: 'Arbitrum Goerli',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://goerli.arbiscan.io'],
    isTestnet: true
  },

  // Optimism Networks
  optimism: {
    chainId: '0xa', // 10 in hex
    chainName: 'Optimism',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    isTestnet: false
  },
  optimismGoerli: {
    chainId: '0x1a4', // 420 in hex
    chainName: 'Optimism Goerli',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.optimism.io'],
    blockExplorerUrls: ['https://goerli-optimism.etherscan.io'],
    isTestnet: true
  },

  // BSC Networks
  bsc: {
    chainId: '0x38', // 56 in hex
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com'],
    isTestnet: false
  },
  bscTestnet: {
    chainId: '0x61', // 97 in hex
    chainName: 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    isTestnet: true
  },

  // Evmos Networks
  evmosTestnet: {
    chainId: '0x2328', // 9000 in hex
    chainName: 'Evmos Testnet',
    nativeCurrency: {
      name: 'Evmos',
      symbol: 'EVMOS',
      decimals: 18,
    },
    rpcUrls: ['https://evmos-testnet-evm.publicnode.com'],
    blockExplorerUrls: ['https://evm.evmos.dev'],
    isTestnet: true
  },
  evmosMainnet: {
    chainId: '0x2329', // 9001 in hex
    chainName: 'Evmos',
    nativeCurrency: {
      name: 'Evmos',
      symbol: 'EVMOS',
      decimals: 18,
    },
    rpcUrls: ['https://evmos-evm.publicnode.com'],
    blockExplorerUrls: ['https://evm.evmos.org'],
    isTestnet: false
  }
}

// Network preference order for auto-switching
const PREFERRED_NETWORKS = {
  development: ['localhost', 'sepolia', 'mumbai', 'evmosTestnet'],
  production: ['ethereum', 'polygon', 'arbitrum', 'evmosMainnet']
}

export const useWallet = () => {
  const [account, setAccount] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState(null)
  const [balance, setBalance] = useState('0')
  const [error, setError] = useState(null)

  // Check if wallet is available
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }, [])

  // Format wallet address for display
  const formatAddress = useCallback((address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [])

  // Get current network info
  const getCurrentNetwork = useCallback(() => {
    return Object.values(SUPPORTED_NETWORKS).find(network => network.chainId === chainId) || null
  }, [chainId])

  // Check if on supported network
  const isOnSupportedNetwork = useCallback(() => {
    return Object.values(SUPPORTED_NETWORKS).some(network => network.chainId === chainId)
  }, [chainId])

  // Get preferred network for current environment
  const getPreferredNetwork = useCallback(() => {
    const isDev = import.meta.env.DEV || window.location.hostname === 'localhost'
    const networkKeys = isDev ? PREFERRED_NETWORKS.development : PREFERRED_NETWORKS.production
    
    return networkKeys.map(key => SUPPORTED_NETWORKS[key]).find(network => network) || SUPPORTED_NETWORKS.localhost
  }, [])

  // Get account balance
  const getBalance = useCallback(async (address) => {
    try {
      if (!window.ethereum || !address) return '0'
      
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })
      
      // Convert from wei to EVMOS
      const balanceInEvmos = parseInt(balance, 16) / Math.pow(10, 18)
      return balanceInEvmos.toFixed(4)
    } catch (error) {
      console.error('Error getting balance:', error)
      return '0'
    }
  }, [])

  // Add network to MetaMask
  const addNetwork = useCallback(async (networkConfig) => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      })
      return true
    } catch (error) {
      console.error('Error adding network:', error)
      return false
    }
  }, [])

  // Switch to specific network
  const switchToNetwork = useCallback(async (networkKey) => {
    try {
      const networkConfig = SUPPORTED_NETWORKS[networkKey]
      if (!networkConfig) {
        throw new Error(`Unsupported network: ${networkKey}`)
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainId }],
      })
      return true
    } catch (error) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        return await addNetwork(SUPPORTED_NETWORKS[networkKey])
      }
      console.error('Error switching network:', error)
      return false
    }
  }, [addNetwork])

  // Switch to preferred network for current environment
  const switchToPreferredNetwork = useCallback(async () => {
    try {
      const isDev = import.meta.env.DEV || window.location.hostname === 'localhost'
      const preferredNetworks = isDev ? PREFERRED_NETWORKS.development : PREFERRED_NETWORKS.production

      // Try networks in order of preference
      for (const networkKey of preferredNetworks) {
        try {
          const success = await switchToNetwork(networkKey)
          if (success) {
            console.log(`✅ Switched to ${SUPPORTED_NETWORKS[networkKey].chainName}`)
            return true
          }
        } catch {
          console.log(`Failed to switch to ${networkKey}, trying next...`)
        }
      }

      return false
    } catch (error) {
      console.error('Error switching to preferred network:', error)
      return false
    }
  }, [switchToNetwork])

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return false
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please check your MetaMask.')
      }

      const account = accounts[0]
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      })

      setAccount(account)
      setChainId(currentChainId)
      setIsConnected(true)

      // Get balance
      const accountBalance = await getBalance(account)
      setBalance(accountBalance)

      // Check if on supported network
      const currentNetwork = Object.values(SUPPORTED_NETWORKS).find(net => net.chainId === currentChainId)
      if (!currentNetwork) {
        console.log('🔄 Not on supported network, attempting to switch...')
        const switchSuccess = await switchToPreferredNetwork()
        if (!switchSuccess) {
          setError('Please switch to a supported network to use TradeSphere DEX')
        }
      } else {
        console.log(`✅ Connected to ${currentNetwork.chainName}`)
      }

      return true
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setError(error.message || 'Failed to connect wallet')
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [isMetaMaskInstalled, getBalance, switchToPreferredNetwork])

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setIsConnected(false)
    setChainId(null)
    setBalance('0')
    setError(null)
  }, [])

  // Handle account changes
  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      const newAccount = accounts[0]
      setAccount(newAccount)
      const accountBalance = await getBalance(newAccount)
      setBalance(accountBalance)
    }
  }, [disconnectWallet, getBalance])

  // Handle chain changes
  const handleChainChanged = useCallback((newChainId) => {
    setChainId(newChainId)
    // Refresh balance when chain changes
    if (account) {
      getBalance(account).then(setBalance)
    }
  }, [account, getBalance])

  // Setup event listeners
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    // Check if already connected
    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })
        
        if (accounts.length > 0) {
          const currentChainId = await window.ethereum.request({
            method: 'eth_chainId',
          })
          
          setAccount(accounts[0])
          setChainId(currentChainId)
          setIsConnected(true)
          
          const accountBalance = await getBalance(accounts[0])
          setBalance(accountBalance)
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }

    checkConnection()

    // Setup event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [isMetaMaskInstalled, handleAccountsChanged, handleChainChanged, getBalance])

  return {
    // State
    account,
    isConnecting,
    isConnected,
    chainId,
    balance,
    error,
    
    // Computed values
    formattedAddress: formatAddress(account),
    currentNetwork: getCurrentNetwork(),
    isOnSupportedNetwork: isOnSupportedNetwork(),
    isMetaMaskInstalled: isMetaMaskInstalled(),
    supportedNetworks: SUPPORTED_NETWORKS,
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchToNetwork,
    switchToPreferredNetwork,
    addNetwork,
  }
}
