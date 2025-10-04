import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseContentAutoSaveProps {
  contentType: 'page' | 'product' | 'blog_post';
  contentId?: string;
  contentData: any;
  enabled?: boolean;
  interval?: number; // in milliseconds
}

export function useContentAutoSave({
  contentType,
  contentId,
  contentData,
  enabled = true,
  interval = 30000, // 30 seconds default
}: UseContentAutoSaveProps) {
  const queryClient = useQueryClient();
  const lastSavedRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const autoSave = useMutation({
    mutationFn: async (data: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('content_auto_saves')
        .upsert({
          content_type: contentType,
          content_id: contentId || null,
          content_data: data,
          user_id: user.id,
        }, {
          onConflict: 'user_id,content_type,content_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-auto-saves', contentType, contentId] });
    },
    onError: (error: any) => {
      console.error('Auto-save failed:', error);
    },
  });

  useEffect(() => {
    if (!enabled || !contentData) return;

    const currentData = JSON.stringify(contentData);
    
    // Skip if data hasn't changed
    if (currentData === lastSavedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      autoSave.mutate(contentData);
      lastSavedRef.current = currentData;
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [contentData, enabled, interval]);

  return {
    autoSave: autoSave.mutate,
    isAutoSaving: autoSave.isPending,
    lastSaved: lastSavedRef.current ? new Date() : null,
  };
}
