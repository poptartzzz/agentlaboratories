const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

export async function getTokenInfo(address: string) {
  try {
    // First try to get ERC20 token info
    const tokenResponse = await fetch(
      `${ETHERSCAN_API_URL}?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`
    );
    const tokenData = await tokenResponse.json();

    // Get token transactions to determine activity
    const txResponse = await fetch(
      `${ETHERSCAN_API_URL}?module=account&action=tokentx&address=${address}&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`
    );
    const txData = await txResponse.json();

    // Get contract ABI to determine if it's a token
    const abiResponse = await fetch(
      `${ETHERSCAN_API_URL}?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`
    );
    const abiData = await abiResponse.json();

    if (tokenData.status === '1' && tokenData.result[0]) {
      const contractInfo = tokenData.result[0];
      const transactions = txData.result || [];
      const isVerified = contractInfo.CompilerVersion !== '';

      return {
        name: contractInfo.ContractName,
        isVerified,
        implementation: contractInfo.Implementation || 'No proxy',
        compiler: contractInfo.CompilerVersion,
        transactions: transactions.length,
        lastTx: transactions[0]?.timeStamp ? new Date(transactions[0].timeStamp * 1000).toLocaleString() : 'No transactions',
        isToken: abiData.status === '1' && abiData.result.includes('transfer('),
        deployedAt: contractInfo.CreationDate || 'Unknown',
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
}

export async function getTokenHolders(address: string) {
  try {
    const response = await fetch(`${ETHERSCAN_API_URL}?module=token&action=tokenholderlist&contractaddress=${address}&apikey=${ETHERSCAN_API_KEY}`);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching token holders:', error);
    return null;
  }
}

export async function getTokenTransactions(address: string) {
  try {
    const response = await fetch(`${ETHERSCAN_API_URL}?module=account&action=tokentx&address=${address}&apikey=${ETHERSCAN_API_KEY}`);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching token transactions:', error);
    return null;
  }
} 