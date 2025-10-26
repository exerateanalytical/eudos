import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Key, Plus, RefreshCw, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { validateXpub } from "@/lib/xpubDerivation";

interface Xpub {
  id: string;
  xpub: string;
  network: string;
  derivation_path: string;
  next_index: number;
  is_active: boolean;
  created_at: string;
  notes: string | null;
}

export const XpubManagement = () => {
  const [xpubs, setXpubs] = useState<Xpub[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    xpub: "",
    network: "mainnet",
    notes: "",
  });

  useEffect(() => {
    fetchXpubs();
  }, []);

  const fetchXpubs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bitcoin_xpubs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setXpubs(data || []);
    } catch (error: any) {
      console.error("Error fetching xpubs:", error);
      toast.error("Failed to load xpubs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddXpub = async () => {
    if (!formData.xpub) {
      toast.error("Please enter an xpub");
      return;
    }

    // Validate xpub format
    if (!validateXpub(formData.xpub, formData.network as 'mainnet' | 'testnet')) {
      toast.error("Invalid xpub format for selected network");
      return;
    }

    try {
      const { error } = await supabase
        .from('bitcoin_xpubs')
        .insert({
          xpub: formData.xpub,
          network: formData.network,
          notes: formData.notes || null,
          is_active: xpubs.length === 0, // Auto-activate if first xpub
        });

      if (error) throw error;

      toast.success("Xpub added successfully");
      setFormData({ xpub: "", network: "mainnet", notes: "" });
      setShowAddForm(false);
      fetchXpubs();
    } catch (error: any) {
      console.error("Error adding xpub:", error);
      toast.error(error.message || "Failed to add xpub");
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      // If activating, deactivate all others first
      if (!currentActive) {
        await supabase
          .from('bitcoin_xpubs')
          .update({ is_active: false })
          .neq('id', id);
      }

      const { error } = await supabase
        .from('bitcoin_xpubs')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;

      toast.success(currentActive ? "Xpub deactivated" : "Xpub activated");
      fetchXpubs();
    } catch (error: any) {
      console.error("Error toggling xpub:", error);
      toast.error("Failed to update xpub");
    }
  };

  const generateAddresses = async (count: number = 50) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-addresses-from-xpub', {
        body: { count }
      });

      if (error) throw error;

      toast.success(`Generated ${data.generated} addresses`);
      if (data.errors && data.errors.length > 0) {
        toast.warning(`${data.errors.length} errors occurred`);
      }
    } catch (error: any) {
      console.error("Error generating addresses:", error);
      toast.error(error.message || "Failed to generate addresses");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Key className="w-6 h-6" />
            XPUB Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage extended public keys for dynamic address generation
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Xpub
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Xpub</CardTitle>
            <CardDescription>
              Enter an extended public key (xpub) to generate Bitcoin addresses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Network</Label>
              <Select
                value={formData.network}
                onValueChange={(value) => setFormData({ ...formData, network: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Extended Public Key (xpub)</Label>
              <Textarea
                placeholder="xpub6C..."
                value={formData.xpub}
                onChange={(e) => setFormData({ ...formData, xpub: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Must start with "xpub" for mainnet or "tpub" for testnet
              </p>
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input
                placeholder="e.g., Production wallet 2024"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                <strong>Security:</strong> Never share your xpub publicly. It can reveal all your addresses.
                Only use xpubs from wallets you control.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={handleAddXpub}>Add Xpub</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {xpubs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Key className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No xpubs configured. Add an xpub to start generating addresses automatically.
              </p>
            </CardContent>
          </Card>
        ) : (
          xpubs.map((xpub) => (
            <Card key={xpub.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-sm">
                        {xpub.xpub.substring(0, 20)}...{xpub.xpub.substring(xpub.xpub.length - 10)}
                      </h3>
                      {xpub.is_active && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="outline">{xpub.network}</Badge>
                      <span>Next Index: {xpub.next_index}</span>
                      <span>{xpub.derivation_path}</span>
                    </div>
                    {xpub.notes && (
                      <p className="text-sm text-muted-foreground">{xpub.notes}</p>
                    )}
                  </div>
                  
                  <Button
                    variant={xpub.is_active ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleActive(xpub.id, xpub.is_active)}
                  >
                    {xpub.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>

                {xpub.is_active && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateAddresses(50)}
                      disabled={generating}
                    >
                      {generating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Generate 50 Addresses
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateAddresses(100)}
                      disabled={generating}
                    >
                      Generate 100
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
