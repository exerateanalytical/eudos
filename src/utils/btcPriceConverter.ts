/**
 * Bitcoin Price Converter Utility
 * Fetches real-time BTC/USD rates and converts fiat prices to BTC
 * Uses CoinGecko API (free, no auth required)
 * Caches rates for 5 minutes using localStorage
 */

const CACHE_KEY = 'btc_price_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const FALLBACK_BTC_USD_RATE = 45000; // Fallback if API fails

interface PriceCache {
  rate: number;
  timestamp: number;
}

/**
 * Fetches current BTC/USD rate from CoinGecko API
 * @returns Promise<number> - Current BTC price in USD
 */
async function fetchBtcUsdRate(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    const rate = data?.bitcoin?.usd;

    if (!rate || typeof rate !== 'number') {
      throw new Error('Invalid rate data from CoinGecko');
    }

    return rate;
  } catch (error) {
    console.error('Failed to fetch BTC rate:', error);
    return FALLBACK_BTC_USD_RATE;
  }
}

/**
 * Gets BTC/USD rate with caching
 * @returns Promise<number> - Current BTC price in USD
 */
async function getCachedBtcRate(): Promise<number> {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    
    if (cachedData) {
      const cache: PriceCache = JSON.parse(cachedData);
      const now = Date.now();
      
      // Check if cache is still valid (less than 5 minutes old)
      if (now - cache.timestamp < CACHE_DURATION) {
        console.log('Using cached BTC rate:', cache.rate);
        return cache.rate;
      }
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }

  // Fetch fresh rate
  const rate = await fetchBtcUsdRate();
  
  // Store in cache
  try {
    const cache: PriceCache = {
      rate,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Cache write error:', error);
  }

  return rate;
}

/**
 * Converts USD amount to BTC
 * @param usdAmount - Amount in USD to convert
 * @returns Promise<number> - Equivalent amount in BTC
 */
export async function convertUsdToBtc(usdAmount: number): Promise<number> {
  if (!usdAmount || usdAmount <= 0) {
    return 0;
  }

  const btcUsdRate = await getCachedBtcRate();
  const btcAmount = usdAmount / btcUsdRate;
  
  // Return with 8 decimal precision (standard for BTC)
  return parseFloat(btcAmount.toFixed(8));
}

/**
 * Formats BTC amount for display
 * @param btcAmount - Amount in BTC
 * @param precision - Number of decimal places (default: 8)
 * @returns string - Formatted BTC amount
 */
export function formatBtcAmount(btcAmount: number, precision: number = 8): string {
  if (!btcAmount || btcAmount === 0) {
    return '0.00000000 BTC';
  }

  return `${btcAmount.toFixed(precision)} BTC`;
}

/**
 * Extracts numeric value from price string (e.g., "$2,500" -> 2500)
 * @param priceString - Price string like "$2,500" or "USD 50,000"
 * @returns number - Numeric value
 */
export function parsePriceString(priceString: string): number {
  // Remove currency symbols, spaces, and commas
  const cleaned = priceString.replace(/[$,USD\s]/g, '');
  const value = parseFloat(cleaned);
  
  if (isNaN(value)) {
    console.error('Invalid price string:', priceString);
    return 0;
  }
  
  return value;
}

/**
 * Converts price string to BTC
 * @param priceString - Price string like "$2,500"
 * @returns Promise<number> - Equivalent amount in BTC
 */
export async function convertPriceStringToBtc(priceString: string): Promise<number> {
  const usdAmount = parsePriceString(priceString);
  return convertUsdToBtc(usdAmount);
}
