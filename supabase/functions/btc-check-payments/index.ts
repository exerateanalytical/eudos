import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BLOCKCYPHER_API = 'https://api.blockcypher.com/v1/btc/main';
const CONFIRMATIONS_REQUIRED = 1;

async function checkAddressTransactions(address: string, expectedAmount: number) {
  try {
    console.log(`Checking address ${address} for transactions`);
    
    // Get address details including transactions from BlockCypher
    const response = await fetch(`${BLOCKCYPHER_API}/addrs/${address}?limit=50`);
    if (!response.ok) {
      throw new Error(`BlockCypher API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check confirmed transactions (txrefs)
    if (data.txrefs && data.txrefs.length > 0) {
      for (const txref of data.txrefs) {
        const receivedBTC = txref.value / 100000000; // satoshis to BTC
        const confirmations = txref.confirmations || 0;
        
        console.log(`Found tx ${txref.tx_hash} with ${receivedBTC} BTC to ${address}, confirmations: ${confirmations}`);
        
        // Check if amount matches (with small tolerance for fees)
        if (Math.abs(receivedBTC - expectedAmount) < 0.00001) {
          return {
            found: true,
            txid: txref.tx_hash,
            confirmations,
            confirmed: confirmations >= CONFIRMATIONS_REQUIRED
          };
        }
      }
    }
    
    // Check unconfirmed transactions
    if (data.unconfirmed_txrefs && data.unconfirmed_txrefs.length > 0) {
      for (const txref of data.unconfirmed_txrefs) {
        const receivedBTC = txref.value / 100000000; // satoshis to BTC
        
        console.log(`Found unconfirmed tx ${txref.tx_hash} with ${receivedBTC} BTC to ${address}`);
        
        // Check if amount matches (with small tolerance for fees)
        if (Math.abs(receivedBTC - expectedAmount) < 0.00001) {
          return {
            found: true,
            txid: txref.tx_hash,
            confirmations: 0,
            confirmed: false
          };
        }
      }
    }
    
    return { found: false };
  } catch (error) {
    console.error(`Error checking address ${address}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { found: false, error: errorMessage };
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

    console.log('Checking pending BTC payments...');

    // Get all pending payments
    const { data: payments, error: paymentsError } = await supabaseClient
      .from('btc_payments')
      .select('*, btc_wallets(*)')
      .eq('status', 'pending');

    if (paymentsError) {
      throw paymentsError;
    }

    console.log(`Found ${payments?.length || 0} pending payments`);

    let updatedCount = 0;

    for (const payment of payments || []) {
      const result = await checkAddressTransactions(payment.address, payment.amount_btc);
      
      if (result.found && result.confirmed) {
        // Mark payment as paid
        const { error: updateError } = await supabaseClient
          .from('btc_payments')
          .update({
            status: 'paid',
            txid: result.txid,
            confirmations: result.confirmations,
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.id);

        if (!updateError) {
          console.log(`Payment ${payment.id} marked as paid (tx: ${result.txid})`);
          
          // Update linked order status to paid (order_id is now UUID)
          if (payment.order_id) {
            const { error: orderError } = await supabaseClient
              .from('orders')
              .update({
                status: 'paid',
                updated_at: new Date().toISOString()
              })
              .eq('id', payment.order_id);
            
            if (!orderError) {
              console.log(`Order ${payment.order_id} marked as paid`);
            } else {
              console.error(`Failed to update order ${payment.order_id}:`, orderError);
            }
          }
          
          updatedCount++;
        }
      } else if (result.found && !result.confirmed) {
        // Update confirmations
        const { error: updateError } = await supabaseClient
          .from('btc_payments')
          .update({
            confirmations: result.confirmations,
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.id);

        if (!updateError) {
          console.log(`Payment ${payment.id} confirmations updated: ${result.confirmations}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked: payments?.length || 0,
        updated: updatedCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error checking BTC payments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});