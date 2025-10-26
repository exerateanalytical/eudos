-- Create bitcoin payment analytics table
CREATE TABLE IF NOT EXISTS public.bitcoin_payment_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  total_orders INTEGER DEFAULT 0,
  successful_payments INTEGER DEFAULT 0,
  failed_payments INTEGER DEFAULT 0,
  expired_payments INTEGER DEFAULT 0,
  total_revenue_usd NUMERIC(12, 2) DEFAULT 0,
  total_revenue_btc NUMERIC(16, 8) DEFAULT 0,
  avg_confirmation_time_minutes INTEGER DEFAULT 0,
  avg_payment_amount_usd NUMERIC(12, 2) DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);

-- Create index for faster date queries
CREATE INDEX idx_bitcoin_analytics_date ON public.bitcoin_payment_analytics(date DESC);

-- Enable RLS
ALTER TABLE public.bitcoin_payment_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view analytics
CREATE POLICY "Admins can view bitcoin analytics"
ON public.bitcoin_payment_analytics
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create hourly analytics table for real-time tracking
CREATE TABLE IF NOT EXISTS public.bitcoin_hourly_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hour_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  orders_created INTEGER DEFAULT 0,
  payments_confirmed INTEGER DEFAULT 0,
  payments_failed INTEGER DEFAULT 0,
  revenue_usd NUMERIC(12, 2) DEFAULT 0,
  revenue_btc NUMERIC(16, 8) DEFAULT 0,
  avg_btc_price NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hour_timestamp)
);

CREATE INDEX idx_bitcoin_hourly_analytics_hour ON public.bitcoin_hourly_analytics(hour_timestamp DESC);

ALTER TABLE public.bitcoin_hourly_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view hourly analytics"
ON public.bitcoin_hourly_analytics
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create payment events table for detailed tracking
CREATE TABLE IF NOT EXISTS public.bitcoin_payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'address_assigned', 'payment_detected', 'payment_confirmed', 'payment_failed', 'payment_expired'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bitcoin_events_order ON public.bitcoin_payment_events(order_id);
CREATE INDEX idx_bitcoin_events_type ON public.bitcoin_payment_events(event_type);
CREATE INDEX idx_bitcoin_events_created ON public.bitcoin_payment_events(created_at DESC);

ALTER TABLE public.bitcoin_payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment events"
ON public.bitcoin_payment_events
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to aggregate daily analytics
CREATE OR REPLACE FUNCTION aggregate_bitcoin_daily_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_orders INTEGER;
  v_successful INTEGER;
  v_failed INTEGER;
  v_expired INTEGER;
  v_revenue_usd NUMERIC;
  v_revenue_btc NUMERIC;
  v_avg_conf_time INTEGER;
  v_avg_amount NUMERIC;
  v_unique_users INTEGER;
BEGIN
  -- Calculate metrics for the target date
  SELECT 
    COUNT(*) FILTER (WHERE o.payment_method = 'bitcoin'),
    COUNT(*) FILTER (WHERE o.payment_method = 'bitcoin' AND o.status IN ('processing', 'completed')),
    COUNT(*) FILTER (WHERE o.payment_method = 'bitcoin' AND o.status = 'cancelled'),
    COUNT(*) FILTER (WHERE o.payment_method = 'bitcoin' AND EXISTS (
      SELECT 1 FROM bitcoin_addresses ba 
      WHERE ba.assigned_to_order = o.id 
      AND ba.reserved_until < NOW() 
      AND ba.payment_confirmed = false
    )),
    COALESCE(SUM(o.total_amount) FILTER (WHERE o.payment_method = 'bitcoin' AND o.status IN ('processing', 'completed')), 0),
    COALESCE(SUM((o.total_amount / NULLIF(o.btc_price_at_order, 0))) FILTER (WHERE o.payment_method = 'bitcoin' AND o.status IN ('processing', 'completed') AND o.btc_price_at_order IS NOT NULL), 0),
    COALESCE(AVG(EXTRACT(EPOCH FROM (ba.assigned_at - o.created_at)) / 60) FILTER (WHERE o.payment_method = 'bitcoin' AND ba.payment_confirmed = true), 0)::INTEGER,
    COALESCE(AVG(o.total_amount) FILTER (WHERE o.payment_method = 'bitcoin' AND o.status IN ('processing', 'completed')), 0),
    COUNT(DISTINCT o.user_id) FILTER (WHERE o.payment_method = 'bitcoin')
  INTO v_total_orders, v_successful, v_failed, v_expired, v_revenue_usd, v_revenue_btc, v_avg_conf_time, v_avg_amount, v_unique_users
  FROM orders o
  LEFT JOIN bitcoin_addresses ba ON ba.assigned_to_order = o.id
  WHERE DATE(o.created_at) = target_date;
  
  -- Upsert analytics record
  INSERT INTO bitcoin_payment_analytics (
    date, total_orders, successful_payments, failed_payments, expired_payments,
    total_revenue_usd, total_revenue_btc, avg_confirmation_time_minutes,
    avg_payment_amount_usd, unique_users, updated_at
  )
  VALUES (
    target_date, v_total_orders, v_successful, v_failed, v_expired,
    v_revenue_usd, v_revenue_btc, v_avg_conf_time, v_avg_amount, v_unique_users, NOW()
  )
  ON CONFLICT (date) DO UPDATE SET
    total_orders = EXCLUDED.total_orders,
    successful_payments = EXCLUDED.successful_payments,
    failed_payments = EXCLUDED.failed_payments,
    expired_payments = EXCLUDED.expired_payments,
    total_revenue_usd = EXCLUDED.total_revenue_usd,
    total_revenue_btc = EXCLUDED.total_revenue_btc,
    avg_confirmation_time_minutes = EXCLUDED.avg_confirmation_time_minutes,
    avg_payment_amount_usd = EXCLUDED.avg_payment_amount_usd,
    unique_users = EXCLUDED.unique_users,
    updated_at = NOW();
END;
$$;

-- Function to log payment events
CREATE OR REPLACE FUNCTION log_bitcoin_payment_event(
  p_order_id UUID,
  p_event_type TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO bitcoin_payment_events (order_id, event_type, metadata)
  VALUES (p_order_id, p_event_type, p_metadata)
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$;

-- Trigger to auto-update analytics timestamp
CREATE OR REPLACE FUNCTION update_bitcoin_analytics_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_bitcoin_analytics_updated_at
BEFORE UPDATE ON bitcoin_payment_analytics
FOR EACH ROW
EXECUTE FUNCTION update_bitcoin_analytics_timestamp();

CREATE TRIGGER update_bitcoin_hourly_analytics_updated_at
BEFORE UPDATE ON bitcoin_hourly_analytics
FOR EACH ROW
EXECUTE FUNCTION update_bitcoin_analytics_timestamp();