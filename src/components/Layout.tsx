import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isErrorPage = location.pathname.match(/^\/(404|403|500)$/) || !location.pathname.match(/^\/[a-zA-Z-/]*$/);
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && !isErrorPage && (
        isHomePage ? (
          <>
            <div className="md:hidden">
              <MobileNav currentPage="home" />
            </div>
            <div className="hidden md:block">
              <Header />
            </div>
          </>
        ) : (
          <Header />
        )
      )}
      <main className="flex-1">
        {children}
      </main>
      {!isDashboard && !isErrorPage && <Footer />}
    </div>
  );
};