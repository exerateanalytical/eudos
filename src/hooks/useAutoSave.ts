import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseAutoSaveOptions {
  contentType: 'product' | 'page' | 'blog_post';
  contentId: string | null;
  data: any;
  enabled: boolean;
  delay?: number;
}

export function useAutoSave({ 
  contentType, 
  contentId, 
  data, 
  enabled,
  delay = 3000 
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);
    if (currentData === lastSavedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('content_auto_saves')
          .upsert({
            content_type: contentType,
            content_id: contentId,
            user_id: user.id,
            content_data: data,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,content_type,content_id'
          });

        if (error) throw error;

        lastSavedRef.current = currentData;
        toast.success('Draft auto-saved', { duration: 1000 });
      } catch (error: any) {
        console.error('Auto-save failed:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [contentType, contentId, data, enabled, delay]);
}
