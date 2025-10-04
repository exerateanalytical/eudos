import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Trash2, GripVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaLibraryDialog } from "./MediaLibraryDialog";

interface ImageGalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageGalleryManager({ images, onChange }: ImageGalleryManagerProps) {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const handleAddImage = (url: string) => {
    onChange([...images, url]);
    setShowMediaLibrary(false);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Gallery</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowMediaLibrary(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Add Images
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No images in gallery. Click "Add Images" to get started.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group border rounded-lg overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6"
                    type="button"
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <MediaLibraryDialog
        open={showMediaLibrary}
        onOpenChange={setShowMediaLibrary}
        onSelectImage={handleAddImage}
      />
    </div>
  );
}
