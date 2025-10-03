import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Settings, Save, Shield, CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SystemConfig {
  siteName: string;
  contactEmail: string;
  supportEmail: string;
  enableRegistration: boolean;
  enableEmailVerification: boolean;
  enableTwoFactor: boolean;
  maintenanceMode: boolean;
  minPasswordLength: number;
  sessionTimeout: number;
  paymentGateway: string;
  paymentPublicKey: string;
}

export function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>({
    siteName: "Admin Platform",
    contactEmail: "contact@example.com",
    supportEmail: "support@example.com",
    enableRegistration: true,
    enableEmailVerification: true,
    enableTwoFactor: false,
    maintenanceMode: false,
    minPasswordLength: 8,
    sessionTimeout: 30,
    paymentGateway: "stripe",
    paymentPublicKey: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*");

      if (error) throw error;

      if (data) {
        const newConfig = { ...config };
        data.forEach((setting) => {
          const value = setting.setting_value as any;
          
          switch (setting.setting_key) {
            case 'site_name':
              newConfig.siteName = value.value || newConfig.siteName;
              break;
            case 'contact_email':
              newConfig.contactEmail = value.value || newConfig.contactEmail;
              break;
            case 'maintenance_mode':
              newConfig.maintenanceMode = value.enabled || false;
              break;
            case 'enable_2fa':
              newConfig.enableTwoFactor = value.enabled || false;
              break;
            case 'session_timeout':
              newConfig.sessionTimeout = value.minutes || 30;
              break;
            case 'password_min_length':
              newConfig.minPasswordLength = value.value || 8;
              break;
          }
        });
        setConfig(newConfig);
      }
    } catch (error: any) {
      console.error("Failed to load settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    const { error } = await supabase
      .from("system_settings")
      .update({ setting_value: value, updated_at: new Date().toISOString() })
      .eq("setting_key", key);

    if (error) throw error;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        updateSetting('site_name', { value: config.siteName }),
        updateSetting('contact_email', { value: config.contactEmail }),
        updateSetting('maintenance_mode', { enabled: config.maintenanceMode }),
        updateSetting('enable_2fa', { enabled: config.enableTwoFactor }),
        updateSetting('session_timeout', { minutes: config.sessionTimeout }),
        updateSetting('password_min_length', { value: config.minPasswordLength }),
      ]);
      toast.success("Settings saved successfully");
    } catch (error: any) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">Configure your platform settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input
              value={config.siteName}
              onChange={(e) => updateConfig("siteName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={config.contactEmail}
                onChange={(e) => updateConfig("contactEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input
                type="email"
                value={config.supportEmail}
                onChange={(e) => updateConfig("supportEmail", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Disable site for maintenance</p>
            </div>
            <Switch
              checked={config.maintenanceMode}
              onCheckedChange={(checked) => updateConfig("maintenanceMode", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Configure authentication and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable User Registration</Label>
              <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
            </div>
            <Switch
              checked={config.enableRegistration}
              onCheckedChange={(checked) => updateConfig("enableRegistration", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Verification Required</Label>
              <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
            </div>
            <Switch
              checked={config.enableEmailVerification}
              onCheckedChange={(checked) => updateConfig("enableEmailVerification", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Allow users to enable 2FA</p>
            </div>
            <Switch
              checked={config.enableTwoFactor}
              onCheckedChange={(checked) => updateConfig("enableTwoFactor", checked)}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Password Length</Label>
              <Input
                type="number"
                min="6"
                max="32"
                value={config.minPasswordLength}
                onChange={(e) => updateConfig("minPasswordLength", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input
                type="number"
                min="5"
                max="1440"
                value={config.sessionTimeout}
                onChange={(e) => updateConfig("sessionTimeout", parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateway
          </CardTitle>
          <CardDescription>Configure payment processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Payment Gateway</Label>
            <Input value={config.paymentGateway} disabled />
            <p className="text-sm text-muted-foreground">Currently using: Stripe</p>
          </div>

          <div className="space-y-2">
            <Label>Public API Key</Label>
            <Input
              type="password"
              placeholder="pk_live_..."
              value={config.paymentPublicKey}
              onChange={(e) => updateConfig("paymentPublicKey", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
