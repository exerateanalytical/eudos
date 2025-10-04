-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Admins can manage tags
CREATE POLICY "Admins can manage tags"
ON public.tags
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Anyone can view tags
CREATE POLICY "Anyone can view tags"
ON public.tags
FOR SELECT
USING (true);

-- Create content_tags junction table (for posts, pages, products)
CREATE TABLE IF NOT EXISTS public.content_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'blog_post', 'page', 'product'
  content_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tag_id, content_type, content_id)
);

-- Enable RLS
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;

-- Admins can manage content tags
CREATE POLICY "Admins can manage content tags"
ON public.content_tags
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Anyone can view content tags
CREATE POLICY "Anyone can view content tags"
ON public.content_tags
FOR SELECT
USING (true);

-- Add tags column to blog posts (for quick filtering)
ALTER TABLE public.cms_blog_posts 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add tags column to products (for quick filtering)
ALTER TABLE public.cms_products 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add tags column to pages (for quick filtering)
ALTER TABLE public.cms_pages 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_tags_tag ON public.content_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_content ON public.content_tags(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.cms_blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.cms_products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_pages_tags ON public.cms_pages USING GIN(tags);

-- Insert some default categories for products
INSERT INTO public.product_categories (name, slug, description) VALUES
  ('Passports', 'passports', 'Official passport documents'),
  ('Driver Licenses', 'driver-licenses', 'Driving license documents'),
  ('Citizenship Documents', 'citizenship', 'Citizenship and naturalization documents'),
  ('Educational Certificates', 'educational', 'Diplomas and educational certifications'),
  ('Professional Certifications', 'professional', 'Professional certificates and licenses')
ON CONFLICT (slug) DO NOTHING;
