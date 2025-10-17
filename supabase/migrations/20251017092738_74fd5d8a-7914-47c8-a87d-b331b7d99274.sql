-- Drop the broken RLS policy that doesn't handle NULL values correctly
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;

-- Create corrected RLS policy with proper NULL handling for guest checkouts
CREATE POLICY "Users can insert own orders"
ON public.orders
FOR INSERT
WITH CHECK (
  -- Authenticated users: user_id must match their auth.uid()
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Guest users: user_id must be NULL and guest contact info must be provided
  (auth.uid() IS NULL AND user_id IS NULL AND 
   (guest_email IS NOT NULL OR guest_phone IS NOT NULL))
);