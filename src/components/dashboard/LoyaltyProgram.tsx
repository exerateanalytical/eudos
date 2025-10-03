import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, Award, Gift } from "lucide-react";
import { format } from "date-fns";

interface LoyaltyPoints {
  points: number;
  lifetime_points: number;
  tier: string;
}

interface LoyaltyTransaction {
  id: string;
  points: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

interface LoyaltyProgramProps {
  userId: string;
}

export const LoyaltyProgram = ({ userId }: LoyaltyProgramProps) => {
  const [loading, setLoading] = useState(true);
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyPoints>({
    points: 0,
    lifetime_points: 0,
    tier: "bronze",
  });
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);

  useEffect(() => {
    fetchLoyaltyData();
  }, [userId]);

  const fetchLoyaltyData = async () => {
    try {
      const { data: pointsData } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (pointsData) {
        setLoyaltyData(pointsData);
      } else {
        await supabase.from("loyalty_points").insert({
          user_id: userId,
          points: 0,
          lifetime_points: 0,
          tier: "bronze",
        });
      }

      const { data: transData } = await supabase
        .from("loyalty_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      setTransactions(transData || []);
    } catch (error) {
      console.error("Error fetching loyalty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = (tier: string) => {
    const tiers = {
      bronze: { color: "bg-orange-600", next: "silver", pointsNeeded: 1000 },
      silver: { color: "bg-gray-400", next: "gold", pointsNeeded: 5000 },
      gold: { color: "bg-yellow-500", next: "platinum", pointsNeeded: 10000 },
      platinum: { color: "bg-purple-500", next: "diamond", pointsNeeded: 25000 },
      diamond: { color: "bg-blue-500", next: null, pointsNeeded: null },
    };
    return tiers[tier as keyof typeof tiers] || tiers.bronze;
  };

  const tierInfo = getTierInfo(loyaltyData.tier);
  const progressToNextTier = tierInfo.pointsNeeded
    ? (loyaltyData.lifetime_points / tierInfo.pointsNeeded) * 100
    : 100;

  if (loading) {
    return <div className="text-center py-8">Loading loyalty program...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Award className="h-8 w-8" />
          Loyalty Program
        </h2>
        <p className="text-muted-foreground">Earn points and unlock rewards</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyaltyData.points.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available to redeem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Points</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyaltyData.lifetime_points.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={`${tierInfo.color} text-white capitalize`}>
                {loyaltyData.tier}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Member status</p>
          </CardContent>
        </Card>
      </div>

      {tierInfo.next && (
        <Card>
          <CardHeader>
            <CardTitle>Progress to {tierInfo.next} Tier</CardTitle>
            <CardDescription>
              {tierInfo.pointsNeeded! - loyaltyData.lifetime_points} points needed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressToNextTier} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {loyaltyData.lifetime_points.toLocaleString()} / {tierInfo.pointsNeeded!.toLocaleString()} points
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Rewards
          </CardTitle>
          <CardDescription>Redeem your points for exclusive rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">5% Discount Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use on your next purchase
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">500 points</span>
                  <Badge variant={loyaltyData.points >= 500 ? "default" : "secondary"}>
                    {loyaltyData.points >= 500 ? "Available" : "Locked"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">10% Discount Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use on your next purchase
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">1,000 points</span>
                  <Badge variant={loyaltyData.points >= 1000 ? "default" : "secondary"}>
                    {loyaltyData.points >= 1000 ? "Available" : "Locked"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>Your recent point transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.created_at), "PPp")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          transaction.points > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.points > 0 ? "+" : ""}
                        {transaction.points}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.transaction_type.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
