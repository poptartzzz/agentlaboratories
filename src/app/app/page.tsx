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
    name: "SIDEKIX AI - Agent Creator",
    description: "Agent Creator assistant for SIDEKIX AI",
    link: "https://www.sidekixai.io\n@sidekixai",
    status: "active",
    image: "/agentaiassiatnt.png"
  },
  {
    name: "Ethereum Contract Helper",
    description: "Made by mew w/ sidekix AI",
    link: "@ethereumsmartcontractbot",
    status: "active",
    image: "/Screenshot 2025-01-06 233619.png"
  },
  {
    name: "Shitcoin Multichain Auto-Slinger",
    description: "Trade volatile shitcoins quickly and make tiny profits consistently.\n\nWorks more often than it doesn't. I think. 💩",
    link: "https://sidekixai.io/\n@sidekixautoslingerbot",
    status: "active",
    image: "/shitcoinslinger.png"
  },
  {
    name: "BASED TG AGENT",
    description: "The BASED TG AGENT will be fully functional after launch of $SXA token.\nThis bot will be able to moderate chat and function as a buy bot.",
    link: "https://sidekixai.io/\n@basedtgagentbot",
    status: "active",
    image: "/basedtgagent.png"
  },
  {
    name: "SIDEKIX BAKE TEST 🥖",
    description: "test bake",
    link: "@baketestsidekixbot",
    status: "active",
    image: "/Screenshot 2025-01-08 182529.png"
  },
  {
    name: "test",
    description: "teeeeesting",
    link: "",
    status: "active",
    image: "/agentaiassiatnt.png"
  },
  {
    name: "Trump",
    description: "Fantastic",
    link: "@trumps_bot",
    status: "active",
    image: "/photo_2017-10-03_09-14-38.jpg"
  },
  {
    name: "MOON MISSION",
    description: "BUY 3BC\n0x3e64cd8fd4d2fae3d7f4710817885b0941838d0b",
    link: "https://dexscreener.com/base/0xe6ec4c661f0b822ba2851b4a1de9ad64132fbfe3",
    status: "active",
    image: "/Screenshot 2025-01-08 210856.png"
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
                <div className="flex items-start gap-4 flex-1 min-w-0">
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
                    <h3 className="text-xl mb-2">SIDEKIX AI - Agent Creator</h3>
                    <div className="text-sm text-[#00ff00]/70 mb-2">Agent Creator assistant for SIDEKIX AI</div>
                    <div className="flex gap-3">
                      <a 
                        href="https://www.sidekixai.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#00ff00] hover:text-[#00ff00]/80 transition-colors"
                      >
                        WEBSITE →
                      </a>
                      <a 
                        href="https://t.me/sidekixai"
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
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image 
                        src={bot.image} 
                        alt={bot.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg mb-2">{bot.name}</h3>
                      <div className="text-xs text-[#00ff00]/70 mb-1 truncate">{bot.link}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs flex-shrink-0 ml-2 ${
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