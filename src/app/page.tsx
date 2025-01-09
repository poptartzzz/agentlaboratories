"use client";

import { useState, useEffect } from "react";
import { Press_Start_2P } from 'next/font/google';
import Link from 'next/link';
import Header from '@/components/Header';
import Separator from '@/components/Separator';
import TypeWriter from '@/components/TypeWriter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { 
  faRobot, 
  faPlug, 
  faGears, 
  faCode, 
  faLock, 
  faMessage,
  faArrowsRotate,
  faChartLine,
  faCrosshairs,
  faCoins,
  faRocket,
  faGem,
  faPersonRunning,
  faGamepad,
  faCrown,
  faMoon,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { generateAgentResponse } from '@/utils/claude';

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

interface DemoInput {
  isOpen: boolean;
  message: string;
}

interface IconTextProps {
  icon: IconDefinition;
  text: string;
}

const generateUniqueId = (() => {
  let id = 0;
  return () => `msg_${Date.now()}_${++id}`;
})();

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

const IconText = ({ icon, text }: IconTextProps) => (
  <div className="flex items-center gap-2">
    <FontAwesomeIcon icon={icon} className="text-[#00ff00] w-4 h-4" />
    <span>{text}</span>
  </div>
);

const getInitialDemoMessage = (type: AgentType): DemoMessage[] => {
  switch (type) {
    case 'trading':
      return [
        { 
          id: generateUniqueId(),
          text: "👤 @trader: Can you analyze BTC's current market structure?", 
          timestamp: Date.now() - 12000,
          isUser: true 
        },
        { 
          id: generateUniqueId(),
          text: `🤖 TRADING ANALYSIS 📊\n\nBTC Price: $98,472.88\n\nMarket Structure:\n- Strong support: $96,500 (200MA)\n- Key resistance: $99,000 (Previous ATH)\n- Volume: 45% above 20D average\n\nSignals:\n- RSI: 62 (Neutral with bullish divergence)\n- MACD: Golden cross forming\n- OBV: Smart money accumulation\n\nRecommendation: Look for entries near $96.5k support. Strong institutional buying detected.`, 
          timestamp: Date.now() - 11000,
          isUser: false 
        },
        {
          id: generateUniqueId(),
          text: "👤 @trader: What's your take on ETH/BTC ratio for swing trading?",
          timestamp: Date.now() - 10000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 TRADING ANALYSIS 📊\n\nETH/BTC Ratio: 0.037\n\nTechnical Setup:\n- Breaking 6-month resistance\n- Volume profile showing accumulation\n- Funding rates neutral\n\nKey Levels:\n- Support: 0.035 BTC\n- Target: 0.04 BTC\n- Stop: 0.033 BTC\n\nStrategy: Long with 3:1 risk/reward ratio`,
          timestamp: Date.now() - 9000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @trader: Any concerning signals in derivatives market?",
          timestamp: Date.now() - 8000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 TRADING ANALYSIS 📊\n\nDerivatives Health:\n- Open Interest: $8.2B (High)\n- Funding Rate: 0.01% (Neutral)\n- Long/Short Ratio: 1.2 (Balanced)\n\nRisk Factors:\n- Large OI could trigger cascade\n- $250M options expiry Friday\n- Whale puts at $92k\n\nRecommendation: Tight stops essential`,
          timestamp: Date.now() - 7000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @trader: Give me a complete setup for SOL",
          timestamp: Date.now() - 6000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 TRADING ANALYSIS 📊\n\nSOL Complete Setup:\nPrice: $213.71 (+0.4% 24h)\n\nEntry Zones:\n- Strong: $205-208 (0.618 fib)\n- Aggressive: $213-215 (breakout)\n\nTargets:\n1. $225 (1.618 ext)\n2. $240 (ATH retest)\n\nStop Loss: $198 (Daily support)\nPosition Size: Max 2% account\nLeverage: Max 3x`,
          timestamp: Date.now() - 5000,
          isUser: false
        }
      ];

    case 'security':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @auditor: What's your audit process?",
          timestamp: Date.now() - 3000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 SECURITY AUDIT BOT 🔍\n\nAudit Protocol:\n1. Static Analysis\n- Solidity patterns\n- Gas optimization\n- Code quality\n\n2. Dynamic Testing\n- Fuzzing\n- Symbolic execution\n- Invariant testing\n\n3. Manual Review\n- Logic verification\n- Access controls\n- Economic risks",
          timestamp: Date.now() - 2000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @auditor: Common vulnerabilities?",
          timestamp: Date.now() - 1000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 TOP VULNERABILITIES 🚨\n\n1. Access Control\n- Unprotected admin functions\n- Missing timelock\n- Weak validation\n\n2. Economic\n- Flash loan attacks\n- Price manipulation\n- MEV exposure\n\n3. Technical\n- Reentrancy\n- Integer overflow\n- Front-running\n\nAlways verify implementations!",
          timestamp: Date.now(),
          isUser: false
        }
      ];

    case 'whale':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @whale_watcher: What patterns do you track?",
          timestamp: Date.now() - 3000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 WHALE TRACKING METRICS 🐋\n\nKey Indicators:\n- Wallet age & history\n- Transaction patterns\n- Exchange flows\n- Staking behavior\n\nAlert Triggers:\n- Large transfers\n- Unusual patterns\n- Smart money moves\n- Accumulation/Distribution",
          timestamp: Date.now() - 2000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @whale_watcher: How do you classify whales?",
          timestamp: Date.now() - 1000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 WHALE CLASSIFICATION 🎯\n\nCategories:\n1. Institution Wallets\n- Known entities\n- Regular patterns\n- Multiple signatures\n\n2. Smart Money\n- Early adopters\n- Strategic timing\n- Complex strategies\n\n3. Miners/Validators\n- Regular rewards\n- Predictable moves\n\n4. Degen Whales\n- High risk plays\n- Quick movements\n- Leverage users",
          timestamp: Date.now(),
          isUser: false
        }
      ];

      case 'elon_tweet':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @degen_trader: What's your current strategy?",
          timestamp: Date.now() - 3000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 ELON TRACKER STATUS 🚀\n\nActive Triggers:\n- Rocket emojis 🚀\n- 'To the moon' phrases\n- Dog-related memes 🐕\n- Mars references 🌠\n\nCounter-Indicators:\n- FUD posts\n- SEC mentions\n- Board meeting tweets\n\nCurrent Mode: Maximum Degen 💎\nMeme Sensitivity: Over 9000",
          timestamp: Date.now() - 2000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @degen_trader: Show recent triggers",
          timestamp: Date.now() - 1000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 RECENT ACTIVITY LOG 📱\n\nLast Triggers:\n- '69.420' tweet: Ultra Bullish\n- Space X rocket gif: Potential Signal\n- 'Who let the Doge out': Alert Level High\n\nBot Actions:\n- Monitoring reply sentiment\n- Tracking meme velocity\n- Calculating viral potential\n\nStatus: Awaiting next tweet storm 🌪️",
          timestamp: Date.now(),
          isUser: false
        }
      ];

      case 'influencer_trader':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @user: Show me your shill detection",
          timestamp: Date.now() - 3000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 SHILL DETECTOR ACTIVATED 🎯\n\nAnalyzing Patterns:\n- Coordinated pumps\n- Paid promotions\n- Bot amplification\n- Engagement farming\n\nRed Flags:\n- 'Not financial advice' spam\n- Price target shilling\n- Fake urgency creation\n- Orchestrated FOMO",
          timestamp: Date.now() - 2000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @user: Any active campaigns?",
          timestamp: Date.now() - 1000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 ACTIVE SHILL CAMPAIGNS 🚨\n\nDetected Activities:\n- 5 influencers pushing same token\n- Suspicious follower growth\n- Recycled pump narratives\n- Paid group coordination\n\nTrust Score: -9000\nShill Level: Maximum\nRugpull Risk: High\n\nRecommendation: Avoid FOMO 🎯",
          timestamp: Date.now(),
          isUser: false
        }
      ];

    case 'shitcoin_hunter':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @degen: What's your scanning criteria?",
          timestamp: Date.now() - 3000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 DEGEN SCANNER PARAMETERS 🔍\n\nToken Criteria:\n- Sub 1M market cap\n- < 100 holders\n- Unrugged\n- Fresh contracts\n\nDegen Metrics:\n- Meme potential\n- Viral coefficient\n- Degenerate appeal\n- Moonshot factor\n\nRisk Level: MAXIMUM DEGEN 🎲",
          timestamp: Date.now() - 2000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @degen: Show me your safety checks",
          timestamp: Date.now() - 1000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 SAFETY PROTOCOLS 🛡️\n\nContract Checks:\n- Honeypot testing\n- Rugpull protection\n- Liquidity analysis\n- Ownership status\n\nRed Flags:\n- Copy/paste code\n- Hidden mint functions\n- Locked liquidity\n- Dev wallet size\n\nMotto: Still probably gonna ape tho 🦍",
          timestamp: Date.now(),
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: `🤖 DEGEN SCAN 🔍\n\nHot Memes:\n- $WOJAK: 1 hour old\n- LP: $50k locked\n- Holders: 85\n- Meme: Viral potential\n\nDegen Score: 8/10\nRisk Level: MAXIMUM`,
          timestamp: Date.now() - 9000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @degen: Contract check?",
          timestamp: Date.now() - 8000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 DEGEN SCAN 🔍\n\nContract Analysis:\n- Ownership: Renounced\n- Max TX: 1%\n- Tax: 5/5\n- Mint: None\n\nBased Rating: SAFU`,
          timestamp: Date.now() - 7000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @degen: Community check?",
          timestamp: Date.now() - 6000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 DEGEN SCAN 🔍\n\nVibe Check:\n- TG Members: 850\n- Twitter: Growing\n- Meme Game: Strong\n- Team: Anon but based\n\nDegen Score: 9/10\nAPE POTENTIAL: MAXIMUM`,
          timestamp: Date.now() - 5000,
          isUser: false
        }
      ];

    case 'defi':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @yield_farmer: Best ETH yields?",
          timestamp: Date.now() - 12000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 DEFI ANALYZER 📈\n\nTop ETH Yields:\n- Lido: 3.8% APR\n- Rocket Pool: 4.1% APR\n- Frax: 4.5% APR\n\nRisks: Protocol-based\nGas Cost: ~$15\nLiquidity: Deep`,
          timestamp: Date.now() - 11000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @yield_farmer: LP opportunities?",
          timestamp: Date.now() - 10000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 DEFI ANALYZER 📈\n\nBest LP Pairs:\n- ETH/USDC: 25% APR\n- BTC/ETH: 18% APR\n- ARB/ETH: 45% APR\n\nIL Risk: Medium\nFarm Rewards: Active\nTVL: Growing`,
          timestamp: Date.now() - 9000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @yield_farmer: New protocols?",
          timestamp: Date.now() - 8000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 DEFI ANALYZER 📈\n\nEmerging Protocols:\n- Protocol A: 120% APR (High risk)\n- Protocol B: 80% APR (Audited)\n- Protocol C: 60% APR (Based team)\n\nDYOR Required!`,
          timestamp: Date.now() - 7000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @yield_farmer: Risk assessment?",
          timestamp: Date.now() - 6000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 DEFI ANALYZER 📈\n\nRisk Levels:\n- Smart Contract: Medium\n- IL Risk: High\n- Depeg Risk: Low\n\nRecommendation:\n- Diversify positions\n- Use tested protocols\n- Monitor IL`,
          timestamp: Date.now() - 5000,
          isUser: false
        }
      ];

    case 'nft':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @user: Hot collections?",
          timestamp: Date.now() - 12000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 NFT SCANNER 🎨\n\nTrending:\n1. Collection A\n- Floor: 0.8 ETH\n- Volume: +125%\n- Unique Buyers: 145\n\n2. Collection B\n- Floor: 0.5 ETH\n- Volume: +80%\n- Listings: Decreasing`,
          timestamp: Date.now() - 11000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @user: Rare trait analysis?",
          timestamp: Date.now() - 10000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 NFT SCANNER 🎨\n\nRarity Check:\n- Legendary: 0.1%\n- Epic: 1%\n- Rare: 5%\n\nTop Traits:\n- Golden: 15 ETH floor\n- Mystic: 8 ETH floor\n- Crystal: 5 ETH floor`,
          timestamp: Date.now() - 9000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @user: Whale activity?",
          timestamp: Date.now() - 8000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 NFT SCANNER 🎨\n\nWhale Moves:\n- 5 ETH floor sweep\n- Rare trait accumulation\n- New wallet buying\n\nBullish Signals:\n- Influencer mints\n- Staking coming\n- Roadmap ahead`,
          timestamp: Date.now() - 7000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @user: Upcoming mints?",
          timestamp: Date.now() - 6000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 NFT SCANNER 🎨\n\nHot Mints:\n1. Project X\n- WL: Open\n- Price: 0.5 ETH\n- Team: Doxxed\n\n2. Project Y\n- Allowlist: Active\n- Price: 0.3 ETH\n- Utility: Gaming`,
          timestamp: Date.now() - 5000,
          isUser: false
        }
      ];

    default:
      return [];
  }
};

// Update the animation to remove outline and only handle flashing
const flashAnimation = `
  @keyframes flash {
    0%, 95%, 98%, 100% {
      opacity: 1;
    }
    96%, 99% {
      opacity: 0.5;
    }
  }

  .flash {
    animation: flash 10s infinite;
  }

  /* Random flash delays */
  .flash-1 { animation-delay: 1s; }
  .flash-2 { animation-delay: 4s; }
  .flash-3 { animation-delay: 7s; }
  .flash-4 { animation-delay: 10s; }
`;

export default function Home() {
  const [demoMessages, setDemoMessages] = useState<DemoMessage[]>([]);
  const [currentAgentType, setCurrentAgentType] = useState<AgentType>('trading');
  const [userInput, setUserInput] = useState<DemoInput>({
    isOpen: false,
    message: ''
  });

  useEffect(() => {
    // Get initial messages for the current agent type
    const messages = getInitialDemoMessage(currentAgentType);
    
    // Reset messages
    setDemoMessages([]);
    
    // If we have messages, start adding them
    if (messages.length > 0) {
      // Add first message pair immediately
      setDemoMessages([messages[0], messages[1]].filter(Boolean));
      
      // Add remaining messages with delay
      let messageIndex = 2;
      
      const interval = setInterval(() => {
        if (messageIndex < messages.length) {
          setDemoMessages(prev => [
            ...prev,
            messages[messageIndex],
            messages[messageIndex + 1]
          ].filter(Boolean));
          
          messageIndex += 2;
        } else {
          clearInterval(interval);
        }
      }, 3000);

      // Cleanup
      return () => {
        clearInterval(interval);
      };
    }
  }, [currentAgentType]);

  const handleAgentTypeChange = (type: AgentType) => {
    setCurrentAgentType(type);
    setDemoMessages(getInitialDemoMessage(type));
  };

  const handleUserMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    setDemoMessages(prev => [...prev, {
      id: generateUniqueId(),
      text: `👤 @user: ${message}`,
      timestamp: Date.now(),
      isUser: true
    }]);

    // Add thinking message
    const thinkingId = generateUniqueId();
    setDemoMessages(prev => [...prev, {
      id: thinkingId,
      text: "🤖 Analyzing...",
      timestamp: Date.now(),
      isUser: false,
      isThinking: true
    }]);

    try {
      let context = "";
      
      switch(currentAgentType) {
        case 'trading':
          context = `You are a crypto trading analysis bot. Use these current prices:
BTC: $98,472.88 (24h: +0.2%)
ETH: $3,644.52 (24h: +0.2%)
SOL: $213.71 (24h: +0.4%)
BNB: $707.95 (24h: +0.3%)

Current conversation:
${demoMessages.map(msg => msg.text).join('\n')}

User question: ${message}

Respond in this format:
🤖 TRADING ANALYSIS 📊

Market Structure:
- Support/Resistance levels
- Volume analysis
- Key patterns

Technical Signals:
- RSI, MACD, etc
- Volume indicators
- Pattern formations

Use real current prices and realistic technical analysis. Always start with 🤖.`;
          break;

        case 'whale':
          context = `You are a whale wallet tracking bot. Use these current prices:
BTC: $98,472.88
ETH: $3,644.52
SOL: $213.71

Current conversation:
${demoMessages.map(msg => msg.text).join('\n')}

User question: ${message}

Respond in this format:
🤖 WHALE ALERT 🐋

Recent Movement:
- Wallet: (use realistic addresses)
- Size: (use realistic amounts based on current prices)
- Direction: (accumulating/distributing)
- Chain: ETH/BSC/SOL

Impact Analysis:
- Market effect
- Wallet history
- Pattern recognition

Use current prices for realistic transaction values. Always start with 🤖.`;
          break;

        case 'defi':
          context = `You are a DeFi yield analysis bot. Use these current prices:
ETH: $3,644.52
AAVE: $341.45
UNI: $15.23
Current TVL data and yields.

Current conversation:
${demoMessages.map(msg => msg.text).join('\n')}
      
      User question: ${message}
      
Respond in this format:
🤖 DEFI ANALYZER 📈

Top Opportunities:
- Protocol names
- Real APY/APR
- TVL data
- Risk levels

Strategy Analysis:
- IL calculations
- Gas considerations
- Protocol risks

Use current prices and realistic yield data. Always start with 🤖.`;
          break;

        case 'shitcoin_hunter':
          context = `You are a degen token scanner. Reference these meme coins:
PEPE: $0.00002068 (+15.4% 7d)
BONK: $0.00003439 (+10.4% 7d)
FLOKI: $0.000197 (+14.0% 7d)

Current conversation:
${demoMessages.map(msg => msg.text).join('\n')}

User question: ${message}

Respond in this format:
🤖 DEGEN SCANNER 🔍

Token Analysis:
- Contract safety
- Liquidity analysis
- Holder distribution
- Meme potential

Risk Assessment:
- Rugpull likelihood
- Team transparency
- Market sentiment

Use current prices and real token data. Always start with 🤖.`;
          break;

        // Add similar specialized contexts for other bot types...

        default:
          context = `You are a specialized crypto analysis bot. Answer questions about market analysis and trading insights.`;
      }

      const response = await generateAgentResponse(context);

      // Remove thinking message and add response
      setDemoMessages(prev => 
        prev.filter(msg => msg.id !== thinkingId).concat({
          id: generateUniqueId(),
          text: response,
          timestamp: Date.now(),
          isUser: false
        })
      );

    } catch (error) {
      console.error('Error:', error);
      setDemoMessages(prev => 
        prev.filter(msg => msg.id !== thinkingId).concat({
        id: generateUniqueId(),
          text: "🤖 Error processing request. Please try again.",
        timestamp: Date.now(),
        isUser: false
        })
      );
    }

    // Clear input
    setUserInput({ isOpen: false, message: '' });
  };

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
      <style jsx>{flashAnimation}</style>
      <Header />
      
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)]"></div>
      </div>

      <section className="relative h-screen flex items-center z-10">
        <div className="absolute inset-0 z-0">
          <iframe 
            src='https://my.spline.design/robots-4b5f71aa4e68f8aff9ac3be5fa98097b/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            title="3D Robot Animation"
            className="absolute inset-0"
          />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="space-y-8 backdrop-blur-md bg-black/30 p-8 rounded-lg border border-[#00ff00]/20">
            <div className="inline-block px-4 py-2 border border-[#00ff00] bg-black/50 hover:bg-[#00ff00]/10 transition-all">
              <a 
                href="https://app.uniswap.org/#/swap?outputCurrency=" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff00] text-xs hover:text-white transition-colors"
              >
                SXA - 0x61bAFCF2BdA2F870F2c29157E729F30058cF5314
              </a>
            </div>
            <h1 className="text-5xl md:text-7xl leading-relaxed">
              <span className="flash flash-1">NEXT</span>
              <span className="flash flash-2">-</span>
              <span className="flash flash-3">GEN</span>
              <span className="block mt-2 text-[#00ff00] flash flash-4">
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
            <div className="flex justify-center gap-6">
              <Link 
                href="/create" 
                className="px-8 py-3 bg-[#00ff00] text-black text-sm hover:bg-[#00ff00]/80 transition-colors"
              >
                BAKE SIDEKIX
              </Link>
              <Link 
                href="/app" 
                className="px-8 py-3 border border-[#00ff00] text-[#00ff00] text-sm hover:bg-[#00ff00] hover:text-black transition-colors"
              >
                LIVE SIDEKIX
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section className="relative py-12 z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-2xl md:text-3xl mb-12">
            INTERACTIVE EXAMPLES <span className="animate-pulse">|</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="p-1 border border-[#00ff00]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
                {agentTypes.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => handleAgentTypeChange(type)}
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
                  <div className="flex items-center gap-2 mb-4 border-b border-[#00ff00]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00ff00]/50"></div>
                    <div className="text-xs">{getAgentTitle(currentAgentType)}</div>
                  </div>
                </div>

                <div className="font-mono text-sm space-y-2 h-80 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-[#00ff00] scrollbar-track-transparent">
                  {demoMessages.length === 0 ? (
                    <div className="animate-pulse">Initializing agent...</div>
                  ) : (
                    demoMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${msg.isUser ? 'text-blue-400' : 'text-[#00ff00]'} text-sm`}
                      >
                        {msg.text}
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-[#00ff00]/20 pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userInput.message}
                      onChange={(e) => setUserInput(prev => ({ ...prev, message: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleUserMessage(userInput.message)}
                      placeholder={getPlaceholder(currentAgentType)}
                      className="flex-1 bg-black border border-[#00ff00] text-[#00ff00] px-2 py-1 text-sm focus:outline-none focus:border-white placeholder-[#00ff00]/30"
                    />
                    <button
                      onClick={() => handleUserMessage(userInput.message)}
                      className="text-xs border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00] hover:text-black transition-all"
                      disabled={!userInput.message.trim()}
                    >
                      SEND
                    </button>
                  </div>
                    </div>

                <div className="text-xs text-[#00ff00]/50 pt-2 mt-2 italic">
                  This is a demo environment meant to showcase examples of different types of bots that can be built. Prices may be outdated.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

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
              BAKE SIDEKIX
            </Link>
            <Link 
              href="/app" 
              className="px-12 py-4 border border-[#00ff00] text-[#00ff00] text-lg hover:bg-[#00ff00] hover:text-black transition-colors"
            >
              LIVE SIDEKIX
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
