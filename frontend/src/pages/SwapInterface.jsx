import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { ROUTER_ABI, ERC20_ABI } from '../constants/abis';
import { TOKEN_LIST } from '../constants/tokens';

const SwapInterface = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState('EVMOS');
  const [toToken, setToToken] = useState('USDC');
  const [slippage, setSlippage] = useState('0.5');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [balances, setBalances] = useState({});
  const [exchangeRate, setExchangeRate] = useState(null);
  const [gasEstimate, setGasEstimate] = useState(null);

  // Get environment variables safely
//   const ROUTER_ADDRESS = import.meta.env.VITE_ROUTER_ADDRESS || '';

  const ROUTER_ADDRESS = import.meta.env.VITE_ROUTER_ADDRESS || '';

  // Connect wallet function
  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsWalletConnected(true);
        
        // Check if connected to Evmos
        const network = await web3Provider.getNetwork();
        if (network.chainId !== 9001 && network.chainId !== 9000) {
          alert('Please switch to Evmos network');
          await switchToEvmosNetwork();
        }
        
        // Fetch balances after connecting
        fetchBalances();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet');
    }
  };

  // Switch to Evmos network
  const switchToEvmosNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x2329', // 9001 in hex for mainnet
          chainName: 'Evmos',
          nativeCurrency: {
            name: 'Evmos',
            symbol: 'EVMOS',
            decimals: 18
          },
          rpcUrls: ['https://eth.bd.evmos.org:8545'],
          blockExplorerUrls: ['https://evm.evmos.org/']
        }]
      });
    } catch (error) {
      console.error('Error switching to Evmos:', error);
    }
  };

  // Fetch token balances
  const fetchBalances = useCallback(async () => {
    if (!provider || !account) return;
    
    console.log("Fetching balances for:", account);
    
    const newBalances = {};
    
    for (const token of TOKEN_LIST) {
      try {
        // Skip tokens with invalid addresses
        if (!token.address || token.address.includes('...')) {
          console.warn(`Skipping ${token.symbol} - invalid address`);
          newBalances[token.symbol] = '0.0';
          continue;
        }
        
        if (token.isNative) {
          // Get native balance
          const balance = await provider.getBalance(account);
          newBalances[token.symbol] = ethers.utils.formatUnits(balance, token.decimals);
          console.log(`${token.symbol} balance:`, newBalances[token.symbol]);
        } else {
          // Get ERC20 balance
          const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const balance = await tokenContract.balanceOf(account);
          newBalances[token.symbol] = ethers.utils.formatUnits(balance, token.decimals);
          console.log(`${token.symbol} balance:`, newBalances[token.symbol]);
        }
      } catch (error) {
        console.error(`Error fetching balance for ${token.symbol}:`, error);
        newBalances[token.symbol] = '0.0';
      }
    }
    
    setBalances(newBalances);
  }, [provider, account]);

  // Get swap quote - wrapped in useCallback to fix dependency warning
  const getSwapQuote = useCallback(async () => {
    if (!provider || !fromAmount || fromAmount <= 0 || !ROUTER_ADDRESS) {
      setToAmount('');
      setExchangeRate(null);
      return;
    }
    
    try {
      const router = new ethers.Contract(
        ROUTER_ADDRESS,
        ROUTER_ABI,
        provider
      );
      
      const fromTokenInfo = TOKEN_LIST.find(t => t.symbol === fromToken);
      const toTokenInfo = TOKEN_LIST.find(t => t.symbol === toToken);
      
      if (!fromTokenInfo || !toTokenInfo) return;
      
      const amountIn = ethers.utils.parseUnits(fromAmount, fromTokenInfo.decimals);
      const path = [fromTokenInfo.address, toTokenInfo.address];
      
      // Get amounts out
      const amounts = await router.getAmountsOut(amountIn, path);
      const amountOut = ethers.utils.formatUnits(amounts[1], toTokenInfo.decimals);
      
      setToAmount(amountOut);
      
      // Calculate exchange rate
      const rate = amountOut / fromAmount;
      setExchangeRate(rate);
      
      // Estimate gas (simplified)
      estimateGas();
    } catch (error) {
      console.error('Error getting quote:', error);
      setToAmount('');
      setExchangeRate(null);
    }
  }, [provider, fromAmount, fromToken, toToken, ROUTER_ADDRESS]);

  // Estimate gas cost
  const estimateGas = async () => {
    // Simplified gas estimation
    // In a real implementation, you would use provider.estimateGas()
    setGasEstimate('2.50'); // Placeholder value
  };

  // Execute swap
  const handleSwap = async () => {
    if (!isWalletConnected) {
      handleConnectWallet();
      return;
    }
    
    if (!provider || !fromAmount || fromAmount <= 0 || !ROUTER_ADDRESS) return;
    
    try {
      const signer = provider.getSigner();
      const router = new ethers.Contract(
        ROUTER_ADDRESS,
        ROUTER_ABI,
        signer
      );
      
      const fromTokenInfo = TOKEN_LIST.find(t => t.symbol === fromToken);
      const toTokenInfo = TOKEN_LIST.find(t => t.symbol === toToken);
      
      if (!fromTokenInfo || !toTokenInfo) return;
      
      const amountIn = ethers.utils.parseUnits(fromAmount, fromTokenInfo.decimals);
      const amountOutMin = ethers.utils.parseUnits(
        (toAmount * (100 - parseFloat(slippage)) / 100).toString(),
        toTokenInfo.decimals
      );
      
      const path = [fromTokenInfo.address, toTokenInfo.address];
      const to = account;
      const deadline = Math.floor(Date.now() / 1000) + (20 * 60); // 20 minutes
      
      let tx;
      
      // If swapping from native token
      if (fromTokenInfo.isNative) {
        tx = await router.swapExactETHForTokens(
          amountOutMin,
          path,
          to,
          deadline,
          { value: amountIn }
        );
      } 
      // If swapping to native token
      else if (toTokenInfo.isNative) {
        // First approve token spending if needed
        const tokenContract = new ethers.Contract(
          fromTokenInfo.address,
          ERC20_ABI,
          signer
        );
        
        const allowance = await tokenContract.allowance(account, router.address);
        if (allowance.lt(amountIn)) {
          const approveTx = await tokenContract.approve(router.address, amountIn);
          await approveTx.wait();
        }
        
        tx = await router.swapExactTokensForETH(
          amountIn,
          amountOutMin,
          path,
          to,
          deadline
        );
      } 
      // Token to token swap
      else {
        // First approve token spending if needed
        const tokenContract = new ethers.Contract(
          fromTokenInfo.address,
          ERC20_ABI,
          signer
        );
        
        const allowance = await tokenContract.allowance(account, router.address);
        if (allowance.lt(amountIn)) {
          const approveTx = await tokenContract.approve(router.address, amountIn);
          await approveTx.wait();
        }
        
        tx = await router.swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          path,
          to,
          deadline
        );
      }
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Swap completed:', receipt.transactionHash);
      
      // Refresh balances
      fetchBalances();
      
      // Show success message
      alert('Swap completed successfully!');
      
    } catch (error) {
      console.error('Error executing swap:', error);
      alert('Swap failed: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  // Update quote when inputs change
  useEffect(() => {
    getSwapQuote();
  }, [getSwapQuote]);

  // Fetch balances when account changes
  useEffect(() => {
    if (account) {
      fetchBalances();
    }
  }, [account, fetchBalances]);

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
                Balance: {balances[fromToken] || '0.0'}
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
                  {TOKEN_LIST.map((token) => (
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
                Balance: {balances[toToken] || '0.0'}
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
                  {TOKEN_LIST.map((token) => (
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
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Trade Details */}
          {fromAmount && toAmount && (
            <div className="bg-slate-700/50 border border-blue-400/20 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Exchange Rate</span>
                <span className="text-white">
                  {exchangeRate ? `1 ${fromToken} = ${exchangeRate.toFixed(6)} ${toToken}` : 'Calculating...'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Network Fee</span>
                <span className="text-white">{gasEstimate ? `~$${gasEstimate}` : 'Estimating...'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Minimum Received</span>
                <span className="text-white">
                  {toAmount ? `${(toAmount * (100 - parseFloat(slippage)) / 100).toFixed(6)} ${toToken}` : '0.0'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Slippage</span>
                <span className="text-white">{slippage}%</span>
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
                <span className="text-green-300 text-sm font-medium">
                  Wallet Connected: {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}
                </span>
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
                Always verify token addresses and transaction details before confirming. 
                This interface interacts directly with your wallet. Double-check all transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwapInterface;