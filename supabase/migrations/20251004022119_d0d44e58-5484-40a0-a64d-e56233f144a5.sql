-- Create media library table
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Admins can manage all media
CREATE POLICY "Admins can manage all media"
ON public.media_library
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Users can view all media (for inserting into content)
CREATE POLICY "Users can view all media"
ON public.media_library
FOR SELECT
USING (true);

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media-library', 'media-library', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for media library
CREATE POLICY "Admins can upload media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'media-library' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
);

CREATE POLICY "Anyone can view media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media-library');

CREATE POLICY "Admins can delete media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'media-library' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
);

-- Add updated_at trigger
CREATE TRIGGER update_media_library_updated_at
BEFORE UPDATE ON public.media_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();