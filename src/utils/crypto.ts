// First, let's create a utility file for crypto functions

export async function getCryptoData(coin: string) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
    );
    const data = await response.json();
    return data[coin];
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return null;
  }
}

export async function getDetailedCryptoData(coin: string) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&community_data=true&developer_data=true&sparkline=false`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching detailed crypto data:', error);
    return null;
  }
} 