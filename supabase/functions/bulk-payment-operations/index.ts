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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { operationType, orderIds, metadata } = await req.json();

    console.log(`Starting bulk operation: ${operationType}`);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify user is admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!userRole || userRole.role !== 'admin') {
      throw new Error('Admin access required');
    }

    // Create bulk operation record
    const { data: operation, error: opError } = await supabase
      .from('bulk_payment_operations')
      .insert({
        created_by: user.id,
        operation_type: operationType,
        status: 'pending',
        total_items: orderIds?.length || 0,
        metadata: metadata || {}
      })
      .select()
      .single();

    if (opError || !operation) {
      throw new Error(`Failed to create operation: ${opError?.message}`);
    }

    console.log(`Created bulk operation: ${operation.id}`);

    // Process based on operation type
    switch (operationType) {
      case 'verify_payments':
        await processBulkVerification(supabase, operation.id, orderIds);
        break;
      
      case 'release_escrow':
        await processBulkEscrowRelease(supabase, operation.id, orderIds);
        break;
      
      case 'refund_batch':
        await processBulkRefunds(supabase, operation.id, orderIds);
        break;
      
      default:
        throw new Error(`Unknown operation type: ${operationType}`);
    }

    // Get final operation status
    const { data: finalOp } = await supabase
      .from('bulk_payment_operations')
      .select('*')
      .eq('id', operation.id)
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        operation: finalOp,
        message: `Bulk operation completed: ${finalOp?.successful_items} succeeded, ${finalOp?.failed_items} failed`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Error in bulk operation:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function processBulkVerification(supabase: any, operationId: string, orderIds?: string[]) {
  console.log('Starting bulk payment verification...');
  
  await supabase
    .from('bulk_payment_operations')
    .update({ status: 'processing', started_at: new Date().toISOString() })
    .eq('id', operationId);

  // Get orders to verify
  let query = supabase
    .from('orders')
    .select('*, bitcoin_addresses(*)')
    .eq('payment_method', 'bitcoin')
    .eq('status', 'pending_payment');

  if (orderIds && orderIds.length > 0) {
    query = query.in('id', orderIds);
  }

  const { data: orders, error: ordersError } = await query;

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    await supabase
      .from('bulk_payment_operations')
      .update({ 
        status: 'failed',
        error_log: [{ error: ordersError.message, timestamp: new Date().toISOString() }],
        completed_at: new Date().toISOString()
      })
      .eq('id', operationId);
    return;
  }

  let successful = 0;
  let failed = 0;
  const errors: any[] = [];

  // Process each order
  for (const order of orders || []) {
    try {
      // Call verify-bitcoin-payment function
      const verifyResponse = await supabase.functions.invoke('verify-bitcoin-payment', {
        body: { orderId: order.id }
      });

      if (verifyResponse.error) {
        throw verifyResponse.error;
      }

      const result = verifyResponse.data;
      
      if (result.paymentConfirmed) {
        successful++;
        console.log(`Payment verified for order: ${order.order_number}`);
      } else {
        // Not an error, just not confirmed yet
        console.log(`Payment not yet confirmed for order: ${order.order_number}`);
      }

    } catch (error: any) {
      failed++;
      errors.push({
        order_id: order.id,
        order_number: order.order_number,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      console.error(`Error verifying order ${order.order_number}:`, error);
    }
  }

  // Update operation status
  await supabase
    .from('bulk_payment_operations')
    .update({
      status: 'completed',
      processed_items: (orders?.length || 0),
      successful_items: successful,
      failed_items: failed,
      error_log: errors,
      completed_at: new Date().toISOString()
    })
    .eq('id', operationId);

  console.log(`Bulk verification complete: ${successful} successful, ${failed} failed`);
}

async function processBulkEscrowRelease(supabase: any, operationId: string, orderIds?: string[]) {
  console.log('Starting bulk escrow release...');
  
  await supabase
    .from('bulk_payment_operations')
    .update({ status: 'processing', started_at: new Date().toISOString() })
    .eq('id', operationId);

  let successful = 0;
  let failed = 0;
  const errors: any[] = [];

  for (const orderId of orderIds || []) {
    try {
      // Update escrow transaction status
      const { error: escrowError } = await supabase
        .from('escrow_transactions')
        .update({
          status: 'released',
          released_at: new Date().toISOString()
        })
        .eq('order_id', orderId)
        .eq('status', 'held');

      if (escrowError) throw escrowError;

      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (orderError) throw orderError;

      successful++;
      
    } catch (error: any) {
      failed++;
      errors.push({
        order_id: orderId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  await supabase
    .from('bulk_payment_operations')
    .update({
      status: 'completed',
      processed_items: orderIds?.length || 0,
      successful_items: successful,
      failed_items: failed,
      error_log: errors,
      completed_at: new Date().toISOString()
    })
    .eq('id', operationId);

  console.log(`Bulk escrow release complete: ${successful} successful, ${failed} failed`);
}

async function processBulkRefunds(supabase: any, operationId: string, orderIds?: string[]) {
  console.log('Starting bulk refunds...');
  
  await supabase
    .from('bulk_payment_operations')
    .update({ status: 'processing', started_at: new Date().toISOString() })
    .eq('id', operationId);

  let successful = 0;
  let failed = 0;
  const errors: any[] = [];

  for (const orderId of orderIds || []) {
    try {
      // Update escrow transaction to refunded
      const { error: escrowError } = await supabase
        .from('escrow_transactions')
        .update({
          status: 'refunded',
          refunded_at: new Date().toISOString()
        })
        .eq('order_id', orderId)
        .in('status', ['held', 'pending']);

      if (escrowError) throw escrowError;

      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (orderError) throw orderError;

      successful++;
      
    } catch (error: any) {
      failed++;
      errors.push({
        order_id: orderId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  await supabase
    .from('bulk_payment_operations')
    .update({
      status: 'completed',
      processed_items: orderIds?.length || 0,
      successful_items: successful,
      failed_items: failed,
      error_log: errors,
      completed_at: new Date().toISOString()
    })
    .eq('id', operationId);

  console.log(`Bulk refunds complete: ${successful} successful, ${failed} failed`);
}
