-- Fix RLS for guest and authenticated inserts on orders
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;

CREATE POLICY "Users can insert own orders"
ON public.orders
FOR INSERT
WITH CHECK (
  -- Authenticated users must match their user_id
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR
  -- Guest checkout: no user_id, but guest contact provided
  (user_id IS NULL AND (guest_email IS NOT NULL OR guest_phone IS NOT NULL))
);
