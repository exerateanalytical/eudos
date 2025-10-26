/**
 * XPUB Derivation Module
 * Generates Bitcoin addresses from extended public keys (xpub) using BIP84 (native segwit)
 */

import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';

// @ts-ignore - tiny-secp256k1 types
import * as ecc from 'tiny-secp256k1';

// @ts-ignore - bip32 factory typing
const bip32 = BIP32Factory(ecc);

export interface DerivedAddress {
  address: string;
  index: number;
  derivationPath: string;
}

/**
 * Derive a Bitcoin address from an xpub at a specific index
 * Uses BIP84 derivation path for native segwit (bc1...)
 * 
 * @param xpub - Extended public key (starts with xpub for mainnet, tpub for testnet)
 * @param index - Derivation index
 * @param network - 'mainnet' or 'testnet'
 * @returns Derived Bitcoin address
 */
export function deriveAddressFromXpub(
  xpub: string,
  index: number,
  network: 'mainnet' | 'testnet' = 'mainnet'
): DerivedAddress {
  try {
    // Select Bitcoin network
    const btcNetwork = network === 'testnet' 
      ? bitcoin.networks.testnet 
      : bitcoin.networks.bitcoin;

    // Parse the xpub
    const node = bip32.fromBase58(xpub, btcNetwork);
    
    // Derive child key at index (BIP84: m/84'/0'/0'/0/index)
    const child = node.derive(0).derive(index);
    
    // Generate P2WPKH address (native segwit)
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: btcNetwork,
    });

    if (!address) {
      throw new Error('Failed to generate address');
    }

    const derivationPath = `m/84'/0'/0'/0/${index}`;

    return {
      address,
      index,
      derivationPath,
    };
  } catch (error) {
    console.error('Error deriving address from xpub:', error);
    throw new Error(`Failed to derive address: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Derive multiple addresses from an xpub
 * 
 * @param xpub - Extended public key
 * @param startIndex - Starting derivation index
 * @param count - Number of addresses to generate
 * @param network - 'mainnet' or 'testnet'
 * @returns Array of derived addresses
 */
export function deriveMultipleAddresses(
  xpub: string,
  startIndex: number,
  count: number,
  network: 'mainnet' | 'testnet' = 'mainnet'
): DerivedAddress[] {
  const addresses: DerivedAddress[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    const derived = deriveAddressFromXpub(xpub, index, network);
    addresses.push(derived);
  }
  
  return addresses;
}

/**
 * Validate xpub format
 * 
 * @param xpub - Extended public key to validate
 * @param network - Expected network
 * @returns true if valid, false otherwise
 */
export function validateXpub(
  xpub: string,
  network: 'mainnet' | 'testnet' = 'mainnet'
): boolean {
  try {
    const btcNetwork = network === 'testnet' 
      ? bitcoin.networks.testnet 
      : bitcoin.networks.bitcoin;
    
    bip32.fromBase58(xpub, btcNetwork);
    
    // Check prefix
    const expectedPrefix = network === 'testnet' ? 'tpub' : 'xpub';
    if (!xpub.startsWith(expectedPrefix)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}
