-- Step 1: Fix wallet2 derivation path from m/0h to proper BIP32 format
UPDATE btc_wallets 
SET derivation_path = 'm/0''/0',
    updated_at = now()
WHERE derivation_path = 'm/0h';

-- Add validation check for derivation paths
CREATE OR REPLACE FUNCTION validate_derivation_path()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if derivation path follows BIP32/BIP44/BIP84 format
  IF NEW.derivation_path !~ '^m(/\d+''?)+$' THEN
    RAISE EXCEPTION 'Invalid derivation path format: %. Must follow BIP32 format like m/84''/0''/0''/0', NEW.derivation_path;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate derivation paths on insert/update
DROP TRIGGER IF EXISTS check_derivation_path ON btc_wallets;
CREATE TRIGGER check_derivation_path
  BEFORE INSERT OR UPDATE ON btc_wallets
  FOR EACH ROW
  EXECUTE FUNCTION validate_derivation_path();