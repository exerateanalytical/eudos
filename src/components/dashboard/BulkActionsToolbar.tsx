import { Button } from "@/components/ui/button";
import { Download, Mail, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onExportCSV: () => void;
  onBulkEmail?: () => void;
  onBulkDelete: () => void;
  onBulkStatusChange?: (status: string) => void;
  statusOptions?: Array<{ value: string; label: string }>;
}

export function BulkActionsToolbar({
  selectedCount,
  onExportCSV,
  onBulkEmail,
  onBulkDelete,
  onBulkStatusChange,
  statusOptions,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-4 bg-muted rounded-lg border">
      <span className="text-sm font-medium">
        {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
      </span>
      
      <div className="flex gap-2 ml-auto">
        {statusOptions && onBulkStatusChange && (
          <Select onValueChange={onBulkStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button size="sm" variant="outline" onClick={onExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>

        {onBulkEmail && (
          <Button size="sm" variant="outline" onClick={onBulkEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        )}

        <Button size="sm" variant="destructive" onClick={onBulkDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}
