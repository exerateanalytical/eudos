import QRCode from 'qrcode';

/**
 * Validates Bitcoin address format (bc1 Bech32 format)
 */
export const isValidBitcoinAddress = (address: string): boolean => {
  const bech32Regex = /^bc1[a-z0-9]{39,87}$/i;
  return bech32Regex.test(address);
};

/**
 * Generates QR code data URL for Bitcoin address
 * @param address Bitcoin address
 * @param amount Optional BTC amount
 * @returns Base64 data URL for QR code image
 */
export const generateBitcoinQR = async (
  address: string,
  amount?: number
): Promise<string> => {
  // Bitcoin URI format: bitcoin:<address>?amount=<btc_amount>
  const uri = amount 
    ? `bitcoin:${address}?amount=${amount}`
    : `bitcoin:${address}`;
  
  try {
    const qrDataUrl = await QRCode.toDataURL(uri, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating Bitcoin QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Formats Bitcoin address for display (truncated)
 */
export const formatBitcoinAddress = (address: string): string => {
  if (address.length <= 20) return address;
  return `${address.slice(0, 10)}...${address.slice(-10)}`;
};
