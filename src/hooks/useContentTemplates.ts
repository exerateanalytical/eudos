import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseContentTemplatesProps {
  contentType: 'page' | 'product' | 'blog_post';
}

export function useContentTemplates({ contentType }: UseContentTemplatesProps) {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['content-templates', contentType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_templates')
        .select('*')
        .eq('content_type', contentType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const createTemplate = useMutation({
    mutationFn: async ({ name, description, templateData, thumbnail }: {
      name: string;
      description?: string;
      templateData: any;
      thumbnail?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('content_templates')
        .insert({
          name,
          description,
          content_type: contentType,
          template_data: templateData,
          thumbnail,
          created_by: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-templates', contentType] });
      toast.success('Template created successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create template: ' + error.message);
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, name, description, templateData, thumbnail }: {
      id: string;
      name?: string;
      description?: string;
      templateData?: any;
      thumbnail?: string;
    }) => {
      const { error } = await supabase
        .from('content_templates')
        .update({
          ...(name && { name }),
          ...(description && { description }),
          ...(templateData && { template_data: templateData }),
          ...(thumbnail && { thumbnail }),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-templates', contentType] });
      toast.success('Template updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update template: ' + error.message);
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-templates', contentType] });
      toast.success('Template deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete template: ' + error.message);
    },
  });

  return {
    templates,
    isLoading,
    createTemplate: createTemplate.mutate,
    updateTemplate: updateTemplate.mutate,
    deleteTemplate: deleteTemplate.mutate,
    isCreating: createTemplate.isPending,
    isUpdating: updateTemplate.isPending,
    isDeleting: deleteTemplate.isPending,
  };
}
