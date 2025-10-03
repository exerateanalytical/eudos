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
  Database,
  Shield,
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
  { title: "Seeding", url: "/dashboard/seeding", icon: Database },
  { title: "Admin Panel", url: "/admin", icon: Shield },
];

export function DashboardSidebar({ isAdmin }: DashboardSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r-2 border-primary/10 bg-gradient-to-b from-background via-accent/5 to-background">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {userItems.map((item, index) => (
                <SidebarMenuItem key={item.title} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.end}
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold shadow-lg hover-scale transition-all duration-300" 
                          : "hover:bg-accent/50 transition-all duration-300 hover-scale"
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
          <SidebarGroupLabel className="text-primary font-semibold">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {accountItems.map((item, index) => (
                <SidebarMenuItem key={item.title} className="animate-fade-in" style={{ animationDelay: `${(userItems.length + index) * 30}ms` }}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold shadow-lg hover-scale transition-all duration-300" 
                          : "hover:bg-accent/50 transition-all duration-300 hover-scale"
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
            <SidebarGroupLabel className="text-primary font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {adminItems.map((item, index) => (
                  <SidebarMenuItem key={item.title} className="animate-fade-in" style={{ animationDelay: `${(userItems.length + accountItems.length + index) * 30}ms` }}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) =>
                          isActive 
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover-scale transition-all duration-300" 
                            : "hover:bg-accent/50 transition-all duration-300 hover-scale"
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
