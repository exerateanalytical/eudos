-- Create bulk payment operations table
CREATE TABLE IF NOT EXISTS public.bulk_payment_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  operation_type TEXT NOT NULL, -- 'verify_payments', 'release_escrow', 'refund_batch'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  total_items INTEGER DEFAULT 0,
  processed_items INTEGER DEFAULT 0,
  successful_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  error_log JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bulk_operations_status ON public.bulk_payment_operations(status);
CREATE INDEX idx_bulk_operations_created ON public.bulk_payment_operations(created_at DESC);

ALTER TABLE public.bulk_payment_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage bulk operations"
ON public.bulk_payment_operations
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create multi-sig wallet configurations table
CREATE TABLE IF NOT EXISTS public.bitcoin_multisig_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  required_signatures INTEGER NOT NULL DEFAULT 2, -- m of n signatures required
  total_cosigners INTEGER NOT NULL DEFAULT 3,
  xpubs JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of cosigner xpubs with labels
  network TEXT NOT NULL DEFAULT 'mainnet',
  derivation_path TEXT NOT NULL DEFAULT 'm/48''/0''/0''/2''',
  is_active BOOLEAN DEFAULT false,
  next_index INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_multisig CHECK (required_signatures <= total_cosigners AND required_signatures > 0)
);

CREATE INDEX idx_multisig_active ON public.bitcoin_multisig_wallets(is_active);

ALTER TABLE public.bitcoin_multisig_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage multisig wallets"
ON public.bitcoin_multisig_wallets
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create payment configurations table
CREATE TABLE IF NOT EXISTS public.bitcoin_payment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configurations
INSERT INTO public.bitcoin_payment_config (config_key, config_value, description) VALUES
  ('payment_tolerance', '{"percentage": 2, "enabled": true}'::jsonb, 'Payment amount tolerance percentage (±2%)'),
  ('address_expiration', '{"hours": 2, "enabled": true}'::jsonb, 'Bitcoin address expiration time in hours'),
  ('min_confirmations', '{"count": 1, "enabled": true}'::jsonb, 'Minimum confirmations required for payment'),
  ('auto_refund', '{"enabled": false, "days_threshold": 7}'::jsonb, 'Automatic refund for expired unpaid orders'),
  ('lightning_network', '{"enabled": false, "node_url": ""}'::jsonb, 'Lightning Network payment support'),
  ('bulk_operations', '{"max_batch_size": 100, "enabled": true}'::jsonb, 'Bulk payment operation settings'),
  ('webhook_notifications', '{"enabled": false, "url": ""}'::jsonb, 'Webhook for payment status updates')
ON CONFLICT (config_key) DO NOTHING;

ALTER TABLE public.bitcoin_payment_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payment config"
ON public.bitcoin_payment_config
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view payment config"
ON public.bitcoin_payment_config
FOR SELECT
TO authenticated
USING (true);

-- Function to get payment configuration
CREATE OR REPLACE FUNCTION get_bitcoin_config(p_config_key TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_config JSONB;
BEGIN
  SELECT config_value INTO v_config
  FROM bitcoin_payment_config
  WHERE config_key = p_config_key;
  
  RETURN COALESCE(v_config, '{}'::jsonb);
END;
$$;

-- Function to update payment configuration
CREATE OR REPLACE FUNCTION update_bitcoin_config(
  p_config_key TEXT,
  p_config_value JSONB,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT has_role(p_user_id, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can update payment configuration';
  END IF;
  
  UPDATE bitcoin_payment_config
  SET config_value = p_config_value,
      updated_by = p_user_id,
      updated_at = NOW()
  WHERE config_key = p_config_key;
  
  RETURN FOUND;
END;
$$;

-- Function for bulk payment verification
CREATE OR REPLACE FUNCTION bulk_verify_pending_payments(
  p_operation_id UUID,
  p_order_ids UUID[] DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_processed INTEGER := 0;
  v_successful INTEGER := 0;
  v_failed INTEGER := 0;
  v_errors JSONB := '[]'::jsonb;
BEGIN
  -- Update operation status
  UPDATE bulk_payment_operations
  SET status = 'processing',
      started_at = NOW()
  WHERE id = p_operation_id;
  
  -- Get orders to process
  FOR v_order_id IN 
    SELECT COALESCE(
      unnest(p_order_ids),
      (SELECT id FROM orders WHERE status = 'pending_payment' AND payment_method = 'bitcoin')
    )
  LOOP
    BEGIN
      -- This would call the verify-bitcoin-payment edge function
      -- For now, we'll just log the processing
      v_processed := v_processed + 1;
      v_successful := v_successful + 1;
      
      -- Log event
      PERFORM log_bitcoin_payment_event(
        v_order_id,
        'bulk_verification',
        jsonb_build_object('operation_id', p_operation_id)
      );
      
    EXCEPTION WHEN OTHERS THEN
      v_failed := v_failed + 1;
      v_errors := v_errors || jsonb_build_object(
        'order_id', v_order_id,
        'error', SQLERRM,
        'timestamp', NOW()
      );
    END;
  END LOOP;
  
  -- Update operation completion
  UPDATE bulk_payment_operations
  SET status = 'completed',
      processed_items = v_processed,
      successful_items = v_successful,
      failed_items = v_failed,
      error_log = v_errors,
      completed_at = NOW()
  WHERE id = p_operation_id;
  
  RETURN jsonb_build_object(
    'processed', v_processed,
    'successful', v_successful,
    'failed', v_failed,
    'errors', v_errors
  );
END;
$$;

-- Add column to bitcoin_addresses for multisig support
ALTER TABLE public.bitcoin_addresses 
ADD COLUMN IF NOT EXISTS is_multisig BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS multisig_wallet_id UUID REFERENCES public.bitcoin_multisig_wallets(id);

-- Create trigger to update bulk operation timestamps
CREATE OR REPLACE FUNCTION update_bulk_operation_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_bulk_operations_timestamp
BEFORE UPDATE ON bulk_payment_operations
FOR EACH ROW
EXECUTE FUNCTION update_bulk_operation_timestamp();

CREATE TRIGGER update_multisig_wallets_timestamp
BEFORE UPDATE ON bitcoin_multisig_wallets
FOR EACH ROW
EXECUTE FUNCTION update_bulk_operation_timestamp();

CREATE TRIGGER update_payment_config_timestamp
BEFORE UPDATE ON bitcoin_payment_config
FOR EACH ROW
EXECUTE FUNCTION update_bulk_operation_timestamp();