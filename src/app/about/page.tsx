"use client";

import Link from 'next/link';
import { Press_Start_2P } from 'next/font/google';
import Header from '@/components/Header';

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
});

export default function About() {
  return (
    <div className={`min-h-screen bg-black text-[#00ff00] ${pressStart.className}`}>
      <Header />
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)]"></div>
      </div>

      <div className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h1 className="text-3xl mb-6">WHAT IS SIDEKIX?</h1>
              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  SIDEKIX is a revolutionary platform that empowers users to create and deploy AI-powered trading bots with ease.
                  Our platform combines advanced artificial intelligence with user-friendly interfaces to make automated trading accessible to everyone.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl mb-6">KEY FEATURES</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-[#00ff00] bg-black/50 p-6">
                  <h3 className="text-lg mb-4">AI-Powered Automation</h3>
                  <p className="text-sm leading-relaxed">
                    SIDEKIX uses advanced AI models to analyze market data and execute trades based on sophisticated algorithms and proven strategies.
                  </p>
                </div>

                <div className="border border-[#00ff00] bg-black/50 p-6">
                  <h3 className="text-lg mb-4">Custom Bot Creation</h3>
                  <p className="text-sm leading-relaxed">
                    Create your own SIDEKIX bot with customized parameters, trading strategies, and risk management settings.
                  </p>
                </div>

                <div className="border border-[#00ff00] bg-black/50 p-6">
                  <h3 className="text-lg mb-4">Real-Time Monitoring</h3>
                  <p className="text-sm leading-relaxed">
                    Track your SIDEKIX bot&apos;s performance in real-time with detailed analytics and performance metrics.
                  </p>
                </div>

                <div className="border border-[#00ff00] bg-black/50 p-6">
                  <h3 className="text-lg mb-4">Community & Support</h3>
                  <p className="text-sm leading-relaxed">
                    Join the SIDEKIX community to share strategies, get support, and stay updated on the latest features.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/create"
                className="inline-block px-8 py-3 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all">
                CREATE YOUR SIDEKIX BOT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 