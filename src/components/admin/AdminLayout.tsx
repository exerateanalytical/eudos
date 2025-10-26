import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Image,
  Users,
  Settings,
  Tags,
  Menu as MenuIcon,
  Newspaper,
  MessageSquare,
  BarChart,
  ChevronDown,
  Bitcoin,
  Activity,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Pages",
    href: "/admin/pages",
    icon: FileText,
    children: [
      { title: "All Pages", href: "/admin/pages" },
      { title: "Add New", href: "/admin/pages/new" },
    ],
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
    icon: Newspaper,
    children: [
      { title: "All Posts", href: "/admin/blog" },
      { title: "Add New", href: "/admin/blog/new" },
      { title: "Categories", href: "/admin/blog/categories" },
    ],
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
    children: [
      { title: "All Products", href: "/admin/products" },
      { title: "Add New", href: "/admin/products/new" },
      { title: "Categories", href: "/admin/products/categories" },
    ],
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: Image,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Bitcoin Payments",
    href: "/admin/bitcoin",
    icon: Bitcoin,
    children: [
      { title: "Analytics", href: "/admin/bitcoin-analytics" },
      { title: "Bulk Operations", href: "/admin/bulk-operations" },
      { title: "Address Management", href: "/admin/bitcoin-addresses" },
    ],
  },
  {
    title: "Automation",
    href: "/admin/automation",
    icon: Webhook,
    children: [
      { title: "Webhooks & Jobs", href: "/admin/webhooks-automation" },
    ],
  },
  {
    title: "System",
    href: "/admin/system",
    icon: Activity,
    children: [
      { title: "Alerts", href: "/admin/system-alerts" },
      { title: "API Settings", href: "/admin/api-settings" },
    ],
  },
  {
    title: "Navigation",
    href: "/admin/navigation",
    icon: MenuIcon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r bg-card transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold">Admin CMS</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="space-y-1 p-2">
            {navItems.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                collapsed={sidebarCollapsed}
                currentPath={location.pathname}
              />
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItemComponent({
  item,
  collapsed,
  currentPath,
}: {
  item: NavItem;
  collapsed: boolean;
  currentPath: string;
}) {
  const [open, setOpen] = useState(
    item.children?.some((child) => currentPath.startsWith(child.href)) || false
  );
  const Icon = item.icon;
  const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/");

  if (item.children && !collapsed) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {item.title}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                open && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pl-6 pt-1">
          {item.children.map((child) => (
            <Link key={child.href} to={child.href}>
              <Button
                variant={currentPath === child.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                size="sm"
              >
                {child.title}
              </Button>
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link to={item.href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn("w-full", collapsed ? "justify-center px-2" : "justify-start")}
        title={collapsed ? item.title : undefined}
      >
        <Icon className="h-4 w-4" />
        {!collapsed && <span className="ml-2">{item.title}</span>}
      </Button>
    </Link>
  );
}
