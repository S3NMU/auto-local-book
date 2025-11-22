import { useEffect } from "react";
import Hero from "@/components/Hero";
import FeaturedVehicles from "@/components/FeaturedVehicles";
import AboutIntro from "@/components/AboutIntro";
import HowItWorks from "@/components/HowItWorks";
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
          description: "Travel smart. Rent the ride. Rest the night.",
        });
        localStorage.setItem('has-visited', 'true');
      }, 1000);
    }
  }, [toast]);

  return (
    <div>
      {/* Hero Section with H | 3 Branding & Quick CTAs */}
      <Hero />
      
      {/* Featured Vehicles (Rent & Buy) */}
      <FeaturedVehicles />
      
      {/* Short Intro About H3 Automo */}
      <AboutIntro />
      
      {/* How It Works Section */}
      <HowItWorks />
    </div>
  );
};

export default Index;
