-- Phase 8: Automation, Webhooks & Scheduled Jobs

-- Webhook subscriptions for external integrations
CREATE TABLE IF NOT EXISTS public.webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL,
  url TEXT NOT NULL,
  secret_key TEXT NOT NULL, -- For signature verification
  events TEXT[] NOT NULL DEFAULT '{}', -- payment_confirmed, payment_expired, escrow_released, etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Webhook delivery log
CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.webhook_subscriptions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_code INTEGER,
  response_body TEXT,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed', 'retrying'))
);

-- Scheduled job tracking
CREATE TABLE IF NOT EXISTS public.scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL UNIQUE,
  job_type TEXT NOT NULL, -- analytics_aggregation, address_pool_check, payment_reminder, cleanup, health_check
  schedule_cron TEXT NOT NULL, -- Cron expression
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  last_status TEXT,
  last_duration_ms INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Job execution log
CREATE TABLE IF NOT EXISTS public.job_execution_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.scheduled_jobs(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'timeout')),
  result JSONB,
  error_message TEXT,
  items_processed INTEGER DEFAULT 0
);

-- Payment reminders tracking
CREATE TABLE IF NOT EXISTS public.payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- expiring_soon, expired, follow_up
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT false,
  notification_sent BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

-- BlockCypher webhook events (for real-time blockchain notifications)
CREATE TABLE IF NOT EXISTS public.blockchain_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id TEXT NOT NULL, -- BlockCypher webhook ID
  event_type TEXT NOT NULL, -- tx-confirmation, double-spend-tx, etc.
  address TEXT NOT NULL,
  transaction_hash TEXT,
  confirmations INTEGER DEFAULT 0,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.webhook_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_execution_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for webhook_subscriptions
CREATE POLICY "Admins can manage webhook subscriptions"
  ON public.webhook_subscriptions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for webhook_deliveries
CREATE POLICY "Admins can view webhook deliveries"
  ON public.webhook_deliveries
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for scheduled_jobs
CREATE POLICY "Admins can manage scheduled jobs"
  ON public.scheduled_jobs
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for job_execution_log
CREATE POLICY "Admins can view job execution logs"
  ON public.job_execution_log
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for payment_reminders
CREATE POLICY "Admins can view payment reminders"
  ON public.payment_reminders
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their payment reminders"
  ON public.payment_reminders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_reminders.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for blockchain_webhook_events
CREATE POLICY "Admins can view blockchain webhook events"
  ON public.blockchain_webhook_events
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Indexes for performance
CREATE INDEX idx_webhook_subscriptions_active ON public.webhook_subscriptions(is_active) WHERE is_active = true;
CREATE INDEX idx_webhook_deliveries_subscription ON public.webhook_deliveries(subscription_id);
CREATE INDEX idx_webhook_deliveries_status ON public.webhook_deliveries(status);
CREATE INDEX idx_scheduled_jobs_active ON public.scheduled_jobs(is_active, next_run_at) WHERE is_active = true;
CREATE INDEX idx_job_execution_log_job ON public.job_execution_log(job_id, started_at DESC);
CREATE INDEX idx_payment_reminders_order ON public.payment_reminders(order_id);
CREATE INDEX idx_blockchain_webhook_events_address ON public.blockchain_webhook_events(address);
CREATE INDEX idx_blockchain_webhook_events_processed ON public.blockchain_webhook_events(processed) WHERE processed = false;

-- Function: Update timestamp trigger
CREATE OR REPLACE FUNCTION update_webhook_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_webhook_subscriptions_timestamp
  BEFORE UPDATE ON public.webhook_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_timestamp();

CREATE TRIGGER update_scheduled_jobs_timestamp
  BEFORE UPDATE ON public.scheduled_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_timestamp();

-- Insert default scheduled jobs
INSERT INTO public.scheduled_jobs (job_name, job_type, schedule_cron, config) VALUES
  ('daily_analytics_aggregation', 'analytics_aggregation', '0 1 * * *', '{"aggregate_type": "daily"}'),
  ('hourly_analytics_aggregation', 'analytics_aggregation', '0 * * * *', '{"aggregate_type": "hourly"}'),
  ('address_pool_check', 'address_pool_check', '*/15 * * * *', '{"min_available": 50, "generate_count": 100}'),
  ('payment_expiry_check', 'payment_reminder', '*/5 * * * *', '{"reminder_before_minutes": 10}'),
  ('expired_address_cleanup', 'cleanup', '0 */6 * * *', '{"cleanup_type": "expired_addresses"}'),
  ('old_data_archive', 'cleanup', '0 2 * * 0', '{"archive_older_than_days": 90}'),
  ('system_health_check', 'health_check', '*/10 * * * *', '{"check_apis": true, "check_database": true}')
ON CONFLICT (job_name) DO NOTHING;

-- Function: Send webhook notification
CREATE OR REPLACE FUNCTION trigger_webhook_notification(
  p_event_type TEXT,
  p_payload JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subscription RECORD;
  v_delivery_id UUID;
  v_count INTEGER := 0;
BEGIN
  -- Find all active subscriptions for this event type
  FOR v_subscription IN
    SELECT * FROM webhook_subscriptions
    WHERE is_active = true
    AND p_event_type = ANY(events)
  LOOP
    -- Create delivery record
    INSERT INTO webhook_deliveries (subscription_id, event_type, payload, status)
    VALUES (v_subscription.id, p_event_type, p_payload, 'pending')
    RETURNING id INTO v_delivery_id;
    
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$;

-- Function: Check if job should run
CREATE OR REPLACE FUNCTION should_run_scheduled_job(p_job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_next_run TIMESTAMPTZ;
  v_is_active BOOLEAN;
BEGIN
  SELECT next_run_at, is_active INTO v_next_run, v_is_active
  FROM scheduled_jobs
  WHERE id = p_job_id;
  
  RETURN v_is_active AND (v_next_run IS NULL OR v_next_run <= NOW());
END;
$$;

-- Function: Log job execution
CREATE OR REPLACE FUNCTION log_job_execution(
  p_job_name TEXT,
  p_status TEXT,
  p_duration_ms INTEGER DEFAULT NULL,
  p_items_processed INTEGER DEFAULT 0,
  p_result JSONB DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_job_id UUID;
  v_log_id UUID;
BEGIN
  -- Get job ID
  SELECT id INTO v_job_id FROM scheduled_jobs WHERE job_name = p_job_name;
  
  IF v_job_id IS NULL THEN
    RAISE EXCEPTION 'Job % not found', p_job_name;
  END IF;
  
  -- Insert log entry
  INSERT INTO job_execution_log (
    job_id, status, duration_ms, items_processed, result, error_message, completed_at
  )
  VALUES (
    v_job_id, p_status, p_duration_ms, p_items_processed, p_result, p_error_message,
    CASE WHEN p_status IN ('completed', 'failed', 'timeout') THEN NOW() ELSE NULL END
  )
  RETURNING id INTO v_log_id;
  
  -- Update job last run
  UPDATE scheduled_jobs
  SET last_run_at = NOW(),
      last_status = p_status,
      last_duration_ms = p_duration_ms
  WHERE id = v_job_id;
  
  RETURN v_log_id;
END;
$$;