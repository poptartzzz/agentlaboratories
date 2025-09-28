"use client";

import { Press_Start_2P } from 'next/font/google';
import Header from '@/components/Header';
import Image from 'next/image';
import Separator from '@/components/Separator';

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
});

export default function About() {
  return (
    <div className={`min-h-screen bg-black text-[#00ff00] ${pressStart.className}`}>
      <Header />

      <div className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-3xl mb-12">Agent Laboratories Setup Guide</h1>

          {/* Step 1: Getting Started */}
          <section className="mb-16">
            <h2 className="text-2xl mb-6">Step 1: Getting Started</h2>
            <div className="prose prose-invert prose-green max-w-none">
              <Image
                src="/1.png"
                alt="Getting Started Interface"
                width={800}
                height={400}
                className="border border-[#00ff00]/30 rounded-sm mb-8"
                priority
              />
              <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
                <h3 className="text-xl mb-4">Define Your Bot&apos;s Purpose</h3>
                <p className="mb-4">The first and most crucial step is clearly defining your bot&apos;s objectives:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Define your bot&apos;s primary function</li>
                  <li>Choose your target platform (Discord/Telegram)</li>
                  <li>List desired features and capabilities</li>
                </ul>
                <p className="mt-4 text-sm italic">💡 Pro Tip: The more specific your initial description, the more accurate the AI&apos;s autofill suggestions will be.</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Step 2: API Configuration */}
          <section className="mb-16">
            <h2 className="text-2xl mb-6">Step 2: API Configuration</h2>
            <Image
              src="/2.png"
              alt="API Configuration Interface"
              width={800}
              height={400}
              className="border border-[#00ff00]/30 rounded-sm mb-8"
              priority
            />
            <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
              <h3 className="text-xl mb-4">Essential APIs Configuration</h3>
              <p className="mb-4">For a trading bot, you&apos;ll need:</p>
              <pre className="bg-black/50 p-4 font-mono text-sm mb-4">
                1. UNISWAP API (uni-*****-*****-*****-*****){'\n'}
                2. RPC Endpoint (quick-*****-*****-*****-*****){'\n'}
                3. Twitter API (twitter-*****-*****-*****-*****)
              </pre>
              <p className="text-sm italic">🔑 Key Feature: Our &quot;BAKE AGENT&quot; technology automatically corrects API placement if entered in incorrect sections.</p>
            </div>
          </section>

          <Separator />

          {/* Step 3: Bot Behavior */}
          <section className="mb-16">
            <h2 className="text-2xl mb-6">Step 3: Bot Behavior Setup</h2>
            <Image
              src="/3.png"
              alt="Bot Behavior Interface"
              width={800}
              height={400}
              className="border border-[#00ff00]/30 rounded-sm mb-8"
              priority
            />
            <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
              <h3 className="text-xl mb-4">Configure Core Behaviors</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg mb-2">Available Features:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Twitter sentiment analysis</li>
                    <li>Stock trading automation</li>
                    <li>Contrarian strategy implementation</li>
                    <li>Real-time market monitoring</li>
                    <li>Automated trading systems</li>
                    <li>Custom feature integration</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Step 4: Trigger Setup */}
          <section className="mb-16">
            <h2 className="text-2xl mb-6">Step 4: Trigger Setup</h2>
            <Image
              src="/4.png"
              alt="Trigger Setup Interface"
              width={800}
              height={400}
              className="border border-[#00ff00]/30 rounded-sm mb-8"
              priority
            />
            <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
              <h3 className="text-xl mb-4">Custom Triggers Configuration</h3>
              <div className="space-y-4">
                <p>Create sophisticated trigger combinations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Multiple condition triggers</li>
                  <li>Time-based executions</li>
                  <li>Event-driven actions</li>
                  <li>Price movement alerts</li>
                  <li>Social media monitoring</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="mb-16">
            <h2 className="text-2xl mb-6">Getting Support</h2>
            <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
              <p className="mb-4">Need help? We&apos;re here for you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>24/7 AI Assistant support</li>
                <li>Community forums</li>
                <li>Documentation library</li>
                <li>Video tutorials</li>
              </ul>
              <p className="mt-6 text-sm italic">
                Remember: The AI Assistant is continuously learning and improving. 
                Your feedback helps make the platform better for everyone!
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 