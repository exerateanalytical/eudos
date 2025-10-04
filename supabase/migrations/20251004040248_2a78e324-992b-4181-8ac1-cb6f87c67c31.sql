-- Phase 3: Configure automated Bitcoin payment checking with pg_cron

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Step 2: Grant usage on pg_net schema to postgres role
GRANT USAGE ON SCHEMA net TO postgres;

-- Step 3: Remove any existing cron job with the same name
SELECT cron.unschedule('check-bitcoin-payments-every-30s') 
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'check-bitcoin-payments-every-30s'
);

-- Step 4: Create cron job to check Bitcoin payments every 30 seconds
SELECT cron.schedule(
  'check-bitcoin-payments-every-30s',
  '*/30 * * * * *', -- Every 30 seconds (seconds minutes hours day month weekday)
  $$
  SELECT net.http_post(
    url := 'https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/btc-check-payments',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb,
    body := '{"triggered_by": "cron"}'::jsonb
  ) AS request_id;
  $$
);