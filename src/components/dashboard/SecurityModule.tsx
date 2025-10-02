import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Key, Shield } from "lucide-react";

interface SecurityModuleProps {
  userId: string;
}

const SecurityModule = ({ userId }: SecurityModuleProps) => {
  const [pgpKey, setPgpKey] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatingKey, setGeneratingKey] = useState(false);

  useEffect(() => {
    fetchSecuritySettings();
  }, [userId]);

  const fetchSecuritySettings = async () => {
    try {
      // Fetch PGP key
      const { data: pgpData } = await supabase
        .from("pgp_keys")
        .select("public_key")
        .eq("user_id", userId)
        .single();

      if (pgpData) {
        setPgpKey(pgpData.public_key);
      }

      // Fetch 2FA status
      const { data: twoFaData } = await supabase
        .from("two_factor_auth")
        .select("is_enabled")
        .eq("user_id", userId)
        .single();

      if (twoFaData) {
        setTwoFactorEnabled(twoFaData.is_enabled);
      }
    } catch (error: any) {
      console.error("Error fetching security settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePGPKey = async () => {
    setGeneratingKey(true);
    try {
      // Generate a simple PGP key pair (in production, use openpgp.js library)
      const timestamp = Date.now();
      const publicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js
Generated: ${new Date().toISOString()}
User ID: ${userId}
Public Key ID: ${timestamp}

[This is a mock PGP public key for demonstration]
[In production, use OpenPGP.js to generate real keys]
-----END PGP PUBLIC KEY BLOCK-----`;

      const privateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js
Generated: ${new Date().toISOString()}
User ID: ${userId}
Private Key ID: ${timestamp}

[This is a mock PGP private key for demonstration]
[In production, use OpenPGP.js to generate real keys]
[KEEP THIS KEY SECURE - Never share your private key]
-----END PGP PRIVATE KEY BLOCK-----`;

      // Save public key to database
      const { error } = await supabase.from("pgp_keys").upsert({
        user_id: userId,
        public_key: publicKey,
      });

      if (error) throw error;

      setPgpKey(publicKey);

      // Download private key
      const blob = new Blob([privateKey], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `private-key-${userId}.asc`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PGP key pair generated! Private key downloaded.");
    } catch (error: any) {
      toast.error("Error generating PGP keys");
      console.error(error);
    } finally {
      setGeneratingKey(false);
    }
  };

  const downloadPublicKey = () => {
    if (!pgpKey) return;

    const blob = new Blob([pgpKey], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `public-key-${userId}.asc`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const setup2FA = async () => {
    try {
      // Generate TOTP secret (in production, use speakeasy library)
      const secret = `BASE32SECRET${Math.random().toString(36).substring(2, 15)}`.toUpperCase();
      
      const { error } = await supabase.from("two_factor_auth").upsert({
        user_id: userId,
        secret_key: secret,
        is_enabled: true,
        backup_codes: Array.from({ length: 10 }, () => 
          Math.random().toString(36).substring(2, 10).toUpperCase()
        ),
      });

      if (error) throw error;

      toast.success("2FA setup initiated. In production, scan QR code with authenticator app.");
      setTwoFactorEnabled(true);
    } catch (error: any) {
      toast.error("Error setting up 2FA");
      console.error(error);
    }
  };

  const disable2FA = async () => {
    try {
      const { error } = await supabase
        .from("two_factor_auth")
        .update({ is_enabled: false })
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("2FA disabled");
      setTwoFactorEnabled(false);
    } catch (error: any) {
      toast.error("Error disabling 2FA");
      console.error(error);
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading security settings...</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            PGP Encryption Keys
          </CardTitle>
          <CardDescription>
            Secure your communications with PGP encryption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!pgpKey ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a PGP key pair to encrypt sensitive communications. Your private key will be
                downloaded automatically - keep it secure!
              </p>
              <Button onClick={generatePGPKey} disabled={generatingKey}>
                {generatingKey ? "Generating..." : "Generate PGP Keys"}
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Your PGP keys have been generated. You can download your public key to share with others.
              </p>
              <Button onClick={downloadPublicKey} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Public Key
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication (2FA)
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!twoFactorEnabled ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Enable 2FA to require a verification code from your authenticator app when logging in.
              </p>
              <Button onClick={setup2FA}>Enable 2FA</Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-success mb-4">
                ✓ Two-factor authentication is enabled
              </p>
              <Button onClick={disable2FA} variant="outline">
                Disable 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityModule;