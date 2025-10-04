import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Trash2, 
  Archive, 
  Eye, 
  Download,
  Check,
  X
} from "lucide-react";
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
import { useState } from "react";

interface ContentBulkActionsProps {
  selectedItems: string[];
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkStatusChange: (ids: string[], status: string) => Promise<void>;
  onBulkExport: (ids: string[]) => void;
  totalItems: number;
  allSelected: boolean;
}

export function ContentBulkActions({
  selectedItems,
  onSelectAll,
  onBulkDelete,
  onBulkStatusChange,
  onBulkExport,
  totalItems,
  allSelected
}: ContentBulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");

  const handleBulkAction = async () => {
    if (selectedItems.length === 0) return;

    switch (bulkAction) {
      case 'delete':
        setShowDeleteDialog(true);
        break;
      case 'publish':
        await onBulkStatusChange(selectedItems, 'published');
        setBulkAction("");
        break;
      case 'draft':
        await onBulkStatusChange(selectedItems, 'draft');
        setBulkAction("");
        break;
      case 'archive':
        await onBulkStatusChange(selectedItems, 'archived');
        setBulkAction("");
        break;
      case 'export':
        onBulkExport(selectedItems);
        setBulkAction("");
        break;
    }
  };

  const confirmDelete = async () => {
    await onBulkDelete(selectedItems);
    setShowDeleteDialog(false);
    setBulkAction("");
  };

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-muted/30 border-b">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          aria-label="Select all"
        />
        
        {selectedItems.length > 0 ? (
          <>
            <span className="text-sm font-medium">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>

            <div className="flex items-center gap-2 flex-1">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Bulk Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publish">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Publish
                    </div>
                  </SelectItem>
                  <SelectItem value="draft">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Move to Draft
                    </div>
                  </SelectItem>
                  <SelectItem value="archive">
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      Archive
                    </div>
                  </SelectItem>
                  <SelectItem value="export">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </div>
                  </SelectItem>
                  <SelectItem value="delete">
                    <div className="flex items-center gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={handleBulkAction}
                disabled={!bulkAction}
                variant={bulkAction === 'delete' ? 'destructive' : 'default'}
              >
                Apply
              </Button>
            </div>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">
            {totalItems} total item{totalItems !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
