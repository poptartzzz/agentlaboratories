import { 
  Connection, 
  PublicKey, 
  Transaction
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createTransferInstruction, 
  TOKEN_PROGRAM_ID,
  getAccount
} from '@solana/spl-token';

// ALABS token on Solana (replace with actual token mint address)
const ALABS_TOKEN_MINT_ADDRESS = 'YOUR_SOLANA_TOKEN_MINT_ADDRESS_HERE';
const REQUIRED_USD_AMOUNT = 10;

// Solana RPC connection
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

interface SolanaError extends Error {
  code?: string | number;
  data?: unknown;
}

// Function to fetch ALABS token price from Jupiter or CoinGecko
export async function getALABSPrice(): Promise<number> {
  try {
    // Check if token mint address is configured
    if (!ALABS_TOKEN_MINT_ADDRESS || ALABS_TOKEN_MINT_ADDRESS === 'YOUR_SOLANA_TOKEN_MINT_ADDRESS_HERE') {
      console.log('ALABS token mint address not configured, using fallback price');
      return 0.01;
    }
    
    // Using Jupiter API for Solana token prices
    const response = await fetch(`https://price.jup.ag/v4/price?ids=${ALABS_TOKEN_MINT_ADDRESS}`);
    const data = await response.json();
    return parseFloat(data.data[ALABS_TOKEN_MINT_ADDRESS]?.price || '0.01');
  } catch (error) {
    console.error('Error fetching ALABS price:', error);
    // Fallback price
    return 0.01;
  }
}

export async function calculateRequiredALABS(): Promise<number> {
  const alabsPrice = await getALABSPrice();
  const requiredALABS = REQUIRED_USD_AMOUNT / alabsPrice;
  return Math.ceil(requiredALABS); // Round up to whole number
}

export const handleTokenPayment = async (
  recipientAddress: string, 
  walletAdapter: unknown
): Promise<boolean> => {
  const adapter = walletAdapter as { 
    connected?: boolean; 
    publicKey?: { toString(): string };
    sendTransaction?: (transaction: unknown, connection: unknown) => Promise<string>;
  };
  if (!adapter?.connected || !adapter?.publicKey) {
    alert('Please connect a Solana wallet!');
    return false;
  }

  // Check if token mint address is configured
  if (!ALABS_TOKEN_MINT_ADDRESS || ALABS_TOKEN_MINT_ADDRESS === 'YOUR_SOLANA_TOKEN_MINT_ADDRESS_HERE') {
    alert('ALABS token is not yet configured. Please wait for token deployment.');
    return false;
  }

  try {
    console.log('Initializing Solana payment process...');
    const requiredAmount = await calculateRequiredALABS();
    console.log('Required ALABS amount:', requiredAmount);
    
    const senderPublicKey = new PublicKey(adapter.publicKey.toString());
    const recipientPublicKey = new PublicKey(recipientAddress);
    const alabsTokenMint = new PublicKey(ALABS_TOKEN_MINT_ADDRESS);
    
    console.log('Sender wallet:', senderPublicKey.toString());
    console.log('Recipient wallet:', recipientPublicKey.toString());

    // Get associated token accounts
    const senderTokenAccount = await getAssociatedTokenAddress(
      alabsTokenMint,
      senderPublicKey
    );
    
    const recipientTokenAccount = await getAssociatedTokenAddress(
      alabsTokenMint,
      recipientPublicKey
    );

    // Check sender's token balance
    try {
      const senderAccount = await getAccount(connection, senderTokenAccount);
      const balance = Number(senderAccount.amount);
      console.log('Current ALABS balance:', balance);
      
      if (balance < requiredAmount) {
        alert(`Insufficient ALABS balance. You need at least ${requiredAmount} ALABS tokens. Your balance: ${balance}`);
        return false;
      }
    } catch {
      alert('You don\'t have an ALABS token account. Please acquire ALABS tokens first.');
      return false;
    }

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      senderTokenAccount,
      recipientTokenAccount,
      senderPublicKey,
      requiredAmount,
      [],
      TOKEN_PROGRAM_ID
    );

    // Create transaction
    const transaction = new Transaction().add(transferInstruction);
    
    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPublicKey;

    console.log('Sending transaction...');
    const signature = await adapter.sendTransaction!(transaction, connection);
    console.log('Transaction signature:', signature);
    
    // Confirm transaction
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    });
    
    if (confirmation.value.err) {
      throw new Error('Transaction failed: ' + confirmation.value.err);
    }
    
    console.log('Transaction confirmed!');
    return true;
    
  } catch (error) {
    const solError = error as SolanaError;
    console.error('Detailed payment error:', {
      message: solError.message,
      code: solError.code,
      data: solError.data,
      stack: solError.stack
    });

    if (solError.code === 4001) {
      alert('Transaction was rejected by user.');
    } else if (solError.message?.includes('insufficient funds')) {
      alert('Insufficient SOL for transaction fees.');
    } else {
      alert(`Payment error: ${solError.message || 'Unknown error occurred'}`);
    }
    
    return false;
  }
}; 