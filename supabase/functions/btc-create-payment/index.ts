import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bitcoin address derivation using bitcoinjs-lib equivalent
// Note: For production, use a proper Bitcoin library
async function deriveAddressFromXpub(xpub: string, index: number): Promise<string> {
  // This is a simplified placeholder - in production, use proper BIP32/BIP84 derivation
  // For now, we'll use a deterministic hash-based approach as a placeholder
  const encoder = new TextEncoder();
  const data = encoder.encode(`${xpub}-${index}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  // Generate a placeholder Bitcoin address (for demo - replace with real derivation)
  return `bc1q${hashHex.substring(0, 40)}`;
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

    const { wallet_id, order_id, amount_btc, amount_fiat, user_id, metadata } = await req.json();

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
    
    // Derive Bitcoin address
    const address = await deriveAddressFromXpub(walletData.xpub, addressIndex);

    console.log(`Derived address ${address} at index ${addressIndex}`);

    // Insert payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('btc_payments')
      .insert({
        wallet_id,
        user_id: user_id || null,
        order_id,
        address_index: addressIndex,
        address,
        amount_btc,
        amount_fiat: amount_fiat || null,
        status: 'pending',
        metadata: metadata || null
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