-- Add btc_price_at_order column to orders table
ALTER TABLE public.orders
ADD COLUMN btc_price_at_order NUMERIC;

COMMENT ON COLUMN public.orders.btc_price_at_order IS 'BTC/USD price at the time of order creation (for payment validation)';

-- Add bitcoin_tx_hash column to transactions table
ALTER TABLE public.transactions
ADD COLUMN bitcoin_tx_hash TEXT;

COMMENT ON COLUMN public.transactions.bitcoin_tx_hash IS 'Bitcoin blockchain transaction hash';

-- Create index on bitcoin_tx_hash for faster lookups
CREATE INDEX idx_transactions_bitcoin_tx_hash ON public.transactions(bitcoin_tx_hash) WHERE bitcoin_tx_hash IS NOT NULL;