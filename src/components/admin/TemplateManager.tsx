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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, FileText } from "lucide-react";
import { useContentTemplates } from "@/hooks/useContentTemplates";
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

interface TemplateManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: 'page' | 'product' | 'blog_post';
  onSelectTemplate: (templateData: any) => void;
  currentData?: any;
}

export function TemplateManager({
  open,
  onOpenChange,
  contentType,
  onSelectTemplate,
  currentData,
}: TemplateManagerProps) {
  const { templates, isLoading, createTemplate, deleteTemplate } = useContentTemplates({ contentType });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim() || !currentData) return;

    createTemplate({
      name: newTemplate.name,
      description: newTemplate.description,
      templateData: currentData,
    });

    setNewTemplate({ name: '', description: '' });
    setShowCreateDialog(false);
  };

  const handleSelectTemplate = (templateData: any) => {
    onSelectTemplate(templateData);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Templates</DialogTitle>
            <DialogDescription>
              Select a template to use or save current content as a new template
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {currentData && (
              <Button onClick={() => setShowCreateDialog(true)} className="w-full">
                Save Current as Template
              </Button>
            )}

            <ScrollArea className="h-[500px] pr-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading templates...
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No templates yet. Save your first template!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => handleSelectTemplate(template.template_data)}
                    >
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      ) : (
                        <div className="w-full h-32 bg-muted rounded mb-3 flex items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h3 className="font-medium truncate">{template.name}</h3>
                        {template.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(template.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save your current content as a reusable template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="My Template"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-description">Description (Optional)</Label>
              <Textarea
                id="template-description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Describe this template..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTemplate}
                disabled={!newTemplate.name.trim()}
              >
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm) {
                  deleteTemplate(deleteConfirm);
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
