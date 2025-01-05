"use client";

import { useState, useEffect } from "react";
import { Press_Start_2P } from 'next/font/google';
import Link from 'next/link';
import { getCryptoData } from '@/utils/crypto';
import { generateAgentResponse } from '@/utils/claude';
import { getTokenInfo } from '@/utils/etherscan';
import Navigation from '@/components/Navigation';
import Separator from '@/components/Separator';
import TypeWriter from '@/components/TypeWriter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
});

type AgentType = 
  | 'trading' 
  | 'moderator' 
  | 'researcher' 
  | 'arbitrage' 
  | 'sentiment' 
  | 'nft' 
  | 'defi' 
  | 'whale'
  | 'governance'
  | 'mempool'
  | 'bridge'
  | 'security'
  | 'elon_tweet'
  | 'influencer_trader'
  | 'shitcoin_hunter';

interface DemoMessage {
  id: string;
  text: string;
  timestamp: number;
  isUser: boolean;
  isThinking?: boolean;
}

// Add this new interface for user input
interface DemoInput {
  isOpen: boolean;
  message: string;
}

// Utility functions for generating random demo content
const generateTradingMessage = (): string => {
  const users = ['trader_123', 'crypto_king', 'hodler99', 'whale_watcher'];
  const questions = [
    'Should I enter BTC now?',
    'What\'s your take on ETH/BTC?',
    'Is this a good entry for SOL?',
    'Stop loss recommendation?',
    'Take profit targets?'
  ];
  
  const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'AVAX/USDT'];
  const prices = Array.from({length: 5}, () => (Math.random() * 50000).toFixed(2));
  const percentages = Array.from({length: 5}, () => (Math.random() * 10).toFixed(2));
  
  const responses = [
    `Based on my analysis, ${pairs[Math.floor(Math.random() * pairs.length)]} shows a bullish divergence. Entry at $${prices[0]} looks optimal.`,
    `I detect strong support at $${prices[1]}. Risk/reward ratio is favorable for a long position.`,
    `Market conditions are volatile. Recommend waiting for confirmation above $${prices[2]}.`,
    `Setting stop loss at $${prices[3]} (${percentages[0]}% below entry) would be prudent.`,
    `Multiple take profit targets: TP1: $${prices[4]} (+${percentages[1]}%), TP2: $${(parseFloat(prices[4]) * 1.05).toFixed(2)} (+${(parseFloat(percentages[1]) * 1.5).toFixed(2)}%)`
  ];

  // Randomly decide if this should be a question or answer
  if (Math.random() > 0.7) {
    return `👤 @${users[Math.floor(Math.random() * users.length)]}: ${questions[Math.floor(Math.random() * questions.length)]}`;
  } else {
    return `🤖 ${responses[Math.floor(Math.random() * responses.length)]}`;
  }
};

const generateModeratorMessage = (): string => {
  const users = ['new_member', 'crypto_fan', 'moon_boy', 'fud_master'];
  const questions = [
    'Is this link safe?',
    'Why was my message deleted?',
    'Can I share my trading group?',
    'Why was I warned?',
    'When moon?'
  ];
  
  const responses = [
    'That link contains potential phishing attempts. Please only share official links.',
    'Your message was removed as it violated our no-spam policy. Please review the rules.',
    'Trading group promotions are only allowed in #promotions channel with mod approval.',
    'Excessive use of caps and spam triggers automatic moderation.',
    'Please keep discussion focused on meaningful market analysis.'
  ];

  if (Math.random() > 0.7) {
    return `👤 @${users[Math.floor(Math.random() * users.length)]}: ${questions[Math.floor(Math.random() * questions.length)]}`;
  } else {
    return `🤖 ${responses[Math.floor(Math.random() * responses.length)]}`;
  }
};

