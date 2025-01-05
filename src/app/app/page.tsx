"use client";

import { Press_Start_2P } from 'next/font/google';
import Link from 'next/link';

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
});

// Example bots data
const exampleBots = [
  {
    id: 'bot_1',
    name: 'Uniswap Alpha',
    type: 'trading',
    status: 'active',
    platform: 'Telegram',
    group: 't.me/unialpha_v1_test',
    stats: {
      messages: '24',
      users: '5',
      uptime: '99.1%'
    },
    description: 'Monitors Uniswap pools for large trades and potential opportunities.',
    lastActive: '2 mins ago'
  },
  {
    id: 'bot_2',
    name: 'Degen Detector',
    type: 'research',
    status: 'active',
    platform: 'Discord',
    group: 'discord.gg/degen_detect_beta',
    stats: {
      messages: '19',
      users: '4',
      uptime: '98.7%'
    },
    description: 'Analyzes new token launches and provides rugpull risk assessment.',
    lastActive: '5 mins ago'
  },
  {
    id: 'bot_3',
    name: 'Whale Alert',
    type: 'tracking',
    status: 'active',
    platform: 'Twitter',
    group: '@whale_alerts_beta',
    stats: {
      messages: '16',
      users: '6',
      uptime: '99.8%'
    },
    description: 'Tracks large wallet movements and institutional trading patterns.',
    lastActive: '1 min ago'
  },
  {
    id: 'bot_4',
    name: 'MEV Hunter',
    type: 'arbitrage',
    status: 'maintenance',
    platform: 'Telegram',
    group: 't.me/mev_hunter_test',
    stats: {
      messages: '15',
      users: '3',
      uptime: '95.5%'
    },
    description: 'Identifies MEV opportunities and arbitrage across DEXes.',
    lastActive: '15 mins ago'
  },
  {
    id: 'bot_5',
    name: 'test',
    type: 'experimental',
    status: 'active',
    platform: 'Discord',
    group: 'discord.gg/agentz_test_32',
    stats: {
      messages: '5',
      users: '2',
      uptime: '87.2%'
    },
    description: 'Testing new trading strategies and signal formats.',
    lastActive: '45 mins ago'
  },
  {
    id: 'bot_6',
    name: 'Would Trump Trade This',
    type: 'sentiment',
    status: 'active',
    platform: 'Twitter',
    group: '@trump_trades_beta',
    stats: {
      messages: '26',
      users: '8',
      uptime: '99.1%'
    },
    description: 'Analyzes trading opportunities using Trump-style sentiment analysis. "We have the best trades, tremendous trades!"',
    lastActive: '1 min ago'
  },
  {
    id: 'bot_7',
    name: 'ELON TWEET AUTO-BUYER',
    type: 'trading',
    status: 'active',
    platform: 'Telegram',
    group: 't.me/elon_alerts_v1',
    stats: {
      messages: '29',
      users: '11',
      uptime: '98.5%'
    },
    description: 'Instantly detects Elon Musk tweets and executes trades based on mentioned cryptocurrencies or technologies.',
    lastActive: '3 mins ago'
  },
  {
    id: 'bot_8',
    name: 'Degen Ape',
    type: 'meme',
    status: 'active',
    platform: 'Discord',
    group: 'discord.gg/degen_ape_test',
    stats: {
      messages: '22',
      users: '7',
      uptime: '96.9%'
    },
    description: 'FOMO detector and degen play analyzer. "Apes together strong!" Tracks trending meme tokens.',
    lastActive: '30 secs ago'
  },
  {
    id: 'bot_9',
    name: 'test_bot_2',
    type: 'development',
    status: 'maintenance',
    platform: 'Telegram',
    group: 't.me/agentz_dev_test',
    stats: {
      messages: '3',
      users: '1',
      uptime: '85.5%'
    },
    description: 'Development testing for new features. Please ignore.',
    lastActive: '2 hours ago'
  }
];

export default function Dashboard() {
  return (
    <div className={`min-h-screen bg-black text-[#00ff00] ${pressStart.className}`}>
      {/* Matrix Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-lg py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl">
              <span className="text-[#00ff00]">AGENTZ</span>
              <span className="animate-pulse">|</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/create" 
                className="px-6 py-2 bg-[#00ff00] text-black hover:bg-[#00ff00]/80 transition-all text-sm">
                CREATE NEW AGENT
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl">ACTIVE AGENTS</h1>
            <div className="text-sm text-[#00ff00]/70">
              Total Agents: {exampleBots.length}
            </div>
          </div>

          {/* Bots Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {exampleBots.map((bot) => (
              <div 
                key={bot.id}
                className="border border-[#00ff00] bg-black/50 p-6 hover:bg-black/80 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg mb-2">{bot.name}</h3>
                    <div className="text-xs text-[#00ff00]/70 mb-1">Platform: {bot.platform}</div>
                    <div className="text-xs text-[#00ff00]/70">Group: {bot.group}</div>
                  </div>
                  <div className={`px-2 py-1 text-xs ${
                    bot.status === 'active' ? 'bg-[#00ff00]/20' : 'bg-yellow-500/20'
                  }`}>
                    {bot.status.toUpperCase()}
                  </div>
                </div>

                <p className="text-sm text-[#00ff00]/70 mb-4">{bot.description}</p>

                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-[#00ff00]">{bot.stats.messages}</div>
                    <div className="text-xs text-[#00ff00]/50">Messages</div>
                  </div>
                  <div>
                    <div className="text-[#00ff00]">{bot.stats.users}</div>
                    <div className="text-xs text-[#00ff00]/50">Users</div>
                  </div>
                  <div>
                    <div className="text-[#00ff00]">{bot.stats.uptime}</div>
                    <div className="text-xs text-[#00ff00]/50">Uptime</div>
                  </div>
                </div>

                <div className="text-xs text-[#00ff00]/50 mt-4">
                  Last active: {bot.lastActive}
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