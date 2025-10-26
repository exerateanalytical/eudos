import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { deriveAddressFromXpub } from './derivation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MIN_AVAILABLE_ADDRESSES = 20; // Alert threshold
const REPLENISH_COUNT = 50; // How many to generate when replenishing

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

    // Check available address count (including reserved but not expired)
    const { count: availableCount, error: countError } = await supabaseClient
      .from('bitcoin_addresses')
      .select('*', { count: 'exact', head: true })
      .eq('is_used', false)
      .or('reserved_until.is.null,reserved_until.lt.now()');

    if (countError) {
      console.error('Error counting available addresses:', countError);
      throw countError;
    }

    console.log(`Available addresses in pool: ${availableCount}`);

    if ((availableCount ?? 0) >= MIN_AVAILABLE_ADDRESSES) {
      console.log('Address pool is healthy, no replenishment needed');
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Pool is healthy',
          available: availableCount,
          threshold: MIN_AVAILABLE_ADDRESSES
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get active XPUB
    const network = Deno.env.get('VITE_BITCOIN_NETWORK') || 'main';
    const { data: xpubData, error: xpubError } = await supabaseClient
      .from('bitcoin_xpubs')
      .select('*')
      .eq('is_active', true)
      .eq('network', network === 'test3' ? 'testnet' : 'mainnet')
      .maybeSingle();

    if (!xpubData || xpubError) {
      const errorMsg = `No active XPUB found for network: ${network}`;
      console.error(errorMsg);
      
      // Send admin alert
      await supabaseClient
        .from('admin_alerts')
        .insert({
          alert_type: 'bitcoin_pool_critical',
          severity: 'critical',
          title: 'Bitcoin Address Pool Critical',
          message: `Address pool has ${availableCount} addresses (threshold: ${MIN_AVAILABLE_ADDRESSES}) but no active XPUB found to generate more.`,
          metadata: { available_count: availableCount, network }
        });
      
      return new Response(
        JSON.stringify({ 
          error: errorMsg,
          available: availableCount,
          threshold: MIN_AVAILABLE_ADDRESSES
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Replenishing ${REPLENISH_COUNT} addresses from XPUB (current index: ${xpubData.next_index})`);

    const generatedAddresses = [];
    const startIndex = xpubData.next_index;

    for (let i = 0; i < REPLENISH_COUNT; i++) {
      const index = startIndex + i;
      
      try {
        // Derive address
        const address = await deriveAddressFromXpub(
          xpubData.xpub,
          index,
          xpubData.network
        );

        generatedAddresses.push({
          address,
          derivation_index: index,
          xpub_id: xpubData.id,
          network: xpubData.network,
          is_used: false,
        });

        console.log(`Derived address ${i + 1}/${REPLENISH_COUNT} at index ${index}`);
      } catch (error) {
        console.error(`Failed to derive address at index ${index}:`, error);
        throw error;
      }
    }

    // Batch insert all addresses
    const { error: insertError } = await supabaseClient
      .from('bitcoin_addresses')
      .insert(generatedAddresses);

    if (insertError) {
      console.error('Error inserting addresses:', insertError);
      throw insertError;
    }

    // Update XPUB next_index
    const { error: updateError } = await supabaseClient
      .from('bitcoin_xpubs')
      .update({ 
        next_index: startIndex + REPLENISH_COUNT,
        updated_at: new Date().toISOString()
      })
      .eq('id', xpubData.id);

    if (updateError) {
      console.error('Error updating XPUB index:', updateError);
      throw updateError;
    }

    const newTotal = (availableCount ?? 0) + REPLENISH_COUNT;
    console.log(`Successfully replenished ${REPLENISH_COUNT} addresses. New pool size: ${newTotal}`);

    // Send notification if pool was critically low
    if ((availableCount ?? 0) < 5) {
      await supabaseClient
        .from('admin_alerts')
        .insert({
          alert_type: 'bitcoin_pool_replenished',
          severity: 'info',
          title: 'Bitcoin Address Pool Replenished',
          message: `Address pool was critically low (${availableCount}) and has been replenished with ${REPLENISH_COUNT} new addresses.`,
          metadata: { 
            previous_count: availableCount, 
            new_count: newTotal,
            network: xpubData.network 
          }
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        replenished: REPLENISH_COUNT,
        previous_available: availableCount,
        new_available: newTotal,
        next_index: startIndex + REPLENISH_COUNT
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
