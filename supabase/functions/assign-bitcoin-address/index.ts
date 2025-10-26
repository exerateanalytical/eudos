import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { deriveAddressFromXpub } from './derivation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let assignedAddress = null;
  let retryCount = 0;
  const MAX_RETRIES = 3;

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

    // Retry logic with exponential backoff
    while (retryCount < MAX_RETRIES) {
      try {
        // First, try to get an active XPUB to derive a new address
        const { data: xpubData, error: xpubError } = await supabaseClient
          .from('bitcoin_xpubs')
          .select('*')
          .eq('is_active', true)
          .maybeSingle();

        if (xpubData && !xpubError) {
          console.log('Using active XPUB for address derivation');
          
          // Get next derivation index atomically
          const { data: nextIndex, error: indexError } = await supabaseClient
            .rpc('get_next_derivation_index', { p_xpub_id: xpubData.id });

          if (indexError || nextIndex === null) {
            console.error('Failed to get next derivation index:', indexError);
            throw new Error('Failed to derive address index');
          }

          console.log('Deriving address at index:', nextIndex);

          // Derive the address
          const derivedAddress = await deriveAddressFromXpub(
            xpubData.xpub,
            nextIndex,
            xpubData.network
          );

          console.log('Derived address:', derivedAddress);

          // Reserve the address for 30 minutes
          const reservationExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();

          // Insert the derived address into bitcoin_addresses table
          const { data: insertedAddress, error: insertError } = await supabaseClient
            .from('bitcoin_addresses')
            .insert({
              address: derivedAddress,
              derivation_index: nextIndex,
              xpub_id: xpubData.id,
              is_used: true,
              assigned_to_order: orderId,
              assigned_at: new Date().toISOString(),
              reserved_until: reservationExpiry,
              payment_confirmed: false,
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error inserting derived address:', insertError);
            throw insertError;
          }

          assignedAddress = derivedAddress;
          console.log('Successfully assigned derived address:', derivedAddress, 'until', reservationExpiry);

          return new Response(
            JSON.stringify({ address: derivedAddress }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Fallback: Use pre-seeded addresses if no XPUB is active
        console.log('No active XPUB found, using pre-seeded addresses');

        // Use the database function to get an available address with automatic cleanup
        const { data, error: fetchError } = await supabaseClient
          .rpc('get_available_bitcoin_address')
          .maybeSingle();

        if (fetchError || !data) {
          console.error('No available Bitcoin addresses:', fetchError);
          
          if (retryCount < MAX_RETRIES - 1) {
            retryCount++;
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            console.log(`Retry ${retryCount}/${MAX_RETRIES} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          return new Response(
            JSON.stringify({ 
              error: 'No Bitcoin addresses available. Please add an XPUB or contact support.',
              error_code: 'ADDRESS_POOL_EMPTY'
            }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const addressId = (data as any).id;
        const addressValue = (data as any).address;

        // Reserve the address for 30 minutes
        const reservationExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        
        const { error: updateError } = await supabaseClient
          .from('bitcoin_addresses')
          .update({
            is_used: true,
            assigned_to_order: orderId,
            assigned_at: new Date().toISOString(),
            reserved_until: reservationExpiry,
            payment_confirmed: false,
          })
          .eq('id', addressId)
          .eq('is_used', false); // Double-check it wasn't assigned by another request

        if (updateError) {
          console.error('Error reserving Bitcoin address:', updateError);
          
          if (retryCount < MAX_RETRIES - 1) {
            retryCount++;
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`Retry ${retryCount}/${MAX_RETRIES} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          return new Response(
            JSON.stringify({ 
              error: 'Failed to reserve Bitcoin address. Please try again.',
              error_code: 'RESERVATION_FAILED'
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        assignedAddress = addressValue;
        console.log('Successfully reserved pre-seeded address:', addressValue, 'until', reservationExpiry);

        return new Response(
          JSON.stringify({ address: addressValue }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (innerError: any) {
        console.error(`Attempt ${retryCount + 1} failed:`, innerError);
        
        if (retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`Retry ${retryCount}/${MAX_RETRIES} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw innerError;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to assign Bitcoin address after multiple attempts',
        error_code: 'MAX_RETRIES_EXCEEDED'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in assign-bitcoin-address:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
