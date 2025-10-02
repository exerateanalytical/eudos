import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserCog, Loader2, Copy, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AdminCreationModule = ({ onCreated }: { onCreated?: () => void }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateAdmin = async () => {
    setIsCreating(true);
    setCredentials(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: {}
      });

      if (error) throw error;

      setCredentials({ email: data.email, password: data.password });
      toast.success('Admin account created successfully!');
      onCreated?.();
    } catch (error: any) {
      console.error('Admin creation error:', error);
      toast.error(error.message || 'Failed to create admin account');
    } finally {
      setIsCreating(false);
    }
  };

  const copyCredentials = () => {
    if (credentials) {
      navigator.clipboard.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`);
      setCopied(true);
      toast.success('Credentials copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          Admin Account Creation
        </CardTitle>
        <CardDescription>
          Create an admin account to access admin features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleCreateAdmin} 
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Admin...
            </>
          ) : (
            <>
              <UserCog className="mr-2 h-4 w-4" />
              Create Admin Account
            </>
          )}
        </Button>

        {credentials && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="space-y-2">
              <div className="font-semibold text-green-800">Admin account created!</div>
              <div className="space-y-1 text-sm">
                <div><strong>Email:</strong> {credentials.email}</div>
                <div><strong>Password:</strong> {credentials.password}</div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={copyCredentials}
                className="mt-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-3 w-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-3 w-3" />
                    Copy Credentials
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