const generateResearcherMessage = (): string => {
  const users = ['analyst_pro', 'research_guru', 'data_wizard', 'trend_hunter'];
  const questions = [
    'What\'s the current market sentiment?',
    'Any notable whale movements?',
    'How\'s the developer activity?',
    'Major news impacts?',
    'Network growth stats?'
  ];
  
  const assets = ['BTC', 'ETH', 'SOL', 'AVAX'];
  const metrics = ['social sentiment', 'developer activity', 'whale movements', 'network activity'];
  const percentages = Array.from({length: 5}, () => (Math.random() * 100).toFixed(1));
  
  const responses = [
    `Analysis shows ${metrics[Math.floor(Math.random() * metrics.length)]} for ${assets[Math.floor(Math.random() * assets.length)]} is up ${percentages[0]}% this week.`,
    `Detected significant whale accumulation: ${Math.floor(Math.random() * 1000)} ${assets[Math.floor(Math.random() * assets.length)]} moved to cold storage.`,
    `GitHub commits increased by ${percentages[1]}% this month, indicating strong development momentum.`,
    `Social sentiment analysis: ${percentages[2]}% bullish across major platforms.`,
    `On-chain metrics show ${percentages[3]}% growth in daily active addresses.`
  ];

  if (Math.random() > 0.7) {
    return `👤 @${users[Math.floor(Math.random() * users.length)]}: ${questions[Math.floor(Math.random() * questions.length)]}`;
  } else {
    return `🤖 ${responses[Math.floor(Math.random() * responses.length)]}`;
  }
};

// Add this helper function to get the agent title
const getAgentTitle = (type: AgentType) => {
  switch (type) {
    case 'trading':
      return 'trading_agent.bot';
    case 'moderator':
      return 'mod_agent.bot';
    case 'researcher':
      return 'research_agent.bot';
    case 'arbitrage':
      return 'arb_hunter.bot';
    case 'sentiment':
      return 'sentiment_analyzer.bot';
    case 'nft':
      return 'nft_scout.bot';
    case 'defi':
      return 'defi_optimizer.bot';
    case 'whale':
      return 'whale_tracker.bot';
    case 'governance':
      return 'dao_analyzer.bot';
    case 'mempool':
      return 'mev_scanner.bot';
    case 'bridge':
      return 'bridge_optimizer.bot';
    case 'security':
      return 'security_auditor.bot';
    case 'elon_tweet':
      return 'elon_degen.bot';
    case 'influencer_trader':
      return 'shill_detector.bot';
    case 'shitcoin_hunter':
      return 'degen_scanner.bot';
    default:
      return 'agent.bot';
  }
};

// Add a utility function to generate unique IDs
const generateUniqueId = (() => {
  let id = 0;
  return () => `msg_${Date.now()}_${++id}`;
})();

// First, add a function to get contextual placeholder text
const getPlaceholder = (type: AgentType) => {
  switch (type) {
    case 'trading':
      return 'Ask about trading signals, price analysis, or entry points...';
    case 'moderator':
      return 'Ask about community guidelines or try posting a message...';
    case 'researcher':
      return 'Ask about market research, on-chain metrics, or project analysis...';
    case 'arbitrage':
      return 'Ask about cross-exchange opportunities or price differences...';
    case 'sentiment':
      return 'Ask about market sentiment, social metrics, or trend analysis...';
    case 'nft':
      return 'Ask about NFT collections, floor prices, or rare traits...';
    case 'defi':
      return 'Ask about yield opportunities, APY comparisons, or pool analysis...';
    case 'whale':
      return 'Ask about large transactions, wallet movements, or accumulation...';
    case 'governance':
      return 'Ask about DAO proposals, voting analysis, or governance metrics...';
    case 'mempool':
      return 'Ask about pending transactions, MEV opportunities, or gas optimization...';
    case 'bridge':
      return 'Ask about cross-chain bridges, transfer routes, or liquidity analysis...';
    case 'security':
      return 'Ask about smart contract security, vulnerability analysis, or audit findings...';
    default:
      return 'Type your message and press Enter...';
  }
};

