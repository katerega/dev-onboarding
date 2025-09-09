import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { ROUTER_ABI, ERC20_ABI } from '../constants/abis';
import { TOKEN_LIST } from '../constants/tokens';

export const useSwap = (walletContext) => {
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState(null);
  const [lastQuoteTime, setLastQuoteTime] = useState(0);

  const { account, isConnected } = walletContext;

  // Get router address from environment
  const ROUTER_ADDRESS = import.meta.env.VITE_ROUTER_ADDRESS || '0x809d550fca64d94Bd9F66E60752A544199cfAC3D';

  // Calculate swap quote with 0.3% fee applied
  const getSwapQuote = useCallback(async (fromToken, toToken, amountIn, provider) => {
    if (!provider || !fromToken || !toToken || !amountIn || amountIn <= 0 || !ROUTER_ADDRESS) {
      return null;
    }

    try {
      const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, provider);
      
      const fromTokenInfo = TOKEN_LIST.find(t => t.symbol === fromToken);
      const toTokenInfo = TOKEN_LIST.find(t => t.symbol === toToken);
      
      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error('Token not found');
      }

      // Parse amount to wei
      const amountInWei = ethers.parseUnits(amountIn.toString(), fromTokenInfo.decimals);
      
      // Build swap path
      let path;
      if (fromTokenInfo.isNative) {
        // Native to token: use WETH address
        const WETH = await router.WETH();
        path = [WETH, toTokenInfo.address];
      } else if (toTokenInfo.isNative) {
        // Token to native: use WETH address  
        const WETH = await router.WETH();
        path = [fromTokenInfo.address, WETH];
      } else {
        // Token to token: direct path (or via WETH if no direct pair)
        path = [fromTokenInfo.address, toTokenInfo.address];
      }

      // Get amounts out (includes 0.3% fee calculation)
      const amounts = await router.getAmountsOut(amountInWei, path);
      const amountOutRaw = ethers.formatUnits(amounts[amounts.length - 1], toTokenInfo.decimals);
      
      // Format to reasonable precision to avoid decimal overflow
      const amountOut = parseFloat(amountOutRaw).toFixed(Math.min(toTokenInfo.decimals, 8));
      
      // Calculate exchange rate
      const exchangeRate = parseFloat(amountOut) / parseFloat(amountIn);
      
      // Calculate price impact (simplified - you'd need more complex logic for real price impact)
      const priceImpact = 0.1; // Placeholder 0.1%
      
      setLastQuoteTime(Date.now());
      
      return {
        amountOut: parseFloat(amountOut),
        exchangeRate,
        priceImpact,
        path,
        amounts
      };
    } catch (error) {
      console.error('Error getting swap quote:', error);
      throw error;
    }
  }, [ROUTER_ADDRESS]);

  // Check and approve token spending
  const approveTokenSpending = useCallback(async (tokenAddress, spenderAddress, amount, signer) => {
    if (!tokenAddress || !spenderAddress || !amount || !signer) {
      throw new Error('Missing parameters for token approval');
    }

    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      
      // Check current allowance
      const currentAllowance = await tokenContract.allowance(account, spenderAddress);
      const amountBN = ethers.getBigInt(amount);
      
      if (currentAllowance >= amountBN) {
        return true; // Already approved
      }

      // Approve spending
      const approveTx = await tokenContract.approve(spenderAddress, amountBN);
      await approveTx.wait();
      
      return true;
    } catch (error) {
      console.error('Error approving token spending:', error);
      throw error;
    }
  }, [account]);

  // Execute swap with slippage protection
  const executeSwap = useCallback(async (
    fromToken,
    toToken, 
    amountIn,
    amountOutMin,
    slippageTolerance,
    provider
  ) => {
    console.log('Executing swap:', { isConnected, provider, ROUTER_ADDRESS });
    if (!isConnected || !provider || !ROUTER_ADDRESS) {
      throw new Error('Wallet not connected or router address missing');
    }

    setIsSwapping(true);
    setSwapError(null);

    try {
      const signer = await provider.getSigner();
      const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
      
      const fromTokenInfo = TOKEN_LIST.find(t => t.symbol === fromToken);
      const toTokenInfo = TOKEN_LIST.find(t => t.symbol === toToken);
      
      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error('Token information not found');
      }

      // Get fresh quote
      const quote = await getSwapQuote(fromToken, toToken, amountIn, provider);
      if (!quote) {
        throw new Error('Unable to get swap quote');
      }

      // Calculate minimum amount out with slippage
      const slippageMultiplier = (100 - parseFloat(slippageTolerance)) / 100;
      const calculatedAmountOutMin = quote.amountOut * slippageMultiplier;
      
      // Format to avoid decimal overflow
      const amountOutMinFormatted = calculatedAmountOutMin.toFixed(toTokenInfo.decimals);
      const amountOutMinWei = ethers.parseUnits(amountOutMinFormatted, toTokenInfo.decimals);

      // Use provided amountOutMin if it's more restrictive
      const finalAmountOutMin = amountOutMin ? 
        ethers.getBigInt(amountOutMin) > amountOutMinWei ? amountOutMin : amountOutMinWei :
        amountOutMinWei;

      const amountInWei = ethers.parseUnits(amountIn.toString(), fromTokenInfo.decimals);
      const deadline = Math.floor(Date.now() / 1000) + (20 * 60); // 20 minutes from now

      let swapTx;

      // Handle different swap types
      if (fromTokenInfo.isNative && !toTokenInfo.isNative) {
        // ETH/EVMOS to Token
        swapTx = await router.swapExactETHForTokens(
          finalAmountOutMin,
          quote.path,
          account,
          deadline,
          { value: amountInWei }
        );
      } else if (!fromTokenInfo.isNative && toTokenInfo.isNative) {
        // Token to ETH/EVMOS
        // First approve token spending
        await approveTokenSpending(fromTokenInfo.address, ROUTER_ADDRESS, amountInWei, signer);
        
        swapTx = await router.swapExactTokensForETH(
          amountInWei,
          finalAmountOutMin,
          quote.path,
          account,
          deadline
        );
      } else if (!fromTokenInfo.isNative && !toTokenInfo.isNative) {
        // Token to Token
        // First approve token spending
        await approveTokenSpending(fromTokenInfo.address, ROUTER_ADDRESS, amountInWei, signer);
        
        swapTx = await router.swapExactTokensForTokens(
          amountInWei,
          finalAmountOutMin,
          quote.path,
          account,
          deadline
        );
      } else {
        throw new Error('Invalid swap configuration');
      }

      // Wait for transaction confirmation
      const receipt = await swapTx.wait();
      
      console.log('Swap completed successfully:', receipt.transactionHash);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        receipt
      };

    } catch (error) {
      console.error('Swap execution failed:', error);
      setSwapError(error.message || 'Swap failed');
      throw error;
    } finally {
      setIsSwapping(false);
    }
  }, [isConnected, ROUTER_ADDRESS, account, getSwapQuote, approveTokenSpending]);

  // Estimate gas cost for swap
  const estimateSwapGas = useCallback(async (
    fromToken,
    toToken,
    amountIn,
    provider
  ) => {
    if (!provider || !ROUTER_ADDRESS) {
      return null;
    }

    try {
      const signer = await provider.getSigner();
      const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
      
      const fromTokenInfo = TOKEN_LIST.find(t => t.symbol === fromToken);
      const toTokenInfo = TOKEN_LIST.find(t => t.symbol === toToken);
      
      if (!fromTokenInfo || !toTokenInfo) {
        return null;
      }

      const quote = await getSwapQuote(fromToken, toToken, amountIn, provider);
      if (!quote) {
        return null;
      }

      const amountInWei = ethers.parseUnits(amountIn.toString(), fromTokenInfo.decimals);
      
      // Calculate min output with proper decimal handling
      const minOutputAmount = quote.amountOut * 0.995; // 0.5% slippage for estimation
      const minOutputFormatted = minOutputAmount.toFixed(toTokenInfo.decimals);
      const amountOutMinWei = ethers.parseUnits(minOutputFormatted, toTokenInfo.decimals);
      const deadline = Math.floor(Date.now() / 1000) + (20 * 60);

      let gasEstimate;

      if (fromTokenInfo.isNative && !toTokenInfo.isNative) {
        // Check if router has the function
        if (!router.swapExactETHForTokens) {
          throw new Error('Router contract missing swapExactETHForTokens function');
        }
        
        gasEstimate = await router.estimateGas.swapExactETHForTokens(
          amountOutMinWei,
          quote.path,
          account,
          deadline,
          { value: amountInWei }
        );
      } else if (!fromTokenInfo.isNative && toTokenInfo.isNative) {
        if (!router.swapExactTokensForETH) {
          throw new Error('Router contract missing swapExactTokensForETH function');
        }
        
        gasEstimate = await router.estimateGas.swapExactTokensForETH(
          amountInWei,
          amountOutMinWei,
          quote.path,
          account,
          deadline
        );
      } else {
        gasEstimate = await router.estimateGas.swapExactTokensForTokens(
          amountInWei,
          amountOutMinWei,
          quote.path,
          account,
          deadline
        );
      }

      // Get gas price
      const gasPrice = await provider.getGasPrice();
      const gasCost = gasEstimate * gasPrice;
      const gasCostInEth = ethers.formatEther(gasCost);
      
      // Convert to USD (placeholder rate - you'd want to fetch real rates)
      const ethPriceUSD = 2000; // Placeholder
      const gasCostUSD = parseFloat(gasCostInEth) * ethPriceUSD;

      return {
        gasEstimate: gasEstimate.toString(),
        gasPrice: gasPrice.toString(),
        gasCostInEth: parseFloat(gasCostInEth),
        gasCostUSD: gasCostUSD.toFixed(2)
      };

    } catch (error) {
      console.error('Error estimating gas:', error);
      return null;
    }
  }, [ROUTER_ADDRESS, account, getSwapQuote]);

  return {
    // State
    isSwapping,
    swapError,
    lastQuoteTime,
    
    // Functions
    getSwapQuote,
    executeSwap,
    estimateSwapGas,
    approveTokenSpending
  };
};
