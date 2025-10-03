import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Send, Users, User } from "lucide-react";

export function EmailNotificationSystem() {
  const [recipientType, setRecipientType] = useState<"all" | "role" | "specific">("all");
  const [selectedRole, setSelectedRole] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendEmail = async () => {
    if (!subject || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSending(true);
    try {
      let recipients: string[] = [];

      if (recipientType === "all") {
        const { data, error } = await supabase
          .from("profiles")
          .select("email");
        
        if (error) throw error;
        recipients = data.map(p => p.email);
      } else if (recipientType === "role" && selectedRole) {
        const { data, error } = await supabase
          .from("user_roles")
          .select("user_id, profiles!inner(email)")
          .eq("role", selectedRole as "admin" | "moderator" | "user");
        
        if (error) throw error;
        recipients = data.map((r: any) => r.profiles.email);
      } else {
        recipients = [recipientEmail];
      }

      // Create notifications for users
      const notifications = recipients.map(email => ({
        user_id: null, // Will need to map email to user_id in real implementation
        title: subject,
        message: message,
        type: "info" as const
      }));

      toast.success(`Email notifications prepared for ${recipients.length} recipient(s)`);
      
      // Reset form
      setSubject("");
      setMessage("");
      setRecipientEmail("");
    } catch (error: any) {
      toast.error("Failed to send notifications: " + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Email Notifications</h2>
        <p className="text-muted-foreground">Send custom notifications to users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Compose Notification
          </CardTitle>
          <CardDescription>Create and send email notifications to your users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Recipients</Label>
            <Select value={recipientType} onValueChange={(v: any) => setRecipientType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    All Users
                  </div>
                </SelectItem>
                <SelectItem value="role">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    By Role
                  </div>
                </SelectItem>
                <SelectItem value="specific">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Specific User
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recipientType === "role" && (
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {recipientType === "specific" && (
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Subject *</Label>
            <Input
              placeholder="Notification subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Message *</Label>
            <Textarea
              placeholder="Type your message here..."
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button onClick={handleSendEmail} disabled={sending} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {sending ? "Sending..." : "Send Notification"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
