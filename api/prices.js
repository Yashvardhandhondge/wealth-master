// Vercel Serverless Function — Node.js Backend
let cachedData = null;
let lastFetch = 0;
const CACHE_TIME = 15 * 1000; // 15 seconds

export default async function handler(req, res) {
  const now = Date.now();

  if (cachedData && now - lastFetch < CACHE_TIME) {
    return res.status(200).json(cachedData);
  }

  try {
    const ids = [
      'bitcoin',
      'ethereum',
      'solana',
      'ripple',
      'cardano',
      'dogecoin',
      'binancecoin',
      'polkadot',
      'avalanche-2',
      'chainlink',
      'litecoin',
      'tron',
      'stellar',
      'internet-computer',
      'uniswap'
    ].join(',');

    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    const data = await response.json();

    cachedData = data;
    lastFetch = now;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch prices' });
  }
}
