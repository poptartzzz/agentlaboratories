import { BrowserProvider, Contract, parseUnits } from 'ethers';

const AZI_ADDRESS = '0xf5FBE542a343c2284f6B9f0B7C59464A92739d80';
const REQUIRED_AMOUNT = '1000';

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

interface EthereumError extends Error {
  code?: string;
  data?: unknown;
}

export const handleTokenPayment = async (recipientAddress: string): Promise<boolean> => {
  if (!window.ethereum) {
    alert('Please install MetaMask!');
    return false;
  }

  try {
    console.log('Initializing payment process...');
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log('Connected wallet:', await signer.getAddress());

    const tokenContract = new Contract(AZI_ADDRESS, ERC20_ABI, signer);
    console.log('Token contract initialized');
    
    const decimals = await tokenContract.decimals();
    console.log('Token decimals:', decimals);
    const amount = parseUnits(REQUIRED_AMOUNT, decimals);
    console.log('Payment amount (with decimals):', amount.toString());
    
    const balance = await tokenContract.balanceOf(await signer.getAddress());
    console.log('Current balance:', balance.toString());
    
    if (BigInt(balance) < BigInt(amount)) {
      alert(`Insufficient AZI balance. You need at least ${REQUIRED_AMOUNT} AZI tokens. Your balance: ${balance.toString()}`);
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