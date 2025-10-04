import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Trash2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (url: string) => void;
}

interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

export function MediaLibraryDialog({ open, onOpenChange, onSelectImage }: MediaLibraryDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ['media-library', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('file_name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MediaItem[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (item: MediaItem) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media-library')
        .remove([item.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', item.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast.success('Media deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete media: ${error.message}`);
    },
  });

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('media-library')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get image dimensions if it's an image
        let width = null;
        let height = null;
        if (file.type.startsWith('image/')) {
          const img = new Image();
          const imgPromise = new Promise<void>((resolve) => {
            img.onload = () => {
              width = img.width;
              height = img.height;
              resolve();
            };
          });
          img.src = URL.createObjectURL(file);
          await imgPromise;
        }

        // Save to database
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            user_id: user.id,
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
            width,
            height,
          });

        if (dbError) throw dbError;
      }

      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast.success('Media uploaded successfully');
      event.target.value = '';
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }, [queryClient]);

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('media-library')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {isLoading ? (
                <div className="text-center py-8">Loading media...</div>
              ) : mediaItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No media found. Upload some files to get started.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {item.mime_type.startsWith('image/') ? (
                        <img
                          src={getPublicUrl(item.file_path)}
                          alt={item.alt_text || item.file_name}
                          className="w-full h-40 object-cover cursor-pointer"
                          onClick={() => {
                            onSelectImage(getPublicUrl(item.file_path));
                            onOpenChange(false);
                          }}
                        />
                      ) : (
                        <div className="w-full h-40 bg-accent flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">{item.file_name}</p>
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-xs truncate">{item.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(item.file_size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                        onClick={() => deleteMutation.mutate(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer text-primary hover:underline"
              >
                Click to upload files
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {uploading ? 'Uploading...' : 'PNG, JPG, GIF up to 10MB'}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
