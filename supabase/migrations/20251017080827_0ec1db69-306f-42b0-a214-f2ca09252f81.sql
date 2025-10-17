-- Make user_id nullable to support guest checkout
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Add index on order_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- Drop the overly permissive guest order policy
DROP POLICY IF EXISTS "Guests can view orders by email or phone" ON public.orders;

-- Create a more restrictive policy - guests will use the secure backend function instead
-- Keep the existing authenticated user policies as they are already secure