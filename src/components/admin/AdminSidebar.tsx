import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  FileText,
  DollarSign,
  MessageSquare,
  Eye,
  Sparkles,
  Headphones,
  BookOpen,
  Star,
  Activity,
  FileCode,
  Mail,
  Settings,
  Bitcoin,
  FolderTree,
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

const adminItems = [
  { 
    title: "Analytics", 
    url: "/admin", 
    icon: BarChart3, 
    end: true,
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    title: "Users", 
    url: "/admin/users", 
    icon: Users,
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    title: "Products", 
    url: "/admin/products", 
    icon: Package,
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    title: "Categories", 
    url: "/admin/categories", 
    icon: FolderTree,
    gradient: "from-lime-500 to-green-500"
  },
  { 
    title: "Orders", 
    url: "/admin/orders", 
    icon: ShoppingCart,
    gradient: "from-orange-500 to-red-500"
  },
  { 
    title: "Applications", 
    url: "/admin/applications", 
    icon: FileText,
    gradient: "from-indigo-500 to-purple-500"
  },
  { 
    title: "Payments", 
    url: "/admin/payments", 
    icon: DollarSign,
    gradient: "from-yellow-500 to-orange-500"
  },
  { 
    title: "Bitcoin Payments", 
    url: "/admin/bitcoin", 
    icon: Bitcoin,
    gradient: "from-orange-500 to-yellow-500"
  },
  { 
    title: "Inquiries", 
    url: "/admin/inquiries", 
    icon: MessageSquare,
    gradient: "from-teal-500 to-cyan-500"
  },
  { 
    title: "Support Tickets", 
    url: "/admin/support", 
    icon: Headphones,
    gradient: "from-amber-500 to-orange-500"
  },
  { 
    title: "Blog Posts", 
    url: "/admin/blog", 
    icon: BookOpen,
    gradient: "from-rose-500 to-pink-500"
  },
  { 
    title: "Reviews", 
    url: "/admin/reviews", 
    icon: Star,
    gradient: "from-violet-500 to-purple-500"
  },
  { 
    title: "Pages", 
    url: "/admin/pages", 
    icon: FileCode,
    gradient: "from-cyan-500 to-blue-500"
  },
  { 
    title: "Activity Logs", 
    url: "/admin/activity", 
    icon: Activity,
    gradient: "from-slate-500 to-gray-500"
  },
  { 
    title: "Notifications", 
    url: "/admin/notifications", 
    icon: Mail,
    gradient: "from-blue-500 to-indigo-500"
  },
  { 
    title: "Settings", 
    url: "/admin/settings", 
    icon: Settings,
    gradient: "from-gray-500 to-slate-500"
  },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r-2 border-primary/20 bg-gradient-to-b from-background via-accent/5 to-background">
      <SidebarContent>
        <div className="p-4 mb-2 animate-fade-in">
          <div className="flex items-center gap-2 justify-center">
            <div className="p-2 bg-gradient-to-br from-primary to-primary/60 rounded-lg shadow-lg">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            {open && (
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <p className="text-xs text-muted-foreground">Manage Everything</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminItems.map((item, index) => (
                <SidebarMenuItem key={item.title} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <SidebarMenuButton asChild>
                     <NavLink 
                      to={item.url} 
                      end={item.end}
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-accent text-blue-600 font-semibold shadow-lg hover-scale transition-all duration-300" 
                          : "hover:bg-accent/50 text-blue-600 transition-all duration-300 hover-scale"
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`p-1 rounded-md ${isActive ? 'bg-white/20' : `bg-gradient-to-br ${item.gradient}`}`}>
                            <item.icon className="h-4 w-4 text-white" />
                          </div>
                          {open && <span className="ml-1">{item.title}</span>}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
