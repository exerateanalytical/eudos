-- Fix security definer views - add security_invoker option

DROP VIEW IF EXISTS public.public_profiles CASCADE;
DROP VIEW IF EXISTS public.public_reviews CASCADE;

CREATE VIEW public.public_profiles
WITH (security_invoker=on)
AS
SELECT 
  id,
  full_name,
  avatar_url,
  created_at
FROM public.profiles;

CREATE VIEW public.public_reviews
WITH (security_invoker=on)
AS
SELECT 
  id,
  product_id,
  product_type,
  rating,
  review_text,
  created_at,
  status,
  substring(md5(user_id::text) from 1 for 8) as anonymous_user_id
FROM public.reviews
WHERE status = 'approved';