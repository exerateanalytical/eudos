import { BitcoinAnalyticsDashboard } from "@/components/admin/BitcoinAnalyticsDashboard";

const BitcoinAnalytics = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bitcoin Payment Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into Bitcoin payment performance, revenue trends, and user behavior
        </p>
      </div>
      
      <BitcoinAnalyticsDashboard />
    </div>
  );
};

export default BitcoinAnalytics;
