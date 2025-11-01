import { useEffect } from "react";
import Hero from "@/components/Hero";
import FeaturedProviders from "@/components/FeaturedProviders";
import ProvidersDirectory from "@/components/ProvidersDirectory";
import HowItWorks from "@/components/HowItWorks";
import ProviderCTA from "@/components/ProviderCTA";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, ShoppingCart, Wrench, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

  const services = [
    {
      icon: Wrench,
      title: "Auto Repairs & Maintenance",
      description: "From oil changes to major repairs, find certified mechanics and shops for all your vehicle maintenance needs.",
      linkText: "Browse Repair Services",
      linkTo: "/services",
      gradient: "from-blue-500/10 to-blue-600/10"
    },
    {
      icon: Car,
      title: "Vehicle Rentals",
      description: "Rent cars, trucks, and specialty vehicles by the day, week, or month. Perfect for trips, projects, or temporary needs.",
      linkText: "View Rental Fleet",
      linkTo: "/rentals?type=rental",
      gradient: "from-green-500/10 to-green-600/10"
    },
    {
      icon: ShoppingCart,
      title: "Vehicle Sales",
      description: "Browse quality pre-owned vehicles from trusted dealers and private sellers. Find your next car with confidence.",
      linkText: "Shop Vehicles",
      linkTo: "/rentals?type=sale",
      gradient: "from-purple-500/10 to-purple-600/10"
    }
  ];

  return (
    <div>
      <Hero />
      
      {/* Services Overview Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything Your Vehicle Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you need repairs, a rental, or looking to buy, H3 Automo connects you with trusted automotive services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <Link to={service.linkTo}>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {service.linkText}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      
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
