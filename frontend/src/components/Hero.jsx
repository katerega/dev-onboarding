import React from 'react'

const Hero = ({ setCurrentView }) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-blue-500/5 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm text-cyan-300 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
            Live on Testnet
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Decentralized Trading
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Simplified</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Trade tokens instantly with zero slippage, minimal fees, and maximum security. 
            The future of DeFi trading is here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => setCurrentView('swap')}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-2xl"
            >
              Start Trading
            </button>
            <button className="border-2 border-blue-400/50 text-blue-200 px-8 py-4 rounded-lg text-lg font-semibold hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-white transition-all backdrop-blur-sm">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">$2.4M+</div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">15K+</div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">0.1%</div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">Trading Fee</div>
            </div>
          </div>
        </div>
      </div>

      {/* Geometric decoration */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-blue-500/20 rounded-full opacity-30"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-cyan-400/10 rounded-full opacity-20"></div>
      <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-lg rotate-45 opacity-30"></div>
    </section>
  )
}

export default Hero
