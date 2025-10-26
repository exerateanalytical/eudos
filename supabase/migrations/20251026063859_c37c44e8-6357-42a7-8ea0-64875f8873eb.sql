-- Fix search_path for security on get_next_derivation_index function
CREATE OR REPLACE FUNCTION public.get_next_derivation_index(p_xpub_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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