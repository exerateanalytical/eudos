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

    // Verify admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { count = 50 } = await req.json();

    if (count < 1 || count > 500) {
      return new Response(
        JSON.stringify({ error: 'Count must be between 1 and 500' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating ${count} addresses from xpub...`);

    // Get active xpub
    const { data: xpub, error: xpubError } = await supabaseClient
      .from('bitcoin_xpubs')
      .select('*')
      .eq('is_active', true)
      .single();

    if (xpubError || !xpub) {
      console.error('No active xpub found:', xpubError);
      return new Response(
        JSON.stringify({ 
          error: 'No active xpub configured. Please add an xpub first.',
          error_code: 'NO_XPUB'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedAddresses: any[] = [];
    const errors: string[] = [];

    for (let i = 0; i < count; i++) {
      try {
        // Get next index
        const { data: nextIndex, error: indexError } = await supabaseClient
          .rpc('get_next_derivation_index', { p_xpub_id: xpub.id });

        if (indexError || nextIndex === null) {
          console.error('Failed to get next index:', indexError);
          errors.push(`Failed to get index ${i}: ${indexError?.message}`);
          continue;
        }

        // Import derivation logic (note: in edge functions, we need to use Deno-compatible imports)
        // For now, we'll use a simpler approach with bitcoinjs-lib directly
        const { deriveAddress } = await import('./derivation.ts');
        
        const derived = deriveAddress(
          xpub.xpub,
          nextIndex,
          xpub.network === 'testnet' ? 'testnet' : 'mainnet'
        );

        // Insert address
        const { data: inserted, error: insertError } = await supabaseClient
          .from('bitcoin_addresses')
          .insert({
            address: derived.address,
            xpub_id: xpub.id,
            derivation_index: nextIndex,
            is_used: false,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Failed to insert address:', insertError);
          errors.push(`Failed to insert address at index ${nextIndex}: ${insertError.message}`);
        } else {
          generatedAddresses.push(inserted);
        }

        // Small delay to avoid overwhelming the database
        if (i % 10 === 0 && i > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error: any) {
        console.error(`Error generating address ${i}:`, error);
        errors.push(`Index ${i}: ${error.message}`);
      }
    }

    console.log(`Generated ${generatedAddresses.length} addresses, ${errors.length} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        generated: generatedAddresses.length,
        requested: count,
        errors: errors,
        addresses: generatedAddresses,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-addresses-from-xpub:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
