-- Allow anyone to view profile names (needed for public review display)
CREATE POLICY "Anyone can view profile names"
ON public.profiles
FOR SELECT
USING (true);