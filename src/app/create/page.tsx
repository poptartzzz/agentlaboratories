"use client";

import { Press_Start_2P } from 'next/font/google';
import { useState, useEffect } from 'react';
import { generateAgentResponse } from '@/utils/claude';
import Header from '@/components/Header';
import Separator from '@/components/Separator';
import Image from 'next/image';
import { handleTokenPayment, calculateRequiredSXA } from '@/utils/tokenUtils';
import Link from 'next/link';

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
});

interface AgentConfig {
  name: string;
  botfatherApiKey: string;
  profileImage: string;
  type: string;
  platform: string;
  description: string;
  features: string[];
  commands: string[];
  triggers: string[];
  responseStyle: string;
  tradingPairs: string[];
  riskLevel: string;
  maxPositionSize: string;
  stopLossDefault: string;
  takeProfitDefault: string;
  tradingTimeframe: string;
  indicators: string[];
  notificationSettings: {
    telegram?: string;
    discord?: string;
    email?: string;
  };
  customResponses: {
    welcome: string;
    error: string;
    success: string;
  };
  apiKeys: string[];
  dataProviders: string[];
  permissions: string[];
  backupFrequency: string;
  maxDailyTrades: string;
  userAccessLevel: string;
  telegramApiKey: string;
  twitterApiKey: string;
  discordApiKey: string;
}

// Add this interface to organize config categories
interface ConfigCategory {
  title: string;
  fields: {
    key: keyof AgentConfig;
    label: string;
    type: 'text' | 'array' | 'object' | 'file';
    description: string;
    required?: boolean | ((key: string) => boolean);
    maxEntries?: number;
    accept?: string;
  }[];
}

// Add the flash animation
const flashAnimation = `
  @keyframes flash {
    0% { border-color: rgba(239, 68, 68, 0.2); }
    50% { border-color: rgba(239, 68, 68, 1); }
    100% { border-color: rgba(239, 68, 68, 0.2); }
  }

  .animate-flash {
    animation: flash 0.5s ease-in-out infinite;
  }
`;

// Add this CSS animation for the spinning circle
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .spin {
    animation: spin 2s linear infinite;
  }
