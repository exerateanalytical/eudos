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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
  completed_at: string | null;
  order_id: string | null;
  metadata: any;
}

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
  onTransactionUpdated: () => void;
}

export function TransactionDetailModal({
  open,
  onOpenChange,
  transaction,
  onTransactionUpdated,
}: TransactionDetailModalProps) {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleRefund = async () => {
    if (!confirm("Are you sure you want to refund this transaction?")) {
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          status: "refunded",
          completed_at: new Date().toISOString(),
        })
        .eq("id", transaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction refunded successfully",
      });

      onTransactionUpdated();
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

  const handleComplete = async () => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", transaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction marked as completed",
      });

      onTransactionUpdated();
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
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{transaction.status}</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{transaction.transaction_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium text-lg">
                {transaction.currency} {transaction.amount.toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">{transaction.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="text-sm">
                {new Date(transaction.created_at).toLocaleString()}
              </p>
            </div>
            {transaction.completed_at && (
              <div>
                <p className="text-sm text-muted-foreground">Completed At</p>
                <p className="text-sm">
                  {new Date(transaction.completed_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {transaction.order_id && (
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm">{transaction.order_id}</p>
            </div>
          )}

          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Metadata</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(transaction.metadata, null, 2)}
              </pre>
            </div>
          )}

          <Separator />

          <div className="flex gap-2 justify-end">
            {transaction.status === "pending" && (
              <Button onClick={handleComplete} disabled={processing}>
                Mark as Completed
              </Button>
            )}
            {transaction.status === "completed" && (
              <Button
                onClick={handleRefund}
                disabled={processing}
                variant="destructive"
              >
                Issue Refund
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
