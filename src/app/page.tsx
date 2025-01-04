"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg py-4' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                AGENTZ
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
              <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
              <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
              <button className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative px-6 py-2 bg-black rounded-lg leading-none">
                  Connect Wallet
                </div>
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
              <a href="#features" className="block hover:text-cyan-400 transition-colors">Features</a>
              <a href="#about" className="block hover:text-cyan-400 transition-colors">About</a>
              <a href="#pricing" className="block hover:text-cyan-400 transition-colors">Pricing</a>
              <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity mt-4">
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-full backdrop-blur-sm border border-cyan-500/20">
                <span className="text-cyan-400">🚀 Next-Gen AI Trading</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Trade Smarter with
                <span className="block mt-2 bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                  AI Agents
                </span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                Harness the power of artificial intelligence to revolutionize your crypto trading. 
                Our AI agents work 24/7 to identify optimal trading opportunities.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative px-8 py-3 bg-black rounded-full leading-none">
                    Launch Platform
                  </div>
                </button>
                <button className="px-8 py-3 rounded-full border border-gray-700 hover:border-cyan-500 transition-colors">
                  View Demo
                </button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8">
                {[
                  { value: '$2.5B+', label: 'Trading Volume' },
                  { value: '100K+', label: 'Active Users' },
                  { value: '99.9%', label: 'Success Rate' }
                ].map((stat, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
                    <div className="relative p-4 text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-600/30 blur-3xl rounded-full"></div>
              <div className="relative">
                <div className="p-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600">
                  <div className="bg-black rounded-xl p-6">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                      {/* Add your trading interface mockup here */}
                      <div className="w-full h-full grid grid-cols-2 gap-2 p-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-20 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-lg animate-pulse" style={{
                            animationDelay: `${i * 200}ms`
                          }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent inline-block">
              Advanced Trading Features
            </h2>
          </div>
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
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6 bg-gradient-to-r from-gray-900 to-black rounded-xl border border-gray-800 hover:border-cyan-500/50 transition-colors">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