`;

// Add this utility function to generate unique IDs
const generateUniqueId = (() => {
  let id = 0;
  return () => `msg_${Date.now()}_${++id}`;
})();

// Update the chat state interface to include id and timestamp
interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  isUser: boolean;
  isThinking?: boolean;
}

// Add these example suggestions
const botSuggestions = [
  {
    id: 'inverse-cramer',
    text: "Make me a bot that buys/sells the opposite of @jimcramer sentiment on Twitter",
  },
  {
    id: 'github-monitor',
    text: "Create a bot that monitors GitHub repositories for security vulnerabilities and sends alerts to Discord",
  },
  {
    id: 'content-curator',
    text: "Build a bot that curates and summarizes crypto news from multiple sources and posts daily reports to Telegram",
  }
];

// Move the type definition outside
type ConfigValue = string | string[] | Record<string, string | undefined>;

// Add this type for config updates
type ConfigUpdates = {
  [K in keyof AgentConfig]?: AgentConfig[K];
};

export default function CreateAgent() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      id: generateUniqueId(),
      text: "🤖 Hi! I'm your agent creation assistant. Tell me about the bot you want to create, and I'll help you set it up. What type of bot are you looking to build?",
      timestamp: Date.now(),
      isUser: false
    }
  ]);
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
    botfatherApiKey: '',
    profileImage: '',
    type: '',
    platform: '',
    description: '',
    features: [],
    commands: [],
    triggers: [],
    responseStyle: '',
    tradingPairs: [],
    riskLevel: '',
    maxPositionSize: '',
    stopLossDefault: '',
    takeProfitDefault: '',
    tradingTimeframe: '',
    indicators: [],
    notificationSettings: {
      telegram: '',
      discord: '',
      email: ''
    },
    customResponses: {
      welcome: '',
      error: '',
      success: ''
    },
    apiKeys: [],
    dataProviders: [],
    permissions: [],
    backupFrequency: '',
    maxDailyTrades: '',
    userAccessLevel: '',
    telegramApiKey: '',
    twitterApiKey: '',
    discordApiKey: ''
  });

  // Move handleFieldUpdate inside the component
  const handleFieldUpdate = (fieldKey: keyof AgentConfig, value: ConfigValue | File) => {
    setAgentConfig(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  // Add this state for managing expanded sections
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Basic Info']);

  // Add this to track dynamic requirements
  const [dynamicRequirements, setDynamicRequirements] = useState<string[]>([]);

  // Add this state to track which section should flash
  const [flashingSection, setFlashingSection] = useState<string | null>(null);

  // Add these to track AI-suggested requirements
  const [aiSuggestedRequirements] = useState<string[]>([]);

  // Move categoryHasRequired inside the component
  const categoryHasRequired = (category: ConfigCategory) => {
    return category.fields.some(field => {
      if (typeof field.required === 'function') {
        return field.required(field.key) || aiSuggestedRequirements.includes(field.key);
      }
      return field.required;
    });
  };

  // Add this configuration structure
  const configCategories: ConfigCategory[] = [
    {
      title: "Basic Info",
      fields: [
        { 
          key: 'name', 
          label: 'Bot Name', 
          type: 'text',
          description: 'The name your bot will display to users',
          required: true
        },
        {
          key: 'botfatherApiKey',
          label: 'Botfather API Key',
          type: 'text',
          description: 'Your Telegram Botfather API key (optional)',
          required: false
        },
        {
          key: 'profileImage',
          label: 'Bot Profile Image',
          type: 'text',
          description: 'URL to your bot profile image (.png)',
          required: false,
        },
        { 
          key: 'type', 
          label: 'Bot Type', 
          type: 'text',
          description: 'Trading, sentiment analysis, monitoring, etc.',
          required: true
        },
        { 
          key: 'platform', 
          label: 'Platform', 
          type: 'text',
          description: 'Currently supports Telegram and Discord only',
          required: true
        },
        { 
          key: 'description', 
          label: 'Description', 
          type: 'text',
          description: 'Brief explanation of what your bot does',
          required: true
        },
      ]
    },
    {
      title: "APIs & Integrations",
      fields: [
        { 
          key: 'apiKeys', 
          label: 'Exchange APIs (max 5)', 
          type: 'array',
          description: 'Add exchange API keys for automated trading (e.g., Binance, Coinbase, KuCoin)',
          maxEntries: 5
        },
        { 
          key: 'dataProviders', 
          label: 'Data Provider APIs (max 5)', 
          type: 'array',
          description: 'Add data provider API keys for market data (e.g., CoinGecko, CryptoCompare)',
          maxEntries: 5
        }
      ]
    },
    {
      title: "Trading Configuration",
      fields: [
        { 
          key: 'tradingPairs', 
          label: 'Trading Pairs', 
          type: 'array',
          description: 'List of trading pairs to monitor (e.g., BTC/USDT, ETH/USDT)'
        },
        { 
          key: 'riskLevel', 
          label: 'Risk Level', 
          type: 'text',
          description: 'Low, Medium, or High - affects position sizing and strategy'
        },
        { 
          key: 'maxPositionSize', 
          label: 'Max Position Size', 
          type: 'text',
          description: 'Maximum size for any single trade (in quote currency)'
        },
        { 
          key: 'stopLossDefault', 
          label: 'Default Stop Loss', 
          type: 'text',
          description: 'Default stop loss percentage for trades'
        },
        { 
          key: 'takeProfitDefault', 
          label: 'Default Take Profit', 
          type: 'text',
          description: 'Default take profit percentage for trades'
        },
        { 
          key: 'tradingTimeframe', 
          label: 'Trading Timeframe', 
          type: 'text',
          description: '1m, 5m, 15m, 1h, 4h, 1d, etc.'
        },
        { 
          key: 'indicators', 
          label: 'Technical Indicators', 
          type: 'array',
          description: 'List of indicators used for analysis (RSI, MACD, etc.)'
        },
        { 
          key: 'maxDailyTrades', 
          label: 'Max Daily Trades', 
          type: 'text',
          description: 'Maximum number of trades per 24h period'
        }
      ]
    },
    {
      title: "Bot Behavior",
      fields: [
        { 
          key: 'features', 
          label: 'Features', 
          type: 'array',
          description: 'List of bot capabilities and functions'
        },
        { 
          key: 'commands', 
          label: 'Commands', 
          type: 'array',
          description: 'Commands users can send to interact with the bot'
        },
        { 
          key: 'triggers', 
          label: 'Triggers', 
          type: 'array',
          description: 'Events that will cause the bot to take action'
        },
        { 
          key: 'responseStyle', 
          label: 'Response Style', 
          type: 'text',
          description: 'Formal, casual, emoji-rich, etc.'
        },
      ]
    },
    {
      title: "Security & Access",
      fields: [
        { 
          key: 'userAccessLevel', 
          label: 'User Access Level', 
          type: 'text',
          description: 'Public, private, or whitelist-only access',
          required: (key) => aiSuggestedRequirements.includes(key)
        },
        { 
          key: 'permissions', 
          label: 'Permissions', 
          type: 'array',
          description: 'List of actions users are allowed to perform',
          required: (key) => aiSuggestedRequirements.includes(key)
        },
        { 
          key: 'backupFrequency', 
          label: 'Backup Frequency', 
          type: 'text',
          description: 'How often to backup bot data and settings'
        },
      ]
    }
  ];

  const [isBaking, setIsBaking] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [requiredSXA, setRequiredSXA] = useState<string>('Loading...');
  const [showGuide, setShowGuide] = useState(true);
  const RECIPIENT_ADDRESS = '0x1fC09820ad9371437329Ba7D33ddb5B96c4953e8';

  // Add this function to check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    const basicInfoRequired = ['name', 'type', 'platform', 'description'];
    
    // Check basic info fields first
    const basicInfoFilled = basicInfoRequired.every(field => {
      const value = agentConfig[field as keyof AgentConfig];
      return value && value.toString().trim() !== '';
    });

    if (!basicInfoFilled) return false;

    // Then check dynamic requirements if any exist
    if (dynamicRequirements.length > 0) {
      return dynamicRequirements.every(requirement => {
        const value = agentConfig[requirement as keyof AgentConfig];
        return value && (
          Array.isArray(value) ? value.length > 0 : value.toString().trim() !== ''
        );
      });
    }

    return true;
  };

  useEffect(() => {
    if (userInput.toLowerCase().includes('telegram')) {
      setDynamicRequirements(prev => [...prev, 'telegramApiKey']);
      setFlashingSection('Platform Integration');
    }
  }, [userInput]);

  const handleUserMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setUserInput(''); // Clear input immediately

      // Add user message
      setChat(prev => [...prev, {
        id: generateUniqueId(),
        text: message,
        timestamp: Date.now(),
        isUser: true
      }]);

      // Define the context here
      const context = `You are an AI Bot Creation Assistant helping users design custom automation solutions. You're creative and open to any type of bot idea.

