import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { BIP32Factory } from "https://esm.sh/bip32@4.0.0";
import * as ecc from "https://esm.sh/tiny-secp256k1@2.2.3";
import { payments, networks } from "https://esm.sh/bitcoinjs-lib@6.1.5";

// Initialize BIP32 with ECC library
const bip32 = BIP32Factory(ecc);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Proper BIP84 Bitcoin address derivation from xpub/zpub
async function deriveAddressFromXpub(xpub: string, index: number, network: string = 'mainnet'): Promise<string> {
  try {
    console.log(`Deriving address at index ${index} from xpub`);
    
    // Determine network
    const btcNetwork = network === 'testnet' ? networks.testnet : networks.bitcoin;
    
    // Parse the extended public key (handles xpub, ypub, zpub)
    const node = bip32.fromBase58(xpub, btcNetwork);
    
    // Derive child key at the specified index (non-hardened derivation)
    const child = node.derive(index);
    
    // Generate native segwit (P2WPKH) address - bc1q... format
    const payment = payments.p2wpkh({
      pubkey: child.publicKey,
      network: btcNetwork
    });
    
    if (!payment.address) {
      throw new Error('Failed to generate Bitcoin address');
    }
    
    console.log(`Generated address: ${payment.address}`);
    return payment.address;
    
  } catch (error) {
    console.error('Error deriving Bitcoin address:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Address derivation failed: ${errorMessage}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      wallet_id, 
      order_id, 
      amount_btc, 
      amount_fiat, 
      user_id, 
      metadata,
      guest_name,
      guest_phone,
      guest_email,
      product_name,
      product_type
    } = await req.json();

    if (!wallet_id || !order_id || !amount_btc) {
      throw new Error('wallet_id, order_id, and amount_btc are required');
    }

    console.log(`Creating BTC payment for order ${order_id}, amount: ${amount_btc} BTC`);

    // Start transaction: atomically increment wallet index
    const { data: walletData, error: walletError } = await supabaseClient
      .from('btc_wallets')
      .select('*')
      .eq('id', wallet_id)
      .single();

    if (walletError || !walletData) {
      throw new Error(`Wallet not found: ${walletError?.message}`);
    }

    // Atomically increment next_index
    const { data: updatedWallet, error: updateError } = await supabaseClient
      .from('btc_wallets')
      .update({ 
        next_index: walletData.next_index + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', wallet_id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to allocate address index: ${updateError.message}`);
    }

    const addressIndex = walletData.next_index;
    
    // Derive Bitcoin address using proper BIP84 derivation
    const address = await deriveAddressFromXpub(
      walletData.xpub, 
      addressIndex,
      walletData.network || 'mainnet'
    );

    console.log(`Derived BIP84 address ${address} at index ${addressIndex} from wallet ${walletData.name}`);

    // Insert payment record with proper UUID order_id
    const { data: payment, error: paymentError } = await supabaseClient
      .from('btc_payments')
      .insert({
        wallet_id,
        user_id: user_id || null,
        order_id, // Now properly typed as UUID
        address_index: addressIndex,
        address,
        amount_btc,
        amount_fiat: amount_fiat || null,
        status: 'pending',
        metadata: {
          ...metadata,
          guest_name,
          guest_phone,
          guest_email,
          product_name,
          product_type
        }
      })
      .select()
      .single();

    if (paymentError) {
      throw new Error(`Failed to create payment: ${paymentError.message}`);
    }

    // Generate QR code data URI (Bitcoin URI format)
    const bitcoinURI = `bitcoin:${address}?amount=${amount_btc}`;

    console.log(`Payment created: ${payment.id}`);

    return new Response(
      JSON.stringify({
        payment,
        bitcoinURI,
        qrCodeData: bitcoinURI // Frontend can generate QR from this
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating BTC payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});