import React, { useState, useEffect, useMemo } from 'react'

const AddLiquidity = () => {
  const [tokenA, setTokenA] = useState('ETH')
  const [tokenB, setTokenB] = useState('USDC')
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [priceImpact, setPriceImpact] = useState('0.01')
  const [liquidityShare, setLiquidityShare] = useState('0.01')
  const [deadline, setDeadline] = useState('20')

  const tokens = useMemo(() => [
    { symbol: 'ETH', name: 'Ethereum', balance: '2.5', price: '1850.45' },
    { symbol: 'USDC', name: 'USD Coin', balance: '5000.0', price: '1.00' },
    { symbol: 'USDT', name: 'Tether USD', balance: '3000.0', price: '1.00' },
    { symbol: 'DAI', name: 'Dai Stablecoin', balance: '2500.0', price: '1.00' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.15', price: '43250.0' },
    { symbol: 'EVMOS', name: 'Evmos', balance: '1000.0', price: '0.85' }
  ], [])

  const poolStats = {
    totalLiquidity: '$2,450,000',
    volume24h: '$125,000',
    fees24h: '$375',
    apy: '24.5%'
  }

  // Calculate token B amount based on token A amount and price ratio
  useEffect(() => {
    if (amountA && tokenA && tokenB) {
      const tokenAPrice = parseFloat(tokens.find(t => t.symbol === tokenA)?.price || 0)
      const tokenBPrice = parseFloat(tokens.find(t => t.symbol === tokenB)?.price || 0)
      
      if (tokenAPrice && tokenBPrice) {
        const calculatedAmountB = (parseFloat(amountA) * tokenAPrice / tokenBPrice).toFixed(6)
        setAmountB(calculatedAmountB)
        
        // Calculate price impact (simplified)
        const impact = Math.min(parseFloat(amountA) / 1000 * 0.1, 5).toFixed(2)
        setPriceImpact(impact)
        
        // Calculate liquidity share (simplified)
        const share = Math.min(parseFloat(amountA) / 10000 * 100, 10).toFixed(3)
        setLiquidityShare(share)
      }
    }
  }, [amountA, tokenA, tokenB, tokens])

  const handleConnectWallet = () => {
    setIsWalletConnected(true)
  }

  const handleAddLiquidity = () => {
    if (!isWalletConnected) {
      handleConnectWallet()
      return
    }
    // Handle add liquidity logic here
    console.log('Adding liquidity:', {
      tokenA,
      tokenB,
      amountA,
      amountB,
      slippage,
      deadline
    })
  }

  const handleMaxAmount = (token) => {
    const tokenData = tokens.find(t => t.symbol === token)
    if (tokenData) {
      if (token === tokenA) {
        setAmountA(tokenData.balance)
      } else {
        setAmountB(tokenData.balance)
      }
    }
  }

  const getPriceImpactColor = () => {
    const impact = parseFloat(priceImpact)
    if (impact < 1) return 'text-green-400'
    if (impact < 3) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <section className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Add Liquidity</h1>
          <p className="text-sm sm:text-base text-blue-200">Provide liquidity to earn trading fees and liquidity rewards</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Liquidity Interface */}
          <div className="xl:col-span-2">
            <div className="bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
              {/* Pool Selection */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">Select Pair</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Token A Input */}
              <div className="bg-slate-700/50 border border-blue-400/20 rounded-xl p-4 mb-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-300 text-sm">Token A</span>
                  <span className="text-blue-300 text-sm">
                    Balance: {tokens.find(t => t.symbol === tokenA)?.balance || '0.0'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <input
                    type="number"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                    placeholder="0.0"
                    className="bg-transparent text-white text-xl sm:text-2xl font-semibold outline-none flex-1 sm:mr-4"
                  />
                  <div className="flex items-center justify-between sm:justify-end space-x-2">
                    <button
                      onClick={() => handleMaxAmount(tokenA)}
                      className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors"
                    >
                      MAX
                    </button>
                    <select
                      value={tokenA}
                      onChange={(e) => setTokenA(e.target.value)}
                      className="bg-slate-600/50 text-white border border-blue-400/30 rounded-lg px-3 py-2 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      {tokens.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-sm text-blue-300 mt-1">
                  ~${((parseFloat(amountA) || 0) * parseFloat(tokens.find(t => t.symbol === tokenA)?.price || 0)).toFixed(2)}
                </div>
              </div>

              {/* Plus Icon */}
              <div className="flex justify-center -my-2 relative z-10">
                <div className="bg-slate-700 border-2 border-blue-400/50 rounded-full p-2">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>

              {/* Token B Input */}
              <div className="bg-slate-700/50 border border-blue-400/20 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-300 text-sm">Token B</span>
                  <span className="text-blue-300 text-sm">
                    Balance: {tokens.find(t => t.symbol === tokenB)?.balance || '0.0'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <input
                    type="number"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                    placeholder="0.0"
                    className="bg-transparent text-white text-xl sm:text-2xl font-semibold outline-none flex-1 sm:mr-4"
                  />
                  <div className="flex items-center justify-between sm:justify-end space-x-2">
                    <button
                      onClick={() => handleMaxAmount(tokenB)}
                      className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors"
                    >
                      MAX
                    </button>
                    <select
                      value={tokenB}
                      onChange={(e) => setTokenB(e.target.value)}
                      className="bg-slate-600/50 text-white border border-blue-400/30 rounded-lg px-3 py-2 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      {tokens.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-sm text-blue-300 mt-1">
                  ~${((parseFloat(amountB) || 0) * parseFloat(tokens.find(t => t.symbol === tokenB)?.price || 0)).toFixed(2)}
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
                          : 'bg-slate-600/50 text-blue-200 hover:bg-slate-600 border border-blue-400/30'
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

              {/* Deadline Setting */}
              <div className="bg-slate-700/50 border border-blue-400/20 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-medium">Transaction Deadline</span>
                  <span className="text-blue-300 text-sm">{deadline} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="bg-slate-600/50 text-white border border-blue-400/30 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    min="1"
                    max="60"
                  />
                  <span className="text-blue-300 text-sm">minutes</span>
                </div>
              </div>

              {/* Transaction Details */}
              {amountA && amountB && (
                <div className="bg-slate-700/50 border border-blue-400/20 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Price Impact</span>
                    <span className={getPriceImpactColor()}>{priceImpact}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Liquidity Share</span>
                    <span className="text-white">{liquidityShare}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Minimum {tokenA} Received</span>
                    <span className="text-white">{(parseFloat(amountA) * (1 - parseFloat(slippage) / 100)).toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Minimum {tokenB} Received</span>
                    <span className="text-white">{(parseFloat(amountB) * (1 - parseFloat(slippage) / 100)).toFixed(6)}</span>
                  </div>
                </div>
              )}

              {/* Add Liquidity Button */}
              <button
                onClick={handleAddLiquidity}
                disabled={!amountA || !amountB || amountA === '0' || amountB === '0'}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  !amountA || !amountB || amountA === '0' || amountB === '0'
                    ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                    : isWalletConnected
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400'
                }`}
              >
                {!isWalletConnected
                  ? 'Connect Wallet'
                  : !amountA || !amountB || amountA === '0' || amountB === '0'
                  ? 'Enter Amounts'
                  : 'Add Liquidity'
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
          </div>

          {/* Pool Information Sidebar */}
          <div className="space-y-6">
            {/* Pool Stats */}
            <div className="bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Pool Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-blue-300">Total Liquidity</span>
                  <span className="text-white font-medium">{poolStats.totalLiquidity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Volume (24h)</span>
                  <span className="text-white font-medium">{poolStats.volume24h}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Fees (24h)</span>
                  <span className="text-white font-medium">{poolStats.fees24h}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">APY</span>
                  <span className="text-green-400 font-medium">{poolStats.apy}</span>
                </div>
              </div>
            </div>

            {/* Current Pool Ratio */}
            <div className="bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Pool Ratio</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {tokenA.charAt(0)}
                    </div>
                    <span className="text-white">{tokenA}</span>
                  </div>
                  <span className="text-blue-300">50%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {tokenB.charAt(0)}
                    </div>
                    <span className="text-white">{tokenB}</span>
                  </div>
                  <span className="text-blue-300">50%</span>
                </div>
              </div>
            </div>

            {/* Liquidity Provider Rewards */}
            <div className="bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4">LP Rewards</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-200 text-sm">Trading fees (0.3%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-200 text-sm">EVMOS rewards</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-200 text-sm">Compounding yields</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-white font-medium text-sm mb-1">Important Information</h3>
                <p className="text-blue-200 text-xs leading-relaxed">
                  By adding liquidity you'll earn 0.3% of all trades on this pair proportional to your share of the pool. 
                  Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. 
                  Please be aware of impermanent loss risks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AddLiquidity
