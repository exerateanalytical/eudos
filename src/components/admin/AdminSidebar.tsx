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
  { title: "Analytics", url: "/admin", icon: BarChart3, end: true },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Applications", url: "/admin/applications", icon: FileText },
  { title: "Payments", url: "/admin/payments", icon: DollarSign },
  { title: "Inquiries", url: "/admin/inquiries", icon: MessageSquare },
  { title: "Blog Posts", url: "/admin/blog", icon: FileText },
  { title: "Reviews", url: "/admin/reviews", icon: Eye },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
}
