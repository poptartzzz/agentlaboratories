"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/30 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              AGENTZ
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
              <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
              <a href="#pricing" className="hover:text-blue-500 transition-colors">Pricing</a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">
                Connect Wallet
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pt-4 pb-3 space-y-3">
              <a href="#features" className="block hover:text-blue-500 transition-colors">Features</a>
              <a href="#about" className="block hover:text-blue-500 transition-colors">About</a>
              <a href="#pricing" className="block hover:text-blue-500 transition-colors">Pricing</a>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity mt-4">
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                AI-Powered <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Crypto Trading</span> Agents
              </h1>
              <p className="text-gray-400 text-lg md:text-xl">
                Maximize your crypto investments with intelligent agents that never sleep. 
                Powered by advanced AI algorithms for optimal trading strategies.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
                  Launch App
                </button>
                <button className="border border-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Learn More
                </button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8">
                {['$1B+ Volume', '50K+ Users', '24/7 Trading'].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      {stat.split(' ')[0]}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.split(' ')[1]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-600/30 blur-3xl rounded-full"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-1">
                <div className="bg-gray-900 rounded-xl p-6">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gray-800 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Advanced Trading Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-Powered Analysis',
                description: 'Advanced algorithms analyze market patterns 24/7',
                icon: '🤖'
              },
              {
                title: 'Multi-Chain Support',
                description: 'Trade across multiple blockchain networks seamlessly',
                icon: '⛓️'
              },
              {
                title: 'Risk Management',
                description: 'Automated stop-loss and take-profit mechanisms',
                icon: '🛡️'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
