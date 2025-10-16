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
      console.log(`✅ Derived BIP84 (zpub) address: ${address} at index ${index}`);
      return address;
    }
    
    // Handle xpub (Electrum BIP32 and other standards)
    if (xpub.startsWith('xpub')) {
      const bip32 = BIP32Factory(ecc);
      const node = bip32.fromBase58(xpub);
      
      // Normalize derivation path: m/0h → m/0'
      const normalized = (derivationPath || 'm/0\'').replace(/(\d+)h/gi, '$1\'');
      console.log(`📋 Normalized derivation path: ${normalized}`);
      
      // Determine script type from derivation path
      let scriptType = 'p2pkh'; // Default for Electrum BIP32 (m/0' or m/44')
      if (normalized.startsWith("m/84'")) {
        scriptType = 'p2wpkh'; // BIP84: bc1... (SegWit native)
      } else if (normalized.startsWith("m/49'")) {
        scriptType = 'p2sh-p2wpkh'; // BIP49: 3... (SegWit wrapped)
      }
      // m/0' or m/44' → p2pkh (legacy 1... addresses)
      
      console.log(`📋 Script type: ${scriptType}`);
      
      // Electrum exports xpub at account level (m/0')
      // Derive: chain 0 (receiving) → index
      const child = node.derive(0).derive(index);
      console.log(`📋 Derived child path: 0/${index}`);
      
      const network = {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: { public: 0x0488b21e, private: 0x0488ade4 },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
      };
      
      let address: string | undefined;
      
      if (scriptType === 'p2wpkh') {
        // BIP84: Native SegWit (bc1...)
        address = payments.p2wpkh({ pubkey: child.publicKey, network }).address;
      } else if (scriptType === 'p2sh-p2wpkh') {
        // BIP49: Wrapped SegWit (3...)
        address = payments.p2sh({ 
          redeem: payments.p2wpkh({ pubkey: child.publicKey, network }), 
          network 
        }).address;
      } else {
        // BIP32/BIP44: Legacy P2PKH (1...)
        address = payments.p2pkh({ pubkey: child.publicKey, network }).address;
      }
      
      if (!address) {
        throw new Error('Failed to generate address from xpub');
      }
      
      console.log(`✅ Derived ${scriptType.toUpperCase()} (xpub) address: ${address} at index ${index}`);
      return address;
    }
    
    throw new Error('Unsupported extended public key format');
    
  } catch (error) {
    console.error('❌ Error deriving Bitcoin address:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Address derivation failed: ${errorMessage}`);
  }
}

serve(async (req) => {
  console.log('🚀 btc-create-payment function called');
  console.log(`📋 Request method: ${req.method}`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestBody = await req.json();
    console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));
    
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
    } = requestBody;

    // Validate required fields (wallet_id optional; will auto-select active wallet if missing)
    if (!order_id || !amount_btc) {
      const errMsg = `Missing required fields - order_id: ${order_id}, amount_btc: ${amount_btc}`;
      console.error('❌', errMsg);
      throw new Error('order_id and amount_btc are required');
    }

    console.log(`✅ Creating BTC payment for order ${order_id}, amount: ${amount_btc} BTC`);

    // Resolve wallet: use provided wallet_id or select active/primary wallet
    let walletData: any | null = null;

    if (wallet_id) {
      console.log(`🔎 Fetching wallet by provided ID: ${wallet_id}`);
      const { data, error } = await supabaseClient
        .from('btc_wallets')
        .select('*')
        .eq('id', wallet_id)
        .single();
      if (error || !data) {
        console.error('❌ Wallet fetch error by ID:', error);
        throw new Error(`Wallet not found: ${error?.message || 'no data'}`);
      }
      walletData = data;
    } else {
      console.log('🔎 No wallet_id provided. Selecting active wallet (preferring primary)...');
      const { data, error } = await supabaseClient
        .from('btc_wallets')
        .select('*')
        .eq('is_active', true)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
      if (error || !data) {
        console.error('❌ Active wallet selection error:', error);
        throw new Error('No active Bitcoin wallet configured');
      }
      walletData = data;
    }

    const walletType = walletData.xpub?.startsWith('zpub') ? 'zpub' : 'xpub';
    console.log(`🔑 Using ${walletType} wallet: ${walletData.name}`);
    console.log(`📊 Wallet details - xpub prefix: ${walletData.xpub.substring(0, 8)}..., derivation: ${walletData.derivation_path}, next_index: ${walletData.next_index}`);

    // Atomically increment next_index
    const { data: updatedWallet, error: updateError } = await supabaseClient
      .from('btc_wallets')
      .update({ 
        next_index: walletData.next_index + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', walletData.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to allocate address index: ${updateError.message}`);
    }

    const addressIndex = walletData.next_index;
    console.log(`🔢 Using address index: ${addressIndex}`);
    
    // Derive Bitcoin address (supports both Electrum BIP32 and BIP84)
    console.log(`🔨 Attempting to derive ${walletType} address...`);
    const address = deriveAddressFromXpub(
      walletData.xpub, 
      addressIndex,
      walletData.derivation_path
    );

    console.log(`✅ Successfully derived ${walletType} address: ${address} at index ${addressIndex} from wallet ${walletData.name}`);

    // Insert payment record with proper UUID order_id
    const { data: payment, error: paymentError } = await supabaseClient
      .from('btc_payments')
      .insert({
        wallet_id: walletData.id,
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

    console.log(`✅ Payment created successfully: ${payment.id}`);
    console.log(`💰 Amount: ${amount_btc} BTC, Address: ${address}`);

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
    console.error('❌ ERROR creating BTC payment:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
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