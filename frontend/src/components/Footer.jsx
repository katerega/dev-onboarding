import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-blue-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-2xl font-bold text-white">TradeSphere</span>
            </div>
            <p className="text-blue-200 mb-6 leading-relaxed">
              The future of decentralized trading. Secure, fast, and user-friendly DeFi for everyone.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800/50 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-300 hover:text-white hover:border-cyan-400/40 transition-all"
                aria-label="X (Twitter)"
                >
                <svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M18.244 2H21.5l-7.73 8.83L22 22h-6.766l-5.31-6.456L4.1 22H0l8.41-9.61L0 2h6.91l4.78 5.937L18.244 2zm-2.363 17.33h2.027L7.205 4.58H5.032l10.849 14.75z"/>
                </svg>
                </a>

              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800/50 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-300 hover:text-white hover:border-cyan-400/40 transition-all"
                aria-label="Discord"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800/50 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-300 hover:text-white hover:border-cyan-400/40 transition-all"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800/50 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-300 hover:text-white hover:border-cyan-400/40 transition-all"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Product</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Swap</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Liquidity</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Farming</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Analytics</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Bridge</a></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Developers</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">API Reference</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Smart Contracts</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Bug Bounty</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">GitHub</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Community</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-800/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-blue-300 text-sm mb-4 md:mb-0">
              © 2025 TradeSphere. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center text-blue-300">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                All systems operational
              </div>
              <div className="text-blue-300">
                Powered by Ethereum
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Audit Info */}
      <div className="border-t border-blue-800/30 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-blue-200">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg> */}
                {/* <span>Audited by CertiK</span> */}
              </div>
        
            </div>
            <div className="text-blue-300">
              Last updated: September 2025
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
