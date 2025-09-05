import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import SwapInterface from './pages/SwapInterface'
import Features from './components/Features'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('landing') // 'landing' or 'swap'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      {currentView === 'landing' ? (
        <>
          <Hero setCurrentView={setCurrentView} />
          <Features />
        </>
      ) : (
        <SwapInterface />
      )}
      
      <Footer />
    </div>
  )
}

export default App
