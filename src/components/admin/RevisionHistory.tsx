import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContentRevisions } from "@/hooks/useContentRevisions";

interface RevisionHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: 'page' | 'product' | 'blog_post';
  contentId: string | null;
  onRestore: (revisionData: any) => void;
}

export function RevisionHistory({ 
  open,
  onOpenChange,
  contentType,
  contentId,
  onRestore,
}: RevisionHistoryProps) {
  const { revisions, restoreRevision, isRestoring } = useContentRevisions({
    contentType,
    contentId,
  });
  
  const [selectedRevision, setSelectedRevision] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handlePreview = (revision: any) => {
    setSelectedRevision(revision);
    setShowComparison(true);
  };

  const handleRestore = (revisionId: string) => {
    if (confirm('Are you sure you want to restore this revision? Current changes will be saved as a new revision.')) {
      restoreRevision(revisionId);
      const revision = revisions.find(r => r.id === revisionId);
      if (revision) {
        onRestore(revision.content_data);
      }
      setShowComparison(false);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Revision History
            </DialogTitle>
            <DialogDescription>
              View and restore previous versions of this content
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            {revisions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No revisions yet
              </div>
            ) : (
              <div className="space-y-4">
                {revisions.map((revision) => (
                  <div
                    key={revision.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Version {revision.revision_number}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(revision.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      {revision.notes && (
                        <p className="text-sm">{revision.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(revision)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(revision.id)}
                        disabled={isRestoring}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Revision Preview - Version {selectedRevision?.revision_number}
            </DialogTitle>
            <DialogDescription>
              Review the content of this revision
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            <div className="p-4 bg-muted rounded-lg">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(selectedRevision?.content_data, null, 2)}
              </pre>
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowComparison(false)}>
              Close
            </Button>
            <Button 
              onClick={() => selectedRevision && handleRestore(selectedRevision.id)}
              disabled={isRestoring}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore This Version
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
