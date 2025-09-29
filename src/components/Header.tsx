import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaTelegram, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';

interface SolanaWalletError extends Error {
  code?: number;
  data?: unknown;
}

export default function Header() {
  const [account, setAccount] = useState<string>('');
  const [solBalance, setSolBalance] = useState<string>('Loading...');
  const [alabsBalance, setAlabsBalance] = useState<string>('Loading...');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const disconnectWallet = async () => {
    try {
      if (window.solana && window.solana.disconnect) {
        await window.solana.disconnect();
      }
      setAccount('');
      setSolBalance('0');
      setAlabsBalance('0');
      setShowWalletMenu(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const switchWallet = async () => {
    setShowWalletMenu(false);
    await connectWallet();
  };

  const fetchBalances = async () => {
    // Set waiting state for balance display
    setSolBalance('Loading...');
    setAlabsBalance('Loading...');
    
    console.log('Wallet connected successfully. Waiting for contract address to display ALABS balance.');
    
    // TODO: Implement proper balance fetching when ALABS token contract is deployed
    // For now, show loading state to indicate we're waiting for token deployment
  };

  const connectWallet = async () => {
    try {
      if (typeof window.solana !== 'undefined' && window.solana.isPhantom) {
        try {
          setIsConnecting(true);
          
          // Connect to Phantom wallet
          const response = await window.solana.connect();
          const publicKey = new PublicKey(response.publicKey.toString());
          
          setAccount(publicKey.toString());
          await fetchBalances();
          
          console.log('Phantom wallet connected successfully!');
        } catch (error) {
          console.log('Error connecting wallet:', error);
          const solError = error as SolanaWalletError;
          if (solError.code === 4001) {
            alert('Connection rejected by user');
          } else {
            alert('Failed to connect wallet. Please try again.');
          }
        } finally {
          setIsConnecting(false);
        }
      } else {
        alert('Please install Phantom wallet! Visit phantom.app');
      }
    } catch (error) {
      console.log('Wallet connection error:', error);
      setIsConnecting(false);
    }
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.solana?.isPhantom && window.solana.publicKey) {
          const publicKey = new PublicKey(window.solana.publicKey.toString());
          setAccount(publicKey.toString());
          await fetchBalances();
        }
      } catch (error) {
        console.log('Initial wallet check failed:', error);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <>
      <div className="fixed w-full z-50 bg-black/80 backdrop-blur-lg py-1 border-b border-[#00ff00]/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <Image 
                  src="/labswebsitelogo.png"
                  alt="Agent Labs"
                  width={180}
                  height={60}
                  className="object-contain h-8 sm:h-10 md:h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-1 items-center justify-center gap-6 mx-6">
              <Link href="/create" className="hover:text-[#00ff00] transition-colors text-sm">
                CREATE
              </Link>
              <Link href="/app" className="hover:text-[#00ff00] transition-colors text-sm">
                AGENTS
              </Link>
              <Link href="/dashboard" className="hover:text-[#00ff00] transition-colors text-sm">
                DASHBOARD
              </Link>
              <Link href="/about" className="hover:text-[#00ff00] transition-colors text-sm">
                ABOUT
              </Link>
              <div className="flex items-center gap-4 border-l border-[#00ff00]/30 pl-6">
                <a 
                  href="https://x.com/agentlab_x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00ff00] transition-colors"
                > 
                  <FaTwitter size={18} />
                </a>
                <a 
                  href="https://t.me/agentlaboratories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00ff00] transition-colors"
                >
                  <FaTelegram size={18} />
                </a>
              </div>
            </div>

            {/* Desktop Wallet Section */}
            <div className="hidden lg:flex items-center">
              {account ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowWalletMenu(!showWalletMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 transition-all rounded-sm text-sm"
                  >
                    <span className="text-[#00ff00]/70">{account.slice(0, 4)}...{account.slice(-4)}</span>
                    <svg 
                      className={`w-3 h-3 text-[#00ff00]/70 transition-transform ${showWalletMenu ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showWalletMenu && (
                    <div className="absolute right-0 top-full mt-2 py-2 w-64 bg-black/95 border border-[#00ff00]/30 backdrop-blur-md rounded-sm">
                      {/* Balance Details */}
                      <div className="px-4 py-2 border-b border-[#00ff00]/20">
                        <div className="text-xs text-[#00ff00]/70 mb-1">Balances</div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#00ff00] font-medium">{solBalance === 'Loading...' ? 'Loading...' : `${solBalance} SOL`}</span>
                          <span className="text-[#00ff00] font-medium">{alabsBalance === 'Loading...' ? 'Loading...' : `${alabsBalance} ALABS`}</span>
                        </div>
                        {solBalance === 'Loading...' && (
                          <div className="text-xs text-[#00ff00]/50 mt-1 italic flex items-center gap-1">
                            <div className="w-3 h-3 border border-[#00ff00]/50 border-t-[#00ff00] rounded-full animate-spin"></div>
                            Waiting for contract address to display ALABS balance
                          </div>
                        )}
                      </div>
                      
                      
                      {/* Actions */}
                      <div className="py-1">
                        <button
                          onClick={switchWallet}
                          className="w-full text-left px-4 py-2 hover:bg-[#00ff00]/10 transition-colors text-sm hover:text-[#00ff00]"
                        >
                          Switch Wallet
                        </button>
                        <button
                          onClick={disconnectWallet}
                          className="w-full text-left px-4 py-2 hover:bg-[#00ff00]/10 transition-colors text-sm text-red-400 hover:text-red-300"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-4 py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 hover:border-[#00ff00] transition-all text-sm rounded-sm"
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Mobile Wallet Button */}
              {account ? (
                <button 
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="flex items-center gap-1 px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded text-xs"
                >
                  <span className="text-[#00ff00]/70">{account.slice(0, 4)}...{account.slice(-4)}</span>
                  <svg 
                    className={`w-2.5 h-2.5 text-[#00ff00]/70 transition-transform ${showWalletMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 transition-all text-xs rounded"
                >
                  {isConnecting ? '...' : 'Connect'}
                </button>
              )}
              
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#00ff00] hover:text-[#00ff00]/70 transition-colors p-2"
              >
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-black/95 border-l border-[#00ff00]/30 backdrop-blur-md">
            <div className="p-6">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold text-[#00ff00]">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#00ff00] hover:text-[#00ff00]/70 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="space-y-4 mb-8">
                <Link 
                  href="/create" 
                  className="block py-3 px-4 hover:bg-[#00ff00]/10 hover:text-[#00ff00] transition-colors rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  CREATE
                </Link>
                <Link 
                  href="/app" 
                  className="block py-3 px-4 hover:bg-[#00ff00]/10 hover:text-[#00ff00] transition-colors rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AGENTS
                </Link>
                <Link 
                  href="/dashboard" 
                  className="block py-3 px-4 hover:bg-[#00ff00]/10 hover:text-[#00ff00] transition-colors rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  DASHBOARD
                </Link>
                <Link 
                  href="/about" 
                  className="block py-3 px-4 hover:bg-[#00ff00]/10 hover:text-[#00ff00] transition-colors rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ABOUT
                </Link>
              </nav>

              {/* Mobile Social Links */}
              <div className="border-t border-[#00ff00]/30 pt-6 mb-6">
                <h3 className="text-sm text-[#00ff00]/70 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://x.com/agentlab_x"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 transition-colors rounded"
                  > 
                    <FaTwitter size={18} />
                  </a>
                  <a 
                    href="https://t.me/agentlaboratories"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 transition-colors rounded"
                  >
                    <FaTelegram size={18} />
                  </a>
                </div>
              </div>

              {/* Mobile Wallet Section */}
              {account && (
                <div className="border-t border-[#00ff00]/30 pt-6">
                  <h3 className="text-sm text-[#00ff00]/70 mb-4">Wallet</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded">
                      <div className="text-xs text-[#00ff00]/70 mb-1">SOL Balance</div>
                      <div className="text-[#00ff00] font-medium">{solBalance} SOL</div>
                    </div>
                    <div className="p-3 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded">
                      <div className="text-xs text-[#00ff00]/70 mb-1">ALABS Balance</div>
                      <div className="text-[#00ff00] font-medium">{alabsBalance} ALABS</div>
                    </div>
                    <div className="p-3 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded">
                      <div className="text-xs text-[#00ff00]/70 mb-1">Address</div>
                      <div className="text-[#00ff00] font-mono text-xs break-all">{account}</div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          switchWallet();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex-1 py-2 px-3 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 transition-colors text-sm rounded"
                      >
                        Switch Wallet
                      </button>
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex-1 py-2 px-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors text-sm text-red-400 rounded"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Wallet Menu Dropdown */}
      {showWalletMenu && account && (
        <div className="fixed top-16 right-4 z-40 lg:hidden">
          <div className="bg-black/95 border border-[#00ff00]/30 backdrop-blur-md rounded-sm py-2 w-64">
            {/* Balance Details */}
            <div className="px-4 py-2 border-b border-[#00ff00]/20">
              <div className="text-xs text-[#00ff00]/70 mb-1">Balances</div>
              <div className="flex justify-between items-center">
                <span className="text-[#00ff00] font-medium">{solBalance === 'Loading...' ? 'Loading...' : `${solBalance} SOL`}</span>
                <span className="text-[#00ff00] font-medium">{alabsBalance === 'Loading...' ? 'Loading...' : `${alabsBalance} ALABS`}</span>
              </div>
              {solBalance === 'Loading...' && (
                <div className="text-xs text-[#00ff00]/50 mt-1 italic flex items-center gap-1">
                  <div className="w-3 h-3 border border-[#00ff00]/50 border-t-[#00ff00] rounded-full animate-spin"></div>
                  Waiting for contract address to display ALABS balance
                </div>
              )}
            </div>
            
            
            {/* Actions */}
            <div className="py-1">
              <button
                onClick={switchWallet}
                className="w-full text-left px-4 py-2 hover:bg-[#00ff00]/10 transition-colors text-sm hover:text-[#00ff00]"
              >
                Switch Wallet
              </button>
              <button
                onClick={disconnectWallet}
                className="w-full text-left px-4 py-2 hover:bg-[#00ff00]/10 transition-colors text-sm text-red-400 hover:text-red-300"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 