-- Fix security linter issues - recreate views and fix function

-- Drop and recreate views as regular views (not security definer)
DROP VIEW IF EXISTS public.public_profiles CASCADE;
DROP VIEW IF EXISTS public.public_reviews CASCADE;

CREATE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  created_at
FROM public.profiles;

CREATE VIEW public.public_reviews AS
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

-- Fix: Add search_path to check_contact_form_rate_limit function
CREATE OR REPLACE FUNCTION public.check_contact_form_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recent_count integer;
BEGIN
  SELECT COUNT(*) INTO v_recent_count
  FROM public.contact_inquiries
  WHERE email = NEW.email
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF v_recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting again.';
  END IF;
  
  RETURN NEW;
END;
$$;