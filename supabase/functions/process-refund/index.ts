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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { escrowId, reason, notes } = await req.json();

    if (!escrowId) {
      return new Response(
        JSON.stringify({ error: 'Escrow ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing refund for escrow:', escrowId);

    // Get escrow transaction
    const { data: escrow, error: escrowError } = await supabaseClient
      .from('escrow_transactions')
      .select('*, orders(*)')
      .eq('id', escrowId)
      .single();

    if (escrowError || !escrow) {
      console.error('Escrow not found:', escrowError);
      return new Response(
        JSON.stringify({ error: 'Escrow transaction not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (escrow.status === 'refunded') {
      return new Response(
        JSON.stringify({ error: 'Escrow already refunded' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (escrow.status !== 'held') {
      return new Response(
        JSON.stringify({ error: 'Can only refund escrow in held status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update escrow status
    const { error: updateEscrowError } = await supabaseClient
      .from('escrow_transactions')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
        dispute_reason: reason,
        resolution_notes: notes,
      })
      .eq('id', escrowId);

    if (updateEscrowError) {
      console.error('Failed to update escrow:', updateEscrowError);
      throw updateEscrowError;
    }

    // Update order status
    if (escrow.order_id) {
      await supabaseClient
        .from('orders')
        .update({ status: 'refunded' })
        .eq('id', escrow.order_id);
    }

    // Create transaction record for refund
    const { error: txError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: escrow.user_id,
        order_id: escrow.order_id,
        amount: escrow.amount,
        transaction_type: 'refund',
        status: 'completed',
        completed_at: new Date().toISOString(),
        currency: escrow.currency,
        description: `Refund for escrow transaction ${escrowId}`,
        metadata: {
          escrow_id: escrowId,
          reason,
          notes,
        }
      });

    if (txError) {
      console.error('Failed to create refund transaction:', txError);
    }

    // Send refund notification email
    try {
      await supabaseClient.functions.invoke('send-bitcoin-payment-email', {
        body: {
          orderId: escrow.order_id,
          eventType: 'refund_processed',
          amount: escrow.amount,
          reason,
        }
      });
    } catch (emailError) {
      console.error('Failed to send refund email:', emailError);
    }

    // Create notification for user
    await supabaseClient.rpc('create_notification', {
      p_user_id: escrow.user_id,
      p_title: 'Refund Processed',
      p_message: `Your refund of $${escrow.amount} has been processed. ${reason || ''}`,
      p_type: 'info',
      p_link: '/dashboard/wallet'
    });

    console.log('Refund processed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        escrow_id: escrowId,
        amount: escrow.amount,
        refunded_at: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error processing refund:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
