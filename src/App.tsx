import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Apply from "./pages/Apply";
import Products from "./pages/Products";
import Shop from "./pages/Shop";
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
import SecurityFeatures from "./pages/SecurityFeatures";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/products" element={<Products />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/citizenship" element={<Citizenship />} />
            <Route path="/citizenship/:country" element={<CitizenshipDetail />} />
            <Route path="/diplomas" element={<Diplomas />} />
            <Route path="/diploma/:university" element={<DiplomaDetail />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/certification/:certificationName" element={<CertificationDetail />} />
            <Route path="/drivers-license" element={<DriversLicense />} />
            <Route path="/drivers-license/:licenseId" element={<DriverLicenseDetail />} />
            <Route path="/passports" element={<Passports />} />
            <Route path="/passports/:passportId" element={<PassportDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/security-features" element={<SecurityFeatures />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
