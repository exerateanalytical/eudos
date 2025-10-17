-- First, unlink orders from invalid payments
UPDATE public.orders
SET btc_payment_id = NULL
WHERE btc_payment_id IN (
  SELECT id FROM public.btc_payments WHERE status = 'pending'
);

-- Now delete the invalid pending payments
DELETE FROM public.btc_payments WHERE status = 'pending';

-- Reset the wallet index to 0 to start fresh
UPDATE public.btc_wallets
SET next_index = 0, updated_at = now()
WHERE is_active = true;