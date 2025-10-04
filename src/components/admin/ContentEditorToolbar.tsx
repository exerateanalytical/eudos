import { useState } from "react";
import { Button } from "@/components/ui/button";
import { History, Save, FileText, Clock } from "lucide-react";
import { TemplateManager } from "./TemplateManager";
import { RevisionHistory } from "./RevisionHistory";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContentEditorToolbarProps {
  contentType: 'page' | 'product' | 'blog_post';
  contentId?: string;
  currentData?: any;
  onSelectTemplate: (templateData: any) => void;
  onRestoreRevision: (revisionData: any) => void;
  onSaveRevision: () => void;
  isAutoSaving?: boolean;
  lastSaved?: Date | null;
}

export function ContentEditorToolbar({
  contentType,
  contentId,
  currentData,
  onSelectTemplate,
  onRestoreRevision,
  onSaveRevision,
  isAutoSaving = false,
  lastSaved,
}: ContentEditorToolbarProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showRevisions, setShowRevisions] = useState(false);

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <>
      <div className="flex items-center gap-2 p-4 border-b bg-muted/30">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplates(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Load or save templates</p>
            </TooltipContent>
          </Tooltip>

          {contentId && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRevisions(true)}
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View revision history</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onSaveRevision}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Version
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save current content as a new version</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex-1" />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isAutoSaving ? (
              <>
                <Clock className="h-4 w-4 animate-pulse" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                <span>{formatLastSaved()}</span>
              </>
            )}
          </div>
        </TooltipProvider>
      </div>

      <TemplateManager
        open={showTemplates}
        onOpenChange={setShowTemplates}
        contentType={contentType}
        onSelectTemplate={onSelectTemplate}
        currentData={currentData}
      />

      {contentId && (
        <RevisionHistory
          open={showRevisions}
          onOpenChange={setShowRevisions}
          contentType={contentType}
          contentId={contentId}
          onRestore={onRestoreRevision}
        />
      )}
    </>
  );
}
