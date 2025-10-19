-- Phase 3: Improve Address Pool Management
-- Add reservation and payment confirmation tracking to bitcoin_addresses

ALTER TABLE bitcoin_addresses 
ADD COLUMN IF NOT EXISTS reserved_until timestamptz,
ADD COLUMN IF NOT EXISTS payment_confirmed boolean DEFAULT false;

-- Create function to automatically release expired reservations
CREATE OR REPLACE FUNCTION release_expired_bitcoin_addresses()
RETURNS void AS $$
BEGIN
  UPDATE bitcoin_addresses 
  SET is_used = false, 
      assigned_to_order = NULL,
      reserved_until = NULL,
      assigned_at = NULL
  WHERE reserved_until < NOW() 
    AND payment_confirmed = false
    AND is_used = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get available Bitcoin address with automatic cleanup
CREATE OR REPLACE FUNCTION get_available_bitcoin_address()
RETURNS TABLE(id uuid, address text) AS $$
BEGIN
  -- First, release expired reservations
  PERFORM release_expired_bitcoin_addresses();
  
  -- Then get an available address with row locking
  RETURN QUERY
  SELECT ba.id, ba.address
  FROM bitcoin_addresses ba
  WHERE ba.is_used = false 
    AND (ba.reserved_until IS NULL OR ba.reserved_until < NOW())
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for better performance on reservation queries
CREATE INDEX IF NOT EXISTS idx_bitcoin_addresses_reservation 
ON bitcoin_addresses(is_used, reserved_until) 
WHERE payment_confirmed = false;

-- Create index for payment confirmation status
CREATE INDEX IF NOT EXISTS idx_bitcoin_addresses_payment_confirmed 
ON bitcoin_addresses(payment_confirmed, assigned_to_order) 
WHERE payment_confirmed = true;