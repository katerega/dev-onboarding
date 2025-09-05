import React, { useState } from 'react'

const Header = ({ currentView, setCurrentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-blue-800/30 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-white">TradeSphere</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'landing'
                  ? 'text-white bg-blue-600/50'
                  : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('swap')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'swap'
                  ? 'text-white bg-blue-600/50'
                  : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
              }`}
            >
              Swap
            </button>
            <a
              href="#features"
              className="text-blue-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#docs"
              className="text-blue-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Docs
            </a>
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-500 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900">
              Connect Wallet
            </button>
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
              <button
                onClick={() => {
                  setCurrentView('landing')
                  setIsMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentView === 'landing'
                    ? 'text-white bg-blue-600/50'
                    : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setCurrentView('swap')
                  setIsMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentView === 'swap'
                    ? 'text-white bg-blue-600/50'
                    : 'text-blue-200 hover:text-white hover:bg-blue-600/30'
                }`}
              >
                Swap
              </button>
              <a
                href="#features"
                className="block text-blue-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#docs"
                className="block text-blue-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </a>
              <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-500 transition-all">
                Connect Wallet
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
