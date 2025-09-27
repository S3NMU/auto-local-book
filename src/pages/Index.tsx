import { useEffect } from "react";
import Hero from "@/components/Hero";

import FeaturedProviders from "@/components/FeaturedProviders";
import ProvidersDirectory from "@/components/ProvidersDirectory";
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
          title: "Welcome to H3 Automo!",
          description: "Find trusted automotive services near you. Set your location to get started.",
        });
        localStorage.setItem('has-visited', 'true');
      }, 1000);
    }
  }, [toast]);

  return (
    <div>
      <Hero />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Grow Your Auto Service Business Section */}
      <ProviderCTA />
      
      {/* Providers Directory Section */}
      <div className="py-8 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">Find Providers Near You</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our network of verified automotive service providers across the country
            </p>
          </div>
          <ProvidersDirectory />
        </div>
      </div>

      <FeaturedProviders />
    </div>
  );
};

export default Index;
