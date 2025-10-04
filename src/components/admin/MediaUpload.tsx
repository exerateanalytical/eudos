import { useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function MediaUpload({ 
  onUpload, 
  isUploading = false,
  accept = "image/*,video/*,application/pdf",
  maxSize = 10,
  className 
}: MediaUploadProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file, maxSize)) {
      onUpload(file);
    }
  }, [onUpload, maxSize]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file, maxSize)) {
      onUpload(file);
    }
  }, [onUpload, maxSize]);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-muted-foreground">
            Max file size: {maxSize}MB
          </p>
        </label>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>Processing</span>
          </div>
          <Progress value={undefined} className="h-2" />
        </div>
      )}
    </div>
  );
}

function validateFile(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    alert(`File size must be less than ${maxSizeMB}MB`);
    return false;
  }
  
  return true;
}
