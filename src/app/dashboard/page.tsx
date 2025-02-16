"use client";

import { useState, useEffect } from 'react';
import { Press_Start_2P } from 'next/font/google';
import Link from 'next/link';
import Header from '@/components/Header';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faKey, 
  faRobot, 
  faGears, 
  faChartLine,
  faWallet,
  faCode,
  faShieldHalved,
  faBell
} from '@fortawesome/free-solid-svg-icons';

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
});

interface ApiKey {
  name: string;
  key: string;
  platform: string;
  lastUsed: string;
}

interface ApiForm {
  isOpen: boolean;
  name: string;
  key: string;
  platform: string;
}

interface AgentConfig {
  name: string;
  type: string;
  status: string;
  lastActive: string;
}

export default function Dashboard() {
  const [account, setAccount] = useState<string>('');
  const [activeSection, setActiveSection] = useState('overview');
  const [agents] = useState<AgentConfig[]>([]);

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
    }
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Active Agents Section */}
            <div className="border border-[#00ff00] bg-black/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Active Agents</h2>
                <Link 
                  href="/create"
                  className="text-xs border border-[#00ff00] px-3 py-1 hover:bg-[#00ff00]/10"
                >
                  + Deploy New
                </Link>
              </div>
              
              {agents.length === 0 ? (
                <div className="text-center py-8 text-[#00ff00]/70">
                  <p className="mb-2">No agents deployed</p>
                  <p className="text-xs">Deploy your first agent to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent, index) => (
                    <div key={index} className="border border-[#00ff00]/30 p-4 hover:bg-[#00ff00]/5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium mb-1">{agent.name}</h3>
                          <div className="text-xs text-[#00ff00]/70">Type: {agent.type}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs ${
                            agent.status === 'Active' ? 'text-[#00ff00]' : 'text-yellow-500'
                          }`}>
                            {agent.status}
                          </div>
                          <div className="text-xs text-[#00ff00]/50 mt-1">
                            Last active: {agent.lastActive}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="border border-[#00ff00] bg-black/50 p-6">
              <h2 className="text-xl mb-4">Performance</h2>
              <div className="text-center py-8 text-[#00ff00]/70">
                <p className="mb-2">No performance data available</p>
                <p className="text-xs">Deploy and run agents to see performance metrics</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border border-[#00ff00] bg-black/50 p-6">
              <h2 className="text-xl mb-4">Recent Activity</h2>
              <div className="text-center py-8 text-[#00ff00]/70">
                <p className="mb-2">No recent activity</p>
                <p className="text-xs">Your activity will appear here once you start using agents</p>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="border border-[#00ff00] bg-black/50 p-6">
            <h2 className="text-2xl mb-6">Settings</h2>
            {agents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#00ff00]/70 mb-4">Deploy an agent to access settings</p>
                <Link 
                  href="/create"
                  className="px-4 py-2 border border-[#00ff00] hover:bg-[#00ff00]/10 transition-colors inline-block"
                >
                  Deploy Your First Agent
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">Display Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dark Mode</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compact View</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>

                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">Agent Defaults</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Default Platform</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-Backup</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>

                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Alerts</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Telegram Notifications</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>

                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Activity Tracking</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Collection</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'developer':
        return (
          <div className="border border-[#00ff00] bg-black/50 p-6">
            <h2 className="text-2xl mb-6">Developer</h2>
            {agents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#00ff00]/70 mb-4">Deploy an agent to access developer tools</p>
                <Link 
                  href="/create"
                  className="px-4 py-2 border border-[#00ff00] hover:bg-[#00ff00]/10 transition-colors inline-block"
                >
                  Deploy Your First Agent
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">API Documentation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">REST API Docs</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">WebSocket API</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>

                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">SDK & Libraries</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">JavaScript SDK</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Python SDK</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>

                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">Testing</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Test Environment</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mock Data</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>

                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Usage Metrics</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Performance Stats</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'security':
        return (
          <div className="border border-[#00ff00] bg-black/50 p-6">
            <h2 className="text-2xl mb-6">Security</h2>
            {agents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#00ff00]/70 mb-4">Deploy an agent to access security settings</p>
                <Link 
                  href="/create"
                  className="px-4 py-2 border border-[#00ff00] hover:bg-[#00ff00]/10 transition-colors inline-block"
                >
                  Deploy Your First Agent
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Auth</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Hardware Wallet</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>

                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">API Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Key Management</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">IP Whitelisting</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>

                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">Transaction Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Spending Limits</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Approval Management</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>

                <div className="border border-[#00ff00]/30 p-4">
                  <h3 className="text-lg mb-4">Access Control</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Device Management</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Session Control</span>
                      <button className="px-3 py-1 border border-[#00ff00]/30 text-xs">Coming Soon</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'notifications':
        return (
          <div className="border border-[#00ff00] bg-black/50 p-6">
            <h2 className="text-2xl mb-6">Notifications</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-[#00ff00]/30 p-4">
                <h3 className="text-lg mb-4">Trading Alerts</h3>
                <div className="text-center py-6 text-[#00ff00]/70">
                  <p className="text-sm">No trading alerts</p>
                  <p className="text-xs mt-2">Alerts about your agent's trading activities will appear here</p>
                </div>
              </div>

              <div className="border border-[#00ff00]/30 p-4">
                <h3 className="text-lg mb-4">System Notifications</h3>
                <div className="text-center py-6 text-[#00ff00]/70">
                  <p className="text-sm">No system notifications</p>
                  <p className="text-xs mt-2">Updates about your agent's performance and status will appear here</p>
                </div>
              </div>

              <div className="border border-[#00ff00]/30 p-4">
                <h3 className="text-lg mb-4">Security Alerts</h3>
                <div className="text-center py-6 text-[#00ff00]/70">
                  <p className="text-sm">No security alerts</p>
                  <p className="text-xs mt-2">Important security notifications will appear here</p>
                </div>
              </div>

              <div className="border border-[#00ff00]/30 p-4">
                <h3 className="text-lg mb-4">Market Updates</h3>
                <div className="text-center py-6 text-[#00ff00]/70">
                  <p className="text-sm">No market updates</p>
                  <p className="text-xs mt-2">Market analysis and trend alerts will appear here</p>
                </div>
              </div>

              <div className="border border-[#00ff00]/30 p-4">
                <h3 className="text-lg mb-4">Agent Activity</h3>
                <div className="text-center py-6 text-[#00ff00]/70">
                  <p className="text-sm">No agent activity</p>
                  <p className="text-xs mt-2">Your agent's actions and decisions will appear here</p>
                </div>
              </div>

              <div className="border border-[#00ff00]/30 p-4">
                <h3 className="text-lg mb-4">Maintenance Updates</h3>
                <div className="text-center py-6 text-[#00ff00]/70">
                  <p className="text-sm">No maintenance updates</p>
                  <p className="text-xs mt-2">System maintenance and upgrade notifications will appear here</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!account) {
    return (
      <div className={`min-h-screen bg-black text-[#00ff00] ${pressStart.className}`}>
        <Header />
        <div className="pt-32 container mx-auto px-6 text-center">
          <h1 className="text-2xl mb-6">Connect Wallet to Access Dashboard</h1>
          <p className="text-[#00ff00]/70">Please connect your wallet to view your agent configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-[#00ff00] ${pressStart.className}`}>
      <Header />
      
      {/* Matrix Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)]"></div>
      </div>

      <div className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl">AGENT DASHBOARD</h1>
            <div className="text-sm">
              <span className="text-[#00ff00]/70">Connected:</span>{' '}
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {[
              { id: 'overview', icon: faChartLine, label: 'Overview' },
              { id: 'agents', icon: faRobot, label: 'My Agents' },
              { id: 'settings', icon: faGears, label: 'Settings' },
              { id: 'developer', icon: faCode, label: 'Developer' },
              { id: 'security', icon: faShieldHalved, label: 'Security' },
              { id: 'notifications', icon: faBell, label: 'Notifications' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border ${
                  activeSection === tab.id
                    ? 'border-[#00ff00] bg-[#00ff00]/10'
                    : 'border-[#00ff00]/30 hover:border-[#00ff00] hover:bg-[#00ff00]/5'
                } transition-all whitespace-nowrap text-sm`}
              >
                <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 