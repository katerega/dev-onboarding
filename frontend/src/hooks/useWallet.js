import { useState, useEffect, useCallback } from 'react'

// EVMOS Network Configuration.
const EVMOS_NETWORK = {
  chainId: '0x2328', // 9000 in hex-decimal
  chainName: 'Evmos Testnet',
  nativeCurrency: {
    name: 'Evmos',
    symbol: 'EVMOS',
    decimals: 18,
  },
  rpcUrls: ['https://eth.bd.evmos.dev:8545'],
  blockExplorerUrls: ['https://evm.evmos.dev'],
}

const EVMOS_MAINNET = {
  chainId: '0x2329', // 9001 in hex
  chainName: 'Evmos',
  nativeCurrency: {
    name: 'Evmos',
    symbol: 'EVMOS',
    decimals: 18,
  },
  rpcUrls: ['https://eth.bd.evmos.org:8545'],
  blockExplorerUrls: ['https://evm.evmos.org'],
}

const LOCALHOST_NETWORK = {
  chainId: '0x7a69', // 31337 in hex (Hardhat)
  chainName: 'Localhost 8545',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://localhost:8545'],
  blockExplorerUrls: ['http://localhost:8545'],
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

  // Check if on correct network
  const isOnEvmosNetwork = useCallback(() => {
    return chainId === '0x2328' || chainId === '0x2329' || chainId === '0x7a69' // Testnet, Mainnet, or Localhost
  }, [chainId])

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

  // Add EVMOS network to MetaMask
  const addEvmosNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [EVMOS_NETWORK],
      })
      return true
    } catch (error) {
      console.error('Error adding EVMOS network:', error)
      return false
    }
  }, [])

  // Switch to EVMOS or localhost network
  const switchToEvmosNetwork = useCallback(async () => {
    try {
      // In development, try localhost first
      if (import.meta.env.DEV || window.location.hostname === 'localhost') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: LOCALHOST_NETWORK.chainId }],
          })
          return true
        } catch {
          console.log('Localhost network not available, trying Evmos...')
        }
      }
      
      // Try Evmos network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: EVMOS_NETWORK.chainId }],
      })
      return true
    } catch (error) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        return await addEvmosNetwork()
      }
      console.error('Error switching network:', error)
      return false
    }
  }, [addEvmosNetwork])

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

      // Check if on EVMOS network
      if (currentChainId !== EVMOS_NETWORK.chainId && currentChainId !== EVMOS_MAINNET.chainId) {
        const switchSuccess = await switchToEvmosNetwork()
        if (!switchSuccess) {
          setError('Please switch to EVMOS network to use TradeSphere DEX')
        }
      }

      return true
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setError(error.message || 'Failed to connect wallet')
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [isMetaMaskInstalled, getBalance, switchToEvmosNetwork])

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
    isOnEvmosNetwork: isOnEvmosNetwork(),
    isMetaMaskInstalled: isMetaMaskInstalled(),
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchToEvmosNetwork,
    addEvmosNetwork,
  }
}
