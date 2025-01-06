import { BrowserProvider, Contract, parseUnits } from 'ethers';

const AZI_ADDRESS = '0xf5FBE542a343c2284f6B9f0B7C59464A92739d80';
const REQUIRED_AMOUNT = '5000';

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export const handleTokenPayment = async (recipientAddress: string): Promise<boolean> => {
  if (!window.ethereum) {
    alert('Please install MetaMask!');
    return false;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new Contract(AZI_ADDRESS, ERC20_ABI, signer);
    
    const decimals = await tokenContract.decimals();
    const amount = parseUnits(REQUIRED_AMOUNT, decimals);
    
    const balance = await tokenContract.balanceOf(await signer.getAddress());
    if (balance.lt(amount)) {
      alert('Insufficient AZI balance. You need at least 5000 AZI tokens.');
      return false;
    }

    const tx = await tokenContract.transfer(recipientAddress, amount);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error processing payment:', error);
    alert('Error processing payment. Please try again.');
    return false;
  }
}; 