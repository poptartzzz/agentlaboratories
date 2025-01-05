"use client";

import { Press_Start_2P } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';
import { generateAgentResponse } from '@/utils/claude';
import Navigation from '@/components/Navigation';

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
});

interface AgentConfig {
  name: string;
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
}

// Add this interface to organize config categories
interface ConfigCategory {
  title: string;
  fields: {
    key: keyof AgentConfig;
    label: string;
    type: 'text' | 'array' | 'object';
    description: string;
    required?: boolean | ((key: string) => boolean);
    maxEntries?: number;
  }[];
}

// Add this interface to track editing states
interface EditingState {
  fieldKey: string | null;
  tempValue: string | string[];
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

export default function CreateAgent() {
  const [chat, setChat] = useState<{ text: string, isUser: boolean }[]>([
    { text: "Hi! I'm your agent creation assistant. Tell me about the bot you want to create, and I'll help you set it up. What type of bot are you looking to build?", isUser: false }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
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
    userAccessLevel: ''
  });

  // Add this state for managing expanded sections
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Basic Info']);

  // Add this to track dynamic requirements
  const [dynamicRequirements, setDynamicRequirements] = useState<string[]>([]);

  // Add this state to track which section should flash
  const [flashingSection, setFlashingSection] = useState<string | null>(null);

  // Add these to track AI-suggested requirements
  const [aiSuggestedRequirements, setAiSuggestedRequirements] = useState<string[]>([]);

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
          required: (key) => dynamicRequirements.includes('exchangeApi'),
          maxEntries: 5
        },
        { 
          key: 'dataProviders', 
          label: 'Data Provider APIs (max 5)', 
          type: 'array',
          description: 'Add data provider API keys for market data (e.g., CoinGecko, CryptoCompare)',
          required: (key) => dynamicRequirements.includes('dataApi'),
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
          description: 'Maximum size for any single trade (in quote currency)',
          required: (key) => aiSuggestedRequirements.includes(key)
        },
        { 
          key: 'stopLossDefault', 
          label: 'Default Stop Loss', 
          type: 'text',
          description: 'Default stop loss percentage for trades',
          required: (key) => aiSuggestedRequirements.includes(key)
        },
        { 
          key: 'takeProfitDefault', 
          label: 'Default Take Profit', 
          type: 'text',
          description: 'Default take profit percentage for trades',
          required: (key) => aiSuggestedRequirements.includes(key)
        },
        { 
          key: 'tradingTimeframe', 
          label: 'Trading Timeframe', 
          type: 'text',
          description: '1m, 5m, 15m, 1h, 4h, 1d, etc.',
          required: (key) => aiSuggestedRequirements.includes(key)
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
        },
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
    },
    {
      title: "Platform Integration",
      fields: [
        { 
          key: 'telegramApiKey', 
          label: 'Telegram API Key', 
          type: 'text',
          description: 'Your Telegram bot API key',
          required: (key) => dynamicRequirements.includes(key)
        },
        { 
          key: 'twitterApiKey', 
          label: 'Twitter API Key', 
          type: 'text',
          description: 'Your Twitter developer API key',
          required: (key) => dynamicRequirements.includes(key)
        },
        { 
          key: 'discordApiKey', 
          label: 'Discord Bot Token', 
          type: 'text',
          description: 'Your Discord bot token',
          required: (key) => dynamicRequirements.includes(key)
        }
      ]
    }
  ];

  const [editingState, setEditingState] = useState<EditingState>({
    fieldKey: null,
    tempValue: ''
  });

  const handleUserInput = async (message: string) => {
    if (!message.trim()) return;

    // Check for platform and exchange mentions
    const lowerMessage = message.toLowerCase();
    const newRequirements: string[] = [];

    // Platform API requirements
    if (lowerMessage.includes('telegram')) {
      newRequirements.push('telegramApiKey');
      setFlashingSection('Platform Integration');
    }
    if (lowerMessage.includes('twitter')) {
      newRequirements.push('twitterApiKey');
      setFlashingSection('Platform Integration');
    }
    if (lowerMessage.includes('discord')) {
      newRequirements.push('discordApiKey');
      setFlashingSection('Platform Integration');
    }

    // Exchange API requirements
    const exchanges = ['binance', 'coinbase', 'kucoin', 'kraken', 'ftx'];
    if (exchanges.some(exchange => lowerMessage.includes(exchange))) {
      newRequirements.push('exchangeApi');
      setFlashingSection('APIs & Integrations');
    }

    // Data provider requirements
    const dataProviders = ['coingecko', 'cryptocompare', 'tradingview', 'glassnode'];
    if (dataProviders.some(provider => lowerMessage.includes(provider))) {
      newRequirements.push('dataApi');
      setFlashingSection('APIs & Integrations');
    }

    // Update dynamic requirements
    if (newRequirements.length > 0) {
      setDynamicRequirements(prev => [...new Set([...prev, ...newRequirements])]);
      
      // Auto-expand the flashing section
      const sectionToExpand = newRequirements.some(req => ['telegramApiKey', 'twitterApiKey', 'discordApiKey'].includes(req))
        ? 'Platform Integration'
        : 'APIs & Integrations';

      setExpandedCategories(prev => 
        prev.includes(sectionToExpand) ? prev : [...prev, sectionToExpand]
      );

      // Remove flash after 2 seconds
      setTimeout(() => {
        setFlashingSection(null);
      }, 2000);
    }

    setChat(prev => [...prev, { text: message, isUser: true }]);
    setUserInput('');
    setIsThinking(true);

    try {
      const context = `You are an AI agent creator assistant. Help create a crypto trading bot by extracting information from the conversation and suggesting configurations.

Current configuration:
${JSON.stringify(agentConfig, null, 2)}

Chat history:
${chat.map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`).join('\n')}

