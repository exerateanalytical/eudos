import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  featuredImage?: string;
}

export function ContentPreview({ 
  open, 
  onOpenChange, 
  title, 
  content,
  featuredImage 
}: ContentPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Preview: {title || "Untitled"}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] w-full rounded-md border p-6">
          {featuredImage && (
            <img 
              src={featuredImage} 
              alt={title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          <h1 className="text-3xl font-bold mb-4">{title || "Untitled"}</h1>
          
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
