import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { MediaLibraryDialog } from "./MediaLibraryDialog";

interface FeaturedImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function FeaturedImagePicker({ value, onChange, label = "Featured Image" }: FeaturedImagePickerProps) {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="relative border rounded-lg overflow-hidden group">
          <img
            src={value}
            alt="Featured"
            className="w-full h-48 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-48 border-dashed"
          onClick={() => setShowMediaLibrary(true)}
        >
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Click to select featured image</p>
          </div>
        </Button>
      )}

      <MediaLibraryDialog
        open={showMediaLibrary}
        onOpenChange={setShowMediaLibrary}
        onSelect={onChange}
      />
    </div>
  );
}
