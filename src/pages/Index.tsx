import { useEffect } from "react";
import Hero from "@/components/Hero";
import ServiceCategories from "@/components/ServiceCategories";
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
      <HowItWorks />
      <ProviderCTA />
    </div>
  );
};

export default Index;
