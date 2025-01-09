import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaTelegram } from 'react-icons/fa';
import { useState } from 'react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';

// ABI for ERC20 token balance check
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

interface WalletError extends Error {
  code?: number;
  data?: unknown;
}

export default function Header() {
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const SXA_ADDRESS = '0x61bAFCF2BdA2F870F2c29157E729F30058cF5314';

  const disconnectWallet = () => {
    setAccount('');
    setBalance('0');
    setShowWalletMenu(false);
  };

  const switchWallet = async () => {
    setShowWalletMenu(false);
    await connectWallet();
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsConnecting(true);
        
        // Request switch to Base Network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }], // Base Network chainId
          });
        } catch (error: unknown) {
          const switchError = error as WalletError;
          console.log('Switch error:', switchError);
          // If Base Network is not added, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x2105',
                  chainName: 'Base',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://mainnet.base.org'],
                  blockExplorerUrls: ['https://basescan.org']
                }]
              });
            } catch (addError) {
              console.error('Error adding Base network:', addError);
              alert('Failed to add Base network. Please add it manually in your wallet.');
              return;
            }
          } else {
            console.error('Error switching to Base network:', switchError);
            alert('Failed to switch to Base network. Please try again.');
            return;
          }
        }

        const result = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = result as string[];
        setAccount(accounts[0]);
        await fetchTokenBalance(accounts[0]);
        
        // Only add listener after user explicitly connects
        window.ethereum.on('accountsChanged', (accounts: unknown) => {
          const addressArray = accounts as string[];
          setAccount(addressArray[0] || '');
          if (addressArray[0]) {
            fetchTokenBalance(addressArray[0]);
          }
        });
      } catch (error) {
        console.error('Error connecting wallet:', error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const fetchTokenBalance = async (address: string) => {
    try {
      if (!window.ethereum) return;

      console.log('Fetching balance for address:', address);
      console.log('Token address:', SXA_ADDRESS);

      const provider = new BrowserProvider(window.ethereum);
      const tokenContract = new Contract(SXA_ADDRESS, ERC20_ABI, provider);

      // Add error handling for each call
      try {
        const decimals = await tokenContract.decimals();
        console.log('Decimals:', decimals);
        const balance = await tokenContract.balanceOf(address);
        console.log('Raw balance:', balance.toString());
        const formattedBalance = formatUnits(balance, decimals);
        console.log('Formatted balance:', formattedBalance);
        setBalance(Math.floor(parseFloat(formattedBalance)).toString());
      } catch (contractError) {
        console.error('Contract call error:', contractError);
        setBalance('Error');
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
      setBalance('Error');
    }
  };

  return (
    <div className="fixed w-full z-50 bg-black/80 backdrop-blur-lg py-1 border-b border-[#00ff00]/30">
      <div className="container mx-auto px-6">
        <div className="flex items-center py-3">
          <Link href="/" className="text-xl md:text-2xl">
            <Image 
              src="/sidekicxai.png"
              alt="SIDEKIX"
              width={180}
              height={60}
              className="object-contain h-12"
            />
          </Link>

          <div className="flex-1 flex items-center justify-center gap-6 mx-6">
            <Link href="/create" className="hover:text-[#00ff00] transition-colors">
              CREATE
            </Link>
            <Link href="/app" className="hover:text-[#00ff00] transition-colors">
              AGENTS
            </Link>
            <Link href="/about" className="hover:text-[#00ff00] transition-colors">
              ABOUT
            </Link>
            <a 
              href="https://docs.sidekixai.io" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#00ff00] transition-colors"
            >
              LITEPAPER
            </a>
            <div className="flex items-center gap-4 border-l border-[#00ff00]/30 pl-6">
              <a 
                href="https://x.com/SidekixAi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00ff00] transition-colors"
              > 
                <FaTwitter size={20} />
              </a>
              <a 
                href="https://t.me/sidekixai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00ff00] transition-colors"
              >
                <FaTelegram size={20} />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-[200px] flex justify-end">
              {account ? (
                <div className="flex items-center gap-4 relative">
                  <button 
                    onClick={() => setShowWalletMenu(!showWalletMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 transition-all rounded-sm whitespace-nowrap text-sm"
                  >
                    <span className="text-[#00ff00] font-medium">{balance}</span>
                    <span>SXA</span>
                    <div className="w-px h-4 bg-[#00ff00]/30" />
                    <span className="ml-2">{account.slice(0, 6)}...{account.slice(-4)}</span>
                  </button>
                  {showWalletMenu && (
                    <div className="absolute right-0 top-full mt-2 py-1 w-48 bg-black/95 border border-[#00ff00]/30 backdrop-blur-md rounded-sm">
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
                  )}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-5 py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 hover:border-[#00ff00] transition-all text-sm rounded-sm"
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 