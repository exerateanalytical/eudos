import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { payment_id } = await req.json();

    if (!payment_id) {
      throw new Error('payment_id is required');
    }

    // Fetch payment details with order info
    const { data: payment, error: paymentError } = await supabaseClient
      .from('btc_payments')
      .select(`
        *,
        orders (
          order_number,
          product_name,
          total_amount,
          guest_name,
          guest_email,
          user_id
        )
      `)
      .eq('id', payment_id)
      .single();

    if (paymentError) throw paymentError;

    if (!payment || payment.status !== 'paid') {
      console.log(`Payment ${payment_id} is not paid or not found`);
      return new Response(
        JSON.stringify({ success: false, message: 'Payment not paid' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const order = payment.orders;
    const recipientEmail = order.guest_email;

    if (!recipientEmail) {
      console.log(`No email for payment ${payment_id}, skipping notification`);
      return new Response(
        JSON.stringify({ success: true, message: 'No email provided' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Send email notification (using Resend or similar service)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email');
      return new Response(
        JSON.stringify({ success: true, message: 'Email service not configured' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'orders@yourdomain.com',
        to: recipientEmail,
        subject: `Payment Confirmed - Order ${order.order_number}`,
        html: `
          <h2>Payment Confirmed! 🎉</h2>
          <p>Hi ${order.guest_name || 'Valued Customer'},</p>
          <p>Your Bitcoin payment has been confirmed and your order is being processed.</p>
          
          <h3>Order Details:</h3>
          <ul>
            <li><strong>Order Number:</strong> ${order.order_number}</li>
            <li><strong>Product:</strong> ${order.product_name}</li>
            <li><strong>Amount:</strong> ₿${payment.amount_btc.toFixed(8)} BTC</li>
            <li><strong>Transaction ID:</strong> ${payment.txid}</li>
            <li><strong>Confirmations:</strong> ${payment.confirmations}</li>
          </ul>

          <p><strong>What's Next?</strong></p>
          <p>Your order is now being processed and you'll receive a shipping notification soon.</p>

          <p>You can view your transaction on the blockchain:</p>
          <a href="https://blockstream.info/tx/${payment.txid}">View Transaction</a>

          <p>Thank you for your purchase!</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Failed to send email:', error);
      throw new Error('Email sending failed');
    }

    console.log(`Payment confirmation email sent for payment ${payment_id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment confirmation email sent',
        email_sent_to: recipientEmail
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error sending payment confirmation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
