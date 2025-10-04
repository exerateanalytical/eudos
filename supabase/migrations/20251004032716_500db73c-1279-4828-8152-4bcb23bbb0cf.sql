-- Add Bitcoin checkout columns to orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS btc_payment_id UUID REFERENCES btc_payments(id),
  ADD COLUMN IF NOT EXISTS guest_name TEXT,
  ADD COLUMN IF NOT EXISTS guest_phone TEXT,
  ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- Create index for faster order number lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_btc_payment_id ON orders(btc_payment_id);

-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_number TEXT;
  date_prefix TEXT;
  random_suffix TEXT;
  attempts INT := 0;
BEGIN
  date_prefix := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-';
  
  LOOP
    random_suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 5));
    new_order_number := date_prefix || random_suffix;
    
    -- Check if order number exists
    IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) THEN
      RETURN new_order_number;
    END IF;
    
    attempts := attempts + 1;
    IF attempts > 10 THEN
      RAISE EXCEPTION 'Failed to generate unique order number after 10 attempts';
    END IF;
  END LOOP;
END;
$$;

-- Update RLS policies to allow guest orders
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders" ON orders
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  (guest_email IS NOT NULL OR guest_phone IS NOT NULL)
);

-- Allow users to view orders by guest email/phone
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT 
USING (
  auth.uid() = user_id OR
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'moderator'::app_role)
);

-- Create policy for guest order lookup
CREATE POLICY "Guests can view orders by email or phone" ON orders
FOR SELECT
USING (
  (guest_email IS NOT NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email') OR
  (guest_phone IS NOT NULL)
);