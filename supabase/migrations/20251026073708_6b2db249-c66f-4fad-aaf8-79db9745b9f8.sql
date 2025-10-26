-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the Bitcoin address pool replenishment job to run every 6 hours
SELECT cron.schedule(
  'replenish-bitcoin-addresses',
  '0 */6 * * *', -- At minute 0 past every 6th hour
  $$
  SELECT
    net.http_post(
        url:='https://glsvoagtlaksuaimsppn.supabase.co/functions/v1/replenish-bitcoin-addresses',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3ZvYWd0bGFrc3VhaW1zcHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTk3MTcsImV4cCI6MjA3NDk3NTcxN30.bG3hIKuZB5K1SFV0l4mRpAuJ-yxYE8lsPv9yk7PeKRg"}'::jsonb,
        body:=concat('{"triggered_by": "cron", "timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);
