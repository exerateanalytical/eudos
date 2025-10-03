import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface InquiryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    agency: string;
    department: string;
    document_type: string;
    quantity: string;
    urgency: string;
    specifications: string;
    status: string;
    created_at: string;
  };
}

export function InquiryDetailModal({
  open,
  onOpenChange,
  inquiry,
}: InquiryDetailModalProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, "destructive" | "default" | "secondary"> = {
      pending: "secondary",
      contacted: "default",
      converted: "default",
      rejected: "destructive",
    };
    return colors[status] || "secondary";
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, "destructive" | "default" | "secondary"> = {
      urgent: "destructive",
      normal: "default",
      low: "secondary",
    };
    return colors[urgency] || "secondary";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Inquiry ID</Label>
            <p className="text-sm font-mono">{inquiry.id}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Contact Information</Label>
            <div className="bg-muted p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Name:</span>
                <span className="text-sm">{inquiry.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Email:</span>
                <span className="text-sm">{inquiry.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Phone:</span>
                <span className="text-sm">{inquiry.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Position:</span>
                <span className="text-sm">{inquiry.position}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Organization</Label>
            <div className="bg-muted p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Agency:</span>
                <span className="text-sm">{inquiry.agency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Department:</span>
                <span className="text-sm">{inquiry.department}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Badge variant="outline">{inquiry.document_type}</Badge>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <p className="font-semibold">{inquiry.quantity}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Urgency</Label>
              <Badge variant={getUrgencyColor(inquiry.urgency)}>
                {inquiry.urgency}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Badge variant={getStatusColor(inquiry.status)}>
                {inquiry.status}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Specifications</Label>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{inquiry.specifications}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Submitted</Label>
            <p className="text-sm">{new Date(inquiry.created_at).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
