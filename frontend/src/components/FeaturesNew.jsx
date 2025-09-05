import React from 'react'

const Features = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Execute trades in milliseconds with optimized smart contracts and minimal gas fees."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Secure & Audited",
      description: "Your funds are protected by battle-tested smart contracts audited by leading security firms."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Deep Liquidity",
      description: "Access the best prices with aggregated liquidity from multiple sources and AMMs."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "Low Fees",
      description: "Trade with fees as low as 0.1% and earn rewards for providing liquidity to pools."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "User Friendly",
      description: "Intuitive interface designed for both beginners and professional traders."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
        </svg>
      ),
      title: "Cross-Chain",
      description: "Seamlessly trade assets across multiple blockchains with our bridge technology."
    }
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose TradeSphere?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Built for the next generation of DeFi traders with cutting-edge technology 
            and uncompromising security standards.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-2xl p-8 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              
              <p className="text-blue-100 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-cyan-300 mb-4">Uptime Guarantee</div>
            <p className="text-blue-200 text-sm">
              Reliable infrastructure ensures your trades execute when you need them most.
            </p>
          </div>
          
          <div className="bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
            <div className="text-4xl font-bold text-white mb-2">&lt;100ms</div>
            <div className="text-cyan-300 mb-4">Average Response Time</div>
            <p className="text-blue-200 text-sm">
              Lightning-fast execution powered by optimized infrastructure.
            </p>
          </div>
          
          <div className="bg-slate-800/50 border border-blue-500/20 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
            <div className="text-4xl font-bold text-white mb-2">$0</div>
            <div className="text-cyan-300 mb-4">Platform Fees</div>
            <p className="text-blue-200 text-sm">
              Only pay network gas fees. No hidden charges or subscription costs.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-slate-800/80 to-blue-900/80 border border-blue-500/30 backdrop-blur-sm rounded-2xl p-12 max-w-4xl mx-auto shadow-lg">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Experience the Future of Trading?
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of traders who have already discovered the power of decentralized finance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                Start Trading Now
              </button>
              <button className="border-2 border-blue-400/50 text-blue-200 px-8 py-4 rounded-lg text-lg font-semibold hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-white transition-all">
                Read Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
