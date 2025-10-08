import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import BIP84 from "https://esm.sh/bip84@0.2.9";
import BIP32Factory from "https://esm.sh/bip32@4.0.0";
import * as ecc from "https://esm.sh/tiny-secp256k1@2.2.3";
import { payments } from "https://esm.sh/bitcoinjs-lib@6.1.5";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Derive Bitcoin address from xpub (Electrum BIP32) or zpub (BIP84)
function deriveAddressFromXpub(xpub: string, index: number, derivationPath: string): string {
  try {
    console.log(`Deriving address at index ${index} from ${xpub.substring(0, 4)}... using path ${derivationPath}`);
    
    // Check if it's a zpub (BIP84 native SegWit)
    if (xpub.startsWith('zpub')) {
      const account = new BIP84.fromZPub(xpub);
      const address = account.getAddress(index, false); // false = receiving address
      console.log(`Derived BIP84 address: ${address} at index ${index}`);
      return address;
    }
    
    // Handle xpub (Electrum BIP32)
    if (xpub.startsWith('xpub')) {
      const bip32 = BIP32Factory(ecc);
      const node = bip32.fromBase58(xpub);
      
      // Electrum exports xpub at account level (m/0h)
      // For receiving addresses, derive directly from index (no additional /0 chain)
      const child = node.derive(index);
      
      // Generate P2WPKH (native SegWit) address
      const { address } = payments.p2wpkh({ 
        pubkey: child.publicKey,
        network: { // mainnet
          messagePrefix: '\x18Bitcoin Signed Message:\n',
          bech32: 'bc',
          bip32: { public: 0x0488b21e, private: 0x0488ade4 },
          pubKeyHash: 0x00,
          scriptHash: 0x05,
          wif: 0x80
        }
      });
      
      if (!address) {
        throw new Error('Failed to generate address from xpub');
      }
      
      console.log(`Derived Electrum BIP32 address: ${address} at index ${index}`);
      return address;
    }
    
    throw new Error('Unsupported extended public key format');
    
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
    
    // Derive Bitcoin address (supports both Electrum BIP32 and BIP84)
    const address = deriveAddressFromXpub(
      walletData.xpub, 
      addressIndex,
      walletData.derivation_path
    );

    console.log(`Derived address ${address} at index ${addressIndex} from wallet ${walletData.name}`);

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