import React, { useState } from 'react'
import { useWallet } from '../hooks/useWallet'

const WalletButton = ({ className = '' }) => {
  const {
    account,
    isConnecting,
    isConnected,
    balance,
    error,
    formattedAddress,
    currentNetwork,
    isOnSupportedNetwork,
    isMetaMaskInstalled,
    connectWallet,
    switchToPreferredNetwork,
    switchToNetwork,
  } = useWallet()

  const [showDropdown, setShowDropdown] = useState(false)

  // Handle wallet connection
  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/', '_blank')
      return
    }
    await connectWallet()
  }

  // Handle network switch
  const handleNetworkSwitch = async () => {
    await switchToPreferredNetwork()
  }

  // Get network display info
  const getNetworkInfo = () => {
    if (!currentNetwork) {
      return { name: 'Unsupported Network', isSupported: false, explorer: '#' }
    }
    
    return {
      name: currentNetwork.chainName,
      isSupported: isOnSupportedNetwork,
      currency: currentNetwork.nativeCurrency.symbol,
      explorer: currentNetwork.blockExplorerUrls[0]
    }
  }

  const networkInfo = getNetworkInfo()

  // Connected wallet dropdown
  if (isConnected && account) {
    return (
      <div className={`relative ${className}`}>
        {/* Network Warning */}
        {!networkInfo.isSupported && (
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}

        {/* Wallet Address & Dropdown */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-3 py-2 text-white hover:text-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          {/* Wallet Address & Network */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{formattedAddress}</span>
            <span className={`text-xs ${networkInfo.isSupported ? 'text-green-300' : 'text-red-300'}`}>
              {networkInfo.name}
            </span>
          </div>
          
          {/* Dropdown Arrow */}
          <svg
            className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            ></div>
            
            {/* Dropdown Content */}
            <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-blue-700/30 rounded-xl shadow-2xl z-20 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-blue-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Connected Wallet</div>
                    <div className="text-blue-300 text-sm">{formattedAddress}</div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${networkInfo.isSupported ? 'bg-green-400' : 'bg-red-400'}`}></div>
                </div>
              </div>

              {/* Balance */}
              <div className="p-4 border-b border-blue-700/30">
                <div className="text-blue-300 text-sm mb-1">Balance</div>
                <div className="text-white text-lg font-semibold">
                  {balance} {networkInfo.currency || 'ETH'}
                </div>
              </div>

              {/* Network Status */}
              <div className="p-4 border-b border-blue-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-blue-300 text-sm">Network</div>
                    <div className={`text-sm font-medium ${networkInfo.isSupported ? 'text-green-400' : 'text-red-400'}`}>
                      {networkInfo.name}
                    </div>
                  </div>
                  {!networkInfo.isSupported && (
                    <button
                      onClick={handleNetworkSwitch}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Switch
                    </button>
                  )}
                </div>
              </div>

              {/* Network Selector */}
              {!networkInfo.isSupported && (
                <div className="p-4 border-b border-blue-700/30">
                  <div className="text-blue-300 text-sm mb-2">Quick Network Switch</div>
                  <div className="space-y-1">
                    <button
                      onClick={() => switchToNetwork('localhost')}
                      className="w-full px-3 py-2 bg-slate-700 text-white text-xs rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      🏠 Localhost
                    </button>
                    <button
                      onClick={() => switchToNetwork('sepolia')}
                      className="w-full px-3 py-2 bg-slate-700 text-white text-xs rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      🧪 Sepolia Testnet
                    </button>
                    <button
                      onClick={() => switchToNetwork('evmosTestnet')}
                      className="w-full px-3 py-2 bg-slate-700 text-white text-xs rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      ⚡ Evmos Testnet
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(account)
                    setShowDropdown(false)
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-blue-200 hover:text-white hover:bg-blue-700/30 rounded-lg transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Address</span>
                </button>
                
                <button
                  onClick={() => {
                    window.open(`${networkInfo.explorer}/address/${account}`, '_blank')
                    setShowDropdown(false)
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-blue-200 hover:text-white hover:bg-blue-700/30 rounded-lg transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>View on Explorer</span>
                </button>
                
                {/* <button
                  onClick={() => {
                    disconnectWallet()
                    setShowDropdown(false)
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Disconnect</span>
                </button> */}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Connect button for non-connected state
  return (
    <div className={className}>
      {/* Error Message */}
      {error && (
        <div className="absolute -top-12 right-0 bg-red-900/90 text-red-200 text-xs px-3 py-2 rounded-lg max-w-xs">
          {error}
        </div>
      )}

      {/* Connect Button */}
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`px-6 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isConnecting
            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500'
        }`}
      >
        {isConnecting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting...</span>
          </div>
        ) : !isMetaMaskInstalled ? (
          'Install MetaMask'
        ) : (
          'Connect Wallet'
        )}
      </button>
    </div>
  )
}

export default WalletButton
