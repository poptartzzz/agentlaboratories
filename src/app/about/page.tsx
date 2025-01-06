"use client";

import { Press_Start_2P } from 'next/font/google';
import Header from '@/components/Header';
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

              {/* Trading Configuration - Enhanced */}
              <div className="bg-[#00ff00]/5 p-6 border border-[#00ff00]/30">
                <h3 className="text-lg mb-4 text-[#00ff00]">Trading Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[#00ff00] mb-2">Trading Setup</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Trading Pairs:
                        <ul className="pl-4 mt-1">
                          <li>Format: BASE/QUOTE (e.g., BTC/USDT)</li>
                          <li>Multiple pairs separated by commas</li>
                          <li>Check exchange pair availability</li>
                        </ul>
                      </li>
                      <li>Risk Levels:
                        <ul className="pl-4 mt-1">
                          <li>Low: 1-2% per trade</li>
                          <li>Medium: 2-5% per trade</li>
                          <li>High: 5-10% per trade</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[#00ff00] mb-2">Risk Management</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Position Sizing:
                        <ul className="pl-4 mt-1">
                          <li>Fixed size (e.g., 0.1 BTC)</li>
                          <li>Percentage based (e.g., 5% of balance)</li>
                          <li>Risk-adjusted (based on volatility)</li>
                        </ul>
                      </li>
                      <li>Stop Loss/Take Profit:
                        <ul className="pl-4 mt-1">
                          <li>Percentage based (e.g., -2% SL, +6% TP)</li>
                          <li>Fixed price levels</li>
                          <li>Trailing stops</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[#00ff00] mb-2">Technical Analysis</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Timeframes:
                        <ul className="pl-4 mt-1">
                          <li>Short-term: 1m, 5m, 15m</li>
                          <li>Medium-term: 1h, 4h</li>
                          <li>Long-term: 1d, 1w</li>
                        </ul>
                      </li>
                      <li>Indicators:
                        <ul className="pl-4 mt-1">
                          <li>Trend: MA, EMA, MACD</li>
                          <li>Momentum: RSI, Stochastic</li>
                          <li>Volume: OBV, VWAP</li>
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