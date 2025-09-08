import React, { createContext } from 'react'
import { useWallet } from '../hooks/useWallet'

const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const wallet = useWallet()
  
  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  )
}

// Export context for custom hook
export { WalletContext }
