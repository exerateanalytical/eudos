import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const DashboardBreadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  const breadcrumbNames: Record<string, string> = {
    dashboard: "Dashboard",
    orders: "Orders",
    applications: "Applications",
    wallet: "Wallet",
    documents: "Documents",
    activity: "Activity Log",
    support: "Support Center",
    loyalty: "Loyalty Program",
    referrals: "Referral System",
    settings: "Settings",
    notifications: "Notifications",
    profile: "Profile",
    security: "Security",
    reviews: "Review Moderation",
    analytics: "Analytics",
    seeding: "Data Seeding",
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Link to="/" className="hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {paths.map((path, index) => {
        const routeTo = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const displayName = breadcrumbNames[path] || path;

        return (
          <div key={routeTo} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-foreground font-medium">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-foreground transition-colors">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
