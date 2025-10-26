-- Add missing columns to bitcoin_addresses table
ALTER TABLE public.bitcoin_addresses
ADD COLUMN IF NOT EXISTS derivation_index INTEGER,
ADD COLUMN IF NOT EXISTS xpub_id UUID REFERENCES public.bitcoin_xpubs(id) ON DELETE SET NULL;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_bitcoin_addresses_xpub_id ON public.bitcoin_addresses(xpub_id);
CREATE INDEX IF NOT EXISTS idx_bitcoin_addresses_derivation_index ON public.bitcoin_addresses(derivation_index);
CREATE INDEX IF NOT EXISTS idx_bitcoin_addresses_is_used_reserved ON public.bitcoin_addresses(is_used, reserved_until) WHERE is_used = false;