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
import Image from 'next/image';

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
      return 'correlation_tracker.bot';
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
      return 'Track pump.fun tokens with high volume and buy on dip...';
    case 'moderator':
      return 'Ask about community guidelines or try posting a message...';
    case 'researcher':
      return 'Ask about market research, on-chain metrics, or project analysis...';
    case 'arbitrage':
      return 'Ask about cross-exchange opportunities or price differences...';
    case 'sentiment':
      return 'Ask about market sentiment, social metrics, or trend analysis...';
    case 'nft':
      return 'Track pump.fun token correlations and momentum strategies...';
    case 'defi':
      return 'Ask about SOL yield farming and pump.fun profit strategies...';
    case 'whale':
      return 'Track pump.fun whale movements and large transactions...';
    case 'governance':
      return 'Ask about DAO proposals, voting analysis, or governance metrics...';
    case 'mempool':
      return 'Ask about pending transactions, MEV opportunities, or gas optimization...';
    case 'bridge':
      return 'Ask about cross-chain bridges, transfer routes, or liquidity analysis...';
    case 'security':
      return 'Scan pump.fun tokens for security issues and rugpull indicators...';
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
          text: "👤 @trader: Track pump.fun tokens with high volume and buy on dip", 
          timestamp: Date.now() - 12000,
          isUser: true 
        },
        { 
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN TRADER 📊\n\nScanning pump.fun for high volume tokens...\n\nFound: $PEPE2.0\n- Volume: $2.4M (24h)\n- Market Cap: $850K\n- Holders: 1,247\n- Price: $0.000012\n\nEntry Strategy:\n- Wait for 15-20% dip\n- Buy at $0.0000096\n- Target: 50% gain ($0.0000144)\n- Stop: $0.000008\n\nVolume Trend: Increasing 📈`, 
          timestamp: Date.now() - 11000,
          isUser: false 
        },
        {
          id: generateUniqueId(),
          text: "👤 @trader: Show me more pump.fun opportunities",
          timestamp: Date.now() - 10000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN SCANNER 📊\n\nHot Tokens Detected:\n\n1. $WOJAK3\n- Volume: $1.8M\n- MC: $650K\n- Entry: Wait for pullback\n- Target: 2x\n\n2. $DOGE2\n- Volume: $3.2M\n- MC: $1.2M\n- Entry: $0.000045\n- Target: 3x\n\n3. $SHIB3\n- Volume: $950K\n- MC: $420K\n- Entry: $0.0000012\n- Target: 5x\n\nAll showing strong volume patterns!`,
          timestamp: Date.now() - 9000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @trader: Auto-sell strategy for pump.fun tokens?",
          timestamp: Date.now() - 8000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 AUTO-SELL PROTOCOL 🎯\n\nPump.fun Auto-Sell Setup:\n\nTrigger Conditions:\n- 50% gain: Sell 25%\n- 100% gain: Sell 50%\n- 200% gain: Sell remaining\n- 10% loss: Emergency stop\n\nSmart Features:\n- Volume spike detection\n- Liquidity monitoring\n- Rugpull protection\n- Gas optimization\n\nStatus: Monitoring 3 positions`,
          timestamp: Date.now() - 7000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @trader: Best time to enter pump.fun tokens?",
          timestamp: Date.now() - 6000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN TIMING 📊\n\nOptimal Entry Strategy:\n\n1. Early Stage (0-1M MC)\n- High risk, high reward\n- Entry: First 2 hours\n- Target: 10-50x\n\n2. Growth Stage (1-5M MC)\n- Moderate risk\n- Entry: Volume spikes\n- Target: 2-10x\n\n3. Mature Stage (5M+ MC)\n- Lower risk\n- Entry: Dips only\n- Target: 1.5-3x\n\nBest Times: 2-6 AM UTC`,
          timestamp: Date.now() - 5000,
          isUser: false
        }
      ];

    case 'security':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @auditor: Scan this pump.fun token for security issues",
          timestamp: Date.now() - 3000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 PUMP.FUN SECURITY SCANNER 🔍\n\nScanning: $PEPE2.0\n\nContract Analysis:\n✅ Ownership: Renounced\n✅ Mint Function: Disabled\n✅ Liquidity: Locked\n✅ Tax: 0/0\n\nSecurity Score: 9/10\nStatus: SAFU ✅",
          timestamp: Date.now() - 2000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @auditor: Check for rugpull indicators",
          timestamp: Date.now() - 1000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 RUGPULL DETECTOR 🚨\n\nRed Flags Check:\n❌ Dev wallet: 0% (Good)\n❌ Large holder: 2.1% (Safe)\n❌ Liquidity: $45K locked (Good)\n❌ Contract: Verified (Safe)\n\nGreen Flags:\n✅ Community active\n✅ Volume consistent\n✅ No suspicious transfers\n\nRisk Level: LOW 🟢",
          timestamp: Date.now(),
          isUser: false
        }
      ];

    case 'whale':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @whale_watcher: Track pump.fun whale movements",
          timestamp: Date.now() - 3000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 PUMP.FUN WHALE TRACKER 🐋\n\nMonitoring: $PEPE2.0\n\nWhale Activity:\n- 0x1234...5678: Bought 2.1M tokens\n- 0xabcd...efgh: Sold 1.8M tokens\n- 0x9876...5432: Holding 5.2M tokens\n\nPattern Analysis:\n- Accumulation phase detected\n- Smart money entering\n- Volume increasing 340%",
          timestamp: Date.now() - 2000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @whale_watcher: Show me the biggest pump.fun whales",
          timestamp: Date.now() - 1000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 PUMP.FUN WHALE LEADERBOARD 🎯\n\nTop Holders:\n\n1. 0x9876...5432: 5.2M tokens (12.4%)\n   - Entry: $0.000008\n   - PnL: +156%\n\n2. 0x1111...2222: 3.8M tokens (9.1%)\n   - Entry: $0.000009\n   - PnL: +89%\n\n3. 0x3333...4444: 2.9M tokens (6.9%)\n   - Entry: $0.000010\n   - PnL: +67%\n\nSmart Money Alert: All early entries!",
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
          text: "👤 @degen: Scan pump.fun for fresh degens",
          timestamp: Date.now() - 3000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 PUMP.FUN DEGEN SCANNER 🔍\n\nScanning Criteria:\n- < 1M market cap\n- < 500 holders\n- Fresh launch (< 24h)\n- High volume potential\n\nDegen Metrics:\n- Meme virality score\n- Community hype\n- Pump potential\n- Rugpull resistance\n\nRisk Level: MAXIMUM DEGEN 🎲",
          timestamp: Date.now() - 2000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @degen: Show me the hottest pump.fun tokens",
          timestamp: Date.now() - 1000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: "🤖 PUMP.FUN HOT LIST 🔥\n\nFresh Degens:\n\n1. $WOJAK3\n- Age: 2 hours\n- MC: $180K\n- Holders: 127\n- Volume: $45K\n- Degen Score: 9/10\n\n2. $DOGE2\n- Age: 4 hours\n- MC: $320K\n- Holders: 89\n- Volume: $78K\n- Degen Score: 8/10\n\n3. $SHIB3\n- Age: 1 hour\n- MC: $95K\n- Holders: 67\n- Volume: $23K\n- Degen Score: 10/10\n\nAll showing early pump signals!",
          timestamp: Date.now(),
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @degen: Auto-buy strategy for pump.fun?",
          timestamp: Date.now() - 9000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 AUTO-BUY PROTOCOL 🎯\n\nPump.fun Auto-Buy Setup:\n\nTrigger Conditions:\n- Volume > $10K in 1h\n- Holders > 50\n- Price < $0.00001\n- No rugpull flags\n\nBuy Parameters:\n- Amount: 0.1 SOL\n- Slippage: 15%\n- Gas: High priority\n\nSafety Features:\n- Max 3 positions\n- Stop loss: -20%\n- Take profit: +100%`,
          timestamp: Date.now() - 8000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @degen: Sell my holdings when token goes live on pumpswap",
          timestamp: Date.now() - 7000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN AUTO-SELL 🚀\n\nMonitoring: $PEPE2.0\n\nCurrent Status:\n- Holdings: 2.1M tokens\n- Entry: $0.000008\n- Current: $0.000012 (+50%)\n- PnL: +$84\n\nAuto-Sell Triggers:\n✅ 50% gain: Sell 25% (DONE)\n⏳ 100% gain: Sell 50%\n⏳ Pumpswap listing: Sell all\n⏳ 200% gain: Sell remaining\n\nStatus: Monitoring for pumpswap listing...`,
          timestamp: Date.now() - 6000,
          isUser: false
        }
      ];

    case 'defi':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @yield_farmer: Best SOL yields for pump.fun profits?",
          timestamp: Date.now() - 12000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN DEFI STRATEGY 📈\n\nSOL Yield Farming:\n- Marinade: 7.2% APR\n- Jito: 8.1% APR\n- BlazeStake: 6.8% APR\n\nStrategy: Stake SOL → Earn yield → Use for pump.fun\nGas Cost: ~$0.01\nLiquidity: Deep`,
          timestamp: Date.now() - 11000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @yield_farmer: LP opportunities for pump.fun tokens?",
          timestamp: Date.now() - 10000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN LP ANALYZER 📈\n\nBest LP Pairs:\n- SOL/USDC: 45% APR\n- BONK/SOL: 120% APR\n- WIF/SOL: 85% APR\n\nPump.fun Strategy:\n- Provide liquidity after pump\n- Earn fees on volume\n- Compound rewards\n\nRisk: High volatility`,
          timestamp: Date.now() - 9000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @yield_farmer: Auto-compound pump.fun profits?",
          timestamp: Date.now() - 8000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN AUTO-COMPOUND 🚀\n\nProfit Recycling Strategy:\n\n1. Sell pump.fun tokens at 50% gain\n2. Auto-stake SOL rewards\n3. Compound daily\n4. Reinvest in new pumps\n\nExpected Returns:\n- Base yield: 7% APR\n- Pump profits: Variable\n- Compound effect: +2-3%\n\nTotal APY: 15-25%`,
          timestamp: Date.now() - 7000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @yield_farmer: Risk management for pump.fun DeFi?",
          timestamp: Date.now() - 6000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN RISK MANAGER 📈\n\nRisk Assessment:\n- Smart Contract: Medium\n- Pump Risk: Maximum\n- IL Risk: High\n- Rugpull Risk: Extreme\n\nSafety Protocol:\n- Max 10% in pumps\n- 90% in stable yields\n- Auto-stop losses\n- Diversified positions\n\nRecommendation: High risk, high reward!`,
          timestamp: Date.now() - 5000,
          isUser: false
        }
      ];

    case 'nft':
      return [
        {
          id: generateUniqueId(),
          text: "👤 @user: Track pump.fun token correlations with other tokens?",
          timestamp: Date.now() - 12000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN CORRELATION TRACKER 📊\n\nToken Correlations:\n1. $PEPE2.0\n- Correlation with $DOGE: 0.78\n- Volume: $2.4M\n- Price Movement: +45%\n\n2. $WOJAK3\n- Correlation with $SHIB: 0.65\n- Volume: $1.8M\n- Price Movement: +32%\n\n3. $BONK2\n- Correlation with $WIF: 0.82\n- Volume: $3.1M\n- Price Movement: +67%\n\nHigh correlation = Copy trade opportunities!`,
          timestamp: Date.now() - 11000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @user: Auto-copy successful pump.fun strategies?",
          timestamp: Date.now() - 10000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN COPY TRADER 📊\n\nCopy Trading Setup:\n\n1. Success Pattern Detection\n- Track winning wallets\n- Analyze entry/exit points\n- Identify profit patterns\n\n2. Auto-Copy Protocol\n- Mirror successful trades\n- Scale position sizes\n- Set stop losses\n\n3. Performance Tracking\n- Monitor copy success rate\n- Adjust strategy weights\n- Optimize timing\n\nCurrent Success Rate: 73%`,
          timestamp: Date.now() - 9000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @user: Monitor pump.fun token social sentiment?",
          timestamp: Date.now() - 8000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN SENTIMENT ANALYZER 📊\n\nMonitoring: $PEPE2.0\n\nSocial Sentiment:\n- Twitter: 78% Bullish\n- Telegram: 85% Bullish\n- Reddit: 72% Bullish\n- Discord: 91% Bullish\n\nSentiment Triggers:\n⏳ 90%+ Bullish: Buy signal\n⏳ 70%+ Bearish: Sell signal\n⏳ Viral mentions: Volume spike alert\n⏳ Influencer posts: Price impact warning\n\nStatus: Strong bullish sentiment detected!`,
          timestamp: Date.now() - 7000,
          isUser: false
        },
        {
          id: generateUniqueId(),
          text: "👤 @user: Best pump.fun tokens for momentum trading?",
          timestamp: Date.now() - 6000,
          isUser: true
        },
        {
          id: generateUniqueId(),
          text: `🤖 PUMP.FUN MOMENTUM SCANNER 📊\n\nHigh Momentum Tokens:\n\n1. $PEPE2.0\n- Momentum Score: 9.2/10\n- Volume Growth: +340%\n- Price: $0.000012\n- Target: $0.000018\n\n2. $WOJAK3\n- Momentum Score: 8.7/10\n- Volume Growth: +280%\n- Price: $0.000008\n- Target: $0.000012\n\n3. $SHIB3\n- Momentum Score: 8.9/10\n- Volume Growth: +420%\n- Price: $0.0000012\n- Target: $0.000002\n\nStrategy: Ride the momentum wave!`,
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
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // useEffect(() => {
  //   setShowDisclaimer(true);
  // }, []);

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
    { type: 'nft', label: 'CORRELATION TRACKER' }
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
      
      {/* Security Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowDisclaimer(false)} />
          <div className="relative bg-black border-2 border-[#00ff00] p-6 max-w-2xl w-full space-y-4">
            <h2 className="text-xl text-[#00ff00] mb-4">Important Security Notice</h2>
            
            <div className="space-y-4 text-sm">
              <p>
                We&apos;ve noticed some token scanners are showing &quot;$AGL&quot; as &quot;MULTI owner&quot; - we want to clarify this 
                is actually a false positive due to our enhanced security implementation.
              </p>
              
              <p>
                Our contract uses an advanced SecurityBase layer that includes standard ownership mechanisms - 
                a security best practice used by many successful projects. This sometimes gets flagged by scanners, 
                but it&apos;s actually a security feature, not a vulnerability.
              </p>
              
              <p>
                The contract implements:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Single owner architecture</li>
                  <li>Standard ownership transfer functions</li>
                  <li>Secure renounce capabilities</li>
                  <li>Full require() statement protection</li>
                </ul>
              </p>
              
              <p>
                You can verify these security features yourself by checking the contract:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>owner() function allows only one owner address</li>
                  <li>Ownership transfers require explicit approval</li>
                  <li>No backdoors or multi-owner capabilities exist</li>
                </ul>
              </p>
              
              <p className="text-[#00ff00]/80 italic">
                Note: As the contract is now renounced, these security implementations are permanent and cannot be modified.
              </p>
            </div>
            
            <button
              onClick={() => setShowDisclaimer(false)}
              className="mt-6 px-4 py-2 border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
      
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)]"></div>
      </div>

      <section className="relative h-screen flex items-center z-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe 
            src='https://my.spline.design/robots-4b5f71aa4e68f8aff9ac3be5fa98097b/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            title="3D Robot Animation"
            className="absolute inset-0"
            style={{ 
              clipPath: 'inset(0 0 80px 0)',
              marginBottom: '-80px'
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="space-y-6 sm:space-y-8 backdrop-blur-md bg-black/30 p-4 sm:p-6 md:p-8 rounded-lg border border-[#00ff00]/20">
            <div className="inline-block px-3 sm:px-4 py-2 border border-[#00ff00] bg-black/50 hover:bg-[#00ff00]/10 transition-all">
              <a 
                href="https://pump.fun/profile/labssol" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff00] text-xs hover:text-white transition-colors flex items-center gap-2"
              >
                <Image
                  src="/pill.png"
                  alt="BOTS"
                  width={16}
                  height={16}
                  className="rounded-full animate-pulse shadow-lg shadow-[#00ff00]/50 drop-shadow-[0_0_8px_#00ff00]"
                />
                LIVE ON PUMP FUN
              </a>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-tight sm:leading-relaxed">
              <span className="flash flash-1">NEXT</span>
              <span className="flash flash-2">-</span>
              <span className="flash flash-3">GEN</span>
              <span className="block mt-1 sm:mt-2 text-[#00ff00] flash flash-4">
                AI AGENTS
              </span>
              <span className="block mt-1 sm:mt-2 text-xs sm:text-sm md:text-xl">
                YOUR 24/7 CRYPTO COMPANION
              </span>
            </h1>
            <div className="text-xs sm:text-sm md:text-base">
              <TypeWriter 
                words={typewriterWords.map(({ icon, text }) => (
                  <IconText key={text} icon={icon} text={text} />
                ))}
                delay={3000}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6">
              <Link 
                href="/create" 
                className="px-6 sm:px-8 py-2 sm:py-3 bg-[#00ff00] text-black text-xs sm:text-sm hover:bg-[#00ff00]/80 transition-colors rounded"
              >
                BAKE AGENT
              </Link>
              <Link 
                href="/app" 
                className="px-6 sm:px-8 py-2 sm:py-3 border border-[#00ff00] text-[#00ff00] text-xs sm:text-sm hover:bg-[#00ff00] hover:text-black transition-colors rounded"
              >
                LIVE AGENTS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section className="relative py-8 sm:py-12 z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-12">
            INTERACTIVE EXAMPLES <span className="animate-pulse">|</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="p-1 border border-[#00ff00]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 mb-1">
                {agentTypes.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => handleAgentTypeChange(type)}
                    className={`px-2 sm:px-3 md:px-4 py-2 text-xs transition-colors ${
                      currentAgentType === type
                        ? 'bg-[#00ff00] text-black'
                        : 'border border-[#00ff00]/50 text-[#00ff00] hover:border-[#00ff00] hover:bg-[#00ff00]/10'
                    }`}
                  >
                    {label}
                </button>
                ))}
            </div>

                <div className="bg-black p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 border-b border-[#00ff00]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#00ff00]/50"></div>
                    <div className="text-xs">{getAgentTitle(currentAgentType)}</div>
                  </div>
                </div>

                <div className="font-mono text-xs sm:text-sm space-y-2 h-60 sm:h-80 overflow-y-auto mb-3 sm:mb-4 scrollbar-thin scrollbar-thumb-[#00ff00] scrollbar-track-transparent">
                  {demoMessages.length === 0 ? (
                    <div className="animate-pulse">Initializing agent...</div>
                  ) : (
                    demoMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${msg.isUser ? 'text-blue-400' : 'text-[#00ff00]'} text-xs sm:text-sm`}
                      >
                        {msg.text}
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-[#00ff00]/20 pt-3 sm:pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userInput.message}
                      onChange={(e) => setUserInput(prev => ({ ...prev, message: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleUserMessage(userInput.message)}
                      placeholder={getPlaceholder(currentAgentType)}
                      className="flex-1 bg-black border border-[#00ff00] text-[#00ff00] px-2 py-1 text-xs sm:text-sm focus:outline-none focus:border-white placeholder-[#00ff00]/30"
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
              <div className="text-4xl font-bold text-[#00ff00]">Beta</div>
              <div className="text-sm text-[#00ff00]/70">Status</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#00ff00]">1</div>
              <div className="text-sm text-[#00ff00]/70">Active Users</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#00ff00]">4</div>
              <div className="text-sm text-[#00ff00]/70">Pump.fun Agents</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#00ff00]">0</div>
              <div className="text-sm text-[#00ff00]/70">Live Trades</div>
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
              BAKE AGENT
            </Link>
            <Link 
              href="/app" 
              className="px-12 py-4 border border-[#00ff00] text-[#00ff00] text-lg hover:bg-[#00ff00] hover:text-black transition-colors"
            >
              LIVE AGENTS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
