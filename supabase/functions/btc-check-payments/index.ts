import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CONFIRMATIONS_REQUIRED = 1;

// Blockchain API providers
const API_PROVIDERS = {
  blockcypher: {
    name: 'BlockCypher',
    baseUrl: 'https://api.blockcypher.com/v1/btc/main',
    rateLimit: 200, // requests per hour on free tier
  },
  blockchain: {
    name: 'Blockchain.info',
    baseUrl: 'https://blockchain.info',
    rateLimit: 300,
  },
  blockstream: {
    name: 'Blockstream',
    baseUrl: 'https://blockstream.info/api',
    rateLimit: 600,
  },
};

async function checkWithBlockCypher(address: string, expectedAmount: number) {
  const apiToken = Deno.env.get('BLOCKCYPHER_API_TOKEN');
  const url = apiToken 
    ? `${API_PROVIDERS.blockcypher.baseUrl}/addrs/${address}?limit=50&token=${apiToken}`
    : `${API_PROVIDERS.blockcypher.baseUrl}/addrs/${address}?limit=50`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`BlockCypher API error: ${response.status}`);
  
  const data = await response.json();
  
  // Check confirmed transactions
  if (data.txrefs && data.txrefs.length > 0) {
    for (const txref of data.txrefs) {
      const receivedBTC = txref.value / 100000000;
      if (Math.abs(receivedBTC - expectedAmount) < 0.00001) {
        return {
          found: true,
          txid: txref.tx_hash,
          confirmations: txref.confirmations || 0,
          confirmed: (txref.confirmations || 0) >= CONFIRMATIONS_REQUIRED
        };
      }
    }
  }
  
  // Check unconfirmed transactions
  if (data.unconfirmed_txrefs && data.unconfirmed_txrefs.length > 0) {
    for (const txref of data.unconfirmed_txrefs) {
      const receivedBTC = txref.value / 100000000;
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
}

async function checkWithBlockchain(address: string, expectedAmount: number) {
  const response = await fetch(`${API_PROVIDERS.blockchain.baseUrl}/rawaddr/${address}?limit=50`);
  if (!response.ok) throw new Error(`Blockchain.info API error: ${response.status}`);
  
  const data = await response.json();
  
  if (data.txs && data.txs.length > 0) {
    for (const tx of data.txs) {
      const confirmations = tx.block_height ? 1 : 0;
      
      for (const out of tx.out) {
        if (out.addr === address) {
          const receivedBTC = out.value / 100000000;
          if (Math.abs(receivedBTC - expectedAmount) < 0.00001) {
            return {
              found: true,
              txid: tx.hash,
              confirmations,
              confirmed: confirmations >= CONFIRMATIONS_REQUIRED
            };
          }
        }
      }
    }
  }
  
  return { found: false };
}

async function checkWithBlockstream(address: string, expectedAmount: number) {
  const txsResponse = await fetch(`${API_PROVIDERS.blockstream.baseUrl}/address/${address}/txs`);
  if (!txsResponse.ok) throw new Error(`Blockstream API error: ${txsResponse.status}`);
  
  const txs = await txsResponse.json();
  
  for (const tx of txs) {
    const statusResponse = await fetch(`${API_PROVIDERS.blockstream.baseUrl}/tx/${tx.txid}/status`);
    const status = await statusResponse.json();
    const confirmations = status.confirmed ? 1 : 0;
    
    if (tx.vout) {
      for (const vout of tx.vout) {
        if (vout.scriptpubkey_address === address) {
          const receivedBTC = vout.value / 100000000;
          if (Math.abs(receivedBTC - expectedAmount) < 0.00001) {
            return {
              found: true,
              txid: tx.txid,
              confirmations,
              confirmed: confirmations >= CONFIRMATIONS_REQUIRED
            };
          }
        }
      }
    }
  }
  
  return { found: false };
}

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function checkAddressTransactions(address: string, expectedAmount: number): Promise<{
  found: boolean;
  txid?: string;
  confirmations?: number;
  confirmed?: boolean;
  error?: string;
}> {
  const providers = [
    { name: 'BlockCypher', fn: checkWithBlockCypher },
    { name: 'Blockchain.info', fn: checkWithBlockchain },
    { name: 'Blockstream', fn: checkWithBlockstream },
  ];

  console.log(`Checking address ${address} for transactions with ${providers.length} providers`);
  
  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}...`);
      
      // Add delay to prevent burst requests
      await delay(500);
      
      const result = await provider.fn(address, expectedAmount);
      
      if (result.found) {
        console.log(`✓ ${provider.name} found tx ${result.txid} with ${result.confirmations} confirmations`);
        return result;
      }
      
      console.log(`${provider.name} - no matching transaction found`);
      return { found: false };
      
    } catch (error) {
      console.error(`✗ ${provider.name} failed:`, error instanceof Error ? error.message : 'Unknown error');
      // Wait before trying next provider
      await delay(1000);
      // Continue to next provider
    }
  }
  
  console.error(`All providers failed for address ${address}`);
  return { found: false, error: 'All API providers failed' };
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

    // Fetch pending payments ordered by created_at (oldest first) for prioritization
    const { data: payments, error: paymentsError } = await supabaseClient
      .from('btc_payments')
      .select('*, btc_wallets(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (paymentsError) {
      throw paymentsError;
    }

    console.log(`Found ${payments?.length || 0} pending payments`);

    let updatedCount = 0;
    const BATCH_SIZE = 10; // Process max 10 payments per run to avoid rate limits
    const DELAY_BETWEEN_CHECKS = 2000; // 2 seconds delay between batches

    // Process payments in batches
    const paymentsToCheck = payments?.slice(0, BATCH_SIZE) || [];
    
    for (let i = 0; i < paymentsToCheck.length; i++) {
      const payment = paymentsToCheck[i];
      
      // Add delay between checks to avoid rate limiting (except first one)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CHECKS));
      }
      
      const result = await checkAddressTransactions(payment.address, payment.amount_btc);
      
      if (result.found && result.confirmed) {
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
