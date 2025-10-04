import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useMediaLibrary() {
  const queryClient = useQueryClient();

  const { data: media = [], isLoading } = useQuery({
    queryKey: ['media-library'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const uploadMedia = useMutation({
    mutationFn: async (file: File) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media-library')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath);

      // Get image dimensions if it's an image
      let width = null;
      let height = null;
      if (file.type.startsWith('image/')) {
        const dimensions = await getImageDimensions(file);
        width = dimensions.width;
        height = dimensions.height;
      }

      // Insert metadata
      const { error: dbError } = await supabase
        .from('media_library')
        .insert({
          file_name: file.name,
          file_path: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          user_id: user.id,
          width,
          height,
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      toast.error('Upload failed: ' + error.message);
    },
  });

  const deleteMedia = useMutation({
    mutationFn: async (id: string) => {
      const media = await supabase
        .from('media_library')
        .select('file_path')
        .eq('id', id)
        .single();

      if (media.error) throw media.error;

      // Extract file path from URL
      const url = new URL(media.data.file_path);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(-2).join('/'); // user_id/filename

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media-library')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast.success('File deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Delete failed: ' + error.message);
    },
  });

  const updateMedia = useMutation({
    mutationFn: async ({ id, alt_text, caption }: { id: string; alt_text?: string; caption?: string }) => {
      const { error } = await supabase
        .from('media_library')
        .update({ alt_text, caption })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast.success('Media updated successfully');
    },
    onError: (error: any) => {
      toast.error('Update failed: ' + error.message);
    },
  });

  return {
    media,
    isLoading,
    uploadMedia: uploadMedia.mutate,
    deleteMedia: deleteMedia.mutate,
    updateMedia: updateMedia.mutate,
    isUploading: uploadMedia.isPending,
    isDeleting: deleteMedia.isPending,
    isUpdating: updateMedia.isPending,
  };
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
