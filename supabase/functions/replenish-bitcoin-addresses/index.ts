import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { deriveAddressFromXpub } from './derivation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TARGET_POOL_SIZE = 50; // Target number of available addresses
const BATCH_SIZE = 20; // Generate this many addresses per run

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('Starting address pool replenishment check...');

    // Check available address count
    const { count: availableCount, error: countError } = await supabaseClient
      .from('bitcoin_addresses')
      .select('*', { count: 'exact', head: true })
      .eq('is_used', false);

    if (countError) {
      console.error('Error counting available addresses:', countError);
      throw countError;
    }

    console.log(`Current available addresses: ${availableCount}`);

    if (availableCount === null || availableCount >= TARGET_POOL_SIZE) {
      console.log('Address pool is sufficient, no replenishment needed');
      return new Response(
        JSON.stringify({ 
          message: 'Address pool is sufficient',
          available: availableCount,
          target: TARGET_POOL_SIZE
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get active XPUB
    const { data: xpubData, error: xpubError } = await supabaseClient
      .from('bitcoin_xpubs')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (!xpubData || xpubError) {
      console.error('No active XPUB found for replenishment');
      
      // Send admin alert
      // TODO: Implement alert system
      
      return new Response(
        JSON.stringify({ 
          error: 'No active XPUB available for address generation',
          warning: 'Please add an active XPUB in admin panel'
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating addresses from XPUB:', xpubData.id);

    const addressesToGenerate = Math.min(BATCH_SIZE, TARGET_POOL_SIZE - availableCount);
    const generatedAddresses = [];

    for (let i = 0; i < addressesToGenerate; i++) {
      // Get next index
      const { data: nextIndex, error: indexError } = await supabaseClient
        .rpc('get_next_derivation_index', { p_xpub_id: xpubData.id });

      if (indexError || nextIndex === null) {
        console.error('Failed to get derivation index:', indexError);
        break;
      }

      // Derive address
      const address = await deriveAddressFromXpub(
        xpubData.xpub,
        nextIndex,
        xpubData.network
      );

      // Insert into database
      const { error: insertError } = await supabaseClient
        .from('bitcoin_addresses')
        .insert({
          address,
          derivation_index: nextIndex,
          xpub_id: xpubData.id,
          is_used: false,
        });

      if (insertError) {
        console.error('Failed to insert address:', insertError);
        break;
      }

      generatedAddresses.push(address);
      console.log(`Generated address ${i + 1}/${addressesToGenerate}: ${address}`);

      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log(`Replenishment complete. Generated ${generatedAddresses.length} addresses`);

    return new Response(
      JSON.stringify({ 
        success: true,
        generated: generatedAddresses.length,
        total_available: availableCount + generatedAddresses.length,
        target: TARGET_POOL_SIZE
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in replenish-bitcoin-addresses:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
