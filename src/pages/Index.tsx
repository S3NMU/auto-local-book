import { useEffect } from "react";
import Hero from "@/components/Hero";
import ServiceCategories from "@/components/ServiceCategories";
import FeaturedProviders from "@/components/FeaturedProviders";
import ProvidersMap from "@/components/ProvidersMap";
import HowItWorks from "@/components/HowItWorks";
import ProviderCTA from "@/components/ProviderCTA";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Welcome message for first-time visitors
    const hasVisited = localStorage.getItem('has-visited');
    if (!hasVisited) {
      setTimeout(() => {
        toast({
          title: "Welcome to Auto Trails!",
          description: "Find trusted automotive services near you. Set your location to get started.",
        });
        localStorage.setItem('has-visited', 'true');
      }, 1000);
    }
  }, [toast]);

  return (
    <div>
      <Hero />
      <ServiceCategories />
      <FeaturedProviders />
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Find Providers Near You</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our network of verified automotive service providers across the country
            </p>
          </div>
          <ProvidersMap />
        </div>
      </div>
      <HowItWorks />
      <ProviderCTA />
    </div>
  );
};

export default Index;
