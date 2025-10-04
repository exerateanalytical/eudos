import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { History, RotateCcw } from "lucide-react";

interface RevisionHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: 'product' | 'page' | 'blog_post';
  contentId: string | null;
  onRestore: (revisionData: any) => void;
}

interface Revision {
  id: string;
  revision_number: number;
  content_data: any;
  created_at: string;
  notes: string | null;
}

export function RevisionHistory({ 
  open, 
  onOpenChange, 
  contentType,
  contentId,
  onRestore
}: RevisionHistoryProps) {
  const { data: revisions = [], isLoading } = useQuery({
    queryKey: ['revisions', contentType, contentId],
    queryFn: async () => {
      if (!contentId) return [];
      
      const { data, error } = await supabase
        .from('content_revisions')
        .select('*')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Revision[];
    },
    enabled: !!contentId && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Revision History
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {isLoading ? (
            <div className="text-center py-8">Loading revisions...</div>
          ) : revisions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No revisions found
            </div>
          ) : (
            <div className="space-y-4">
              {revisions.map((revision) => (
                <div
                  key={revision.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Revision #{revision.revision_number}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(revision.created_at), { 
                            addSuffix: true 
                          })}
                        </span>
                      </div>
                      {revision.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {revision.notes}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(revision.created_at).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onRestore(revision.content_data);
                        onOpenChange(false);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
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
  );
}
