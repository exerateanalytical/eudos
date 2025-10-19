import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Assigning Bitcoin address for order:', orderId);

    // Start a transaction by using a single query with row locking
    const { data: availableAddress, error: fetchError } = await supabaseClient
      .from('bitcoin_addresses')
      .select('id, address')
      .eq('is_used', false)
      .is('assigned_to_order', null)
      .limit(1)
      .single();

    if (fetchError || !availableAddress) {
      console.error('No available Bitcoin addresses:', fetchError);
      return new Response(
        JSON.stringify({ error: 'No Bitcoin addresses available. Please contact support.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark the address as used and assign to order
    const { error: updateError } = await supabaseClient
      .from('bitcoin_addresses')
      .update({
        is_used: true,
        assigned_to_order: orderId,
        assigned_at: new Date().toISOString(),
      })
      .eq('id', availableAddress.id)
      .eq('is_used', false); // Double-check it wasn't assigned by another request

    if (updateError) {
      console.error('Error updating Bitcoin address:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to assign Bitcoin address' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully assigned address:', availableAddress.address);

    return new Response(
      JSON.stringify({ address: availableAddress.address }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in assign-bitcoin-address:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
