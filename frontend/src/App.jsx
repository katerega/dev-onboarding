import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import SwapInterface from './pages/SwapInterface'
import AddLiquidity from './pages/AddLiquidity'
import CreatePair from './pages/CreatePair'
import Features from './components/Features'
import Footer from './components/Footer'
import './App.css'

// Landing page component
const LandingPage = () => (
  <>
    <Hero />
    <Features />
  </>
)

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/swap" element={<SwapInterface />} />
          <Route path="/liquidity" element={<AddLiquidity />} />
          <Route path="/create-pair" element={<CreatePair />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
