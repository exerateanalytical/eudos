import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlockCypherAddressResponse {
  address: string;
  total_received: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  txrefs?: Array<{
    tx_hash: string;
    confirmations: number;
    value: number;
  }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const blockcypherToken = Deno.env.get('BLOCKCYPHER_API_TOKEN');
    const network = Deno.env.get('VITE_BITCOIN_NETWORK') || 'main';
    const baseUrl = network === 'test3' ? 'https://api.blockcypher.com/v1/btc/test3' : 'https://api.blockcypher.com/v1/btc/main';

    console.log('Starting automated payment check...');

    // Get all pending orders with Bitcoin payment method
    const { data: pendingOrders, error: ordersError } = await supabaseClient
      .from('orders')
      .select('id, order_number, total_amount, created_at')
      .eq('payment_method', 'bitcoin')
      .eq('status', 'pending');

    if (ordersError) {
      console.error('Error fetching pending orders:', ordersError);
      throw ordersError;
    }

    console.log(`Found ${pendingOrders?.length || 0} pending Bitcoin orders`);

    let checkedCount = 0;
    let confirmedCount = 0;
    let errors: string[] = [];

    for (const order of pendingOrders || []) {
      try {
        // Get Bitcoin address for this order
        const { data: btcAddress, error: addressError } = await supabaseClient
          .from('bitcoin_addresses')
          .select('id, address, payment_confirmed')
          .eq('assigned_to_order', order.id)
          .maybeSingle();

        if (addressError || !btcAddress) {
          console.log(`No Bitcoin address found for order ${order.order_number}`);
          continue;
        }

        if (btcAddress.payment_confirmed) {
          console.log(`Order ${order.order_number} already confirmed, skipping`);
          continue;
        }

        // Check payment on blockchain
        const apiUrl = blockcypherToken
          ? `${baseUrl}/addrs/${btcAddress.address}?token=${blockcypherToken}`
          : `${baseUrl}/addrs/${btcAddress.address}`;

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          console.error(`BlockCypher API error for ${btcAddress.address}: ${response.status}`);
          errors.push(`Order ${order.order_number}: API error ${response.status}`);
          continue;
        }

        const addressData: BlockCypherAddressResponse = await response.json();
        checkedCount++;

        // Check if payment received
        if (addressData.total_received > 0 && addressData.txrefs && addressData.txrefs.length > 0) {
          const latestTx = addressData.txrefs[0];
          
          // Require at least 1 confirmation
          if (latestTx.confirmations >= 1) {
            console.log(`Payment confirmed for order ${order.order_number}! TX: ${latestTx.tx_hash}`);

            // Update bitcoin address
            await supabaseClient
              .from('bitcoin_addresses')
              .update({
                payment_confirmed: true,
                is_used: true,
              })
              .eq('id', btcAddress.id);

            // Update order status
            await supabaseClient
              .from('orders')
              .update({ status: 'processing' })
              .eq('id', order.id);

            // Update transaction status
            await supabaseClient
              .from('transactions')
              .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                bitcoin_tx_hash: latestTx.tx_hash,
                metadata: {
                  bitcoin_tx_hash: latestTx.tx_hash,
                  confirmations: latestTx.confirmations,
                  btc_amount: latestTx.value / 100000000, // Convert satoshis to BTC
                }
              })
              .eq('order_id', order.id);

            // Update escrow transaction status
            await supabaseClient
              .from('escrow_transactions')
              .update({ 
                status: 'held',
                held_at: new Date().toISOString()
              })
              .eq('order_id', order.id);

            // Send payment confirmed email
            try {
              await supabaseClient.functions.invoke('send-bitcoin-payment-email', {
                body: { 
                  orderId: order.id,
                  address: btcAddress.address,
                  eventType: 'payment_confirmed',
                  txHash: latestTx.tx_hash,
                  confirmations: latestTx.confirmations
                }
              });
            } catch (emailError) {
              console.error('Failed to send payment confirmed email:', emailError);
            }

            confirmedCount++;
          } else {
            console.log(`Payment detected for order ${order.order_number} but awaiting confirmations (${latestTx.confirmations}/1)`);
          }
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error: any) {
        console.error(`Error checking order ${order.order_number}:`, error);
        errors.push(`Order ${order.order_number}: ${error.message}`);
      }
    }

    const result = {
      success: true,
      checked: checkedCount,
      confirmed: confirmedCount,
      errors: errors,
      timestamp: new Date().toISOString()
    };

    console.log('Payment check complete:', result);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Fatal error in btc-check-payments:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
