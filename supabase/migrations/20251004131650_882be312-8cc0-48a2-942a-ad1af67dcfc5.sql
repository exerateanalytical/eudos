-- Add advanced SEO fields to existing tables
-- Add columns to cms_pages
ALTER TABLE public.cms_pages 
ADD COLUMN IF NOT EXISTS focus_keyword text,
ADD COLUMN IF NOT EXISTS related_keywords text[],
ADD COLUMN IF NOT EXISTS og_title text,
ADD COLUMN IF NOT EXISTS og_description text,
ADD COLUMN IF NOT EXISTS og_image text,
ADD COLUMN IF NOT EXISTS twitter_card_type text DEFAULT 'summary_large_image',
ADD COLUMN IF NOT EXISTS schema_type text DEFAULT 'WebPage',
ADD COLUMN IF NOT EXISTS noindex boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS seo_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS readability_score integer DEFAULT 0;

-- Add columns to cms_products
ALTER TABLE public.cms_products
ADD COLUMN IF NOT EXISTS focus_keyword text,
ADD COLUMN IF NOT EXISTS related_keywords text[],
ADD COLUMN IF NOT EXISTS og_title text,
ADD COLUMN IF NOT EXISTS og_description text,
ADD COLUMN IF NOT EXISTS og_image text,
ADD COLUMN IF NOT EXISTS twitter_card_type text DEFAULT 'summary_large_image',
ADD COLUMN IF NOT EXISTS schema_type text DEFAULT 'Product',
ADD COLUMN IF NOT EXISTS noindex boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS seo_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS readability_score integer DEFAULT 0;

-- Add columns to cms_blog_posts
ALTER TABLE public.cms_blog_posts
ADD COLUMN IF NOT EXISTS focus_keyword text,
ADD COLUMN IF NOT EXISTS related_keywords text[],
ADD COLUMN IF NOT EXISTS og_title text,
ADD COLUMN IF NOT EXISTS og_description text,
ADD COLUMN IF NOT EXISTS og_image text,
ADD COLUMN IF NOT EXISTS twitter_card_type text DEFAULT 'summary_large_image',
ADD COLUMN IF NOT EXISTS schema_type text DEFAULT 'Article',
ADD COLUMN IF NOT EXISTS noindex boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS seo_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS readability_score integer DEFAULT 0;

-- Create content analytics table
CREATE TABLE IF NOT EXISTS public.content_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('page', 'product', 'blog_post')),
  content_id uuid NOT NULL,
  views integer DEFAULT 0,
  unique_views integer DEFAULT 0,
  avg_time_on_page integer DEFAULT 0,
  bounce_rate numeric(5,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(content_type, content_id)
);

-- Enable RLS on content_analytics
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;

-- Admins can manage analytics
CREATE POLICY "Admins can manage analytics"
ON public.content_analytics
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Anyone can increment view counts (for tracking)
CREATE POLICY "Anyone can view analytics"
ON public.content_analytics
FOR SELECT
USING (true);

-- Create content templates table
CREATE TABLE IF NOT EXISTS public.content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  content_type text NOT NULL CHECK (content_type IN ('page', 'product', 'blog_post')),
  template_data jsonb NOT NULL,
  thumbnail text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on content_templates
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

-- Admins can manage templates
CREATE POLICY "Admins can manage templates"
ON public.content_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_content_analytics_updated_at
BEFORE UPDATE ON public.content_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at
BEFORE UPDATE ON public.content_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();