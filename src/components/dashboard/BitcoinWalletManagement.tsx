import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bitcoin, Plus, Edit, Trash2 } from "lucide-react";
import { AdminPaymentDashboard } from "./AdminPaymentDashboard";
import { BitcoinAnalytics } from "./BitcoinAnalytics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Wallet {
  id: string;
  name: string;
  xpub: string;
  network: string;
  derivation_path: string;
  next_index: number;
  created_at: string;
}

interface Payment {
  id: string;
  wallet_id: string;
  order_id: string;
  address: string;
  amount_btc: number;
  status: string;
  txid: string | null;
  confirmations: number;
  created_at: string;
}

export function BitcoinWalletManagement() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    xpub: "",
    derivation_path: "m/0h" // Default to Electrum BIP32
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletsResult, paymentsResult] = await Promise.all([
        supabase.from("btc_wallets").select("*").order("created_at", { ascending: false }),
        supabase.from("btc_payments").select("*").order("created_at", { ascending: false }),
      ]);

      if (walletsResult.error) throw walletsResult.error;
      if (paymentsResult.error) throw paymentsResult.error;

      setWallets(walletsResult.data || []);
      setPayments(paymentsResult.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWallet = async () => {
    try {
      // Validate xpub/zpub format for mainnet
      const isValidXpub = formData.xpub.startsWith('xpub') || formData.xpub.startsWith('zpub');
      if (!isValidXpub) {
        toast({
          title: "Invalid extended public key",
          description: "Please enter a valid mainnet xpub (Electrum BIP32) or zpub (BIP84) key",
          variant: "destructive",
        });
        return;
      }

      // Validate extended public key length
      if (formData.xpub.length < 100 || formData.xpub.length > 120) {
        toast({
          title: "Invalid extended public key",
          description: "Extended public key length appears incorrect",
          variant: "destructive",
        });
        return;
      }

      // Validate derivation path format (accept both ' and h notation)
      const isZpub = formData.xpub.startsWith('zpub');
      const isXpub = formData.xpub.startsWith('xpub');
      
      if (isZpub) {
        // zpub should use BIP84 path (informational - zpub handles derivation internally)
        if (formData.derivation_path && !formData.derivation_path.startsWith("m/84'")) {
          console.warn("zpub wallet has non-BIP84 derivation path, but BIP84 will handle derivation internally");
        }
      } else if (isXpub) {
        // xpub can use various paths - validate format (accept both ' and h notation)
        if (formData.derivation_path && !formData.derivation_path.match(/^m(\/\d+['h]?)+$/i)) {
          toast({
            title: "Invalid derivation path",
            description: "Expected format like m/0h or m/84'/0'/0'",
            variant: "destructive",
          });
          return;
        }
      }

      if (!formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Wallet name is required",
          variant: "destructive",
        });
        return;
      }

      if (editingWallet) {
        // Update existing wallet
        const { error } = await supabase
          .from("btc_wallets")
          .update({
            name: formData.name.trim(),
            xpub: formData.xpub.trim(),
            network: "mainnet", // Always mainnet
            derivation_path: formData.derivation_path,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingWallet.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Wallet updated successfully",
        });
      } else {
        // Add new wallet
        const { error } = await supabase.from("btc_wallets").insert({
          name: formData.name.trim(),
          xpub: formData.xpub.trim(),
          network: "mainnet", // Always mainnet
          derivation_path: formData.derivation_path
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Bitcoin wallet added successfully",
        });
      }

      setDialogOpen(false);
      setEditingWallet(null);
      setFormData({
        name: "",
        xpub: "",
        derivation_path: "m/0h" // Default to Electrum BIP32
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditWallet = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setFormData({
      name: wallet.name,
      xpub: wallet.xpub,
      derivation_path: wallet.derivation_path,
    });
    setDialogOpen(true);
  };

  const handleDeleteWallet = async (walletId: string, walletName: string) => {
    if (!confirm(`Are you sure you want to delete wallet "${walletName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("btc_wallets")
        .delete()
        .eq("id", walletId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Wallet deleted successfully",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpenAddDialog = () => {
    setEditingWallet(null);
    setFormData({
      name: "",
      xpub: "",
      derivation_path: "m/0h" // Default to Electrum BIP32
    });
    setDialogOpen(true);
  };

  const walletColumns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "network",
      label: "Network",
      render: () => (
        <Badge variant="default">
          Mainnet
        </Badge>
      ),
    },
    {
      key: "xpub",
      label: "XPub",
      render: (row: Wallet) => (
        <code className="text-xs">{row.xpub.substring(0, 20)}...</code>
      ),
    },
    {
      key: "next_index",
      label: "Next Index",
    },
    {
      key: "created_at",
      label: "Created",
      render: (row: Wallet) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Wallet) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditWallet(row)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteWallet(row.id, row.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const paymentColumns = [
    {
      key: "order_id",
      label: "Order ID",
    },
    {
      key: "address",
      label: "Address",
      render: (row: Payment) => (
        <code className="text-xs">{row.address.substring(0, 15)}...</code>
      ),
    },
    {
      key: "amount_btc",
      label: "Amount (BTC)",
      render: (row: Payment) => `${row.amount_btc} BTC`,
    },
    {
      key: "status",
      label: "Status",
      render: (row: Payment) => (
        <Badge variant={row.status === "paid" ? "default" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "confirmations",
      label: "Confirmations",
    },
    {
      key: "created_at",
      label: "Date",
      render: (row: Payment) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading Bitcoin data...</p>
      </div>
    );
  }

  const totalReceived = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount_btc), 0);

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount_btc), 0);

  return (
    <div className="space-y-8">
      {/* Payment Dashboard */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Bitcoin className="h-7 w-7" />
          Payment Dashboard
        </h2>
        <AdminPaymentDashboard />
      </div>

      {/* Wallet Management Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Wallet Management</h2>
            <p className="text-muted-foreground mt-1">
              Configure Bitcoin wallets for payment processing
            </p>
          </div>
          <Button onClick={handleOpenAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        {/* Analytics Dashboard */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Analytics</h3>
          <BitcoinAnalytics />
        </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingWallet ? "Edit Bitcoin Wallet" : "Add Bitcoin Wallet"}
            </DialogTitle>
            <DialogDescription>
              {editingWallet 
                ? "Update your Bitcoin wallet details" 
                : "Add a new Bitcoin wallet using an xpub key"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Wallet Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Primary Wallet"
              />
            </div>
            <div>
              <Label>Extended Public Key</Label>
              <Input
                value={formData.xpub}
                onChange={(e) => setFormData({ ...formData, xpub: e.target.value })}
                placeholder="xpub... or zpub..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mainnet xpub (Electrum BIP32) or zpub (BIP84) extended public key
              </p>
            </div>
            <div>
              <Label>Derivation Path</Label>
              <Input
                value={formData.derivation_path}
                onChange={(e) => setFormData({ ...formData, derivation_path: e.target.value })}
                placeholder="m/0h or m/84'/0'/0'/0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Derivation path (accepts both ' and h notation):<br/>
                • Electrum BIP32 (xpub): m/0h or m/0'/0 (P2PKH, 1... addresses)<br/>
                • BIP49 (xpub): m/49'/0'/0'/0 (P2SH-P2WPKH, 3... addresses)<br/>
                • BIP84/zpub: m/84'/0'/0'/0 (P2WPKH, bc1... addresses)
              </p>
            </div>
            <Button onClick={handleSaveWallet} className="w-full">
              {editingWallet ? "Update Wallet" : "Add Wallet"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Received</p>
          <p className="text-2xl font-bold">{totalReceived.toFixed(8)} BTC</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold">{pendingAmount.toFixed(8)} BTC</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Payments</p>
          <p className="text-2xl font-bold">{payments.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Wallets</h2>
        {wallets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No wallets configured yet</p>
            <Button onClick={handleOpenAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Wallet
            </Button>
          </div>
        ) : (
          <AdminDataTable
            data={wallets}
            columns={walletColumns}
            searchPlaceholder="Search wallets..."
          />
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
        <AdminDataTable
          data={payments}
          columns={paymentColumns}
          searchPlaceholder="Search payments..."
        />
      </Card>
      </div>
    </div>
  );
}
