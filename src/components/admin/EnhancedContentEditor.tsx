import { useState, useCallback } from "react";
import { ContentEditorToolbar } from "./ContentEditorToolbar";
import { useContentAutoSave } from "@/hooks/useContentAutoSave";
import { useContentRevisions } from "@/hooks/useContentRevisions";
import { toast } from "sonner";

interface EnhancedContentEditorProps {
  contentType: 'page' | 'product' | 'blog_post';
  contentId?: string;
  initialData?: any;
  children: (props: {
    formData: any;
    setFormData: (data: any) => void;
  }) => React.ReactNode;
  onDataChange?: (data: any) => void;
}

export function EnhancedContentEditor({
  contentType,
  contentId,
  initialData,
  children,
  onDataChange,
}: EnhancedContentEditorProps) {
  const [formData, setFormData] = useState(initialData || {});
  
  const { createRevision } = useContentRevisions({
    contentType,
    contentId: contentId || '',
  });

  const { isAutoSaving } = useContentAutoSave({
    contentType,
    contentId,
    contentData: formData,
    enabled: true,
  });

  const handleDataChange = useCallback((newData: any) => {
    setFormData(newData);
    onDataChange?.(newData);
  }, [onDataChange]);

  const handleSelectTemplate = useCallback((templateData: any) => {
    handleDataChange(templateData);
    toast.success('Template applied successfully');
  }, [handleDataChange]);

  const handleRestoreRevision = useCallback((revisionData: any) => {
    handleDataChange(revisionData);
    toast.success('Revision restored successfully');
  }, [handleDataChange]);

  const handleSaveRevision = useCallback(() => {
    if (!contentId) {
      toast.error('Save the content first before creating a revision');
      return;
    }
    
    createRevision({
      contentData: formData,
      notes: 'Manual save',
    });
  }, [contentId, formData, createRevision]);

  return (
    <div className="flex flex-col h-full">
      <ContentEditorToolbar
        contentType={contentType}
        contentId={contentId}
        currentData={formData}
        onSelectTemplate={handleSelectTemplate}
        onRestoreRevision={handleRestoreRevision}
        onSaveRevision={handleSaveRevision}
        isAutoSaving={isAutoSaving}
      />
      
      <div className="flex-1 overflow-auto">
        {children({ formData, setFormData: handleDataChange })}
      </div>
    </div>
  );
}
