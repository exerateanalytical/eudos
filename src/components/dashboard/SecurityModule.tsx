import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Key, Shield, Lock, Copy, Check } from "lucide-react";
import { z } from "zod";
import * as openpgp from "openpgp";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { Alert, AlertDescription } from "@/components/ui/alert";

const passwordChangeSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface SecurityModuleProps {
  userId: string;
}

interface TwoFactorData {
  secret_key: string;
  is_enabled: boolean;
  backup_codes: string[] | null;
}

const SecurityModule = ({ userId }: SecurityModuleProps) => {
  const [pgpKey, setPgpKey] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [generatingKey, setGeneratingKey] = useState(false);

  useEffect(() => {
    fetchSecuritySettings();
  }, [userId]);

  const fetchSecuritySettings = async () => {
    try {
      const { data: pgpData } = await supabase
        .from("pgp_keys")
        .select("public_key")
        .eq("user_id", userId)
        .maybeSingle();

      if (pgpData) {
        setPgpKey(pgpData.public_key);
      }

      const { data: twoFaData } = await supabase
        .from("two_factor_auth")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (twoFaData) {
        setTwoFactorData(twoFaData);
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
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", userId)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { privateKey, publicKey } = await openpgp.generateKey({
        type: "rsa",
        rsaBits: 4096,
        userIDs: [{ name: profile.full_name, email: profile.email }],
        format: "armored",
      });

      const { error } = await supabase.from("pgp_keys").upsert({
        user_id: userId,
        public_key: publicKey,
      });

      if (error) throw error;

      setPgpKey(publicKey);

      const blob = new Blob([privateKey], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `private-key-${userId}.asc`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PGP key pair generated! Private key downloaded. Keep it secure!");
    } catch (error: any) {
      toast.error(error.message || "Error generating PGP keys");
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
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single();

      if (!profile) throw new Error("Profile not found");

      const secret = authenticator.generateSecret();
      
      const codes = Array.from({ length: 10 }, () => 
        authenticator.generateSecret().substring(0, 8).toUpperCase()
      );

      const otpauth = authenticator.keyuri(
        profile.email,
        "SecurePrint Labs",
        secret
      );

      const qrCode = await QRCode.toDataURL(otpauth);
      setQrCodeUrl(qrCode);
      setBackupCodes(codes);
      setShowBackupCodes(true);

      const { error } = await supabase.from("two_factor_auth").upsert({
        user_id: userId,
        secret_key: secret,
        is_enabled: false,
        backup_codes: codes,
      });

      if (error) throw error;

      setTwoFactorData({
        secret_key: secret,
        is_enabled: false,
        backup_codes: codes,
      });

      toast.success("Scan QR code with your authenticator app");
    } catch (error: any) {
      toast.error(error.message || "Error setting up 2FA");
      console.error(error);
    }
  };

  const verify2FA = async () => {
    try {
      if (!twoFactorData) throw new Error("2FA not set up");

      const isValid = authenticator.verify({
        token: verificationCode,
        secret: twoFactorData.secret_key,
      });

      if (!isValid) {
        toast.error("Invalid verification code");
        return;
      }

      const { error } = await supabase
        .from("two_factor_auth")
        .update({ is_enabled: true })
        .eq("user_id", userId);

      if (error) throw error;

      setTwoFactorEnabled(true);
      setQrCodeUrl("");
      setVerificationCode("");
      toast.success("2FA enabled successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error verifying 2FA");
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

      setTwoFactorEnabled(false);
      setQrCodeUrl("");
      setShowBackupCodes(false);
      toast.success("2FA disabled");
    } catch (error: any) {
      toast.error(error.message || "Error disabling 2FA");
      console.error(error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    try {
      passwordChangeSchema.parse(data);

      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error(error.message || "Error updating password");
      }
    }
  };

  const copyToClipboard = async (text: string, code: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading security settings...</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Minimum 8 characters"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
              />
            </div>
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            PGP Encryption Keys
          </CardTitle>
          <CardDescription>
            Secure your communications with PGP encryption (4096-bit RSA)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!pgpKey ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a PGP key pair to encrypt sensitive communications. Your private key will be
                downloaded automatically - keep it secure and never share it!
              </p>
              <Button onClick={generatePGPKey} disabled={generatingKey}>
                {generatingKey ? "Generating..." : "Generate PGP Keys"}
              </Button>
            </div>
          ) : (
            <div>
              <Alert className="mb-4">
                <AlertDescription>
                  ✓ Your PGP keys have been generated. Share your public key with others to receive encrypted messages.
                </AlertDescription>
              </Alert>
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
            Add an extra layer of security using TOTP authenticator apps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!twoFactorEnabled && !qrCodeUrl && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Enable 2FA to require a verification code from your authenticator app (Google Authenticator, Authy, etc.) when logging in.
              </p>
              <Button onClick={setup2FA}>Enable 2FA</Button>
            </div>
          )}

          {qrCodeUrl && !twoFactorEnabled && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>Step 1:</strong> Scan this QR code with your authenticator app
                </AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <img src={qrCodeUrl} alt="2FA QR Code" className="border rounded-lg p-4 bg-white" />
              </div>
              
              <Alert>
                <AlertDescription>
                  <strong>Step 2:</strong> Enter the 6-digit code from your app to verify
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={verify2FA} disabled={verificationCode.length !== 6}>
                  Verify & Enable
                </Button>
                <Button variant="outline" onClick={() => {
                  setQrCodeUrl("");
                  setVerificationCode("");
                }}>
                  Cancel
                </Button>
              </div>

              {showBackupCodes && backupCodes.length > 0 && (
                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> Save these backup codes. Each can be used once if you lose access to your authenticator.
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {backupCodes.map((code, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-muted p-2 rounded font-mono text-sm">
                          <span>{code}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(code, code)}
                            className="ml-auto"
                          >
                            {copiedCode === code ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {twoFactorEnabled && (
            <div>
              <Alert className="mb-4">
                <AlertDescription>
                  ✓ Two-factor authentication is enabled. Your account is protected with TOTP codes.
                </AlertDescription>
              </Alert>
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
