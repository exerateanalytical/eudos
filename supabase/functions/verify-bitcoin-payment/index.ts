import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlockCypherTransaction {
  confirmations: number;
  total: number;
  received: string;
}

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
    confirmed: string;
  }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
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

    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verifying Bitcoin payment for order:', orderId);

    // Get the Bitcoin address assigned to this order
    const { data: addressData, error: addressError } = await supabaseClient
      .from('bitcoin_addresses')
      .select('id, address, payment_confirmed, reserved_until')
      .eq('assigned_to_order', orderId)
      .single();

    if (addressError || !addressData) {
      console.error('Bitcoin address not found for order:', addressError);
      return new Response(
        JSON.stringify({ error: 'Bitcoin address not found for this order' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if reservation expired
    if (addressData.reserved_until) {
      const expiryTime = new Date(addressData.reserved_until).getTime();
      const now = Date.now();
      
      if (now > expiryTime) {
        console.log('Payment address has expired');
        return new Response(
          JSON.stringify({ 
            error: 'Payment address has expired. Please generate a new payment address.',
            error_code: 'ADDRESS_EXPIRED',
            expired_at: addressData.reserved_until
          }),
          { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If already confirmed, return success
    if (addressData.payment_confirmed) {
      return new Response(
        JSON.stringify({ 
          verified: true, 
          message: 'Payment already confirmed',
          confirmations: 6
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the order details to check expected amount
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .select('total_amount, status, btc_price_at_order')
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      console.error('Order not found:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use BlockCypher API to check for payments
    const apiUrl = blockcypherToken
      ? `${baseUrl}/addrs/${addressData.address}?token=${blockcypherToken}`
      : `${baseUrl}/addrs/${addressData.address}`;
    
    console.log('Checking blockchain for address:', addressData.address);
    
    const blockchainResponse = await fetch(apiUrl);
    
    if (!blockchainResponse.ok) {
      console.error('BlockCypher API error:', await blockchainResponse.text());
      return new Response(
        JSON.stringify({ 
          error: 'Unable to verify payment at this time',
          verified: false 
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const blockchainData: BlockCypherAddressResponse = await blockchainResponse.json();
    
    console.log('Blockchain data:', {
      balance: blockchainData.balance,
      total_received: blockchainData.total_received,
      n_tx: blockchainData.n_tx
    });

    // Check if any payment was received
    const hasPayment = blockchainData.total_received > 0;
    
    if (!hasPayment) {
      return new Response(
        JSON.stringify({ 
          verified: false, 
          message: 'No payment detected yet',
          balance: blockchainData.balance,
          total_received: blockchainData.total_received
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get confirmation count from most recent transaction
    const latestTx = blockchainData.txrefs?.[0];
    const confirmations = latestTx?.confirmations || 0;
    const receivedBtc = latestTx ? latestTx.value / 100000000 : 0; // Convert satoshis to BTC
    
    console.log('Payment detected with confirmations:', confirmations, 'BTC:', receivedBtc);

    // Validate payment amount (if BTC price was stored with order)
    if (orderData.btc_price_at_order && receivedBtc > 0) {
      const expectedBtc = orderData.total_amount / orderData.btc_price_at_order;
      const tolerance = 0.02; // 2% tolerance for network fees
      const difference = Math.abs(receivedBtc - expectedBtc) / expectedBtc;
      
      console.log('Amount validation:', {
        expected: expectedBtc,
        received: receivedBtc,
        difference: (difference * 100).toFixed(2) + '%'
      });

      if (difference > tolerance) {
        const shortfall = expectedBtc - receivedBtc;
        console.error(`PAYMENT AMOUNT MISMATCH: Expected ${expectedBtc} BTC, received ${receivedBtc} BTC`);
        
        return new Response(
          JSON.stringify({ 
            verified: false,
            error: 'Payment amount incorrect',
            error_code: 'AMOUNT_MISMATCH',
            expected_btc: expectedBtc.toFixed(8),
            received_btc: receivedBtc.toFixed(8),
            shortfall_btc: shortfall > 0 ? shortfall.toFixed(8) : null,
            message: shortfall > 0 
              ? `Underpayment detected. Please send an additional ${shortfall.toFixed(8)} BTC to complete the payment.`
              : `Overpayment detected. Expected ${expectedBtc.toFixed(8)} BTC but received ${receivedBtc.toFixed(8)} BTC.`,
            confirmations
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If we have at least 1 confirmation, mark as confirmed
    if (confirmations >= 1) {
      // Update Bitcoin address as confirmed
      const { error: confirmError } = await supabaseClient
        .from('bitcoin_addresses')
        .update({
          payment_confirmed: true,
          is_used: true,
        })
        .eq('id', addressData.id);

      if (confirmError) {
        console.error('Error confirming payment:', confirmError);
      } else {
        console.log('Payment confirmed for address:', addressData.address);
        
        // Update order status
        await supabaseClient
          .from('orders')
          .update({ status: 'processing' })
          .eq('id', orderId);

        // Update transaction status with Bitcoin transaction details
        await supabaseClient
          .from('transactions')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            bitcoin_tx_hash: latestTx?.tx_hash,
            metadata: {
              bitcoin_tx_hash: latestTx?.tx_hash,
              confirmations: confirmations,
              btc_amount: receivedBtc,
              received_at: new Date().toISOString()
            }
          })
          .eq('order_id', orderId);

        // Update escrow transaction status
        await supabaseClient
          .from('escrow_transactions')
          .update({ 
            status: 'held',
            held_at: new Date().toISOString()
          })
          .eq('order_id', orderId);
      }
    }

    return new Response(
      JSON.stringify({ 
        verified: confirmations >= 1,
        confirmations,
        message: confirmations >= 1 
          ? 'Payment confirmed!' 
          : `Payment pending (${confirmations} confirmations)`,
        balance: blockchainData.balance,
        total_received: blockchainData.total_received
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in verify-bitcoin-payment:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
