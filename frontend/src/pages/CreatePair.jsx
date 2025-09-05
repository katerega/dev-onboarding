import React, { useState, useMemo } from 'react'

const CreatePair = () => {
  const [tokenA, setTokenA] = useState({
    address: '',
    symbol: '',
    decimals: 18,
    balance: '0'
  })
  
  const [tokenB, setTokenB] = useState({
    address: '',
    symbol: '',
    decimals: 18,
    balance: '0'
  })

  const [initialLiquidity, setInitialLiquidity] = useState({
    tokenA: '',
    tokenB: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [pairExists] = useState(false)
  const [settings, setSettings] = useState({
    deadline: 20,
    showAdvanced: false
  })

  // Mock token validation function
  const validateTokenAddress = async (address) => {
    if (!address || address.length !== 42 || !address.startsWith('0x')) {
      return null
    }
    
    // Mock token data - in real app, this would fetch from blockchain
    const mockTokens = {
      '0xa0b86a33e6ba53e2f8c64f15f2e50e0b8c3e5d9c': { symbol: 'USDC', decimals: 6 },
      '0xb1c47a34f6ba53e2f8c64f15f2e50e0b8c3e5d9d': { symbol: 'WETH', decimals: 18 },
      '0xc2d58b45g7ca63f3g9d75g26g3f61f1c9d4f6e0e': { symbol: 'DAI', decimals: 18 }
    }
    
    return mockTokens[address] || { symbol: 'TOKEN', decimals: 18 }
  }

  const handleTokenAChange = async (address) => {
    setTokenA(prev => ({ ...prev, address }))
    
    if (address) {
      const tokenInfo = await validateTokenAddress(address)
      if (tokenInfo) {
        setTokenA(prev => ({
          ...prev,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals,
          balance: '1000.0' // Mock balance
        }))
      }
    }
  }

  const handleTokenBChange = async (address) => {
    setTokenB(prev => ({ ...prev, address }))
    
    if (address) {
      const tokenInfo = await validateTokenAddress(address)
      if (tokenInfo) {
        setTokenB(prev => ({
          ...prev,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals,
          balance: '1000.0' // Mock balance
        }))
      }
    }
  }

  // Calculate initial exchange rate
  const exchangeRate = useMemo(() => {
    if (!initialLiquidity.tokenA || !initialLiquidity.tokenB) return null
    
    const rateAtoB = parseFloat(initialLiquidity.tokenB) / parseFloat(initialLiquidity.tokenA)
    const rateBtoA = parseFloat(initialLiquidity.tokenA) / parseFloat(initialLiquidity.tokenB)
    
    return {
      aToB: rateAtoB.toFixed(6),
      bToA: rateBtoA.toFixed(6)
    }
  }, [initialLiquidity.tokenA, initialLiquidity.tokenB])

  // Validate pair creation
  const canCreatePair = useMemo(() => {
    return (
      tokenA.address && 
      tokenB.address && 
      tokenA.address !== tokenB.address &&
      initialLiquidity.tokenA &&
      initialLiquidity.tokenB &&
      parseFloat(initialLiquidity.tokenA) > 0 &&
      parseFloat(initialLiquidity.tokenB) > 0 &&
      !pairExists
    )
  }, [tokenA.address, tokenB.address, initialLiquidity, pairExists])

  const handleCreatePair = async () => {
    if (!canCreatePair) return
    
    setIsLoading(true)
    try {
      // Mock pair creation process
      console.log('Creating pair:', {
        tokenA: tokenA.address,
        tokenB: tokenB.address,
        initialLiquidityA: initialLiquidity.tokenA,
        initialLiquidityB: initialLiquidity.tokenB,
        deadline: settings.deadline
      })
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Pair created successfully! Transaction hash: 0x123...abc')
    } catch (error) {
      console.error('Error creating pair:', error)
      alert('Error creating pair: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-md sm:max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Create New Token Pair</h1>
          <p className="text-sm sm:text-base text-blue-200">
            Create a new trading pair by adding initial liquidity to the pool
          </p>
        </div>

        {/* Main Interface */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-800/30 shadow-2xl">
            {/* Token A Input */}
            <div className="mb-6">
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Token A Address
              </label>
              <input
                type="text"
                value={tokenA.address}
                onChange={(e) => handleTokenAChange(e.target.value)}
                placeholder="0x..."
                className="w-full p-4 bg-slate-700/50 border border-blue-700/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {tokenA.symbol && (
                <div className="mt-2 p-3 bg-blue-900/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Symbol: {tokenA.symbol}</span>
                    <span className="text-blue-200">Decimals: {tokenA.decimals}</span>
                  </div>
                  <div className="text-sm text-blue-300 mt-1">
                    Balance: {tokenA.balance} {tokenA.symbol}
                  </div>
                </div>
              )}
            </div>

            {/* Token B Input */}
            <div className="mb-6">
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Token B Address
              </label>
              <input
                type="text"
                value={tokenB.address}
                onChange={(e) => handleTokenBChange(e.target.value)}
                placeholder="0x..."
                className="w-full p-4 bg-slate-700/50 border border-blue-700/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {tokenB.symbol && (
                <div className="mt-2 p-3 bg-blue-900/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Symbol: {tokenB.symbol}</span>
                    <span className="text-blue-200">Decimals: {tokenB.decimals}</span>
                  </div>
                  <div className="text-sm text-blue-300 mt-1">
                    Balance: {tokenB.balance} {tokenB.symbol}
                  </div>
                </div>
              )}
            </div>

            {/* Initial Liquidity Section */}
            {tokenA.address && tokenB.address && tokenA.address !== tokenB.address && (
              <div className="mb-6 p-4 bg-slate-700/30 rounded-xl border border-blue-700/20">
                <h3 className="text-white font-semibold mb-4">Initial Liquidity</h3>
                
                {/* Token A Amount */}
                <div className="mb-4">
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    {tokenA.symbol || 'Token A'} Amount
                  </label>
                  <input
                    type="number"
                    value={initialLiquidity.tokenA}
                    onChange={(e) => setInitialLiquidity(prev => ({ ...prev, tokenA: e.target.value }))}
                    placeholder="0.0"
                    className="w-full p-3 bg-slate-700/50 border border-blue-700/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Token B Amount */}
                <div className="mb-4">
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    {tokenB.symbol || 'Token B'} Amount
                  </label>
                  <input
                    type="number"
                    value={initialLiquidity.tokenB}
                    onChange={(e) => setInitialLiquidity(prev => ({ ...prev, tokenB: e.target.value }))}
                    placeholder="0.0"
                    className="w-full p-3 bg-slate-700/50 border border-blue-700/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Exchange Rate Display */}
                {exchangeRate && (
                  <div className="p-3 bg-blue-900/20 rounded-lg">
                    <div className="text-sm text-blue-200 mb-1">Initial Exchange Rate:</div>
                    <div className="text-white">
                      1 {tokenA.symbol} = {exchangeRate.aToB} {tokenB.symbol}
                    </div>
                    <div className="text-white">
                      1 {tokenB.symbol} = {exchangeRate.bToA} {tokenA.symbol}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Advanced Settings */}
            <div className="mb-6">
              <button
                onClick={() => setSettings(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
                className="flex items-center justify-between w-full p-3 text-blue-200 hover:text-white transition-colors"
              >
                <span>Advanced Settings</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${settings.showAdvanced ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {settings.showAdvanced && (
                <div className="mt-3 p-4 bg-slate-700/30 rounded-lg border border-blue-700/20">
                  <div className="mb-4">
                    <label className="block text-blue-200 text-sm font-medium mb-2">
                      Transaction Deadline
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={settings.deadline}
                        onChange={(e) => setSettings(prev => ({ ...prev, deadline: parseInt(e.target.value) }))}
                        min="1"
                        max="180"
                        className="w-20 p-2 bg-slate-700/50 border border-blue-700/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-blue-200">minutes</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Warnings */}
            {tokenA.address && tokenB.address && tokenA.address === tokenB.address && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700/30 rounded-lg">
                <div className="text-red-400 text-sm font-medium">
                  ⚠️ Token addresses must be different
                </div>
              </div>
            )}

            {pairExists && (
              <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700/30 rounded-lg">
                <div className="text-yellow-400 text-sm font-medium">
                  ⚠️ This token pair already exists
                </div>
              </div>
            )}

            {/* Create Pair Button */}
            <button
              onClick={handleCreatePair}
              disabled={!canCreatePair || isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                canCreatePair && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400'
                  : 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Pair...</span>
                </div>
              ) : (
                'Create Pair & Add Initial Liquidity'
              )}
            </button>

            {/* Info Section */}
            <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700/20">
              <h4 className="text-white font-medium mb-2">Important Notes:</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• You'll be the first liquidity provider for this pair</li>
                <li>• Initial exchange rate will be set by your deposit ratio</li>
                <li>• You'll receive LP tokens representing your pool share</li>
                <li>• Make sure both tokens are legitimate and audited</li>
                <li>• Transaction cannot be reversed once confirmed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default CreatePair
