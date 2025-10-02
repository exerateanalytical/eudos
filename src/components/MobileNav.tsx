import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Printer, Menu, Home, Package, ShoppingBag, FileText, X, GraduationCap, Globe, Award, CreditCard, FileCheck, User, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface MobileNavProps {
  currentPage?: string;
}

export const MobileNav = ({ currentPage }: MobileNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/products", label: "Products", icon: Package },
    { path: "/passports", label: "Passports", icon: FileCheck },
    { path: "/drivers-license", label: "Driver's License", icon: CreditCard },
    { path: "/citizenship", label: "Citizenship", icon: Globe },
    { path: "/diplomas", label: "Diplomas", icon: GraduationCap },
    { path: "/certifications", label: "Certifications", icon: Award },
    { path: "/shop", label: "Shop", icon: ShoppingBag },
    { path: "/apply", label: "Apply", icon: FileText },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 md:gap-3 group cursor-pointer active:scale-95 transition-transform touch-manipulation" 
            onClick={() => handleNavClick("/")}
          >
            <div className="relative">
              <Printer className="h-6 w-6 md:h-8 md:w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SecurePrint Labs
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-4 lg:gap-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95 ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
            {session ? (
              <Button onClick={() => navigate("/dashboard")} variant="default" size="sm" className="active:scale-95">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="outline" size="icon" className="active:scale-95">
                <User className="h-4 w-4" />
              </Button>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="active:scale-95 touch-manipulation">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Printer className="h-5 w-5 text-primary" />
                    <span className="font-bold text-foreground">Menu</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                    className="h-8 w-8 active:scale-95"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavClick(item.path)}
                          className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-lg font-medium transition-all touch-manipulation active:scale-95 ${
                            isActive(item.path)
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                          }`}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="text-base">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </nav>

                {/* Footer CTA */}
                <div className="p-4 border-t border-border space-y-3">
                  {session ? (
                    <Button
                      className="w-full active:scale-95 touch-manipulation"
                      size="lg"
                      onClick={() => handleNavClick("/dashboard")}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  ) : (
                    <Button
                      className="w-full active:scale-95 touch-manipulation"
                      size="lg"
                      onClick={() => handleNavClick("/auth")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Login / Register
                    </Button>
                  )}
                  <Button
                    className="w-full active:scale-95 touch-manipulation"
                    size="lg"
                    variant="outline"
                    onClick={() => handleNavClick("/apply")}
                  >
                    Apply Now
                  </Button>
                  <Button
                    className="w-full active:scale-95 touch-manipulation"
                    size="lg"
                    variant="outline"
                    onClick={() => handleNavClick("/shop")}
                  >
                    Browse Shop
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
};