Current conversation:
${chat.map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`).join('\n')}

User's latest message: ${message}

IMPORTANT: Your response must be valid JSON in this exact format:
{
  "message": "Your conversational response here (starting with 🤖)",
  "config_updates": {
    "name": "extract or suggest bot name if mentioned",
    "type": "extract or suggest bot type based on conversation",
    "platform": "extract platform (Discord/Telegram) if mentioned",
    "description": "create a clear description of the bot's purpose",
    "features": ["list", "key", "features", "mentioned", "or", "suggested"],
    "apiKeys": ["list", "required", "API", "integrations"],
    "triggers": ["list", "event", "triggers", "or", "commands"]
  }
}

Do not include any text outside of this JSON structure. All your communication should be in the "message" field.`;

      const response = await generateAgentResponse(context);
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.trim());
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // If parsing fails, just show the raw response
        setChat(prev => [...prev, { 
          id: generateUniqueId(),
          text: `🤖 ${response}`,
          timestamp: Date.now(),
          isUser: false 
        }]);
        return;
      }

      // Add the AI response to chat
        setChat(prev => [...prev, { 
        id: generateUniqueId(),
        text: parsedResponse.message || response,
        timestamp: Date.now(),
          isUser: false 
        }]);

      // Handle configuration updates if they exist
      if (parsedResponse.config_updates && Object.keys(parsedResponse.config_updates).length > 0) {
        handleConfigUpdates(parsedResponse.config_updates);
      }

    } catch (error) {
      console.error('AI Response Error:', error);
      setChat(prev => [...prev, { 
        id: generateUniqueId(),
        text: error instanceof Error 
          ? `🤖 Error: ${error.message}` 
          : "🤖 Error: Unable to connect to AI service",
        timestamp: Date.now(),
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigUpdates = (updates: ConfigUpdates) => {
    const sectionsToUpdate = new Set<string>();

    setAgentConfig(prev => {
      const newConfig = { ...prev };
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value && key in newConfig) {
          if (Array.isArray(value)) {
            (newConfig[key as keyof AgentConfig] as string[]) = 
              [...new Set([...(newConfig[key as keyof AgentConfig] as string[]), ...value])];
          } else {
            (newConfig[key as keyof AgentConfig] as string) = value as string;
          }

          const section = configCategories.find(cat => 
            cat.fields.some(field => field.key === key)
          )?.title;

          if (section) {
            sectionsToUpdate.add(section);
            setExpandedCategories(prev => 
              prev.includes(section) ? prev : [...prev, section]
            );
          }
        }
      });

      return newConfig;
    });

    // Flash updated sections
    Array.from(sectionsToUpdate).forEach((section, index) => {
      setTimeout(() => {
        setFlashingSection(section);
        setTimeout(() => setFlashingSection(null), 1000);
      }, index * 1500);
    });
  };

  useEffect(() => {
    // Check if wallet is connected
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((result: unknown) => {
          const accounts = result as string[];
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: unknown) => {
        const addressArray = accounts as string[];
        setAccount(addressArray[0] || '');
      });
    }
  }, []);

  const handleBakeAgent = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    setIsBaking(true);
    
    try {
      const success = await handleTokenPayment(RECIPIENT_ADDRESS);
      if (success) {
        // Continue with agent creation
        // For now, just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        setIsBaking(false);
        return;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing your request');
    } finally {
      setIsProcessing(false);
      setIsBaking(false);
    }
  };

  useEffect(() => {
    async function updatePrice() {
      try {
        const amount = await calculateRequiredSXA();
        setRequiredSXA(amount);
      } catch (error) {
        console.error('Error updating price:', error);
        setRequiredSXA('COST');
      }
    }
    updatePrice();
    const interval = setInterval(updatePrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-black text-[#00ff00] ${pressStart.className}`}>
      <style jsx>{flashAnimation}</style>
      <style jsx>{spinAnimation}</style>
      {/* Matrix Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)]"></div>
      </div>

      <Header />

      {/* Information Popup */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90" onClick={() => setShowGuide(false)}></div>
          <div className="relative bg-black border-2 border-[#00ff00] p-8 max-w-lg w-full">
            <button 
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 text-[#00ff00] hover:text-[#00ff00]/70"
            >
              ✕
            </button>
            <h2 className="text-xl mb-6">Welcome to AgentLab AI Creator!</h2>
            <p className="text-[#00ff00]/80 mb-6 leading-relaxed">
              Our comprehensive documentation is currently being enhanced. In the meantime, 
              please visit our <Link href="/about" className="underline hover:text-[#00ff00]/70">About page</Link> for 
              an overview, or connect with our AI Assistant <a 
                href="https://t.me/agentlabhelperbot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-[#00ff00]/70"
              >@agentlabhelperbot</a> on Telegram for guided assistance.
            </p>
            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-3 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00] transition-all"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Chat Interface */}
            <div className="border border-[#00ff00] bg-black/50 p-6">
              <h2 className="text-xl mb-4">AGENT CREATOR</h2>
              
              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {chat.map((message) => (
                  <div
                    key={message.id}
                    className={`${message.isUser ? 'text-blue-400' : 'text-[#00ff00]'} text-sm ${
                      message.isThinking ? 'animate-pulse' : ''
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="text-[#00ff00] text-sm animate-pulse">
                    Assistant is thinking...
                  </div>
                )}
              </div>

              <div className="border-t border-[#00ff00]/20 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && userInput.trim()) {
                        handleUserMessage(userInput);
                      }
                    }}
                  placeholder="Describe your bot..."
                  className="flex-1 bg-black border border-[#00ff00] text-[#00ff00] px-2 py-1 text-sm focus:outline-none focus:border-white"
                    disabled={isLoading}
                />
                <button
                    onClick={() => {
                      if (userInput.trim()) {
                        handleUserMessage(userInput);
                      }
                    }}
                    disabled={!userInput.trim() || isLoading}
                  className="px-4 py-1 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all text-sm disabled:opacity-50"
                >
                    {isLoading ? 'SENDING...' : 'SEND'}
                </button>
                </div>

                {/* Add suggestion buttons */}
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-[#00ff00]/50">Try these examples:</div>
                  <div className="flex flex-wrap gap-2">
                    {botSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => {
                          setUserInput(suggestion.text);
                          handleUserMessage(suggestion.text);
                        }}
                        disabled={isLoading}
                        className="text-xs border border-[#00ff00]/30 px-3 py-1.5 hover:border-[#00ff00] hover:bg-[#00ff00]/10 transition-all text-[#00ff00]/70 hover:text-[#00ff00] text-left disabled:opacity-50"
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Preview */}
            <div className="border border-[#00ff00] bg-black/50 p-6 overflow-y-auto max-h-[800px]">
              <h2 className="text-xl mb-4">CONFIGURATION</h2>
              
              <div className="space-y-6">
                {configCategories.map((category) => (
                  <div key={category.title} 
                    className={`border transition-all duration-500 ${
                      flashingSection === category.title 
                        ? 'border-[#00ff00] bg-[#00ff00]/10'
                        : 'border-[#00ff00]/20 bg-transparent'
                    }`}
                  >
                    <button
                      className="w-full px-4 py-2 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 transition-all flex justify-between items-center"
                      onClick={() => setExpandedCategories(prev => 
                        prev.includes(category.title) 
                          ? prev.filter(c => c !== category.title)
                          : [...prev, category.title]
                      )}
                    >
                      <span>
                        {category.title}
                        {categoryHasRequired(category) && <span className="text-red-500 ml-1">*</span>}
                      </span>
                      <span>{expandedCategories.includes(category.title) ? '−' : '+'}</span>
                    </button>
                    
                    {expandedCategories.includes(category.title) && (
                      <div className="p-4 space-y-4">
                        {category.fields.map((field) => (
                          <div key={field.key} className="space-y-2">
                            <label className="text-sm text-[#00ff00]/70">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {field.type === 'array' ? (
                              <div className="space-y-2">
                                {(agentConfig[field.key] as string[]).map((item, index) => (
                                  <div key={index} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) => {
                                        const newArray = [...(agentConfig[field.key] as string[])];
                                        newArray[index] = e.target.value;
                                        handleFieldUpdate(field.key, newArray);
                                      }}
                                      className="flex-1 bg-black border border-[#00ff00]/30 text-[#00ff00] px-2 py-1 text-sm"
                                    />
                                    <button
                                      onClick={() => {
                                        const newArray = (agentConfig[field.key] as string[]).filter((_, i) => i !== index);
                                        handleFieldUpdate(field.key, newArray);
                                      }}
                                      className="text-[#00ff00]/70 hover:text-[#00ff00]"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const newArray = [...(agentConfig[field.key] as string[]), ''];
                                    handleFieldUpdate(field.key, newArray);
                                  }}
                                  className="text-xs text-[#00ff00]/70 hover:text-[#00ff00]"
                                >
                                  + Add {field.label}
                                </button>
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={agentConfig[field.key] as string}
                                onChange={(e) => handleFieldUpdate(field.key, e.target.value)}
                                className="w-full bg-black border border-[#00ff00]/30 text-[#00ff00] px-2 py-1 text-sm"
                              />
                            )}
                            {field.description && (
                              <div className="text-xs text-[#00ff00]/50 italic">
                                {field.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Custom Responses Section */}
                <div className="border border-red-500/50">
                  <button
                    className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 transition-all flex justify-between items-center"
                    onClick={() => setExpandedCategories(prev => 
                      prev.includes('Custom Responses') 
                        ? prev.filter(c => c !== 'Custom Responses')
                        : [...prev, 'Custom Responses']
                    )}
                  >
                    <div className="flex items-center gap-2">
                    <span>Custom Responses</span>
                      <div className="w-2 h-2 rounded-full bg-red-500 spin"></div>
                      <span className="text-xs text-red-500">(Coming Soon)</span>
                    </div>
                    <span>{expandedCategories.includes('Custom Responses') ? '−' : '+'}</span>
                  </button>
                  
                  {expandedCategories.includes('Custom Responses') && (
                    <div className="p-4 space-y-4 bg-red-500/5">
                      <div className="text-center text-red-500/70 py-8">
                        Feature coming soon...
                      </div>
                    </div>
                  )}
                </div>

                {/* Notification Settings Section */}
                <div className="border border-red-500/50">
                  <button
                    className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 transition-all flex justify-between items-center"
                    onClick={() => setExpandedCategories(prev => 
                      prev.includes('Notification Settings') 
                        ? prev.filter(c => c !== 'Notification Settings')
                        : [...prev, 'Notification Settings']
                    )}
                  >
                    <div className="flex items-center gap-2">
                    <span>Notification Settings</span>
                      <div className="w-2 h-2 rounded-full bg-red-500 spin"></div>
                      <span className="text-xs text-red-500">(Coming Soon)</span>
                    </div>
                    <span>{expandedCategories.includes('Notification Settings') ? '−' : '+'}</span>
                  </button>
                  
                  {expandedCategories.includes('Notification Settings') && (
                    <div className="p-4 space-y-4 bg-red-500/5">
                      <div className="text-center text-red-500/70 py-8">
                        Feature coming soon...
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-[#00ff00]/50 mt-4 mb-2">
                  <span className="text-red-500">*</span> Required fields
                </div>
                
                <div>
                  <div className="relative">
                    <button
                      onClick={handleBakeAgent}
                      disabled={!account || isProcessing}
                      className={`w-full py-3 ${
                        !account 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : isProcessing
                            ? 'bg-[#00ff00]/50 cursor-wait'
                            : 'bg-[#00ff00] hover:bg-[#00ff00]/80'
                      } text-black transition-all`}
                    >
                      {!account 
                        ? 'CONNECT WALLET TO BAKE' 
                        : isProcessing 
                          ? 'PROCESSING...' 
                          : `BAKE AGENT (${requiredSXA} AGL ≈ $20)`}
                    </button>
                    
                    {!areRequiredFieldsFilled() && !isBaking && (
                      <div className="absolute -bottom-6 left-0 w-full text-center text-red-500 text-xs animate-pulse">
                        WARNING: MISSING REQUIRED FIELDS - LOGIC MAY FAIL
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 mb-12">
        <div className="max-w-2xl mx-auto">
          <div className="border-2 border-[#00ff00] bg-black/50 p-6 hover:bg-black/80 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <Image 
                    src="/agentlogowebsitemini.png"
                    alt="AgentLab AI Assistant"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl mb-2">AgentLab AI - Agent Creator Assistant</h3>
                  <div className="text-sm text-[#00ff00]/70 mb-2">Agent Creator assistant for AgentLab AI</div>
                  <div className="flex gap-3">
                    <a 
                      href="https://agentlabai.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#00ff00] hover:text-[#00ff00]/80 transition-colors"
                    >
                      WEBSITE →
                    </a>
                    <a 
                      href="https://t.me/agentlabhelperbot"
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
      </div>

      {/* Separator */}
      <div className="w-full h-px bg-[#00ff00]/20 mb-12"></div>

      {/* Tutorial content starts here */}
      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-2xl md:text-3xl mb-8 text-center">BOT CREATOR GUIDE</h1>

          {/* AI Assistant Section - Enhanced */}
          <section className="mb-12">
            <h2 className="text-xl mb-4">🤖 Using the AI Assistant</h2>
            <div className="space-y-4 text-sm">
              <p>The AI Assistant helps configure your bot through natural conversation. Here&apos;s your step-by-step guide:</p>
              
              <div className="space-y-4">
                <div className="bg-[#00ff00]/10 p-4 border border-[#00ff00]/30">
                  <h3 className="font-bold mb-2">1. Starting the Conversation</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Begin with a clear description of your bot&apos;s purpose</li>
                    <li>Example: &quot;I want to create a bot that monitors GitHub repositories for security vulnerabilities&quot;</li>
                    <li>The AI will ask clarifying questions to understand your needs</li>
                  </ul>
                </div>

                <div className="bg-[#00ff00]/10 p-4 border border-[#00ff00]/30">
                  <h3 className="font-bold mb-2">2. Providing Details</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Answer the AI&apos;s questions about specific features</li>
                    <li>Mention platform preferences (Discord/Telegram)</li>
                    <li>Describe any specific APIs or integrations needed</li>
                    <li>The AI will auto-fill relevant configuration sections</li>
                  </ul>
                </div>

                <div className="bg-[#00ff00]/10 p-4 border border-[#00ff00]/30">
                  <h3 className="font-bold mb-2">3. Using Templates</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Click on example templates below the chat for quick starts</li>
                    <li>Modify template suggestions to match your needs</li>
                    <li>Ask the AI to explain any configuration options</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Detailed Configuration Guide */}
          <section className="mb-12">
            <h2 className="text-xl mb-4">⚙️ Detailed Configuration Guide</h2>
            
            <div className="space-y-8">
              {/* Basic Info - Enhanced */}
              <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
                <h3 className="text-lg mb-4 text-[#00ff00]">Basic Info (Required)</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[#00ff00] mb-2">Bot Name</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Choose a unique, descriptive name</li>
                      <li>Avoid special characters except underscores</li>
                      <li>Examples: &quot;github_security_bot&quot;, &quot;sentiment_analyzer&quot;</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[#00ff00] mb-2">Bot Type</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Common types:
                        <ul className="pl-4 mt-1">
                          <li>Trading: Automated trading operations</li>
                          <li>Monitoring: Track events, prices, or data</li>
                          <li>Sentiment: Analyze market or social sentiment</li>
                          <li>Security: Monitor for vulnerabilities or threats</li>
                          <li>Community: Manage user interactions</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[#00ff00] mb-2">Platform</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Discord:
                        <ul className="pl-4 mt-1">
                          <li>Better for community interaction</li>
                          <li>Rich embed support</li>
                          <li>Role-based permissions</li>
                        </ul>
                      </li>
                      <li>Telegram:
                        <ul className="pl-4 mt-1">
                          <li>Better for alerts and notifications</li>
                          <li>Simple command structure</li>
                          <li>Group and channel support</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[#00ff00] mb-2">Description</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Include:
                        <ul className="pl-4 mt-1">
                          <li>Main purpose and functionality</li>
                          <li>Target users or use case</li>
                          <li>Key features or capabilities</li>
                          <li>Example: &quot;A Discord bot that monitors GitHub repositories for security vulnerabilities, sending alerts when new issues are detected&quot;</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* APIs & Integrations - Enhanced */}
              <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
                <h3 className="text-lg mb-4 text-[#00ff00]">APIs & Integrations (Optional)</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[#00ff00] mb-2">Exchange APIs</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Supported Exchanges:
                        <ul className="pl-4 mt-1">
                          <li>Binance: Spot and futures trading</li>
                          <li>Coinbase: USD pairs focus</li>
                          <li>KuCoin: Wide alt-coin selection</li>
                          <li>FTX: Derivatives and spot</li>
                        </ul>
                      </li>
                      <li>Required Permissions:
                        <ul className="pl-4 mt-1">
                          <li>Read: Market data access</li>
                          <li>Trading: Order execution</li>
                          <li>Account: Balance information</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Providers - Enhanced */}
              <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
                <h3 className="text-lg mb-4 text-[#00ff00]">Data Providers</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[#00ff00] mb-2">Data Providers</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Market Data:
                        <ul className="pl-4 mt-1">
                          <li>CoinGecko: Wide market coverage</li>
                          <li>CryptoCompare: Real-time data</li>
                          <li>Messari: On-chain metrics</li>
                        </ul>
                      </li>
                      <li>Other Integrations:
                        <ul className="pl-4 mt-1">
                          <li>GitHub: Repository monitoring</li>
                          <li>Twitter: Social sentiment</li>
                          <li>News APIs: Market updates</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bot Behavior - Enhanced */}
              <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
                <h3 className="text-lg mb-4 text-[#00ff00]">Bot Behavior</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[#00ff00] mb-2">Features Configuration</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Core Features:
                        <ul className="pl-4 mt-1">
                          <li>Data collection and analysis</li>
                          <li>Alert generation</li>
                          <li>User interaction handling</li>
                          <li>Automated actions</li>
                        </ul>
                      </li>
                      <li>Advanced Features:
                        <ul className="pl-4 mt-1">
                          <li>Multi-source data correlation</li>
                          <li>Machine learning integration</li>
                          <li>Custom analytics</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[#00ff00] mb-2">Command Structure</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Basic Commands:
                        <ul className="pl-4 mt-1">
                          <li>/help - Show available commands</li>
                          <li>/status - Check bot status</li>
                          <li>/settings - View current config</li>
                        </ul>
                      </li>
                      <li>Advanced Commands:
                        <ul className="pl-4 mt-1">
                          <li>/analyze - Run custom analysis</li>
                          <li>/alert - Set custom alerts</li>
                          <li>/report - Generate reports</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[#00ff00] mb-2">Event Triggers</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Market Triggers:
                        <ul className="pl-4 mt-1">
                          <li>Price movements</li>
                          <li>Volume spikes</li>
                          <li>Pattern formations</li>
                        </ul>
                      </li>
                      <li>External Triggers:
                        <ul className="pl-4 mt-1">
                          <li>News events</li>
                          <li>Social media activity</li>
                          <li>API updates</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Security & Access - Enhanced */}
              <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
                <h3 className="text-lg mb-4 text-[#00ff00]">Security & Access</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[#00ff00] mb-2">Access Control</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Access Levels:
                        <ul className="pl-4 mt-1">
                          <li>Public: Anyone can use basic commands</li>
                          <li>Private: Whitelist only access</li>
                          <li>Tiered: Role-based permissions</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[#00ff00] mb-2">Permission System</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>User Roles:
                        <ul className="pl-4 mt-1">
                          <li>Admin: Full control</li>
                          <li>Moderator: Management commands</li>
                          <li>User: Basic interactions</li>
                          <li>Guest: Read-only access</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[#00ff00] mb-2">Data Management</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Backup Options:
                        <ul className="pl-4 mt-1">
                          <li>Hourly: Critical systems</li>
                          <li>Daily: User data</li>
                          <li>Weekly: Configuration</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center text-sm text-[#00ff00]/70 italic mt-8">
            Note: Custom Responses and Notification Settings modules coming soon...
          </div>
        </div>
      </div>
    </div>
  );
} 