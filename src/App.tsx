import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Providers from "./pages/Providers";
import About from "./pages/About";
import ForProviders from "./pages/ForProviders";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AccountSettings from "./pages/AccountSettings";
import ListShop from "./pages/ListShop";
import Admin from "./pages/Admin";
import ProviderDashboard from "./pages/ProviderDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import HowItWorks from "./pages/HowItWorks";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import ProviderBenefits from "./pages/ProviderBenefits";
import PendingApproval from "./pages/PendingApproval";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = ['/admin', '/provider-dashboard'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboardRoute && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/about" element={<About />} />
          <Route path="/for-providers" element={<ForProviders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/provider-benefits" element={<ProviderBenefits />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/list-shop" element={<ListShop />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/blog" element={<Blog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};


const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
