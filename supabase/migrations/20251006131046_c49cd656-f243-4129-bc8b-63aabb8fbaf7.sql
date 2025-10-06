-- Fix security warning: Add search_path to validate_derivation_path function
CREATE OR REPLACE FUNCTION validate_derivation_path()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if derivation path follows BIP32/BIP44/BIP84 format
  IF NEW.derivation_path !~ '^m(/\d+''?)+$' THEN
    RAISE EXCEPTION 'Invalid derivation path format: %. Must follow BIP32 format like m/84''/0''/0''/0', NEW.derivation_path;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = '';