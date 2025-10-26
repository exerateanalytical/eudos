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

    console.log('Starting Bitcoin analytics aggregation...');

    // Get date range from request (default to today)
    const { startDate, endDate } = await req.json().catch(() => ({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    }));

    console.log(`Aggregating analytics from ${startDate} to ${endDate}`);

    // Call the database function to aggregate daily analytics
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    console.log(`Processing ${dates.length} days`);

    for (const date of dates) {
      const { error: aggError } = await supabase.rpc('aggregate_bitcoin_daily_analytics', {
        target_date: date
      });

      if (aggError) {
        console.error(`Error aggregating analytics for ${date}:`, aggError);
      } else {
        console.log(`Successfully aggregated analytics for ${date}`);
      }
    }

    // Also aggregate hourly analytics for today
    const now = new Date();
    const currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0);
    
    // Get orders created in current hour
    const { data: hourlyOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*, bitcoin_addresses!inner(*)')
      .eq('payment_method', 'bitcoin')
      .gte('created_at', currentHour.toISOString())
      .lt('created_at', new Date(currentHour.getTime() + 3600000).toISOString());

    if (ordersError) {
      console.error('Error fetching hourly orders:', ordersError);
    } else {
      const ordersCreated = hourlyOrders?.length || 0;
      const paymentsConfirmed = hourlyOrders?.filter(o => o.status === 'processing' || o.status === 'completed').length || 0;
      const paymentsFailed = hourlyOrders?.filter(o => o.status === 'cancelled').length || 0;
      const revenueUsd = hourlyOrders
        ?.filter(o => o.status === 'processing' || o.status === 'completed')
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0;
      const revenueBtc = hourlyOrders
        ?.filter(o => o.status === 'processing' || o.status === 'completed' && o.btc_price_at_order)
        .reduce((sum, o) => sum + (Number(o.total_amount || 0) / Number(o.btc_price_at_order || 1)), 0) || 0;
      const avgBtcPrice = hourlyOrders
        ?.filter(o => o.btc_price_at_order)
        .reduce((sum, o, _, arr) => sum + Number(o.btc_price_at_order || 0) / arr.length, 0) || 0;

      // Upsert hourly analytics
      const { error: hourlyError } = await supabase
        .from('bitcoin_hourly_analytics')
        .upsert({
          hour_timestamp: currentHour.toISOString(),
          orders_created: ordersCreated,
          payments_confirmed: paymentsConfirmed,
          payments_failed: paymentsFailed,
          revenue_usd: revenueUsd,
          revenue_btc: revenueBtc,
          avg_btc_price: avgBtcPrice
        }, {
          onConflict: 'hour_timestamp'
        });

      if (hourlyError) {
        console.error('Error upserting hourly analytics:', hourlyError);
      } else {
        console.log('Successfully updated hourly analytics');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Analytics aggregation completed',
        daysProcessed: dates.length,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Error in analytics aggregation:', error);
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
