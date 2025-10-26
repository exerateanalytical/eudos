import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const webhookPayload = await req.json();

    console.log('Received BlockCypher webhook:', JSON.stringify(webhookPayload, null, 2));

    // Store webhook event
    const { data: webhookEvent, error: insertError } = await supabase
      .from('blockchain_webhook_events')
      .insert({
        webhook_id: webhookPayload.id || 'unknown',
        event_type: webhookPayload.event || 'unknown',
        address: webhookPayload.address || '',
        transaction_hash: webhookPayload.hash,
        confirmations: webhookPayload.confirmations || 0,
        payload: webhookPayload,
        processed: false,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Process the webhook based on event type
    const eventType = webhookPayload.event;
    const address = webhookPayload.address;

    if (eventType === 'tx-confirmation' || eventType === 'confirmed-tx' || eventType === 'unconfirmed-tx') {
      // Find order by address
      const { data: bitcoinAddress } = await supabase
        .from('bitcoin_addresses')
        .select('*, orders(*)')
        .eq('address', address)
        .single();

      if (bitcoinAddress && bitcoinAddress.assigned_to_order) {
        console.log(`Processing webhook for order: ${bitcoinAddress.orders.order_number}`);

        // Call verify-bitcoin-payment function
        const verifyResponse = await supabase.functions.invoke('verify-bitcoin-payment', {
          body: { orderId: bitcoinAddress.assigned_to_order },
        });

        if (verifyResponse.error) {
          console.error('Error verifying payment:', verifyResponse.error);
        } else {
          console.log('Payment verification triggered successfully');
        }

        // Mark webhook as processed
        await supabase
          .from('blockchain_webhook_events')
          .update({
            processed: true,
            processed_at: new Date().toISOString(),
          })
          .eq('id', webhookEvent.id);

        // Log event
        await supabase.rpc('log_bitcoin_payment_event', {
          p_order_id: bitcoinAddress.assigned_to_order,
          p_event_type: 'blockchain_webhook_received',
          p_metadata: {
            webhook_id: webhookEvent.id,
            event_type: eventType,
            confirmations: webhookPayload.confirmations || 0,
          },
        });

        // Trigger application webhooks
        await supabase.rpc('trigger_webhook_notification', {
          p_event_type: 'blockchain_transaction_detected',
          p_payload: {
            order_id: bitcoinAddress.assigned_to_order,
            order_number: bitcoinAddress.orders.order_number,
            address,
            transaction_hash: webhookPayload.hash,
            confirmations: webhookPayload.confirmations || 0,
            amount_btc: webhookPayload.value ? webhookPayload.value / 100000000 : 0,
          },
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        event_id: webhookEvent.id,
        message: 'Webhook received and processed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error processing BlockCypher webhook:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
