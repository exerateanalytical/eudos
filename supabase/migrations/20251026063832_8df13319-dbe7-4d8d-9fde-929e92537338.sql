-- Create bitcoin_xpubs table for HD wallet management
CREATE TABLE IF NOT EXISTS public.bitcoin_xpubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  xpub TEXT NOT NULL UNIQUE,
  network TEXT NOT NULL DEFAULT 'mainnet' CHECK (network IN ('mainnet', 'testnet')),
  derivation_path TEXT NOT NULL DEFAULT 'm/84''/0''/0''/0',
  next_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.bitcoin_xpubs ENABLE ROW LEVEL SECURITY;

-- Only admins can manage xpubs
CREATE POLICY "Admins can manage bitcoin xpubs"
  ON public.bitcoin_xpubs
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add xpub_id to bitcoin_addresses table
ALTER TABLE public.bitcoin_addresses 
ADD COLUMN IF NOT EXISTS xpub_id UUID REFERENCES public.bitcoin_xpubs(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS derivation_index INTEGER;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_bitcoin_addresses_xpub_id ON public.bitcoin_addresses(xpub_id);
CREATE INDEX IF NOT EXISTS idx_bitcoin_xpubs_active ON public.bitcoin_xpubs(is_active) WHERE is_active = true;

-- Function to get next derivation index and increment
CREATE OR REPLACE FUNCTION public.get_next_derivation_index(p_xpub_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_index INTEGER;
BEGIN
  UPDATE public.bitcoin_xpubs
  SET next_index = next_index + 1,
      updated_at = NOW()
  WHERE id = p_xpub_id AND is_active = true
  RETURNING next_index - 1 INTO v_index;
  
  RETURN v_index;
END;
$$;

-- Update trigger for bitcoin_xpubs
CREATE TRIGGER update_bitcoin_xpubs_updated_at
BEFORE UPDATE ON public.bitcoin_xpubs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();