// Add error boundary for Spline
const SplineComponent = () => {
  return (
    <div className="absolute inset-0 z-0">
      <spline-viewer 
        url="https://prod.spline.design/QowvYLfIkW8q41RE/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
};

// Add this helper function near the top of your component
interface IconTextProps {
  icon: IconDefinition;
  text: string;
}

const IconText = ({ icon, text }: IconTextProps) => (
  <div className="flex items-center gap-2">
    <FontAwesomeIcon icon={icon} className="text-[#00ff00] w-4 h-4" />
    <span>{text}</span>
  </div>
);

// Fix the any type on line 458
interface TokenData {
  token: string;
  data: {
    price: number;
    volume: number;
    change: number;
  }
}

const processResults = (results: TokenData[]) => {
  // ... rest of function
};

export default function Home() {
  const [demoMessages, setDemoMessages] = useState<DemoMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAgentType, setCurrentAgentType] = useState<AgentType>('trading');
  const [userInput, setUserInput] = useState<DemoInput>({
    isOpen: false,
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [features.length]);

  const features = [
    {
      title: "Platform Integration",
      description: "Deploy your bot on Telegram or Discord. Seamlessly interact with users through popular messaging platforms with built-in API support.",
      icon: <FontAwesomeIcon icon={faRobot} className="text-[#00ff00] w-8 h-8" />
    },
    {
      title: "API Integration",
      description: "Connect to major exchanges (Binance, Coinbase) and data providers (CoinGecko, CryptoCompare) with secure API management.",
      icon: <FontAwesomeIcon icon={faPlug} className="text-[#00ff00] w-8 h-8" />
    },
    {
      title: "Trading Configuration",
      description: "Set up advanced trading parameters including position sizing, stop-loss defaults, timeframes, and risk management rules.",
      icon: <FontAwesomeIcon icon={faGears} className="text-[#00ff00] w-8 h-8" />
    },
    {
      title: "Bot Behavior",
      description: "Customize commands, triggers, and response styles. Define how your bot interacts with users and responds to events.",
      icon: <FontAwesomeIcon icon={faCode} className="text-[#00ff00] w-8 h-8" />
    },
    {
      title: "Security & Access",
      description: "Control user access levels, set permissions, and manage backup frequencies. Keep your bot and users secure.",
      icon: <FontAwesomeIcon icon={faLock} className="text-[#00ff00] w-8 h-8" />
    },
    {
      title: "Custom Responses",
      description: "Personalize welcome messages, error handling, and success notifications. Make your bot's communication style unique.",
      icon: <FontAwesomeIcon icon={faMessage} className="text-[#00ff00] w-8 h-8" />
    }
  ];

  // Function to generate a new random demo
  const generateNewDemo = async () => {
    setIsGenerating(true);
    setDemoMessages([]);
    
    let conversation: {text: string, isUser: boolean}[] = [];
    
    switch (currentAgentType) {
      case 'elon_tweet':
        conversation = [
          { text: "👤 @degen_trader: Show me the ELON BOT settings", isUser: true },
          { text: "🤖 ELON TWEET BOT Status:\nMode: DEGEN ACTIVATED 🚀\n\nCurrent Settings:\n- Buy Trigger: Any Elon tweet containing < 3 words\n- Initial Buy: $500 per coin mentioned\n- Stop Loss: -15% (paper hands 📄)\n- Take Profit: +100% (minimum, we only ride moonshots 🌕)\n\nLast Action: Bought $DOGE after '🐕' tweet\nResult: +420% profit (nice)\n\nWaiting for next tweet...", isUser: false }
        ];
        break;
      case 'influencer_trader':
        conversation = [
          { text: "👤 @fomo_master: Check influencer bot status", isUser: true },
          { text: "🤖 INFLUENCER TRACKER v4.20 🎯\n\nMonitoring:\n1. BitBoy (inverse all trades)\n2. CryptoCapo (inverse when too bearish)\n3. Plan B (adjust stock-to-flow for hopium)\n\nCurrent Positions:\n- Short $BTC because BitBoy is bullish\n- Long $ETH because everyone is bearish\n- Avoiding all NFTs shilled in last 24h\n\nProfitability: We're all gonna make it 🚀", isUser: false },
          { text: "👤 @fomo_master: Any active shills now?", isUser: true },
          { text: "🤖 LIVE SHILL DETECTION:\n\n🚨 3 influencers shilling same coin: $PEPE\n⚠️ 5 'Not Financial Advice' disclaimers detected\n💰 2 'Once in a lifetime opportunity' claims\n🎯 7 rocket emojis in one tweet\n\nBot Action:\n- Waiting for synchronized shilling\n- Will short when they say 'fundamentals'\n- Buy signal: When they start blocking critics\n\nTrust level: In memes we trust 🎰", isUser: false }
        ];
        break;
      // ... other cases ...
    }
    
    // Add messages with delays
    for (let i = 0; i < conversation.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDemoMessages(prev => [...prev, {
        id: generateUniqueId(),
        text: conversation[i].text,
        timestamp: Date.now(),
        isUser: conversation[i].isUser
      }]);
    }
    
    setIsGenerating(false);
  };

  // Update the initial useEffect
  useEffect(() => {
    // Set initial conversation based on default agent type (trading)
    const initialConversation = [
      { text: "👤 @trader: What's your analysis on BTC/USDT?", isUser: true },
      { text: "🤖 Current BTC Analysis:\nPrice: $43,567\nTrend: Bullish divergence on 4H\n\nKey Levels:\n- Support: $42,800\n- Resistance: $44,200\n- Stop Loss: $42,500\n\nRSI showing oversold on 1H timeframe. Volume increasing with price. Recommended entry around $43,200 with tight stops.", isUser: false }
    ];

    setDemoMessages(initialConversation.map(msg => ({
      id: generateUniqueId(),
      text: msg.text,
      timestamp: Date.now(),
      isUser: msg.isUser
    })));
  }, []); // Empty dependency array means this runs once on mount

  // Add this function to handle user messages
  const handleUserMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Immediately show user message
    const userMessage = `👤 @visitor: ${message}`;
    setDemoMessages(prev => [...prev, {
      id: generateUniqueId(),
      text: userMessage,
      timestamp: Date.now(),
      isUser: true
    }]);

    // Immediately show thinking message
    const thinkingId = generateUniqueId();
    setDemoMessages(prev => [...prev, {
      id: thinkingId,
      text: "🤖 Agent is thinking...",
      timestamp: Date.now(),
      isUser: false,
      isThinking: true
    }]);

    setIsGenerating(true);
    setUserInput({ isOpen: false, message: '' });

    try {
      // Check if message contains an Ethereum address
      const addressMatch = message.match(/0x[a-fA-F0-9]{40}/);
      if (addressMatch) {
        const address = addressMatch[0];
        
        // Show searching message with animation
        const searchingId = generateUniqueId();
        setDemoMessages(prev => [...prev, {
          id: searchingId,
          text: "🤖 Analyzing smart contract...",
          timestamp: Date.now(),
          isUser: false,
          isThinking: true
        }]);

        try {
          const tokenInfo = await getTokenInfo(address);

          if (tokenInfo) {
            let responseText = `🤖 Contract Analysis for ${address.slice(0, 6)}...${address.slice(-4)}:\n`;
            
            if (tokenInfo.isToken) {
              responseText += `📝 Token Name: ${tokenInfo.name}\n`;
            } else {
              responseText += `📝 Contract Name: ${tokenInfo.name}\n`;
            }

            responseText += `
✅ Verification: ${tokenInfo.isVerified ? 'Verified' : 'Unverified'} contract
🔄 Implementation: ${tokenInfo.implementation}
⚙️ Compiler: ${tokenInfo.compiler}
📊 Transactions: ${tokenInfo.transactions}
⏰ Last Activity: ${tokenInfo.lastTx}
📅 Deployed: ${tokenInfo.deployedAt}

${tokenInfo.isVerified ? '✅ Contract is verified, suggesting legitimate deployment' : '⚠️ Contract is unverified - exercise caution'}
${tokenInfo.transactions > 1000 ? '📈 High transaction count indicates active usage' : '⚠️ Low transaction count - might be new or inactive'}

Would you like me to analyze the transaction patterns or check for potential security risks?`;

            // Replace thinking message with analysis
            setDemoMessages(prev => prev.map(msg => 
              msg.id === searchingId ? {
                id: generateUniqueId(),
                text: responseText,
                timestamp: Date.now(),
                isUser: false
              } : msg
            ));
          } else {
            setDemoMessages(prev => prev.map(msg => 
              msg.id === searchingId ? {
                id: generateUniqueId(),
                text: "🤖 I couldn't find detailed information about this contract. It might be very new or not deployed on mainnet. Would you like me to check other networks?",
                timestamp: Date.now(),
                isUser: false
              } : msg
            ));
          }
        } catch (error) {
          console.error('Error:', error);
          setDemoMessages(prev => prev.map(msg => 
            msg.id === searchingId ? {
              id: generateUniqueId(),
              text: "🤖 I encountered an error while analyzing this contract. The address might be invalid or the contract might not be deployed yet.",
              timestamp: Date.now(),
              isUser: false
            } : msg
          ));
        }
        return;
      }

      // Get crypto prices for common tokens mentioned in the message
      const tokens = {
        btc: message.toLowerCase().includes('btc') || message.toLowerCase().includes('bitcoin'),
        eth: message.toLowerCase().includes('eth') || message.toLowerCase().includes('ethereum'),
        sol: message.toLowerCase().includes('sol') || message.toLowerCase().includes('solana'),
      };

      // Fetch relevant token data
      const priceData: Record<string, any> = {};
      
      // Fetch prices in parallel
      const promises = [];
      if (tokens.btc) promises.push(getCryptoData('bitcoin').then(data => ({ token: 'btc', data })));
      if (tokens.eth) promises.push(getCryptoData('ethereum').then(data => ({ token: 'eth', data })));
      if (tokens.sol) promises.push(getCryptoData('solana').then(data => ({ token: 'sol', data })));

      const results = await Promise.all(promises);
      
      // Process results
      results.forEach(({ token, data }) => {
        if (data) {
          priceData[token] = {
            price: data.usd?.toFixed(2) || 'N/A',
            change: data.usd_24h_change?.toFixed(2) || 'N/A',
            volume: (data.usd_24h_vol / 1e9)?.toFixed(2) || 'N/A'
          };
        }
      });

      // Create market data string for prompt
      const marketDataString = Object.entries(priceData)
        .map(([token, data]) => 
          `${token.toUpperCase()}: $${data.price} (${data.change}% 24h) | Vol: $${data.volume}B`
        )
        .join('\n');

      // Generate context-aware response with real price data
      const followUpPrompt = `You are an AI crypto trading agent. Here is the current real market data:
      ${marketDataString}

      Previous conversation context:
      ${demoMessages.map(m => m.text).join('\n')}
      
      User question: ${message}
      
      Provide a detailed analysis using the REAL price data provided above. You can make up additional technical analysis details to support your response, but use the actual prices in your analysis. Keep the response concise and chat-like. Start your response with 🤖.`;

      const response = await generateAgentResponse(followUpPrompt);
      
      // Replace thinking message with actual response
      setDemoMessages(prev => prev.map(msg => 
        msg.id === thinkingId ? {
          id: generateUniqueId(),
          text: response,
          timestamp: Date.now(),
          isUser: false
        } : msg
      ));

    } catch (error) {
      console.error('Error:', error);
      setDemoMessages(prev => [...prev, {
        id: generateUniqueId(),
        text: "🤖 I encountered an error while fetching token information. Please verify the address and try again.",
        timestamp: Date.now(),
        isUser: false
      }]);
    }

    setIsGenerating(false);
  };

  // First, create an array of available agent types for tabs
  const agentTypes: { type: AgentType; label: string }[] = [
    { type: 'trading', label: 'TRADING ANALYZER' },
    { type: 'elon_tweet', label: 'ELON TWEET TRACKER' },
    { type: 'influencer_trader', label: 'INFLUENCER DETECTOR' },
    { type: 'shitcoin_hunter', label: 'SHITCOIN SCANNER' },
    { type: 'defi', label: 'DEFI OPTIMIZER' },
    { type: 'security', label: 'SECURITY AUDITOR' },
    { type: 'whale', label: 'WHALE WATCHER' },
    { type: 'nft', label: 'NFT ANALYZER' }
  ];

  const typewriterWords = [
    { icon: faRobot, text: "Trading While You Sleep" },
    { icon: faArrowsRotate, text: "Inverse CryptoCapo Bot (Always Profitable)" },
    { icon: faChartLine, text: "Buy High Sell Higher Bot" },
    { icon: faCrosshairs, text: "'Trust Me Bro' Signal Detector" },
    { icon: faCoins, text: "Whale Wallet Stalker" },
    { icon: faRocket, text: "Memecoin FOMO Protector" },
    { icon: faGem, text: "Diamond Hands Enforcer" },
    { icon: faPersonRunning, text: "Rugpull Escape Artist" },
    { icon: faGamepad, text: "GameFi Degen Bot" },
    { icon: faCrown, text: "Ape Index Calculator" },
    { icon: faMoon, text: "Moon Mission Coordinator" },
    { icon: faStar, text: "Hopium Level Analyzer" }
  ];

  return (
    <div className={`min-h-screen bg-black text-[#00ff00] overflow-x-hidden ${pressStart.className}`}>
      <Navigation />
      
      {/* Matrix Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)]"></div>
      </div>

      {/* Hero Section with Spline */}
      <section className="relative h-screen flex items-center z-10">
        <SplineComponent />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="space-y-8 backdrop-blur-sm bg-black/70 p-8 rounded-lg">
            <div className="inline-block px-4 py-2 border border-[#00ff00] bg-black">
              <span className="text-[#00ff00] text-xs">AUTOMATE YOUR SUCCESS</span>
            </div>
            <h1 className="text-5xl md:text-7xl leading-relaxed">
              NEXT-GEN
              <span className="block mt-2 text-[#00ff00]">
                AI AGENTS
              </span>
              <span className="block mt-2 text-sm md:text-xl">
                YOUR 24/7 CRYPTO COMPANION
              </span>
            </h1>
            <div className="text-sm md:text-base">
              <TypeWriter 
                words={typewriterWords.map(({ icon, text }) => (
                  <IconText key={text} icon={icon} text={text} />
                ))}
                delay={3000}
              />
            </div>
            <div className="flex justify-center gap-4">
              <Link href="/app" 
                className="px-8 py-3 bg-[#00ff00] text-black text-sm hover:bg-[#00ff00]/80 transition-colors">
                LAUNCH AGENT CREATOR
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Interactive Examples Section */}
      <section className="relative py-12 z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-2xl md:text-3xl mb-12">
            INTERACTIVE EXAMPLES <span className="animate-pulse">|</span>
          </h2>
          
          {/* Live Demo Terminal */}
          <div className="max-w-4xl mx-auto">
            <div className="p-1 border border-[#00ff00]">
              {/* Add tabs above the terminal */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
                {agentTypes.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => {
                      setCurrentAgentType(type);
                      // Create a new conversation based on the selected type
                      let conversation: {text: string, isUser: boolean}[] = [];
                      switch (type) {
                        case 'trading':
                          conversation = [
                            { text: "👤 @trader: What's your analysis on BTC/USDT?", isUser: true },
                            { text: "🤖 Current BTC Analysis:\nPrice: $43,567\nTrend: Bullish divergence on 4H\n\nKey Levels:\n- Support: $42,800\n- Resistance: $44,200\n- Stop Loss: $42,500\n\nRSI showing oversold on 1H timeframe. Volume increasing with price. Recommended entry around $43,200 with tight stops.", isUser: false },
                            { text: "👤 @trader: Any concerning signals?", isUser: true },
                            { text: "🤖 CAUTION SIGNALS:\n- Funding rate slightly high (0.02%)\n- Whale selling detected at $44,100\n- Options expiry in 48hrs\n\nRecommend: Tight stops and position sizing", isUser: false },
                            { text: "👤 @trader: Check ETH/BTC pair", isUser: true },
                            { text: "🤖 ETH/BTC ANALYSIS:\nCurrent: 0.0654 BTC\nTrend: Accumulation phase\n\nKey Patterns:\n- Bull flag forming on 4H\n- MACD crossover imminent\n- Volume profile supporting breakout\n\nTarget: 0.0680 BTC (+4%)", isUser: false }
                          ];
                          break;

                        case 'elon_tweet':
                          conversation = [
                            { text: "👤 @degen_trader: Show me the ELON BOT settings", isUser: true },
                            { text: "🤖 ELON TWEET BOT Status:\nMode: DEGEN ACTIVATED 🚀\n\nCurrent Settings:\n- Buy Trigger: Any Elon tweet containing < 3 words\n- Initial Buy: $500 per coin mentioned\n- Stop Loss: -15% (paper hands 📄)\n- Take Profit: +100% (minimum, we only ride moonshots 🌕)\n\nLast Action: Bought $DOGE after '🐕' tweet\nResult: +420% profit (nice)\n\nWaiting for next tweet...", isUser: false }
                          ];
                          break;

                        case 'influencer_trader':
                          conversation = [
                            { text: "👤 @fomo_master: Check influencer bot status", isUser: true },
                            { text: "🤖 INFLUENCER TRACKER v4.20 🎯\n\nMonitoring:\n1. BitBoy (inverse all trades)\n2. CryptoCapo (inverse when too bearish)\n3. Plan B (adjust stock-to-flow for hopium)\n\nCurrent Positions:\n- Short $BTC because BitBoy is bullish\n- Long $ETH because everyone is bearish\n- Avoiding all NFTs shilled in last 24h\n\nProfitability: We're all gonna make it 🚀", isUser: false }
                          ];
                          break;

                        case 'shitcoin_hunter':
                          conversation = [
                            { text: "👤 @degen_ape: Status of the shitcoin scanner?", isUser: true },
                            { text: "🤖 SHITCOIN RADAR ACTIVATED 💩\n\nScanning /r/CryptoMoonShots...\nMonitoring Telegram pump groups...\nAnalyzing Twitter degeneracy...\n\nHOT FINDINGS 🔥\n1. $ELONBALLS (5 mins old, 300% up)\n2. $SAFEMOONINU (2 rugs already, bullish)\n3. $BABYSHIB (literally just launched)\n\nRisk Level: Maximum Degen 🎲\nLiquidity: Trust me bro 🤝", isUser: false }
                          ];
                          break;

                        case 'defi':
                          conversation = [
                            { text: "👤 @yield_farmer: Find best yield opportunities", isUser: true },
                            { text: "🤖 SCANNING DEFI PROTOCOLS 📊\n\nTop APY Opportunities:\n1. AAVE/ETH LP: 156% APY\n2. CAKE-BNB Farm: 287% APY\n3. Stable-LP: 42% APY (lowest risk)\n\nGas Fees:\n- ETH: 45 gwei\n- BSC: 5 gwei\n- Polygon: <1 gwei\n\nRecommendation: Polygon farms optimal for small deposits", isUser: false }
                          ];
                          break;

                        case 'security':
                          conversation = [
                            { text: "👤 @auditor: Scan this new DeFi protocol", isUser: true },
                            { text: "🤖 SECURITY SCAN RESULTS 🔍\n\nContract Analysis:\n- Owner privileges: HIGH\n- Mint function: DETECTED\n- Time locks: NONE\n- Proxy upgrades: UNSAFE\n\nRed Flags:\n⚠️ Admin can pause trading\n⚠️ Blacklist function found\n⚠️ Hidden mint capabilities\n\nRug Pull Risk: 8/10 - EXERCISE CAUTION", isUser: false }
                          ];
                          break;

                        case 'whale':
                          conversation = [
                            { text: "👤 @whale_watcher: Any significant movements?", isUser: true },
                            { text: "🤖 WHALE ALERT 🐋\n\nLast 4 hours:\n- 3,500 BTC moved to Binance\n- ETH whale accumulated 12,000 ETH\n- Unknown wallet bridged $45M to L2\n\nWhale Sentiment:\n- Top 100 wallets: Accumulating\n- Exchange outflows increasing\n- New smart money entering\n\nBullish pattern forming 📈", isUser: false }
                          ];
                          break;

                        case 'nft':
                          conversation = [
                            { text: "👤 @nft_degen: What's trending in NFTs?", isUser: true },
                            { text: "🤖 NFT MARKET SCAN 🎨\n\nTop Collections (24h):\n1. Bored Apes: Floor ↑ 15%\n2. Azuki: Volume ↑ 89%\n3. Pudgy Penguins: Whale buying\n\nMint Opportunities:\n- Degen Toonz: WL spots available\n- Moonbirds: Reveal in 2 hours\n\nGas Wars Expected: Set 200 GWEI max", isUser: false }
                          ];
                          break;

                        default:
                          conversation = [
                            { text: "👤 @user: Show me what you can do", isUser: true },
                            { text: "🤖 Ready to assist with trading analysis, market monitoring, and automated strategies. Type your request or check the documentation for commands!", isUser: false }
                          ];
                      }
                      
                      // Update messages immediately
                      setDemoMessages(conversation.map(msg => ({
                        id: generateUniqueId(),
                        text: msg.text,
                        timestamp: Date.now(),
                        isUser: msg.isUser
                      })));
                    }}
                    className={`px-4 py-2 text-xs transition-colors ${
                      currentAgentType === type
                        ? 'bg-[#00ff00] text-black'
                        : 'border border-[#00ff00]/50 text-[#00ff00] hover:border-[#00ff00] hover:bg-[#00ff00]/10'
                    }`}
                  >
                    {label}
                </button>
                ))}
            </div>

                <div className="bg-black p-4">
                {/* Terminal Header */}
                  <div className="flex items-center gap-2 mb-4 border-b border-[#00ff00]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00ff00]/50"></div>
                    <div className="text-xs">{getAgentTitle(currentAgentType)}</div>
                  </div>
                </div>

                {/* Messages Container - Adjust height to accommodate input */}
                <div className="font-mono text-sm space-y-2 h-80 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-[#00ff00] scrollbar-track-transparent">
                  {isGenerating && demoMessages.length === 0 ? (
                    <div className="animate-pulse">Initializing random agent...</div>
                  ) : (
                    demoMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${msg.isThinking ? 'animate-pulse' : 'opacity-0 animate-fade-in'} ${
                          msg.isUser ? 'text-blue-400' : 'text-[#00ff00]'
                        }`}
                        style={{ animationDelay: msg.isThinking ? '0ms' : '1000ms' }}
                      >
                        {msg.text}
                      </div>
                    ))
                  )}
                </div>

                {/* Always visible input area */}
                <div className="border-t border-[#00ff00]/20 pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userInput.message}
                      onChange={(e) => setUserInput(prev => ({ ...prev, message: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleUserMessage(userInput.message)}
                      placeholder={getPlaceholder(currentAgentType)}
                      className="flex-1 bg-black border border-[#00ff00] text-[#00ff00] px-2 py-1 text-sm focus:outline-none focus:border-white placeholder-[#00ff00]/30"
                      disabled={isGenerating}
                    />
                    <button
                      onClick={() => handleUserMessage(userInput.message)}
                      className="text-xs border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00] hover:text-black transition-all"
                      disabled={!userInput.message.trim() || isGenerating}
                    >
                      SEND
                    </button>
                  </div>
                    </div>

                {/* Disclaimer */}
                <div className="text-xs text-[#00ff00]/50 pt-2 mt-2 italic">
                  Note: This is a demo environment. Some responses and data may be simulated for demonstration purposes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Features Section */}
      <section id="features" className="relative py-6 z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-2xl md:text-3xl mb-4">
            FEATURES <span className="animate-pulse">|</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="border border-[#00ff00] bg-black/50 p-6 hover:bg-black/80 transition-all">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl mb-4">{feature.title}</h3>
                <p className="text-sm text-[#00ff00]/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Use Cases Section */}
      <section className="relative py-12 z-10 bg-black/30">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-2xl md:text-3xl mb-8">
            USE CASES <span className="animate-pulse">|</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="border border-[#00ff00] p-6 bg-black/50">
              <h3 className="text-xl mb-4">Trading Bot</h3>
              <ul className="text-sm text-[#00ff00]/70 space-y-2">
                <li>• Market Analysis</li>
                <li>• Auto Trading</li>
                <li>• Risk Management</li>
                <li>• Portfolio Tracking</li>
              </ul>
                    </div>
            
            <div className="border border-[#00ff00] p-6 bg-black/50">
              <h3 className="text-xl mb-4">Community Bot</h3>
              <ul className="text-sm text-[#00ff00]/70 space-y-2">
                <li>• Moderation</li>
                <li>• User Support</li>
                <li>• Event Notifications</li>
                <li>• Role Management</li>
              </ul>
                </div>
            
            <div className="border border-[#00ff00] p-6 bg-black/50">
              <h3 className="text-xl mb-4">Research Bot</h3>
              <ul className="text-sm text-[#00ff00]/70 space-y-2">
                <li>• Data Analysis</li>
                <li>• Market Research</li>
                <li>• Trend Detection</li>
                <li>• Report Generation</li>
              </ul>
              </div>

            <div className="border border-[#00ff00] p-6 bg-black/50">
              <h3 className="text-xl mb-4">Alert Bot</h3>
              <ul className="text-sm text-[#00ff00]/70 space-y-2">
                <li>• Price Alerts</li>
                <li>• Whale Tracking</li>
                <li>• News Monitoring</li>
                <li>• Custom Triggers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Stats Section */}
      <section className="relative py-12 z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-2xl md:text-3xl mb-8">
            PLATFORM STATS <span className="animate-pulse">|</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#00ff00]">24/7</div>
              <div className="text-sm text-[#00ff00]/70">Uptime</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#00ff00]">50ms</div>
              <div className="text-sm text-[#00ff00]/70">Response Time</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#00ff00]">100+</div>
              <div className="text-sm text-[#00ff00]/70">Integrations</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#00ff00]">1M+</div>
              <div className="text-sm text-[#00ff00]/70">Daily Requests</div>
            </div>
          </div>

          <div className="text-center text-xs text-[#00ff00]/50 mt-4 italic">
            * DEPENDING ON APIs CONFIGURED
          </div>
        </div>
      </section>

      <Separator />

      {/* CTA Section */}
      <section className="relative py-6 z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl mb-8">
            READY TO START? <span className="animate-pulse">|</span>
          </h2>
          <div className="flex justify-center gap-6">
            <Link 
              href="/create" 
              className="px-12 py-4 bg-[#00ff00] text-black text-lg hover:bg-[#00ff00]/80 transition-colors"
            >
              LAUNCH AGENT CREATOR
            </Link>
            <Link 
              href="/app" 
              className="px-12 py-4 border border-[#00ff00] text-[#00ff00] text-lg hover:bg-[#00ff00] hover:text-black transition-colors"
            >
              VIEW AGENTS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
