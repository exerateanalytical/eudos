-- Create landing themes table for WordPress-style theme management
CREATE TABLE IF NOT EXISTS public.landing_themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail TEXT,
  is_active BOOLEAN DEFAULT false,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  background_gradient TEXT NOT NULL,
  font_family TEXT DEFAULT 'Inter',
  layout_style TEXT DEFAULT 'modern',
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.landing_themes ENABLE ROW LEVEL SECURITY;

-- Anyone can view themes
CREATE POLICY "Anyone can view themes"
  ON public.landing_themes FOR SELECT
  USING (true);

-- Only admins can manage themes
CREATE POLICY "Admins can manage themes"
  ON public.landing_themes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to ensure only one theme is active at a time
CREATE OR REPLACE FUNCTION public.ensure_single_active_theme()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.landing_themes
    SET is_active = false
    WHERE id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER theme_activation_trigger
  BEFORE INSERT OR UPDATE ON public.landing_themes
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_active_theme();

-- Update trigger for updated_at
CREATE TRIGGER update_landing_themes_updated_at
  BEFORE UPDATE ON public.landing_themes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed 10 pre-designed themes
INSERT INTO public.landing_themes (name, slug, description, primary_color, secondary_color, accent_color, background_gradient, layout_style, is_active, config) VALUES
('Modern Blue', 'modern-blue', 'Clean and professional design with blue accents', 'hsl(217, 91%, 60%)', 'hsl(188, 94%, 43%)', 'hsl(250, 82%, 60%)', 'from-blue-50/50 via-cyan-50/30 to-purple-50/50', 'modern', true, '{"heroStyle": "gradient", "cardStyle": "elevated"}'::jsonb),
('Corporate Green', 'corporate-green', 'Professional business theme with green palette', 'hsl(142, 71%, 45%)', 'hsl(160, 84%, 39%)', 'hsl(173, 80%, 40%)', 'from-emerald-50 via-green-50/50 to-teal-50', 'corporate', false, '{"heroStyle": "solid", "cardStyle": "bordered"}'::jsonb),
('Tech Purple', 'tech-purple', 'Futuristic tech-focused design with purple tones', 'hsl(250, 82%, 60%)', 'hsl(258, 90%, 66%)', 'hsl(270, 95%, 75%)', 'from-purple-50 via-violet-50 to-indigo-50', 'tech', false, '{"heroStyle": "gradient", "cardStyle": "glass"}'::jsonb),
('Bold Orange', 'bold-orange', 'Energetic and attention-grabbing orange theme', 'hsl(21, 90%, 48%)', 'hsl(17, 88%, 40%)', 'hsl(24, 95%, 53%)', 'from-orange-50 via-amber-50 to-yellow-50', 'bold', false, '{"heroStyle": "vibrant", "cardStyle": "shadow"}'::jsonb),
('Elegant Black', 'elegant-black', 'Sophisticated dark theme with gold accents', 'hsl(217, 19%, 27%)', 'hsl(215, 16%, 47%)', 'hsl(43, 96%, 56%)', 'from-slate-900 via-gray-900 to-zinc-900', 'elegant', false, '{"heroStyle": "dark", "cardStyle": "minimal"}'::jsonb),
('Ocean Teal', 'ocean-teal', 'Calm and trustworthy teal and cyan palette', 'hsl(173, 80%, 40%)', 'hsl(188, 94%, 43%)', 'hsl(191, 91%, 36%)', 'from-teal-50 via-cyan-50 to-sky-50', 'minimal', false, '{"heroStyle": "clean", "cardStyle": "bordered"}'::jsonb),
('Sunset Red', 'sunset-red', 'Warm and inviting red-orange gradient theme', 'hsl(0, 84%, 60%)', 'hsl(21, 90%, 48%)', 'hsl(24, 95%, 53%)', 'from-red-50 via-orange-50 to-amber-50', 'warm', false, '{"heroStyle": "gradient", "cardStyle": "elevated"}'::jsonb),
('Royal Indigo', 'royal-indigo', 'Premium indigo and blue professional theme', 'hsl(243, 75%, 59%)', 'hsl(245, 83%, 67%)', 'hsl(248, 85%, 70%)', 'from-indigo-50 via-blue-50 to-violet-50', 'premium', false, '{"heroStyle": "professional", "cardStyle": "shadow"}'::jsonb),
('Nature Green', 'nature-green', 'Fresh and eco-friendly green theme', 'hsl(142, 76%, 36%)', 'hsl(142, 69%, 58%)', 'hsl(82, 85%, 67%)', 'from-green-50 via-lime-50 to-emerald-50', 'natural', false, '{"heroStyle": "organic", "cardStyle": "soft"}'::jsonb),
('Midnight Blue', 'midnight-blue', 'Deep blue professional corporate theme', 'hsl(221, 83%, 53%)', 'hsl(224, 76%, 48%)', 'hsl(217, 91%, 60%)', 'from-blue-900/20 via-indigo-900/10 to-slate-900/20', 'corporate-dark', false, '{"heroStyle": "professional", "cardStyle": "glass"}'::jsonb);