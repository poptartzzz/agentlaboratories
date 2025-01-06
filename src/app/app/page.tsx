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
    name: "test",
    description: "test bot please ignore",
    link: "test.com",
    status: "maintenance",
    image: "/agentzaimainmain.png"
  },
  {
    name: "moooooner",
    description: "to the mooooooon",
    link: "@moonerbot",
    status: "maintenance",
    image: "/agentzaimainmain.png"
  },
  {
    name: "AGENTZ bake test 🥖🍞",
    description: "do not bake cat bake agentz",
    link: "@agenztbakebot",
    status: "active",
    image: "/cat.jpg"
  },
  {
    name: "BASED TG AGENT(Z)",
    description: "TG Agent Wallet Test Bot",
    link: "@basedtgagentbot",
    status: "active",
    image: "/basedafegent.png"
  },
  {
    name: "Simple Tweet Notifier and Forwarder",
    description: "Simple Tweet Notifier and Forwarder",
    link: "@agentztweetforwarderbot",
    status: "active",
    image: "/twitteforwarder.png"
  },
  {
    name: "Shitcoin Multichain Auto-Slinger",
    description: "Multichain Shitcoin Slinger by AGENTZ AI",
    link: "https://agentz.diy\n@agentzshitcoinbot",
    status: "active",
    image: "/shitcoinslinger.png"
  },
  {
    name: "AGENTZ AI - Agent Creator Assistant",
    description: "Agent Creator assistant for AGENTZ AI",
    link: "https://agentz.diy\n@agentzaihelperbot",
    status: "active",
    image: "/agentaiassiatnt.png"
  }
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
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image 
                      src="/agentaiassiatnt.png"
                      alt="AGENTZ AI Assistant"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">AGENTZ AI - Agent Creator Assistant</h3>
                    <div className="text-sm text-[#00ff00]/70 mb-2">Agent Creator assistant for AGENTZ AI</div>
                    <div className="flex gap-3">
                      <a 
                        href="https://agentz.diy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#00ff00] hover:text-[#00ff00]/80 transition-colors"
                      >
                        WEBSITE →
                      </a>
                      <a 
                        href="https://t.me/agentzaihelperbot"
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

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl">ACTIVE AGENTS</h1>
            <div className="text-sm text-[#00ff00]/70">
              Total Agents: {agents.length - 1}
            </div>
          </div>

          {/* Bots Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {agents.filter(bot => bot.name !== "AGENTZ AI - Agent Creator Assistant").map((bot) => (
              <div 
                key={bot.name}
                className="border border-[#00ff00] bg-black/50 p-6 hover:bg-black/80 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image 
                        src={bot.image} 
                        alt={bot.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg mb-2">{bot.name}</h3>
                      <div className="text-xs text-[#00ff00]/70 mb-1">{bot.link}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs ${
                    bot.status === 'active' ? 'bg-[#00ff00]/20' : 'bg-yellow-500/20'
                  }`}>
                    {bot.status.toUpperCase()}
                  </div>
                </div>

                <p className="text-sm text-[#00ff00]/70 mb-4">{bot.description}</p>

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