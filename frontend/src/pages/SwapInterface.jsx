import React, { useState } from 'react'

const SwapInterface = () => {
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('USDC')
  const [slippage, setSlippage] = useState('0.5')
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: '0.0' },
    { symbol: 'USDC', name: 'USD Coin', balance: '0.0' },
    { symbol: 'USDT', name: 'Tether USD', balance: '0.0' },
    { symbol: 'DAI', name: 'Dai Stablecoin', balance: '0.0' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.0' }
  ]

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleConnectWallet = () => {
    setIsWalletConnected(true)
  }

  const handleSwap = () => {
    if (!isWalletConnected) {
      handleConnectWallet()
      return
    }
    // Handle swap logic here
    console.log('Swapping', fromAmount, fromToken, 'for', toAmount, toToken)
  }

  return (
    <section className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-md sm:max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Swap Tokens</h1>
          <p className="text-sm sm:text-base text-blue-200">Trade tokens instantly with the best rates</p>
        </div>

        {/* Swap Interface */}
        <div className="bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
          {/* Settings */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Swap</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-blue-300 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* From Token */}
          <div className="bg-slate-700/50 border border-blue-400/20 rounded-xl p-4 mb-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-300 text-sm">From</span>
              <span className="text-blue-300 text-sm">
                Balance: {tokens.find(t => t.symbol === fromToken)?.balance || '0.0'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="bg-transparent text-white text-xl sm:text-2xl font-semibold outline-none flex-1 sm:mr-4"
              />
              <div className="flex items-center justify-end sm:justify-start">
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="bg-slate-600/50 text-white border border-blue-400/30 rounded-lg px-3 py-2 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full sm:w-auto"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwapTokens}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 border-2 border-blue-400/50 rounded-full p-2 hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg"
              aria-label="Swap tokens"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Token */}
          <div className="bg-slate-700/50 border border-blue-400/20 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-300 text-sm">To</span>
              <span className="text-blue-300 text-sm">
                Balance: {tokens.find(t => t.symbol === toToken)?.balance || '0.0'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <input
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="0.0"
                className="bg-transparent text-white text-xl sm:text-2xl font-semibold outline-none flex-1 sm:mr-4"
                readOnly
              />
              <div className="flex items-center justify-end sm:justify-start">
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="bg-slate-600/50 text-white border border-blue-400/30 rounded-lg px-3 py-2 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full sm:w-auto"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Slippage Settings */}
          <div className="bg-slate-700/50 border border-blue-400/20 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-medium">Slippage Tolerance</span>
              <span className="text-blue-300 text-sm">{slippage}%</span>
            </div>
            <div className="flex space-x-2">
              {['0.1', '0.5', '1.0'].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    slippage === value
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                      : 'bg-slate-600/50 text-blue-200 hover:bg-slate-500/50 border border-blue-400/20'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="bg-slate-600/50 text-white border border-blue-400/30 rounded-lg px-2 py-1 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Custom"
              />
            </div>
          </div>

          {/* Trade Details */}
          {fromAmount && toAmount && (
            <div className="bg-slate-700/50 border border-blue-400/20 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Exchange Rate</span>
                <span className="text-white">1 {fromToken} = 1,850.45 {toToken}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Network Fee</span>
                <span className="text-white">~$2.50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Route</span>
                <span className="text-white">{fromToken} → {toToken}</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!fromAmount || fromAmount === '0'}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              !fromAmount || fromAmount === '0'
                ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                : isWalletConnected
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400'
                : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400'
            }`}
          >
            {!isWalletConnected
              ? 'Connect Wallet'
              : !fromAmount || fromAmount === '0'
              ? 'Enter Amount'
              : 'Swap Tokens'
            }
          </button>

          {/* Wallet Status */}
          {isWalletConnected && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-300 text-sm font-medium">Wallet Connected</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-xl">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Security Notice</h3>
              <p className="text-blue-200 text-xs leading-relaxed">
                Always verify token addresses and transaction details before confirming. TradeSphere does not store your private keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SwapInterface
