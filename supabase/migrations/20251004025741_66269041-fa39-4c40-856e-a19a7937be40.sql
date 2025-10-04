-- Create wallets table for Bitcoin xpub management
CREATE TABLE IF NOT EXISTS public.btc_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'primary',
  xpub TEXT NOT NULL,
  network TEXT NOT NULL DEFAULT 'mainnet',
  derivation_path TEXT NOT NULL DEFAULT 'm/84''/0''/0''/0',
  next_index BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.btc_wallets ENABLE ROW LEVEL SECURITY;

-- Only admins can manage wallets
CREATE POLICY "Admins can manage BTC wallets"
ON public.btc_wallets
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create Bitcoin payments table
CREATE TABLE IF NOT EXISTS public.btc_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.btc_wallets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  order_id TEXT NOT NULL,
  address_index BIGINT NOT NULL,
  address TEXT NOT NULL,
  amount_btc NUMERIC(20,8) NOT NULL,
  amount_fiat NUMERIC(20,2),
  status TEXT NOT NULL DEFAULT 'pending',
  txid TEXT,
  confirmations INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.btc_payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view their own BTC payments"
ON public.btc_payments
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all BTC payments"
ON public.btc_payments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- System can insert payments (via edge function)
CREATE POLICY "Service role can insert BTC payments"
ON public.btc_payments
FOR INSERT
WITH CHECK (true);

-- System can update payments (via edge function)
CREATE POLICY "Service role can update BTC payments"
ON public.btc_payments
FOR UPDATE
USING (true);

-- Create indexes
CREATE INDEX idx_btc_wallets_name ON public.btc_wallets(name);
CREATE INDEX idx_btc_payments_status ON public.btc_payments(status);
CREATE INDEX idx_btc_payments_wallet ON public.btc_payments(wallet_id);
CREATE INDEX idx_btc_payments_user ON public.btc_payments(user_id);
CREATE INDEX idx_btc_payments_address ON public.btc_payments(address);

-- Trigger to update updated_at
CREATE TRIGGER update_btc_wallets_updated_at
BEFORE UPDATE ON public.btc_wallets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_btc_payments_updated_at
BEFORE UPDATE ON public.btc_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();