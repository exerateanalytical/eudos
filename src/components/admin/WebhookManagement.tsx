import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, TestTube2, CheckCircle2, XCircle, Clock } from "lucide-react";

const WEBHOOK_EVENTS = [
  { id: 'payment_confirmed', label: 'Payment Confirmed' },
  { id: 'payment_expired', label: 'Payment Expired' },
  { id: 'payment_expiring_soon', label: 'Payment Expiring Soon' },
  { id: 'escrow_released', label: 'Escrow Released' },
  { id: 'escrow_refunded', label: 'Escrow Refunded' },
  { id: 'blockchain_transaction_detected', label: 'Blockchain Transaction Detected' },
  { id: 'order_status_changed', label: 'Order Status Changed' },
];

export function WebhookManagement() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    secretKey: '',
    events: [] as string[],
    maxRetries: 3,
  });

  // Fetch webhooks
  const { data: webhooks, isLoading } = useQuery({
    queryKey: ['webhook-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch delivery logs
  const { data: deliveries } = useQuery({
    queryKey: ['webhook-deliveries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_deliveries')
        .select('*, webhook_subscriptions(url)')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });

  // Create webhook
  const createWebhook = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('webhook_subscriptions').insert({
        url: formData.url,
        secret_key: formData.secretKey,
        events: formData.events,
        max_retries: formData.maxRetries,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Webhook created successfully');
      queryClient.invalidateQueries({ queryKey: ['webhook-subscriptions'] });
      setDialogOpen(false);
      setFormData({ url: '', secretKey: '', events: [], maxRetries: 3 });
    },
    onError: (error: any) => {
      toast.error(`Failed to create webhook: ${error.message}`);
    },
  });

  // Delete webhook
  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('webhook_subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Webhook deleted');
      queryClient.invalidateQueries({ queryKey: ['webhook-subscriptions'] });
    },
  });

  // Toggle active status
  const toggleWebhook = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('webhook_subscriptions')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-subscriptions'] });
    },
  });

  // Test webhook
  const testWebhook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.functions.invoke('webhook-delivery', {
        body: {
          eventType: 'test_webhook',
          payload: {
            message: 'This is a test webhook',
            timestamp: new Date().toISOString(),
          },
        },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Test webhook sent');
      queryClient.invalidateQueries({ queryKey: ['webhook-deliveries'] });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'retrying':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Webhook Subscriptions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Webhook Subscriptions</CardTitle>
              <CardDescription>
                Configure webhook endpoints to receive real-time payment notifications
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Webhook Subscription</DialogTitle>
                  <DialogDescription>
                    Set up a new webhook endpoint to receive event notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url">Webhook URL</Label>
                    <Input
                      id="url"
                      placeholder="https://your-app.com/webhooks/bitcoin"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="secret">Secret Key</Label>
                    <Input
                      id="secret"
                      type="password"
                      placeholder="Used to sign webhook payloads"
                      value={formData.secretKey}
                      onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retries">Max Retries</Label>
                    <Input
                      id="retries"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.maxRetries}
                      onChange={(e) => setFormData({ ...formData, maxRetries: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Events to Subscribe</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {WEBHOOK_EVENTS.map((event) => (
                        <div key={event.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={event.id}
                            checked={formData.events.includes(event.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  events: [...formData.events, event.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  events: formData.events.filter((e) => e !== event.id),
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor={event.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {event.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => createWebhook.mutate()}
                    disabled={!formData.url || !formData.secretKey || formData.events.length === 0}
                  >
                    Create Webhook
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Last Triggered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks?.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>
                      <Switch
                        checked={webhook.is_active}
                        onCheckedChange={(checked) =>
                          toggleWebhook.mutate({ id: webhook.id, isActive: checked })
                        }
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{webhook.url}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.slice(0, 2).map((event: string) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                        {webhook.events.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{webhook.events.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {webhook.last_triggered_at
                        ? new Date(webhook.last_triggered_at).toLocaleString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testWebhook.mutate(webhook.id)}
                        >
                          <TestTube2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteWebhook.mutate(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Webhook Deliveries</CardTitle>
          <CardDescription>Last 50 webhook delivery attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Delivered At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries?.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(delivery.status)}
                      <span className="capitalize">{delivery.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {delivery.webhook_subscriptions?.url}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{delivery.event_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {delivery.response_code && (
                      <Badge variant={delivery.response_code >= 200 && delivery.response_code < 300 ? 'default' : 'destructive'}>
                        {delivery.response_code}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {delivery.delivered_at
                      ? new Date(delivery.delivered_at).toLocaleString()
                      : 'Pending'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
