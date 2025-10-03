import { NavLink } from "react-router-dom";
import {
  Home,
  Package,
  FileText,
  Wallet,
  FolderOpen,
  Activity,
  HeadphonesIcon,
  Gift,
  UserPlus,
  Settings,
  Bell,
  User,
  Lock,
  Eye,
  BarChart3,
  Database,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  isAdmin: boolean;
}

const userItems = [
  { title: "Overview", url: "/dashboard", icon: Home, end: true },
  { title: "Orders", url: "/dashboard/orders", icon: Package },
  { title: "Applications", url: "/dashboard/applications", icon: FileText },
  { title: "Wallet", url: "/dashboard/wallet", icon: Wallet },
  { title: "Documents", url: "/dashboard/documents", icon: FolderOpen },
  { title: "Activity", url: "/dashboard/activity", icon: Activity },
];

const accountItems = [
  { title: "Support", url: "/dashboard/support", icon: HeadphonesIcon },
  { title: "Loyalty", url: "/dashboard/loyalty", icon: Gift },
  { title: "Referrals", url: "/dashboard/referrals", icon: UserPlus },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Security", url: "/dashboard/security", icon: Lock },
];

const adminItems = [
  { title: "Reviews", url: "/dashboard/reviews", icon: Eye },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Seeding", url: "/dashboard/seeding", icon: Database },
];

export function DashboardSidebar({ isAdmin }: DashboardSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.end}
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                          : "hover:bg-accent/50 transition-colors"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                          : "hover:bg-accent/50 transition-colors"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) =>
                          isActive 
                            ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                            : "hover:bg-accent/50 transition-colors"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
