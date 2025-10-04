import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Check, Image as ImageIcon } from "lucide-react";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { MediaUpload } from "./MediaUpload";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  allowMultiple?: boolean;
}

export function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
  allowMultiple = false,
}: MediaLibraryDialogProps) {
  const { media, isLoading, uploadMedia, deleteMedia, updateMedia, isUploading } = useMediaLibrary();
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [editingMedia, setEditingMedia] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSelect = (url: string) => {
    if (allowMultiple) {
      setSelectedMedia(prev => 
        prev.includes(url) 
          ? prev.filter(u => u !== url)
          : [...prev, url]
      );
    } else {
      onSelect(url);
      onOpenChange(false);
    }
  };

  const handleInsert = () => {
    if (allowMultiple && selectedMedia.length > 0) {
      selectedMedia.forEach(url => onSelect(url));
      setSelectedMedia([]);
      onOpenChange(false);
    }
  };

  const handleUpdateMedia = () => {
    if (editingMedia) {
      updateMedia({
        id: editingMedia.id,
        alt_text: editingMedia.alt_text,
        caption: editingMedia.caption,
      });
      setEditingMedia(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
            <DialogDescription>
              Upload, manage, and select media files
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="space-y-4">
              <ScrollArea className="h-[500px] pr-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading media...
                  </div>
                ) : media.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No media files yet. Upload your first file!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {media.map((item) => (
                      <div
                        key={item.id}
                        className="relative group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleSelect(item.file_path)}
                      >
                        {item.mime_type.startsWith('image/') ? (
                          <img
                            src={item.file_path}
                            alt={item.alt_text || item.file_name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center bg-muted">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        
                        {selectedMedia.includes(item.file_path) && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}

                        <div className="p-3 space-y-1">
                          <p className="text-sm font-medium truncate">
                            {item.file_name}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatFileSize(item.file_size)}</span>
                            <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingMedia(item);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(item.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {allowMultiple && selectedMedia.length > 0 && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedMedia([])}>
                    Clear Selection
                  </Button>
                  <Button onClick={handleInsert}>
                    Insert {selectedMedia.length} File(s)
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload">
              <MediaUpload
                onUpload={uploadMedia}
                isUploading={isUploading}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Edit Media Dialog */}
      <Dialog open={!!editingMedia} onOpenChange={() => setEditingMedia(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media Details</DialogTitle>
          </DialogHeader>
          {editingMedia && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alt-text">Alt Text</Label>
                <Input
                  id="alt-text"
                  value={editingMedia.alt_text || ''}
                  onChange={(e) => setEditingMedia({ ...editingMedia, alt_text: e.target.value })}
                  placeholder="Describe this image for accessibility"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  value={editingMedia.caption || ''}
                  onChange={(e) => setEditingMedia({ ...editingMedia, caption: e.target.value })}
                  placeholder="Optional caption"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingMedia(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateMedia}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm) {
                  deleteMedia(deleteConfirm);
                  setDeleteConfirm(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
