import { BrowserProvider, Contract, parseUnits } from 'ethers';

const SXA_ADDRESS = '0x61bAFCF2BdA2F870F2c29157E729F30058cF5314';
const REQUIRED_USD_AMOUNT = 50;

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
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  }
];

interface EthereumError extends Error {
  code?: string;
  data?: unknown;
}

// Function to fetch SXA price from DEX or API
export async function getSXAPrice(): Promise<number> {
  try {
    // Replace this URL with actual price API endpoint
    const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/0x61bAFCF2BdA2F870F2c29157E729F30058cF5314');
    const data = await response.json();
    return parseFloat(data.pairs[0].priceUsd);
  } catch (error) {
    console.error('Error fetching SXA price:', error);
    throw new Error('Failed to fetch SXA price');
  }
}

export async function calculateRequiredSXA(): Promise<string> {
  const sxaPrice = await getSXAPrice();
  const requiredSXA = REQUIRED_USD_AMOUNT / sxaPrice;
  return requiredSXA.toFixed(0); // Round to whole number
}

export const handleTokenPayment = async (recipientAddress: string): Promise<boolean> => {
  if (!window.ethereum) {
    alert('Please install MetaMask!');
    return false;
  }

  try {
    console.log('Initializing payment process...');
    const requiredAmount = await calculateRequiredSXA();
    console.log('Required SXA amount:', requiredAmount);
    
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log('Connected wallet:', await signer.getAddress());

    const tokenContract = new Contract(SXA_ADDRESS, ERC20_ABI, signer);
    console.log('Token contract initialized');
    
    const decimals = await tokenContract.decimals();
    console.log('Token decimals:', decimals);
    const amount = parseUnits(requiredAmount, decimals);
    console.log('Payment amount (with decimals):', amount.toString());
    
    const balance = await tokenContract.balanceOf(await signer.getAddress());
    console.log('Current balance:', balance.toString());
    
    if (BigInt(balance) < BigInt(amount)) {
      alert(`Insufficient SXA balance. You need at least ${REQUIRED_USD_AMOUNT} SXA tokens. Your balance: ${balance.toString()}`);
      return false;
    }

    console.log('Initiating transfer to:', recipientAddress);
    const tx = await tokenContract.transfer(recipientAddress, amount);
    console.log('Transaction sent:', tx.hash);
    console.log('Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);
    
    return true;
  } catch (error) {
    const ethError = error as EthereumError;
    console.error('Detailed payment error:', {
      message: ethError.message,
      code: ethError.code,
      data: ethError.data,
      stack: ethError.stack
    });

    if (ethError.code === 'ACTION_REJECTED') {
      alert('Transaction was rejected by user.');
    } else if (ethError.code === 'INSUFFICIENT_FUNDS') {
      alert('Insufficient ETH for gas fees.');
    } else {
      alert(`Payment error: ${ethError.message || 'Unknown error occurred'}`);
    }
    
    return false;
  }
}; 