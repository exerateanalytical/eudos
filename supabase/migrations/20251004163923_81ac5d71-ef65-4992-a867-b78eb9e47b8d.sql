-- Update RLS policy to use has_role function (avoid recursive RLS)
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed: ensure the current admin has the admin role
-- Using the user id observed in recent auth logs
INSERT INTO public.user_roles (user_id, role)
VALUES ('00990028-7718-4888-baa2-4a9d41c765e2', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;