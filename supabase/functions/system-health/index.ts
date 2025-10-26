import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheck {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  details?: any;
}

async function createAlert(
  supabaseClient: any,
  alertType: string,
  severity: 'info' | 'warning' | 'critical',
  title: string,
  message: string,
  metadata: any = {}
) {
  try {
    await supabaseClient
      .from('admin_alerts')
      .insert({
        alert_type: alertType,
        severity,
        title,
        message,
        metadata,
      });
    console.log(`Created ${severity} alert: ${title}`);
  } catch (error) {
    console.error('Failed to create alert:', error);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('Starting system health check...');

    const healthChecks: HealthCheck[] = [];

    // 1. Check database connectivity
    try {
      const { error } = await supabaseClient.from('orders').select('id').limit(1);
      if (error) throw error;
      healthChecks.push({
        component: 'database',
        status: 'healthy',
        message: 'Database connection successful',
      });
    } catch (error: any) {
      healthChecks.push({
        component: 'database',
        status: 'critical',
        message: 'Database connection failed',
        details: error.message,
      });
      await createAlert(
        supabaseClient,
        'database_error',
        'critical',
        'Database Connection Failed',
        `Database connectivity check failed: ${error.message}`,
        { error: error.message }
      );
    }

    // 2. Check BlockCypher API
    const blockcypherToken = Deno.env.get('BLOCKCYPHER_API_TOKEN');
    try {
      const response = await fetch(
        `https://api.blockcypher.com/v1/btc/main${blockcypherToken ? `?token=${blockcypherToken}` : ''}`
      );
      if (response.ok) {
        healthChecks.push({
          component: 'blockcypher_api',
          status: 'healthy',
          message: 'BlockCypher API accessible',
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: any) {
      healthChecks.push({
        component: 'blockcypher_api',
        status: 'warning',
        message: 'BlockCypher API check failed',
        details: error.message,
      });
      await createAlert(
        supabaseClient,
        'api_error',
        'warning',
        'BlockCypher API Issue',
        `Cannot connect to BlockCypher API: ${error.message}`,
        { error: error.message }
      );
    }

    // 3. Check Bitcoin address pool
    const { count: availableAddresses } = await supabaseClient
      .from('bitcoin_addresses')
      .select('*', { count: 'exact', head: true })
      .eq('is_used', false);

    if (availableAddresses !== null) {
      if (availableAddresses < 10) {
        healthChecks.push({
          component: 'address_pool',
          status: 'critical',
          message: `Low address pool: ${availableAddresses} addresses remaining`,
          details: { available: availableAddresses },
        });
        await createAlert(
          supabaseClient,
          'low_address_pool',
          'critical',
          'Bitcoin Address Pool Critical',
          `Only ${availableAddresses} Bitcoin addresses remaining. Immediate action required!`,
          { available: availableAddresses, threshold: 10 }
        );
      } else if (availableAddresses < 25) {
        healthChecks.push({
          component: 'address_pool',
          status: 'warning',
          message: `Address pool running low: ${availableAddresses} addresses`,
          details: { available: availableAddresses },
        });
        await createAlert(
          supabaseClient,
          'low_address_pool',
          'warning',
          'Bitcoin Address Pool Low',
          `Bitcoin address pool is running low with ${availableAddresses} addresses.`,
          { available: availableAddresses, threshold: 25 }
        );
      } else {
        healthChecks.push({
          component: 'address_pool',
          status: 'healthy',
          message: `Address pool healthy: ${availableAddresses} addresses available`,
          details: { available: availableAddresses },
        });
      }
    }

    // 4. Check pending payments
    const { count: pendingPayments } = await supabaseClient
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('payment_method', 'bitcoin')
      .eq('status', 'pending');

    if (pendingPayments !== null && pendingPayments > 50) {
      healthChecks.push({
        component: 'pending_payments',
        status: 'warning',
        message: `High number of pending payments: ${pendingPayments}`,
        details: { count: pendingPayments },
      });
      await createAlert(
        supabaseClient,
        'high_pending_payments',
        'warning',
        'High Pending Payment Count',
        `There are ${pendingPayments} pending Bitcoin payments that may need review.`,
        { count: pendingPayments }
      );
    } else {
      healthChecks.push({
        component: 'pending_payments',
        status: 'healthy',
        message: `Pending payments: ${pendingPayments || 0}`,
        details: { count: pendingPayments },
      });
    }

    // 5. Check XPUB configuration
    const { data: xpubs, count: xpubCount } = await supabaseClient
      .from('bitcoin_xpubs')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (xpubCount === 0) {
      healthChecks.push({
        component: 'xpub_config',
        status: 'warning',
        message: 'No active XPUB configured (using pre-seeded addresses)',
      });
      await createAlert(
        supabaseClient,
        'no_active_xpub',
        'warning',
        'No Active XPUB Configured',
        'System is relying on pre-seeded addresses. Consider adding an active XPUB.',
        { xpub_count: 0 }
      );
    } else {
      healthChecks.push({
        component: 'xpub_config',
        status: 'healthy',
        message: `${xpubCount} active XPUB(s) configured`,
        details: { count: xpubCount },
      });
    }

    // Calculate overall health
    const criticalIssues = healthChecks.filter(c => c.status === 'critical').length;
    const warningIssues = healthChecks.filter(c => c.status === 'warning').length;

    const overallStatus = criticalIssues > 0 ? 'critical' : warningIssues > 0 ? 'warning' : 'healthy';

    const result = {
      timestamp: new Date().toISOString(),
      overall_status: overallStatus,
      checks: healthChecks,
      summary: {
        total: healthChecks.length,
        healthy: healthChecks.filter(c => c.status === 'healthy').length,
        warning: warningIssues,
        critical: criticalIssues,
      },
    };

    console.log('Health check complete:', result);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in system-health:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
