-- Create content revisions table
CREATE TABLE IF NOT EXISTS public.content_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL, -- 'product', 'page', 'blog_post'
  content_id UUID NOT NULL,
  revision_number INTEGER NOT NULL,
  content_data JSONB NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;

-- Admins can manage all revisions
CREATE POLICY "Admins can manage all revisions"
ON public.content_revisions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Add scheduled_publish_at column to cms tables
ALTER TABLE public.cms_blog_posts 
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.cms_pages 
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.cms_products 
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMP WITH TIME ZONE;

-- Create auto-save drafts table
CREATE TABLE IF NOT EXISTS public.content_auto_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id UUID,
  user_id UUID NOT NULL,
  content_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_auto_saves ENABLE ROW LEVEL SECURITY;

-- Users can manage their own auto-saves
CREATE POLICY "Users can manage own auto-saves"
ON public.content_auto_saves
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger for auto-saves
CREATE TRIGGER update_content_auto_saves_updated_at
BEFORE UPDATE ON public.content_auto_saves
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_revisions_content ON public.content_revisions(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_auto_saves_user ON public.content_auto_saves(user_id, content_type);
