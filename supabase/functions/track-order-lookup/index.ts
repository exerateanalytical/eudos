import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_number, contact } = await req.json();

    console.log('Track order lookup request:', { order_number, contact });

    // Validate order_number format: ORD-YYYYMMDD-XXXXX
    if (!order_number || !/^ORD-\d{8}-[A-Z0-9]{5}$/.test(order_number)) {
      return new Response(
        JSON.stringify({ error: 'Invalid order number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate contact (email or E.164 phone)
    if (!contact) {
      return new Response(
        JSON.stringify({ error: 'Contact information required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isEmail = contact.includes('@');
    if (isEmail) {
      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // E.164 phone validation: +[1-9]digits, total 7-15 digits
      if (!/^\+[1-9]\d{6,14}$/.test(contact)) {
        return new Response(
          JSON.stringify({ error: 'Invalid phone format. Use international format (e.g., +1234567890)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Use service role to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order with matching order_number and contact
    const query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        product_name,
        product_type,
        total_amount,
        status,
        created_at,
        payment_method,
        btc_payments (
          id,
          address,
          amount_btc,
          amount_fiat,
          status,
          confirmations,
          txid,
          created_at,
          updated_at
        )
      `)
      .eq('order_number', order_number);

    // Add contact filter
    if (isEmail) {
      query.eq('guest_email', contact);
    } else {
      query.eq('guest_phone', contact);
    }

    const { data: orders, error } = await query.single();

    if (error || !orders) {
      console.error('Order not found:', error);
      return new Response(
        JSON.stringify({ error: 'Order not found. Please check your order number and contact information.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order found successfully');

    // Return sanitized order data
    return new Response(
      JSON.stringify({ order: orders }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in track-order-lookup:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});