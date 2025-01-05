"use client";

import { Press_Start_2P } from 'next/font/google';
import Link from 'next/link';

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
});

export default function About() {
  return (
    <div className={`min-h-screen bg-black text-[#00ff00] ${pressStart.className}`}>
      {/* Matrix Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)]"></div>
      </div>

      {/* Navbar - same as homepage */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-lg py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl">
              <span className="text-[#00ff00]">AGENTZ</span>
              <span className="animate-pulse">|</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 text-sm">
              <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/app" className="hover:text-white transition-colors">Dashboard</Link>
              <button className="px-6 py-2 bg-black border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all duration-300">
                Launch App
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-3xl md:text-4xl mb-8 text-center">AGENTZ AI WHITEPAPER</h1>
          
          {/* Executive Summary */}
          <section className="mb-12">
            <h2 className="text-xl mb-4">1. Executive Summary</h2>
            <p className="text-sm leading-relaxed mb-4">
              AGENTZ AI represents a revolutionary platform in the blockchain space, combining artificial intelligence with decentralized technology to create customizable autonomous agents. The AGENTZ token serves as the backbone of this ecosystem, enabling users to create, deploy, and monetize AI agents across various platforms and use cases.
            </p>
          </section>

          {/* Token Economics */}
          <section className="mb-12">
            <h2 className="text-xl mb-4">2. Token Economics</h2>
            <div className="text-sm leading-relaxed space-y-4">
              <h3 className="text-lg">2.1 Token Distribution</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Total Supply: 1,000,000,000 AGENTZ</li>
                <li>Public Sale: 40% (400,000,000 AGENTZ)</li>
                <li>Development Fund: 20% (200,000,000 AGENTZ)</li>
                <li>Ecosystem Growth: 15% (150,000,000 AGENTZ)</li>
                <li>Team & Advisors: 15% (150,000,000 AGENTZ)</li>
                <li>Community Rewards: 10% (100,000,000 AGENTZ)</li>
              </ul>

              <h3 className="text-lg mt-6">2.2 Token Utility</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Agent Creation & Deployment</li>
                <li>Access to Premium Features</li>
                <li>Governance Rights</li>
                <li>Staking Rewards</li>
                <li>Revenue Sharing</li>
              </ul>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="mb-12">
            <h2 className="text-xl mb-4">3. Technology Stack</h2>
            <div className="text-sm leading-relaxed space-y-4">
              <h3 className="text-lg">3.1 Core Components</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Advanced Language Models (Claude, GPT-4)</li>
                <li>Blockchain Integration (EVM-compatible)</li>
                <li>Decentralized Storage (IPFS)</li>
                <li>Custom Agent Framework</li>
                <li>API Integration Layer</li>
              </ul>

              <h3 className="text-lg mt-6">3.2 Agent Types</h3>
              <p>AGENTZ supports multiple agent types, each specialized for specific use cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Trading Agents: Market analysis, signal generation, portfolio management</li>
                <li>Community Agents: Moderation, support, engagement tracking</li>
                <li>Research Agents: Data analysis, trend detection, report generation</li>
                <li>Security Agents: Smart contract analysis, threat detection</li>
                <li>Custom Agents: User-defined functionality</li>
              </ul>
            </div>
          </section>

          {/* Platform Features */}
          <section className="mb-12">
            <h2 className="text-xl mb-4">4. Platform Features</h2>
            <div className="text-sm leading-relaxed space-y-4">
              <h3 className="text-lg">4.1 Agent Creation</h3>
              <p>Users can create custom agents through:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No-Code Interface: Drag-and-drop agent builder</li>
                <li>Template Library: Pre-built agent templates</li>
                <li>Advanced Mode: Custom code implementation</li>
                <li>API Integration: Connect to external services</li>
              </ul>

              <h3 className="text-lg mt-6">4.2 Deployment Options</h3>
              <p>Agents can be deployed across multiple platforms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Telegram Groups & Channels</li>
                <li>Discord Servers</li>
                <li>Twitter Accounts</li>
                <li>Web Interfaces</li>
                <li>Custom API Endpoints</li>
              </ul>
            </div>
          </section>

          {/* Continue with more sections... */}
        </div>
      </div>
    </div>
  );
} 