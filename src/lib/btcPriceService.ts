/**
 * Bitcoin Price Service
 * Fetches live BTC/USD price with caching and fallback support
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let priceCache: { price: number; timestamp: number } | null = null;

export interface BtcPriceData {
  usd: number;
  source: string;
  timestamp: number;
}

/**
 * Fetch BTC price from CoinGecko API
 */
async function fetchFromCoinGecko(): Promise<number> {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
  );
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.bitcoin.usd;
}

/**
 * Fetch BTC price from Coinbase API (fallback)
 */
async function fetchFromCoinbase(): Promise<number> {
  const response = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
  
  if (!response.ok) {
    throw new Error(`Coinbase API error: ${response.status}`);
  }
  
  const data = await response.json();
  return parseFloat(data.data.amount);
}

/**
 * Get current BTC/USD price with caching
 */
export async function getBtcPrice(forceRefresh = false): Promise<BtcPriceData> {
  const now = Date.now();
  
  // Return cached price if valid
  if (!forceRefresh && priceCache && (now - priceCache.timestamp) < CACHE_TTL_MS) {
    return {
      usd: priceCache.price,
      source: 'cache',
      timestamp: priceCache.timestamp
    };
  }
  
  // Try CoinGecko first
  try {
    const price = await fetchFromCoinGecko();
    priceCache = { price, timestamp: now };
    
    return {
      usd: price,
      source: 'coingecko',
      timestamp: now
    };
  } catch (error) {
    console.warn('CoinGecko API failed, trying Coinbase fallback:', error);
  }
  
  // Fallback to Coinbase
  try {
    const price = await fetchFromCoinbase();
    priceCache = { price, timestamp: now };
    
    return {
      usd: price,
      source: 'coinbase',
      timestamp: now
    };
  } catch (error) {
    console.error('All BTC price APIs failed:', error);
    
    // Return cached price even if stale
    if (priceCache) {
      return {
        usd: priceCache.price,
        source: 'stale-cache',
        timestamp: priceCache.timestamp
      };
    }
    
    throw new Error('Unable to fetch BTC price from any source');
  }
}

/**
 * Convert USD to BTC amount
 */
export function usdToBtc(usdAmount: number, btcPrice: number): number {
  return usdAmount / btcPrice;
}

/**
 * Convert BTC to USD amount
 */
export function btcToUsd(btcAmount: number, btcPrice: number): number {
  return btcAmount * btcPrice;
}

/**
 * Format BTC amount for display
 */
export function formatBtc(amount: number): string {
  return amount.toFixed(8) + ' BTC';
}

/**
 * Format USD amount for display
 */
export function formatUsd(amount: number): string {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
