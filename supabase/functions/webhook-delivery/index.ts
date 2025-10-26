import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { createHmac } from 'node:crypto';

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

    const { eventType, payload, deliveryId } = await req.json();

    console.log(`Processing webhook delivery: ${deliveryId} for event: ${eventType}`);

    // Get pending deliveries if deliveryId not provided
    let deliveries: any[] = [];
    
    if (deliveryId) {
      const { data, error } = await supabase
        .from('webhook_deliveries')
        .select('*, webhook_subscriptions(*)')
        .eq('id', deliveryId)
        .single();
      
      if (error) throw error;
      deliveries = [data];
    } else {
      // Process all pending deliveries
      const { data, error } = await supabase
        .from('webhook_deliveries')
        .select('*, webhook_subscriptions(*)')
        .eq('status', 'pending')
        .limit(50);
      
      if (error) throw error;
      deliveries = data || [];
    }

    let successCount = 0;
    let failureCount = 0;

    for (const delivery of deliveries) {
      try {
        const subscription = delivery.webhook_subscriptions;
        
        // Generate HMAC signature for security
        const timestamp = Date.now();
        const signaturePayload = `${timestamp}.${JSON.stringify(delivery.payload)}`;
        const signature = createHmac('sha256', subscription.secret_key)
          .update(signaturePayload)
          .digest('hex');

        // Send webhook
        const webhookResponse = await fetch(subscription.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': `t=${timestamp},v1=${signature}`,
            'X-Webhook-Event': delivery.event_type,
            'X-Webhook-Delivery-ID': delivery.id,
          },
          body: JSON.stringify(delivery.payload),
        });

        const responseBody = await webhookResponse.text();
        const responseCode = webhookResponse.status;

        if (webhookResponse.ok) {
          // Success
          await supabase
            .from('webhook_deliveries')
            .update({
              status: 'delivered',
              response_code: responseCode,
              response_body: responseBody.substring(0, 1000),
              delivered_at: new Date().toISOString(),
            })
            .eq('id', delivery.id);

          await supabase
            .from('webhook_subscriptions')
            .update({
              last_triggered_at: new Date().toISOString(),
              retry_count: 0,
            })
            .eq('id', subscription.id);

          successCount++;
          console.log(`Successfully delivered webhook ${delivery.id} to ${subscription.url}`);
        } else {
          throw new Error(`Webhook returned status ${responseCode}: ${responseBody}`);
        }

      } catch (error: any) {
        // Handle failure
        const subscription = delivery.webhook_subscriptions;
        const attemptNumber = delivery.attempt_number + 1;
        const maxRetries = subscription.max_retries || 3;

        if (attemptNumber >= maxRetries) {
          // Max retries reached
          await supabase
            .from('webhook_deliveries')
            .update({
              status: 'failed',
              response_body: error.message.substring(0, 1000),
            })
            .eq('id', delivery.id);

          await supabase
            .from('webhook_subscriptions')
            .update({
              retry_count: 0,
            })
            .eq('id', subscription.id);

          failureCount++;
          console.error(`Failed webhook ${delivery.id} after ${maxRetries} attempts`);
        } else {
          // Retry
          await supabase
            .from('webhook_deliveries')
            .update({
              status: 'retrying',
              attempt_number: attemptNumber,
              response_body: error.message.substring(0, 1000),
            })
            .eq('id', delivery.id);

          await supabase
            .from('webhook_subscriptions')
            .update({
              retry_count: attemptNumber,
            })
            .eq('id', subscription.id);

          console.log(`Retrying webhook ${delivery.id}, attempt ${attemptNumber}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: deliveries.length,
        successful: successCount,
        failed: failureCount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error in webhook delivery:', error);
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
