import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Revision {
  id: string;
  revision_number: number;
  created_at: string;
  created_by: string;
  notes?: string;
  content_data: any;
}

interface RevisionHistoryProps {
  revisions: Revision[];
  currentData: any;
  onRestore: (revisionId: string) => void;
  isLoading?: boolean;
}

export function RevisionHistory({ 
  revisions, 
  currentData,
  onRestore,
  isLoading = false 
}: RevisionHistoryProps) {
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handlePreview = (revision: Revision) => {
    setSelectedRevision(revision);
    setShowComparison(true);
  };

  const handleRestore = (revisionId: string) => {
    if (confirm('Are you sure you want to restore this revision? Current changes will be saved as a new revision.')) {
      onRestore(revisionId);
      setShowComparison(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Revision History
          </CardTitle>
          <CardDescription>
            View and restore previous versions of this content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
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
                        disabled={isLoading}
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
        </CardContent>
      </Card>

      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Revision Comparison - Version {selectedRevision?.revision_number}
            </DialogTitle>
            <DialogDescription>
              Compare this revision with the current version
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 overflow-auto">
            <div>
              <h3 className="font-semibold mb-2">Current Version</h3>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(currentData, null, 2)}
                </pre>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Version {selectedRevision?.revision_number}
              </h3>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(selectedRevision?.content_data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowComparison(false)}>
              Close
            </Button>
            <Button onClick={() => selectedRevision && handleRestore(selectedRevision.id)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore This Version
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
