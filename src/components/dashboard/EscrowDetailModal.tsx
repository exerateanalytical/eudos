import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EscrowTransaction {
  id: string;
  user_id: string;
  order_id: string | null;
  amount: number;
  currency: string;
  status: string;
  dispute_reason: string | null;
  resolution_notes: string | null;
  held_at: string;
  released_at: string | null;
  refunded_at: string | null;
  created_at: string;
}

interface EscrowDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  escrow: EscrowTransaction;
  onEscrowUpdated: () => void;
}

export function EscrowDetailModal({
  open,
  onOpenChange,
  escrow,
  onEscrowUpdated,
}: EscrowDetailModalProps) {
  const [processing, setProcessing] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState(
    escrow.resolution_notes || ""
  );
  const { toast } = useToast();

  const handleRelease = async () => {
    if (!confirm("Are you sure you want to release this escrow?")) {
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("escrow_transactions")
        .update({
          status: "released",
          released_at: new Date().toISOString(),
          resolution_notes: resolutionNotes,
        })
        .eq("id", escrow.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Escrow released successfully",
      });

      onEscrowUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleRefund = async () => {
    if (!confirm("Are you sure you want to refund this escrow?")) {
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("escrow_transactions")
        .update({
          status: "refunded",
          refunded_at: new Date().toISOString(),
          resolution_notes: resolutionNotes,
        })
        .eq("id", escrow.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Escrow refunded successfully",
      });

      onEscrowUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Escrow Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Escrow ID</p>
              <p className="font-mono text-sm">{escrow.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{escrow.status}</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium text-lg">
                {escrow.currency} {escrow.amount.toFixed(2)}
              </p>
            </div>
            {escrow.order_id && (
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono text-sm">{escrow.order_id}</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Held Since</p>
              <p className="text-sm">
                {new Date(escrow.held_at).toLocaleString()}
              </p>
            </div>
            {escrow.released_at && (
              <div>
                <p className="text-sm text-muted-foreground">Released At</p>
                <p className="text-sm">
                  {new Date(escrow.released_at).toLocaleString()}
                </p>
              </div>
            )}
            {escrow.refunded_at && (
              <div>
                <p className="text-sm text-muted-foreground">Refunded At</p>
                <p className="text-sm">
                  {new Date(escrow.refunded_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {escrow.dispute_reason && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Dispute Reason</p>
              <p className="bg-muted p-3 rounded text-sm">{escrow.dispute_reason}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="resolution-notes">Resolution Notes</Label>
            <Textarea
              id="resolution-notes"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Add notes about the resolution..."
              rows={4}
            />
          </div>

          <Separator />

          {escrow.status === "held" && (
            <div className="flex gap-2 justify-end">
              <Button
                onClick={handleRefund}
                disabled={processing}
                variant="destructive"
              >
                Refund to Buyer
              </Button>
              <Button onClick={handleRelease} disabled={processing}>
                Release to Seller
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
