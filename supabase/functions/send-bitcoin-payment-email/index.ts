import { Resend } from 'https://esm.sh/resend@2.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  orderId: string;
  emailType: 'address_assigned' | 'payment_detected' | 'payment_confirmed' | 'order_processing';
  recipientEmail: string;
  recipientName: string;
  orderNumber?: string;
  btcAddress?: string;
  btcAmount?: string;
  confirmations?: number;
  txHash?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, emailType, recipientEmail, recipientName, orderNumber, btcAddress, btcAmount, confirmations, txHash }: EmailRequest = await req.json();

    console.log('Email request received:', {
      orderId,
      emailType,
      recipientEmail: recipientEmail ? 'present' : 'MISSING',
      recipientName: recipientName ? 'present' : 'MISSING',
      orderNumber: orderNumber ? 'present' : 'MISSING'
    });

    if (!recipientEmail || !emailType || !recipientName) {
      console.error('Missing required fields:', { recipientEmail, emailType, recipientName });
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          missing: {
            recipientEmail: !recipientEmail,
            emailType: !emailType,
            recipientName: !recipientName
          }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let subject = '';
    let html = '';

    const baseStyles = `
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #6366f1; font-size: 24px; font-weight: bold; }
        .content { color: #333; line-height: 1.6; }
        .address-box { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1; }
        .code { font-family: monospace; background-color: #f1f5f9; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 14px; }
        .button { background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
        .warning { background-color: #fff3cd; border-left: 4px solid: #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
      </style>
    `;

    switch (emailType) {
      case 'address_assigned':
        subject = `Bitcoin Payment Address for Order ${orderNumber}`;
        html = `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <div class="logo">🔒 SecurePrint Labs</div>
            </div>
            <div class="content">
              <h2>Payment Address Assigned</h2>
              <p>Hi ${recipientName},</p>
              <p>Your order <strong>${orderNumber}</strong> has been created successfully. Please send your Bitcoin payment to the address below:</p>
              
              <div class="address-box">
                <p><strong>Bitcoin Address:</strong></p>
                <div class="code">${btcAddress}</div>
                <p style="margin-top: 15px;"><strong>Amount to Send:</strong></p>
                <div class="code">${btcAmount} BTC</div>
              </div>

              <div class="warning">
                ⏰ <strong>Important:</strong> This address is reserved for 30 minutes. Please complete your payment within this timeframe.
              </div>

              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Send the exact BTC amount to the address above</li>
                <li>We'll detect your payment automatically</li>
                <li>Your order will be processed once payment is confirmed (1+ confirmations)</li>
              </ul>
              
              <a href="${Deno.env.get('VITE_SUPABASE_URL')}/dashboard" class="button">View Order Status</a>
            </div>
            <div class="footer">
              <p>Questions? Contact our support team</p>
              <p>© ${new Date().getFullYear()} SecurePrint Labs. All rights reserved.</p>
            </div>
          </div>
        `;
        break;

      case 'payment_detected':
        subject = `Payment Detected for Order ${orderNumber}`;
        html = `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <div class="logo">🔒 SecurePrint Labs</div>
            </div>
            <div class="content">
              <h2>✅ Payment Received!</h2>
              <p>Hi ${recipientName},</p>
              <p>We've detected your Bitcoin payment for order <strong>${orderNumber}</strong>.</p>
              
              <div class="address-box">
                <p><strong>Transaction Hash:</strong></p>
                <div class="code">${txHash}</div>
                <p style="margin-top: 15px;"><strong>Confirmations:</strong> ${confirmations}/1</p>
              </div>

              <p>Your payment is currently awaiting blockchain confirmation. This typically takes 10-30 minutes.</p>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Your order will be processed automatically once we receive 1 blockchain confirmation</li>
                <li>You'll receive another email when your payment is fully confirmed</li>
                <li>Track your order status in your dashboard</li>
              </ul>
              
              <a href="${Deno.env.get('VITE_SUPABASE_URL')}/dashboard" class="button">Track Order</a>
            </div>
            <div class="footer">
              <p>Questions? Contact our support team</p>
              <p>© ${new Date().getFullYear()} SecurePrint Labs. All rights reserved.</p>
            </div>
          </div>
        `;
        break;

      case 'payment_confirmed':
        subject = `Payment Confirmed - Order ${orderNumber} is Processing`;
        html = `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <div class="logo">🔒 SecurePrint Labs</div>
            </div>
            <div class="content">
              <h2>🎉 Payment Confirmed!</h2>
              <p>Hi ${recipientName},</p>
              <p>Great news! Your Bitcoin payment for order <strong>${orderNumber}</strong> has been confirmed on the blockchain.</p>
              
              <div class="address-box">
                <p><strong>Transaction Hash:</strong></p>
                <div class="code">${txHash}</div>
                <p style="margin-top: 15px;"><strong>Confirmations:</strong> ${confirmations}</p>
                <p style="margin-top: 15px;"><strong>Status:</strong> ✅ Confirmed</p>
              </div>

              <p><strong>What's next?</strong></p>
              <ul>
                <li>Your order is now being processed</li>
                <li>Funds are held securely in escrow</li>
                <li>You'll receive shipping updates via email</li>
                <li>Release funds from escrow once you receive your items</li>
              </ul>
              
              <a href="${Deno.env.get('VITE_SUPABASE_URL')}/dashboard" class="button">View Order Details</a>
            </div>
            <div class="footer">
              <p>Questions? Contact our support team</p>
              <p>© ${new Date().getFullYear()} SecurePrint Labs. All rights reserved.</p>
            </div>
          </div>
        `;
        break;

      case 'order_processing':
        subject = `Your Order ${orderNumber} is Being Prepared`;
        html = `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <div class="logo">🔒 SecurePrint Labs</div>
            </div>
            <div class="content">
              <h2>📦 Order Processing</h2>
              <p>Hi ${recipientName},</p>
              <p>Your order <strong>${orderNumber}</strong> is now being prepared for shipment.</p>
              
              <p><strong>Order Status:</strong> Processing</p>
              <p>You'll receive a shipping confirmation email with tracking information once your order ships.</p>
              
              <a href="${Deno.env.get('VITE_SUPABASE_URL')}/dashboard" class="button">Track Your Order</a>
            </div>
            <div class="footer">
              <p>Questions? Contact our support team</p>
              <p>© ${new Date().getFullYear()} SecurePrint Labs. All rights reserved.</p>
            </div>
          </div>
        `;
        break;
    }

    const { data, error } = await resend.emails.send({
      from: 'SecurePrint Labs <orders@resend.dev>',
      to: [recipientEmail],
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-bitcoin-payment-email:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
