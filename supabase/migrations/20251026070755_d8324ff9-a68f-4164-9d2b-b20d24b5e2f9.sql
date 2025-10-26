-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create admin_alerts table for system notifications
CREATE TABLE IF NOT EXISTS public.admin_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;

-- Only admins can view alerts
CREATE POLICY "Admins can view alerts"
  ON public.admin_alerts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update alerts
CREATE POLICY "Admins can update alerts"
  ON public.admin_alerts
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX idx_admin_alerts_unresolved ON public.admin_alerts(created_at DESC) WHERE is_resolved = false;

-- Schedule btc-check-payments every 2 minutes
SELECT cron.schedule(
  'check-bitcoin-payments',
  '*/2 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/btc-check-payments',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb
  ) as request_id;
  $$
);

-- Schedule address pool replenishment every 30 minutes
SELECT cron.schedule(
  'replenish-bitcoin-addresses',
  '*/30 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/replenish-bitcoin-addresses',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb
  ) as request_id;
  $$
);

-- Schedule system health check every hour
SELECT cron.schedule(
  'system-health-check',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/system-health',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb
  ) as request_id;
  $$
);