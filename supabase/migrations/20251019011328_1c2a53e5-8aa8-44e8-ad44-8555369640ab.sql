-- Remove Bitcoin Payment System
-- Drop triggers first
DROP TRIGGER IF EXISTS on_payment_confirmed ON public.btc_payments;
DROP TRIGGER IF EXISTS update_btc_payments_updated_at ON public.btc_payments;
DROP TRIGGER IF EXISTS update_btc_wallets_updated_at ON public.btc_wallets;
DROP TRIGGER IF EXISTS check_derivation_path ON public.btc_wallets;

-- Drop indexes
DROP INDEX IF EXISTS idx_btc_wallets_name;
DROP INDEX IF EXISTS idx_btc_payments_status;
DROP INDEX IF EXISTS idx_btc_payments_wallet;
DROP INDEX IF EXISTS idx_btc_payments_user;
DROP INDEX IF EXISTS idx_btc_payments_address;
DROP INDEX IF EXISTS idx_btc_payments_order_id;
DROP INDEX IF EXISTS idx_btc_payments_created_at;

-- Remove foreign key from orders table
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_btc_payment_id_fkey;
ALTER TABLE public.orders DROP COLUMN IF EXISTS btc_payment_id;

-- Drop tables (btc_payments first due to foreign key to btc_wallets)
DROP TABLE IF EXISTS public.btc_payments CASCADE;
DROP TABLE IF EXISTS public.btc_wallets CASCADE;

-- Remove validation function
DROP FUNCTION IF EXISTS public.validate_derivation_path() CASCADE;
DROP FUNCTION IF EXISTS public.notify_payment_confirmed() CASCADE;