import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Globe, Menu, User, LayoutDashboard, Home, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative">
            <Globe className="h-6 w-6 md:h-8 md:w-8 text-primary transition-transform duration-300 group-hover:scale-110 active:scale-95" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            SecurePrint Labs
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2 lg:gap-4 items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <button onClick={() => navigate("/")} className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95">
                  <Home className="h-4 w-4 mr-1.5" />
                  Home
                </button>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Passports</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/passports?filter=US")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          US Passports
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/passports?filter=UK")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          UK Passports
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/passports?filter=Canada")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Canadian Passports
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/passports?filter=EU")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          EU Passports
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/passports")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground font-medium text-primary">
                          View All
                        </button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Driver's License</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/drivers-license?filter=US")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          US Driver's License
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/drivers-license?filter=UK")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          UK Driver's License
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/drivers-license?filter=Canada")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Canadian Driver's License
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/drivers-license")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground font-medium text-primary">
                          View All
                        </button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Citizenship</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/citizenship?category=EU%20Citizenship%20Documents")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          EU Citizenship
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/citizenship?category=Americas%20Citizenship%20Documents")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Americas Citizenship
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/citizenship?category=Asia-Pacific%20Citizenship%20Documents")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Asia-Pacific Citizenship
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/citizenship")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground font-medium text-primary">
                          View All
                        </button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Diplomas</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/diplomas?filter=High%20School")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          High School Diplomas
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/diplomas?filter=Bachelor")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Bachelor's Degrees
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/diplomas?filter=Master")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Master's Degrees
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/diplomas?filter=PhD")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          PhD Degrees
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/diplomas")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground font-medium text-primary">
                          View All
                        </button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Certifications</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/certifications?category=Project%20Management")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Project Management
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/certifications?category=IT%20%26%20Cloud%20Computing")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          IT & Cloud Computing
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/certifications?category=Healthcare%20%26%20Medical")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Healthcare & Medical
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/certifications?category=Finance%20%26%20Accounting")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Finance & Accounting
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button onClick={() => navigate("/certifications")} className="block w-full text-left select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground font-medium text-primary">
                          View All
                        </button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <button onClick={() => navigate("/apply")} className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95">
                  Apply
                </button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <button onClick={() => navigate("/escrow")} className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95">
                  <Shield className="h-4 w-4 mr-1.5" />
                  Escrow
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {session ? (
            <Button onClick={() => navigate("/dashboard")} variant="default" size="sm" className="active:scale-95 ml-2">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          ) : (
            <Button onClick={() => navigate("/auth")} variant="outline" size="sm" className="active:scale-95 gap-2 ml-2">
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Login</span>
            </Button>
          )}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="active:scale-95">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <nav className="flex flex-col gap-4 mt-8">
              <button onClick={() => { navigate("/"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95 flex items-center gap-2">
                <Home className="h-5 w-5" />
                Home
              </button>
              <button onClick={() => { navigate("/products"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95">
                Products
              </button>
              <button onClick={() => { navigate("/passports"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95">
                Passports
              </button>
              <button onClick={() => { navigate("/drivers-license"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95">
                Driver's License
              </button>
              <button onClick={() => { navigate("/citizenship"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95">
                Citizenship
              </button>
              <button onClick={() => { navigate("/diplomas"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95">
                Diplomas
              </button>
              <button onClick={() => { navigate("/certifications"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95">
                Certifications
              </button>
              <button onClick={() => { navigate("/apply"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95">
                Apply
              </button>
              <button onClick={() => { navigate("/escrow"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Escrow
              </button>
              <div className="pt-4 mt-4 border-t border-border space-y-2">
                {session ? (
                  <Button className="w-full active:scale-95" onClick={() => { navigate("/dashboard"); setMobileMenuOpen(false); }}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                ) : (
                  <Button className="w-full active:scale-95" onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}>
                    <User className="mr-2 h-4 w-4" />
                    Login / Register
                  </Button>
                )}
                <Button variant="outline" className="w-full active:scale-95" onClick={() => { navigate("/apply"); setMobileMenuOpen(false); }}>
                  Apply Now
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};