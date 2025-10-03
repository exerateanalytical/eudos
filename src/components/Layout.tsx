import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isErrorPage = location.pathname.match(/^\/(404|403|500)$/) || !location.pathname.match(/^\/[a-zA-Z-/]*$/);

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && !isErrorPage && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isDashboard && !isErrorPage && <Footer />}
    </div>
  );
};