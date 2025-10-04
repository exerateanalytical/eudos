import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { ContentProtection } from "./components/ContentProtection";
import { DynamicPage } from "./components/DynamicPage";
import { DynamicProduct } from "./components/DynamicProduct";
import { useEffect } from "react";
import { performanceMonitor } from "./lib/performance";
import Index from "./pages/Index";
import Apply from "./pages/Apply";
import Products from "./pages/Products";

import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Testimonials from "./pages/Testimonials";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Citizenship from "./pages/Citizenship";
import CitizenshipDetail from "./pages/CitizenshipDetail";
import Diplomas from "./pages/Diplomas";
import DiplomaDetail from "./pages/DiplomaDetail";
import Certifications from "./pages/Certifications";
import CertificationDetail from "./pages/CertificationDetail";
import DriversLicense from "./pages/DriversLicense";
import DriverLicenseDetail from "./pages/DriverLicenseDetail";
import Passports from "./pages/Passports";
import PassportDetail from "./pages/PassportDetail";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import SecurityFeatures from "./pages/SecurityFeatures";
import Escrow from "./pages/Escrow";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import ServerError from "./pages/ServerError";
import TrackOrder from "./pages/TrackOrder";
import CategoryPage from "./pages/CategoryPage";
import CategoryManagement from "./pages/CategoryManagement";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.init();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ContentProtection />
            <ScrollToTop />
            <ErrorBoundary>
            <Layout>
            <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Protected/Authenticated Routes */}
            <Route path="/apply" element={<Apply />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/admin/*" element={<Admin />} />
            
            {/* Legacy Product Detail Routes - Keep for backward compatibility */}
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/citizenship/:country" element={<CitizenshipDetail />} />
            <Route path="/diploma/:university" element={<DiplomaDetail />} />
            <Route path="/certification/:certificationName" element={<CertificationDetail />} />
            <Route path="/drivers-license/:licenseId" element={<DriverLicenseDetail />} />
            <Route path="/passports/:passportId" element={<PassportDetail />} />
            
            {/* Legacy Category Routes - Keep for backward compatibility */}
            <Route path="/products" element={<Products />} />
            <Route path="/citizenship" element={<Citizenship />} />
            <Route path="/diplomas" element={<Diplomas />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/drivers-license" element={<DriversLicense />} />
            <Route path="/passports" element={<Passports />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            
            {/* Error Pages */}
            <Route path="/403" element={<Forbidden />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="/404" element={<NotFound />} />
            
            {/* Category Routes */}
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            
            {/* Dynamic CMS Routes - These should come last before catch-all */}
            <Route path="/p/:slug" element={<DynamicProduct />} />
            <Route path="/:slug" element={<DynamicPage />} />
            
            {/* Catch-all 404 - Must be last */}
            <Route path="*" element={<NotFound />} />
            </Routes>
            </Layout>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;
