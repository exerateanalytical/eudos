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

    const { jobName } = await req.json();

    console.log(`Running scheduled job: ${jobName || 'all due jobs'}`);

    const startTime = Date.now();

    // Get jobs to run
    let jobsQuery = supabase
      .from('scheduled_jobs')
      .select('*')
      .eq('is_active', true);

    if (jobName) {
      jobsQuery = jobsQuery.eq('job_name', jobName);
    }

    const { data: jobs, error: jobsError } = await jobsQuery;

    if (jobsError) throw jobsError;

    const results: any[] = [];

    for (const job of jobs || []) {
      const jobStartTime = Date.now();
      
      try {
        let result: any = {};

        switch (job.job_type) {
          case 'analytics_aggregation':
            result = await runAnalyticsAggregation(supabase, job.config);
            break;
          
          case 'address_pool_check':
            result = await runAddressPoolCheck(supabase, job.config);
            break;
          
          case 'payment_reminder':
            result = await runPaymentReminders(supabase, job.config);
            break;
          
          case 'cleanup':
            result = await runCleanup(supabase, job.config);
            break;
          
          case 'health_check':
            result = await runHealthCheck(supabase, job.config);
            break;
          
          default:
            throw new Error(`Unknown job type: ${job.job_type}`);
        }

        const duration = Date.now() - jobStartTime;

        // Log successful execution
        await supabase.rpc('log_job_execution', {
          p_job_name: job.job_name,
          p_status: 'completed',
          p_duration_ms: duration,
          p_items_processed: result.itemsProcessed || 0,
          p_result: result,
        });

        results.push({
          job: job.job_name,
          status: 'completed',
          duration,
          result,
        });

      } catch (error: any) {
        const duration = Date.now() - jobStartTime;

        // Log failed execution
        await supabase.rpc('log_job_execution', {
          p_job_name: job.job_name,
          p_status: 'failed',
          p_duration_ms: duration,
          p_error_message: error.message,
        });

        results.push({
          job: job.job_name,
          status: 'failed',
          duration,
          error: error.message,
        });
      }
    }

    const totalDuration = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        success: true,
        duration: totalDuration,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error in scheduled jobs:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Job implementations
async function runAnalyticsAggregation(supabase: any, config: any) {
  const aggregateType = config.aggregate_type || 'daily';
  const targetDate = aggregateType === 'daily' ? new Date() : null;

  await supabase.rpc('aggregate_bitcoin_daily_analytics', {
    target_date: targetDate,
  });

  return { itemsProcessed: 1, aggregateType };
}

async function runAddressPoolCheck(supabase: any, config: any) {
  const minAvailable = config.min_available || 50;
  const generateCount = config.generate_count || 100;

  // Check available addresses
  const { count } = await supabase
    .from('bitcoin_addresses')
    .select('*', { count: 'exact', head: true })
    .eq('is_used', false);

  if ((count || 0) < minAvailable) {
    // Create alert
    await supabase.from('admin_alerts').insert({
      alert_type: 'low_address_pool',
      severity: 'warning',
      title: 'Low Bitcoin Address Pool',
      message: `Only ${count} addresses available. Consider generating more.`,
      metadata: { current_count: count, minimum_required: minAvailable },
    });

    return {
      itemsProcessed: 1,
      addressesAvailable: count,
      alertCreated: true,
    };
  }

  return {
    itemsProcessed: 1,
    addressesAvailable: count,
    alertCreated: false,
  };
}

async function runPaymentReminders(supabase: any, config: any) {
  const reminderBeforeMinutes = config.reminder_before_minutes || 10;
  const expiryThreshold = new Date();
  expiryThreshold.setMinutes(expiryThreshold.getMinutes() + reminderBeforeMinutes);

  // Find expiring payments
  const { data: expiringOrders } = await supabase
    .from('orders')
    .select('*, bitcoin_addresses(*)')
    .eq('status', 'pending_payment')
    .eq('payment_method', 'bitcoin')
    .lte('bitcoin_addresses.reserved_until', expiryThreshold.toISOString())
    .is('bitcoin_addresses.payment_confirmed', false);

  let remindersCreated = 0;

  for (const order of expiringOrders || []) {
    // Check if reminder already sent
    const { data: existingReminder } = await supabase
      .from('payment_reminders')
      .select('id')
      .eq('order_id', order.id)
      .eq('reminder_type', 'expiring_soon')
      .single();

    if (!existingReminder) {
      await supabase.from('payment_reminders').insert({
        order_id: order.id,
        reminder_type: 'expiring_soon',
        metadata: {
          address: order.bitcoin_addresses[0]?.address,
          expires_at: order.bitcoin_addresses[0]?.reserved_until,
        },
      });

      // Trigger webhook
      await supabase.rpc('trigger_webhook_notification', {
        p_event_type: 'payment_expiring_soon',
        p_payload: {
          order_id: order.id,
          order_number: order.order_number,
          address: order.bitcoin_addresses[0]?.address,
          expires_at: order.bitcoin_addresses[0]?.reserved_until,
        },
      });

      remindersCreated++;
    }
  }

  return { itemsProcessed: expiringOrders?.length || 0, remindersCreated };
}

async function runCleanup(supabase: any, config: any) {
  const cleanupType = config.cleanup_type;

  if (cleanupType === 'expired_addresses') {
    // Release expired addresses
    await supabase.rpc('release_expired_bitcoin_addresses');
    return { itemsProcessed: 1, cleanupType };
  }

  if (cleanupType === 'old_data') {
    const olderThanDays = config.archive_older_than_days || 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    // Archive old webhook deliveries
    await supabase
      .from('webhook_deliveries')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .in('status', ['delivered', 'failed']);

    return { itemsProcessed: 1, cleanupType, cutoffDate: cutoffDate.toISOString() };
  }

  return { itemsProcessed: 0, cleanupType };
}

async function runHealthCheck(supabase: any, config: any) {
  const checks: any = {
    database: false,
    apis: {},
    timestamp: new Date().toISOString(),
  };

  // Check database connectivity
  try {
    const { error } = await supabase.from('scheduled_jobs').select('id').limit(1);
    checks.database = !error;
  } catch {
    checks.database = false;
  }

  // Check BlockCypher API if configured
  if (config.check_apis) {
    const blockcypherToken = Deno.env.get('BLOCKCYPHER_API_TOKEN');
    if (blockcypherToken) {
      try {
        const response = await fetch(
          `https://api.blockcypher.com/v1/btc/main?token=${blockcypherToken}`
        );
        checks.apis.blockcypher = response.ok;
      } catch {
        checks.apis.blockcypher = false;
      }
    }
  }

  // Create alert if critical service is down
  if (!checks.database || Object.values(checks.apis).some((status) => !status)) {
    await supabase.from('admin_alerts').insert({
      alert_type: 'health_check_failure',
      severity: 'critical',
      title: 'System Health Check Failed',
      message: 'One or more critical services are down',
      metadata: checks,
    });
  }

  return { itemsProcessed: 1, checks };
}
