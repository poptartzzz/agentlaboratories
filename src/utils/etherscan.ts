import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getMint, getTokenSupply } from '@solana/spl-token';

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

export async function getTokenInfo(mintAddress: string) {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    
    // Get mint information
    const mintInfo = await getMint(connection, mintPublicKey);
    
    // Get token supply
    const supplyInfo = await getTokenSupply(connection, mintPublicKey);
    
    // Get recent transactions (signatures)
    const signatures = await connection.getSignaturesForAddress(mintPublicKey, { limit: 100 });
    
    // Try to get token metadata from Metaplex (if available)
    let tokenName = 'Unknown Token';
    let tokenSymbol = 'UNKNOWN';
    
    try {
      // This would require Metaplex SDK for full metadata
      // For now, we'll use basic info from the mint
      tokenName = `SPL Token`;
      tokenSymbol = 'SPL';
    } catch (metadataError) {
      console.log('No metadata found for token');
    }

    return {
      name: tokenName,
      symbol: tokenSymbol,
      mintAddress: mintAddress,
      decimals: mintInfo.decimals,
      supply: supplyInfo.value.uiAmountString || '0',
      isInitialized: mintInfo.isInitialized,
      freezeAuthority: mintInfo.freezeAuthority?.toString() || 'None',
      mintAuthority: mintInfo.mintAuthority?.toString() || 'None',
      transactions: signatures.length,
      lastTx: signatures[0]?.blockTime 
        ? new Date(signatures[0].blockTime * 1000).toLocaleString() 
        : 'No transactions',
      isToken: true,
    };
  } catch (error) {
    console.error('Error fetching Solana token info:', error);
    return null;
  }
}

export async function getTokenHolders(mintAddress: string) {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    
    // Note: Getting all token holders on Solana requires scanning all token accounts
    // This is computationally expensive and typically done by indexing services
    // For now, we'll return a placeholder that suggests using a service like Helius or Alchemy
    
    console.log('Token holder lookup requires specialized indexing service for Solana');
    return {
      message: 'Token holder data requires specialized indexing service',
      suggestion: 'Use services like Helius, Alchemy, or SolanaFM for comprehensive token holder data'
    };
  } catch (error) {
    console.error('Error fetching Solana token holders:', error);
    return null;
  }
}

export async function getTokenTransactions(mintAddress: string) {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    
    // Get recent transaction signatures for the mint address
    const signatures = await connection.getSignaturesForAddress(mintPublicKey, { 
      limit: 50 
    });
    
    // Get transaction details for each signature
    const transactions = [];
    for (const sigInfo of signatures.slice(0, 10)) { // Limit to first 10 for performance
      try {
        const tx = await connection.getTransaction(sigInfo.signature, {
          maxSupportedTransactionVersion: 0
        });
        
        if (tx) {
          transactions.push({
            signature: sigInfo.signature,
            slot: sigInfo.slot,
            blockTime: sigInfo.blockTime,
            confirmationStatus: sigInfo.confirmationStatus,
            err: sigInfo.err,
            fee: tx.meta?.fee || 0,
            success: !sigInfo.err
          });
        }
      } catch (txError) {
        console.error('Error fetching transaction details:', txError);
      }
    }
    
    return transactions;
  } catch (error) {
    console.error('Error fetching Solana token transactions:', error);
    return null;
  }
} 