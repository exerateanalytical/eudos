-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the btc-check-payments function to run every 30 seconds
SELECT cron.schedule(
  'check-bitcoin-payments',
  '30 seconds',
  $$
  SELECT
    net.http_post(
        url:='https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/btc-check-payments',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);