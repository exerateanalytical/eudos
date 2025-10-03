import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Share2, Gift, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Referral {
  id: string;
  referred_email: string;
  referral_code: string;
  status: string;
  reward_amount: number | null;
  reward_claimed: boolean;
  created_at: string;
  completed_at: string | null;
}

interface ReferralSystemProps {
  userId: string;
}

export const ReferralSystem = ({ userId }: ReferralSystemProps) => {
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    fetchReferrals();
    generateReferralCode();
  }, [userId]);

  const generateReferralCode = () => {
    const code = `REF-${userId.substring(0, 8).toUpperCase()}`;
    setReferralCode(code);
  };

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReferral = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("referrals").insert({
        referrer_id: userId,
        referred_email: email,
        referral_code: referralCode,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Referral invitation sent!",
      });

      setEmail("");
      fetchReferrals();
    } catch (error) {
      console.error("Error sending referral:", error);
      toast({
        title: "Error",
        description: "Failed to send referral invitation",
        variant: "destructive",
      });
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      pending: "secondary",
      completed: "default",
      expired: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const stats = {
    total: referrals.length,
    completed: referrals.filter((r) => r.status === "completed").length,
    pending: referrals.filter((r) => r.status === "pending").length,
    earned: referrals.reduce((sum, r) => sum + (r.reward_amount || 0), 0),
  };

  if (loading) {
    return <div className="text-center py-8">Loading referral program...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Referral Program
        </h2>
        <p className="text-muted-foreground">Invite friends and earn rewards</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.earned.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Share this code with friends to earn rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={referralCode} readOnly className="font-mono text-lg" />
            <Button onClick={copyReferralCode} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Earn $10 for each friend who makes their first purchase using your code!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send Referral Invitation</CardTitle>
          <CardDescription>Invite friends via email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendReferral} className="flex gap-2">
            <Input
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Share2 className="mr-2 h-4 w-4" />
              Send Invite
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Track your referral invitations</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {referrals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No referrals yet. Start inviting friends!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <p className="font-medium">{referral.referred_email}</p>
                      <p className="text-sm text-muted-foreground">
                        Invited {format(new Date(referral.created_at), "PP")}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      {getStatusBadge(referral.status)}
                      {referral.reward_amount && (
                        <p className="text-sm font-medium text-green-600">
                          +${referral.reward_amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Share your unique referral code with friends</li>
            <li>Your friend signs up and makes their first purchase</li>
            <li>You both receive $10 in account credit</li>
            <li>There's no limit to how many friends you can refer!</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