New message: ${message}

Analyze the message and previous chat to extract or suggest bot configuration details. Always respond with a JSON object containing:
1. A conversational message to the user
2. Any configuration updates detected or suggested

Response format:
{
  "message": "Your conversational response here",
  "updates": {
    "name": "suggested or mentioned bot name",
    "type": "trading/sentiment/monitoring/etc",
    "platform": "telegram/discord/twitter",
    "description": "detailed bot description",
    "features": ["feature 1", "feature 2"],
    "commands": ["command 1", "command 2"],
    "triggers": ["trigger 1", "trigger 2"]
  }
}

Only include fields in "updates" that are relevant to the current conversation. Make intelligent suggestions based on the user's requirements.`;

      const response = await generateAgentResponse(context);
      
      try {
        // Clean the response and parse JSON
        const cleanResponse = response.replace('🤖 ', '').trim();
        const parsedResponse = JSON.parse(cleanResponse);

        // Check AI response for suggested requirements
        const suggestedReqs: string[] = [];
        
        // Check response content for specific features
        const responseText = parsedResponse.message.toLowerCase();
        
        // Trading related
        if (responseText.includes('trading') || responseText.includes('position') || responseText.includes('profit')) {
          suggestedReqs.push('maxPositionSize', 'stopLossDefault', 'takeProfitDefault', 'tradingTimeframe');
          setFlashingSection('Trading Configuration');
        }

        // Notification related
        if (responseText.includes('notify') || responseText.includes('alert') || responseText.includes('message')) {
          suggestedReqs.push('notificationSettings');
          setFlashingSection('Notification Settings');
        }

        // Social monitoring
        if (responseText.includes('elon') || responseText.includes('tweet') || responseText.includes('social')) {
          suggestedReqs.push('dataProviders');
          setFlashingSection('APIs & Integrations');
        }

        // Security related
        if (responseText.includes('private') || responseText.includes('access') || responseText.includes('permission')) {
          suggestedReqs.push('userAccessLevel', 'permissions');
          setFlashingSection('Security & Access');
        }

        // Update AI suggested requirements
        if (suggestedReqs.length > 0) {
          setAiSuggestedRequirements(prev => [...new Set([...prev, ...suggestedReqs])]);
          
          // Auto-expand relevant sections
          const sectionsToExpand = configCategories
            .filter(category => 
              category.fields.some(field => suggestedReqs.includes(field.key))
            )
            .map(category => category.title);

          setExpandedCategories(prev => [
            ...new Set([...prev, ...sectionsToExpand])
          ]);
        }

        // Update configuration with any new information
        if (parsedResponse.updates) {
          setAgentConfig(prev => {
            const newConfig = { ...prev };
            
            // Update each field if provided in the response
            Object.entries(parsedResponse.updates).forEach(([key, value]) => {
              if (value && (
                // If it's an array, only update if new values provided
                (Array.isArray(value) && value.length > 0) ||
                // If it's a string, only update if not empty
                (typeof value === 'string' && value.trim() !== '')
              )) {
                newConfig[key as keyof AgentConfig] = value;
              }
            });
            
            return newConfig;
          });
        }

        // Collapse sections that get filled
        if (parsedResponse.updates) {
          const filledCategories = configCategories.filter(category => 
            category.fields.some(field => 
              parsedResponse.updates[field.key] && 
              parsedResponse.updates[field.key].length > 0
            )
          ).map(category => category.title);

          setExpandedCategories(prev => 
            prev.filter(category => !filledCategories.includes(category))
          );
        }

        // Add assistant's message to chat
        setChat(prev => [...prev, { 
          text: parsedResponse.message, 
          isUser: false 
        }]);

      } catch (e) {
        console.error('Parse error:', e);
        // Fallback for non-JSON responses
        setChat(prev => [...prev, { 
          text: response, 
          isUser: false 
        }]);
      }
    } catch (error) {
      console.error('API error:', error);
      setChat(prev => [...prev, { 
        text: "I encountered an error. Please try again.", 
        isUser: false 
      }]);
    }

    setIsThinking(false);
  };

  const renderEditableField = (label: string, value: string) => {
    const isRequired = typeof field.required === 'function' 
      ? field.required(field.key)
      : field.required;

    const isCurrentlyEditing = editingState.fieldKey === field.key;
    const currentEntries = Array.isArray(value) ? value.length : 0;

    const startEditing = () => {
      setEditingState({
        fieldKey: field.key,
        tempValue: value
      });
    };

    const handleSave = () => {
      setAgentConfig(prev => ({
        ...prev,
        [field.key]: editingState.tempValue
      }));
      setEditingState({ fieldKey: null, tempValue: '' });
    };

    const handleChange = (newValue: string | string[]) => {
      setEditingState(prev => ({
        ...prev,
        tempValue: newValue
      }));
    };

    return (
      <div>
        <div className="flex justify-between text-[#00ff00]/70 mb-1">
          <div>
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </div>
          <div className="flex gap-2">
            {field.type === 'array' && (
              <button
                onClick={() => {
                  if (Array.isArray(editingState.tempValue)) {
                    handleChange([...editingState.tempValue, '']);
                  }
                  if (!isCurrentlyEditing) {
                    startEditing();
                  }
                }}
                className="text-xs hover:text-white px-2 border border-[#00ff00]/50 hover:border-[#00ff00]"
                disabled={field.maxEntries ? currentEntries >= field.maxEntries : false}
              >
                + ADD {field.maxEntries && `(${currentEntries}/${field.maxEntries})`}
              </button>
            )}
            <button
              onClick={() => {
                if (isCurrentlyEditing) {
                  handleSave();
                } else {
                  startEditing();
                }
              }}
              className="text-xs hover:text-white"
            >
              {isCurrentlyEditing ? 'SAVE' : 'EDIT'}
            </button>
          </div>
        </div>
        {field.description && (
          <div className="text-xs text-[#00ff00]/50 mb-2 italic">
            {field.description}
          </div>
        )}
        <div className="border border-[#00ff00]/20 p-2">
          {isCurrentlyEditing ? (
            field.type === 'array' ? (
              <>
                <textarea
                  className="w-full bg-black text-[#00ff00] border-none outline-none"
                  value={Array.isArray(editingState.tempValue) ? editingState.tempValue.join('\n') : ''}
                  onChange={(e) => {
                    const newValues = e.target.value.split('\n').filter(Boolean);
                    if (!field.maxEntries || newValues.length <= field.maxEntries) {
                      handleChange(newValues);
                    }
                  }}
                  rows={4}
                  placeholder="Enter one item per line"
                />
                {field.maxEntries && (
                  <div className="text-xs text-[#00ff00]/50 mt-1">
                    {currentEntries}/{field.maxEntries} entries
                  </div>
                )}
              </>
            ) : (
              <input
                className="w-full bg-black text-[#00ff00] border-none outline-none"
                value={editingState.tempValue as string}
                onChange={(e) => handleChange(e.target.value)}
              />
            )
          ) : field.type === 'array' ? (
            (value as string[]).length > 0 ? (
              <ul className="list-disc pl-4">
                {(value as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : '...'
          ) : (
            value || '...'
          )}
        </div>
      </div>
    );
  };

  const [isBaking, setIsBaking] = useState(false);
  const [bakingError, setBakingError] = useState<string | null>(null);
  const [bakingProgress, setBakingProgress] = useState<number>(0);

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

  const handleBaking = () => {
    setIsBaking(true);
    setBakingError(null);
    setBakingProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setBakingProgress(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 1000);

    // Simulate timeout after 15 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setIsBaking(false);
      setBakingError('INITIALIZATION FAILED - PLEASE REFER TO THE DOCUMENTATION AT /about FOR COMPLETE SETUP GUIDE');
      setBakingProgress(0);
    }, 15000);
  };

  return (
    <div className={`min-h-screen bg-black text-[#00ff00] ${pressStart.className}`}>
      <style jsx>{flashAnimation}</style>
      {/* Matrix Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)]"></div>
      </div>

      <Navigation />

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Chat Interface */}
            <div className="border border-[#00ff00] bg-black/50 p-6">
              <h2 className="text-xl mb-4">AGENT CREATOR</h2>
              
              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {chat.map((message, index) => (
                  <div
                    key={index}
                    className={`${message.isUser ? 'text-blue-400' : 'text-[#00ff00]'} text-sm`}
                  >
                    {message.text}
                  </div>
                ))}
                {isThinking && (
                  <div className="text-[#00ff00] text-sm animate-pulse">
                    Assistant is thinking...
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUserInput(userInput)}
                  placeholder="Describe your bot..."
                  className="flex-1 bg-black border border-[#00ff00] text-[#00ff00] px-2 py-1 text-sm focus:outline-none focus:border-white"
                  disabled={isThinking}
                />
                <button
                  onClick={() => handleUserInput(userInput)}
                  disabled={!userInput.trim() || isThinking}
                  className="px-4 py-1 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all text-sm disabled:opacity-50"
                >
                  SEND
                </button>
              </div>
            </div>

            {/* Configuration Preview */}
            <div className="border border-[#00ff00] bg-black/50 p-6 overflow-y-auto max-h-[800px]">
              <h2 className="text-xl mb-4">CONFIGURATION</h2>
              
              <div className="space-y-6">
                {configCategories.map((category) => (
                  <div key={category.title} 
                    className={`border border-[#00ff00]/20 transition-all ${
                      flashingSection === category.title 
                        ? 'animate-flash border-red-500' 
                        : ''
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
                        {category.fields.map((field, index) => (
                          <div key={`${category.title}-${field.key}-${index}`}>
                            {renderEditableField(
                              field.label,
                              agentConfig[field.key]
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Custom Responses Section */}
                <div className="border border-[#00ff00]/20">
                  <button
                    className="w-full px-4 py-2 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 transition-all flex justify-between items-center"
                    onClick={() => setExpandedCategories(prev => 
                      prev.includes('Custom Responses') 
                        ? prev.filter(c => c !== 'Custom Responses')
                        : [...prev, 'Custom Responses']
                    )}
                  >
                    <span>Custom Responses</span>
                    <span>{expandedCategories.includes('Custom Responses') ? '−' : '+'}</span>
                  </button>
                  
                  {expandedCategories.includes('Custom Responses') && (
                    <div className="p-4 space-y-4">
                      {renderEditableField('Welcome Message', agentConfig.customResponses.welcome)}
                      {renderEditableField('Success Message', agentConfig.customResponses.success)}
                      {renderEditableField('Error Message', agentConfig.customResponses.error)}
                    </div>
                  )}
                </div>

                {/* Notification Settings Section */}
                <div className="border border-[#00ff00]/20">
                  <button
                    className="w-full px-4 py-2 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 transition-all flex justify-between items-center"
                    onClick={() => setExpandedCategories(prev => 
                      prev.includes('Notifications') 
                        ? prev.filter(c => c !== 'Notifications')
                        : [...prev, 'Notifications']
                    )}
                  >
                    <span>Notification Settings</span>
                    <span>{expandedCategories.includes('Notifications') ? '−' : '+'}</span>
                  </button>
                  
                  {expandedCategories.includes('Notifications') && (
                    <div className="p-4 space-y-4">
                      {renderEditableField('Telegram', agentConfig.notificationSettings.telegram || '')}
                      {renderEditableField('Discord', agentConfig.notificationSettings.discord || '')}
                      {renderEditableField('Email', agentConfig.notificationSettings.email || '')}
                    </div>
                  )}
                </div>

                <div className="text-xs text-[#00ff00]/50 mt-4 mb-2">
                  <span className="text-red-500">*</span> Required fields
                </div>

                {bakingError && (
                  <div className="text-red-500 text-sm mb-2 border border-red-500/50 p-2 bg-red-500/10">
                    <div className="flex items-center justify-between">
                      <span>ERROR: {bakingError}</span>
                      <Link 
                        href="/about" 
                        className="text-xs underline hover:text-red-400 transition-colors"
                      >
                        View Guide
                      </Link>
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="relative">
                    <button
                      className="w-full mt-2 px-4 py-2 bg-[#00ff00] text-black hover:bg-[#00ff00]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                      disabled={isBaking}
                      onClick={handleBaking}
                    >
                      <div className="relative z-10">
                        {isBaking ? (
                          <div className="flex items-center justify-center gap-2">
                            <span>BAKING AGENT</span>
                            <span className="text-xs">{bakingProgress}%</span>
                          </div>
                        ) : (
                          'BAKE AGENT'
                        )}
                      </div>
                      {isBaking && (
                        <div 
                          className="absolute left-0 top-0 h-full bg-[#00ff00]/30 transition-all duration-1000"
                          style={{ width: `${bakingProgress}%` }}
                        />
                      )}
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
    </div>
  );
} 