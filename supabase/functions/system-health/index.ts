import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: HealthCheck;
    blockcypher_api: HealthCheck;
    address_pool: HealthCheck;
    pending_payments: HealthCheck;
    xpub_configured: HealthCheck;
  };
  summary: {
    total_checks: number;
    passed: number;
    failed: number;
  };
}

interface HealthCheck {
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
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

    const checks: HealthStatus['checks'] = {
      database: { status: 'pass', message: 'Database connection successful' },
      blockcypher_api: { status: 'pass', message: 'BlockCypher API accessible' },
      address_pool: { status: 'pass', message: 'Address pool healthy' },
      pending_payments: { status: 'pass', message: 'No stuck payments' },
      xpub_configured: { status: 'pass', message: 'XPUB configured' },
    };

    // Check 1: Database Connectivity
    try {
      const { error } = await supabaseClient
        .from('bitcoin_addresses')
        .select('id')
        .limit(1);
      
      if (error) throw error;
    } catch (error: any) {
      checks.database = {
        status: 'fail',
        message: 'Database connection failed',
        details: error.message
      };
    }

    // Check 2: BlockCypher API
    try {
      const blockcypherToken = Deno.env.get('BLOCKCYPHER_API_TOKEN');
      const network = Deno.env.get('VITE_BITCOIN_NETWORK') || 'main';
      const baseUrl = network === 'test3' 
        ? 'https://api.blockcypher.com/v1/btc/test3' 
        : 'https://api.blockcypher.com/v1/btc/main';
      
      const testUrl = blockcypherToken
        ? `${baseUrl}/addrs/bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?token=${blockcypherToken}`
        : `${baseUrl}/addrs/bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`;

      const response = await fetch(testUrl);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
    } catch (error: any) {
      checks.blockcypher_api = {
        status: 'fail',
        message: 'BlockCypher API not accessible',
        details: error.message
      };
    }

    // Check 3: Address Pool Size
    try {
      const { count, error } = await supabaseClient
        .from('bitcoin_addresses')
        .select('*', { count: 'exact', head: true })
        .eq('is_used', false);

      if (error) throw error;

      if (count === null || count < 3) {
        checks.address_pool = {
          status: 'fail',
          message: 'Critical: Address pool critically low',
          details: { available: count, minimum: 3 }
        };
      } else if (count < 10) {
        checks.address_pool = {
          status: 'warn',
          message: 'Warning: Address pool below recommended level',
          details: { available: count, recommended: 50 }
        };
      } else {
        checks.address_pool = {
          status: 'pass',
          message: 'Address pool healthy',
          details: { available: count }
        };
      }
    } catch (error: any) {
      checks.address_pool = {
        status: 'fail',
        message: 'Failed to check address pool',
        details: error.message
      };
    }

    // Check 4: Stuck Payments (pending for >2 hours)
    try {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      
      const { count, error } = await supabaseClient
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('payment_method', 'bitcoin')
        .eq('status', 'pending')
        .lt('created_at', twoHoursAgo);

      if (error) throw error;

      if (count && count > 0) {
        checks.pending_payments = {
          status: 'warn',
          message: `${count} payment(s) pending for >2 hours`,
          details: { stuck_count: count }
        };
      }
    } catch (error: any) {
      checks.pending_payments = {
        status: 'fail',
        message: 'Failed to check pending payments',
        details: error.message
      };
    }

    // Check 5: XPUB Configuration
    try {
      const { data, error } = await supabaseClient
        .from('bitcoin_xpubs')
        .select('id')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        checks.xpub_configured = {
          status: 'warn',
          message: 'No active XPUB configured (using pre-seeded addresses)',
          details: { active_xpub: false }
        };
      }
    } catch (error: any) {
      checks.xpub_configured = {
        status: 'fail',
        message: 'Failed to check XPUB status',
        details: error.message
      };
    }

    // Calculate summary
    const checkValues = Object.values(checks);
    const passed = checkValues.filter(c => c.status === 'pass').length;
    const failed = checkValues.filter(c => c.status === 'fail').length;
    const warned = checkValues.filter(c => c.status === 'warn').length;

    const overallStatus: HealthStatus['status'] = 
      failed > 0 ? 'unhealthy' :
      warned > 0 ? 'degraded' :
      'healthy';

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
      summary: {
        total_checks: checkValues.length,
        passed,
        failed
      }
    };

    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 207 : 503;

    return new Response(
      JSON.stringify(healthStatus, null, 2),
      { 
        status: statusCode, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in system-health:', error);
    return new Response(
      JSON.stringify({ 
        status: 'unhealthy',
        error: error?.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
