import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ApplicationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: {
    id: string;
    user_id: string;
    document_type: string;
    country: string;
    status: string;
    notes: string | null;
    created_at: string;
  };
}

export function ApplicationDetailModal({
  open,
  onOpenChange,
  application,
}: ApplicationDetailModalProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, "destructive" | "default" | "secondary"> = {
      submitted: "secondary",
      pending: "default",
      approved: "default",
      rejected: "destructive",
    };
    return colors[status] || "secondary";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Application ID</Label>
            <p className="text-sm font-mono">{application.id}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Badge variant="outline">{application.document_type}</Badge>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <p className="font-semibold">{application.country}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Badge variant={getStatusColor(application.status)}>
              {application.status}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Submission Date</Label>
            <p className="text-sm">
              {new Date(application.created_at).toLocaleString()}
            </p>
          </div>

          {application.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{application.notes}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
