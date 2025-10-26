-- Enable pg_cron and pg_net extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule: Daily Analytics Aggregation (1 AM UTC)
SELECT cron.schedule(
  'bitcoin-daily-analytics',
  '0 1 * * *',
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/scheduled-jobs-runner',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb,
    body := '{"jobName": "daily_analytics_aggregation"}'::jsonb
  ) as request_id;
  $$
);

-- Schedule: Hourly Analytics Aggregation
SELECT cron.schedule(
  'bitcoin-hourly-analytics',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/scheduled-jobs-runner',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb,
    body := '{"jobName": "hourly_analytics_aggregation"}'::jsonb
  ) as request_id;
  $$
);

-- Schedule: Address Pool Check (every 15 minutes)
SELECT cron.schedule(
  'bitcoin-address-pool-check',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/scheduled-jobs-runner',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb,
    body := '{"jobName": "address_pool_check"}'::jsonb
  ) as request_id;
  $$
);

-- Schedule: Payment Expiry Check (every 5 minutes)
SELECT cron.schedule(
  'bitcoin-payment-expiry-check',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/scheduled-jobs-runner',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb,
    body := '{"jobName": "payment_expiry_check"}'::jsonb
  ) as request_id;
  $$
);

-- Schedule: Expired Address Cleanup (every 6 hours)
SELECT cron.schedule(
  'bitcoin-expired-address-cleanup',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/scheduled-jobs-runner',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb,
    body := '{"jobName": "expired_address_cleanup"}'::jsonb
  ) as request_id;
  $$
);

-- Schedule: Old Data Archive (weekly - Sunday 2 AM)
SELECT cron.schedule(
  'bitcoin-old-data-archive',
  '0 2 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/scheduled-jobs-runner',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb,
    body := '{"jobName": "old_data_archive"}'::jsonb
  ) as request_id;
  $$
);

-- Schedule: System Health Check (every 10 minutes)
SELECT cron.schedule(
  'bitcoin-system-health-check',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/scheduled-jobs-runner',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb,
    body := '{"jobName": "system_health_check"}'::jsonb
  ) as request_id;
  $$
);

-- View all scheduled jobs
-- SELECT * FROM cron.job;

-- To unschedule a job (if needed):
-- SELECT cron.unschedule('job-name');