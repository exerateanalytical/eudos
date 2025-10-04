-- Create database function to trigger payment confirmation email
CREATE OR REPLACE FUNCTION public.notify_payment_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if status changed to 'paid'
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    -- Call edge function to send confirmation email
    PERFORM net.http_post(
      url := concat(current_setting('app.settings.supabase_url'), '/functions/v1/send-payment-confirmation'),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', concat('Bearer ', current_setting('app.settings.supabase_anon_key'))
      ),
      body := jsonb_build_object('payment_id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on btc_payments table
DROP TRIGGER IF EXISTS on_payment_confirmed ON public.btc_payments;
CREATE TRIGGER on_payment_confirmed
  AFTER UPDATE ON public.btc_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_payment_confirmed();

-- Enable pg_net extension for HTTP requests (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Store Supabase URL and anon key in settings (for trigger to use)
-- Note: These will be set via environment variables in production
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage settings
CREATE POLICY "Admins can manage app settings"
  ON public.app_settings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));