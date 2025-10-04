import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseContentRevisionsProps {
  contentType: 'page' | 'product' | 'blog_post';
  contentId: string | null;
}

export function useContentRevisions({ contentType, contentId }: UseContentRevisionsProps) {
  const queryClient = useQueryClient();

  const { data: revisions = [], isLoading } = useQuery({
    queryKey: ['content-revisions', contentType, contentId],
    queryFn: async () => {
      if (!contentId) return [];
      
      const { data, error } = await supabase
        .from('content_revisions')
        .select('*')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .order('revision_number', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!contentId,
  });

  const createRevision = useMutation({
    mutationFn: async ({ contentData, notes }: { contentData: any; notes?: string }) => {
      if (!contentId) throw new Error('Content ID is required');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const revisionNumber = revisions.length > 0 
        ? Math.max(...revisions.map(r => r.revision_number)) + 1 
        : 1;

      const { error } = await supabase
        .from('content_revisions')
        .insert({
          content_type: contentType,
          content_id: contentId,
          content_data: contentData,
          revision_number: revisionNumber,
          created_by: user.id,
          notes,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-revisions', contentType, contentId] });
      toast.success('Revision saved');
    },
    onError: (error: any) => {
      toast.error('Failed to save revision: ' + error.message);
    },
  });

  const restoreRevision = useMutation({
    mutationFn: async (revisionId: string) => {
      const revision = revisions.find(r => r.id === revisionId);
      if (!revision) throw new Error('Revision not found');

      // Restore the content to the selected revision
      const tableName = contentType === 'page' ? 'cms_pages' 
        : contentType === 'product' ? 'cms_products' 
        : 'cms_blog_posts';

      const { error } = await supabase
        .from(tableName)
        .update(revision.content_data as any)
        .eq('id', contentId);

      if (error) throw error;

      // Create a new revision for the current state before restoring
      await createRevision.mutateAsync({
        contentData: revision.content_data,
        notes: `Restored from version ${revision.revision_number}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType + 's'] });
      toast.success('Revision restored successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to restore revision: ' + error.message);
    },
  });

  return {
    revisions,
    isLoading,
    createRevision: createRevision.mutate,
    restoreRevision: restoreRevision.mutate,
    isCreating: createRevision.isPending,
    isRestoring: restoreRevision.isPending,
  };
}
