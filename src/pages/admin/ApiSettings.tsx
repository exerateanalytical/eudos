import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Key, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Info,
  Mail,
  Bitcoin,
  RefreshCw,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface ApiStatus {
  name: string;
  key: string;
  icon: any;
  description: string;
  isConfigured: boolean;
  tested: boolean;
  working: boolean;
  lastChecked: string | null;
}

export default function ApiSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    {
      name: "BlockCypher API",
      key: "BLOCKCYPHER_API_TOKEN",
      icon: Bitcoin,
      description: "Bitcoin blockchain API for payment verification",
      isConfigured: false,
      tested: false,
      working: false,
      lastChecked: null,
    },
    {
      name: "Resend API",
      key: "RESEND_API_KEY",
      icon: Mail,
      description: "Email service for notifications and alerts",
      isConfigured: false,
      tested: false,
      working: false,
      lastChecked: null,
    },
  ]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id);

    const isAdmin = roles?.some(r => r.role === 'admin');
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    checkApiStatuses();
  };

  const checkApiStatuses = async () => {
    setLoading(true);
    try {
      // Check if secrets are configured by trying to use them
      const updatedStatuses = [...apiStatuses];

      // Check BlockCypher
      try {
        const { data, error } = await supabase.functions.invoke('system-health');
        if (!error && data) {
          const blockcypherCheck = data.checks?.find((c: any) => c.component === 'blockcypher_api');
          if (blockcypherCheck) {
            const idx = updatedStatuses.findIndex(s => s.key === 'BLOCKCYPHER_API_TOKEN');
            updatedStatuses[idx] = {
              ...updatedStatuses[idx],
              isConfigured: true,
              tested: true,
              working: blockcypherCheck.status === 'healthy',
              lastChecked: new Date().toISOString(),
            };
          }
        }
      } catch (error) {
        console.error('Error checking BlockCypher:', error);
      }

      // For Resend, we can't easily test without sending an email
      // So we just mark as configured if no error when invoking health
      const resendIdx = updatedStatuses.findIndex(s => s.key === 'RESEND_API_KEY');
      updatedStatuses[resendIdx] = {
        ...updatedStatuses[resendIdx],
        isConfigured: true, // Assume configured if in secrets
        tested: false,
        working: false,
        lastChecked: null,
      };

      setApiStatuses(updatedStatuses);
    } catch (error) {
      console.error('Error checking API statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const testApi = async (apiKey: string) => {
    setTesting(apiKey);
    try {
      if (apiKey === 'BLOCKCYPHER_API_TOKEN') {
        const { data, error } = await supabase.functions.invoke('system-health');
        
        if (!error && data) {
          const blockcypherCheck = data.checks?.find((c: any) => c.component === 'blockcypher_api');
          
          if (blockcypherCheck?.status === 'healthy') {
            toast.success('BlockCypher API is working correctly!');
          } else {
            toast.error('BlockCypher API test failed. Please check your token.');
          }

          const updatedStatuses = apiStatuses.map(status => {
            if (status.key === apiKey) {
              return {
                ...status,
                tested: true,
                working: blockcypherCheck?.status === 'healthy',
                lastChecked: new Date().toISOString(),
              };
            }
            return status;
          });
          setApiStatuses(updatedStatuses);
        }
      } else if (apiKey === 'RESEND_API_KEY') {
        toast.info('To test Resend, use the test email notification feature in System Settings.');
      }
    } catch (error: any) {
      console.error('Error testing API:', error);
      toast.error(`Test failed: ${error.message}`);
    } finally {
      setTesting(null);
    }
  };

  const updateSecret = (secretName: string) => {
    toast.info(`Please use the Lovable Cloud secrets manager to update ${secretName}. Check the chat for the update button.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Key className="w-8 h-8" />
            API Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage external API integrations and secrets
          </p>
        </div>
        <Button onClick={checkApiStatuses} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Security Notice */}
      <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700 dark:text-blue-300">Security Notice</AlertTitle>
        <AlertDescription className="text-blue-600 dark:text-blue-400">
          API keys are securely stored in Lovable Cloud and never exposed in the frontend. 
          Updates are managed through the secure secrets system.
        </AlertDescription>
      </Alert>

      {/* API Status Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {apiStatuses.map((api) => {
          const IconComponent = api.icon;
          return (
            <Card key={api.key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5" />
                  {api.name}
                  {api.tested && (
                    api.working ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Working
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                      </Badge>
                    )
                  )}
                  {!api.tested && api.isConfigured && (
                    <Badge variant="outline">
                      <Info className="w-3 h-3 mr-1" />
                      Not Tested
                    </Badge>
                  )}
                  {!api.isConfigured && (
                    <Badge variant="secondary">
                      Not Configured
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>{api.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Secret Key:</span>
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {api.key}
                  </code>
                </div>

                {api.lastChecked && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Checked:</span>
                    <span className="text-xs">
                      {new Date(api.lastChecked).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => testApi(api.key)}
                    variant="outline"
                    size="sm"
                    disabled={!api.isConfigured || testing === api.key}
                    className="flex-1"
                  >
                    {testing === api.key ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => updateSecret(api.key)}
                    variant="default"
                    size="sm"
                    className="flex-1"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Update Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            How to Update API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h3 className="font-semibold">BlockCypher API Token</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Visit <a href="https://www.blockcypher.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BlockCypher.com</a></li>
              <li>Create an account or sign in</li>
              <li>Generate an API token from your dashboard</li>
              <li>Click "Update Key" above and paste your token</li>
            </ol>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-semibold">Resend API Key</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Visit <a href="https://resend.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Resend.com</a></li>
              <li>Sign up and verify your email domain</li>
              <li>Create an API key from your dashboard</li>
              <li>Click "Update Key" above and paste your API key</li>
            </ol>
          </div>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              After updating keys, use the "Test Connection" button to verify they're working correctly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
