-- Create system_settings table for storing application configuration
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage all settings
CREATE POLICY "Admins can manage settings"
ON public.system_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view settings (for public configurations)
CREATE POLICY "Anyone can view settings"
ON public.system_settings
FOR SELECT
USING (true);

-- Create indexes for performance
CREATE INDEX idx_system_settings_key ON public.system_settings(setting_key);
CREATE INDEX idx_system_settings_category ON public.system_settings(category);

-- Create trigger for updating updated_at
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, category) VALUES
('site_name', '{"value": "My Application"}'::jsonb, 'general'),
('site_url', '{"value": "https://example.com"}'::jsonb, 'general'),
('contact_email', '{"value": "admin@example.com"}'::jsonb, 'general'),
('maintenance_mode', '{"enabled": false}'::jsonb, 'general'),
('enable_2fa', '{"enabled": true}'::jsonb, 'security'),
('session_timeout', '{"minutes": 30}'::jsonb, 'security'),
('password_min_length', '{"value": 8}'::jsonb, 'security'),
('stripe_enabled', '{"enabled": false}'::jsonb, 'payment'),
('paypal_enabled', '{"enabled": false}'::jsonb, 'payment'),
('crypto_enabled', '{"enabled": false}'::jsonb, 'payment');