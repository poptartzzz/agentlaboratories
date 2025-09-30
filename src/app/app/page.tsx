"use client";

import { Press_Start_2P } from 'next/font/google';
import Link from 'next/link';
import Header from '@/components/Header';
import Image from 'next/image';

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
});

// Example bots data
const agents = [
  {
    id: 1,
    name: "AGENT LAB test",
    description: "",
    link: "",
    status: "active",
    image: "/agentlogowebsitemini.png"
  },
  {
    id: 2,
    name: "AGENT LAB 🤖",
    description: "Your personal AI assistant",
    link: "@agentlabbot",
    status: "active",
    image: "/agentlogowebsitemini.png"
  },
  {
    id: 3,
    name: "AI AGENT LABS - Agent Creator",
    description: "Made by mew w/ AI AGENT LABS",
    link: "https://agentlaboratories.fun/\n@aiagent_labs",
    status: "active",
    image: "/agentlogowebsitemini.png"
  },
  {
    id: 4,
    name: "AGENT LAB BAKE TEST 🥖",
    description: "Test your baking skills",
    link: "@baketestagentlabbot",
    status: "active",
    image: "/Screenshot 2025-01-08 182529.png"
  },
  {
    name: "THIS IS A GEM",
    description: "",
    link: "",
    status: "active",
    image: "/agentlogowebsitemini.png"
  },
  {
    name: "PUMP.FUN SCANNER",
    description: "Automatically scans pump.fun for high volume tokens and alerts on potential opportunities",
    link: "@pumpfunscanner",
    status: "active",
    image: "/pill.png"
  },
  {
    name: "PUMP.FUN AUTO-BUY",
    description: "Automatically buys pump.fun tokens on volume spikes and sells at 50% gains",
    link: "@pumpfunautobuy",
    status: "active",
    image: "/pill.png"
  },
  {
    name: "PUMP.FUN WHALE TRACKER",
    description: "Tracks pump.fun whale movements and copies successful trades automatically",
    link: "@pumpfunwhale",
    status: "active",
    image: "/pill.png"
  },
  {
    name: "PUMP.FUN SECURITY SCANNER",
    description: "Scans pump.fun tokens for security issues and rugpull indicators",
    link: "@pumpfunsecurity",
    status: "active",
    image: "/pill.png"
  },
];

export default function Dashboard() {
  return (
    <div className={`min-h-screen bg-black text-[#00ff00] ${pressStart.className}`}>
      <Header />
      {/* Matrix Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-6">
          {/* Hot Bots Section */}
          <div className="mb-12">
            <h2 className="text-2xl mb-8">HOT AGENTZ 🔥</h2>
            <div className="border-2 border-[#00ff00] bg-black/50 p-6 hover:bg-black/80 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image 
                      src="/agentlogowebsitemini.png"
                      alt="AI Agent Labs AI Assistant"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">AI Agent Labs - Agent Creator</h3>
                    <div className="text-sm text-[#00ff00]/70 mb-2">Agent Creator assistant for AI Agent Labs</div>
                    <div className="flex gap-3">
                      <a 
                        href="https://agentlaboratories.fun"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#00ff00] hover:text-[#00ff00]/80 transition-colors"
                      >
                        WEBSITE →
                      </a>
                      <a 
                        href="https://t.me/aiagent_labs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#00ff00] hover:text-[#00ff00]/80 transition-colors"
                      >
                        TELEGRAM →
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-[#00ff00]/20 px-2 py-1 text-xs">
                  ACTIVE
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="w-full h-px bg-[#00ff00]/20 mb-12"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-2">
            <h1 className="text-xl sm:text-2xl">ACTIVE AGENTS</h1>
            <div className="text-sm text-[#00ff00]/70">
              Total Agents: {agents.length - 1}
            </div>
          </div>

          {/* Bots Grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {agents.filter(bot => bot.name !== "AI AGENT LABS - Agent Creator").map((bot) => (
              <div 
                key={bot.name}
                className="border border-[#00ff00] bg-black/50 p-4 sm:p-6 hover:bg-black/80 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src={bot.image} 
                        alt={bot.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-lg mb-1 sm:mb-2">{bot.name}</h3>
                      <div className="text-xs text-[#00ff00]/70 mb-1 truncate">{bot.link}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs flex-shrink-0 ml-2 ${
                    bot.status === 'active' ? 'bg-[#00ff00]/20' : 'bg-yellow-500/20'
                  }`}>
                    {bot.status.toUpperCase()}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#00ff00]/70 mb-3 sm:mb-4">{bot.description}</p>

                <div className="mt-4">
                  {bot.link.split('\n').map((link, index) => (
                    <a 
                      key={index}
                      href={link.startsWith('@') ? `https://t.me/${link.substring(1)}` : link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#00ff00] hover:text-[#00ff00]/80 transition-colors block mb-1"
                    >
                      {link.startsWith('@') ? 'TELEGRAM →' : 'WEBSITE →'}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Create New Bot CTA */}
          <div className="mt-8 text-center">
            <Link href="/create"
              className="inline-block px-8 py-3 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all">
              CREATE YOUR OWN AGENT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 