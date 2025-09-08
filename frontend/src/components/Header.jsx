import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import WalletButton from './WalletButton'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="border-b border-blue-800/30 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-white">TradeSphere</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-white bg-blue-600/50'
                  : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
              }`}
            >
              Home
            </Link>
            <Link
              to="/create-pair"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/create-pair')
                  ? 'text-white bg-blue-600/50'
                  : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
              }`}
            >
              Create Pair
            </Link>
             <Link
              to="/liquidity"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/liquidity')
                  ? 'text-white bg-blue-600/50'
                  : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
              }`}
            >
              Liquidity
            </Link>
            <Link
              to="/swap"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/swap')
                  ? 'text-white bg-blue-600/50'
                  : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
              }`}
            >
              Swap
            </Link>
           
          
            <a
              href="#docs"
              className="text-blue-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Docs
            </a>
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            <WalletButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-200 hover:text-white p-2"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-800/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/')
                    ? 'text-white bg-blue-600/50'
                    : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
                }`}
              >
                Home
              </Link>
              <Link
                to="/create-pair"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/create-pair')
                    ? 'text-white bg-blue-600/50'
                    : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
                }`}
              >
                Create Pair
              </Link>
              <Link
                to="/liquidity"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/liquidity')
                    ? 'text-white bg-blue-600/50'
                    : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
                }`}
              >
                Liquidity
              </Link>
              <Link
                to="/swap"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/swap')
                    ? 'text-white bg-blue-600/50'
                    : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
                }`}
              >
                Swap
              </Link>
              <a
                href="#docs"
                className="block text-blue-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </a>
              <div className="mt-4">
                <WalletButton className="w-full" />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
