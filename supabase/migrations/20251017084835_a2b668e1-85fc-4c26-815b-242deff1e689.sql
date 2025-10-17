-- Remove testnet from allowed values and set mainnet as default
ALTER TABLE public.btc_wallets 
DROP CONSTRAINT IF EXISTS btc_wallets_network_check;

ALTER TABLE public.btc_wallets 
ADD CONSTRAINT btc_wallets_network_check 
CHECK (network = 'mainnet');

-- Update any existing testnet wallets to mainnet (should be none based on previous data)
UPDATE public.btc_wallets 
SET network = 'mainnet' 
WHERE network != 'mainnet';

-- Ensure all wallets have the correct mainnet network
ALTER TABLE public.btc_wallets 
ALTER COLUMN network SET DEFAULT 'mainnet';