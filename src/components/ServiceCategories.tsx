import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Car, 
  Gauge, 
  Zap, 
  Shield, 
  Sparkles,
  Settings,
  CircuitBoard
} from "lucide-react";
import oilChangeImage from "@/assets/service-oil-change.jpg";
import brakesImage from "@/assets/service-brakes.jpg";
import diagnosticsImage from "@/assets/service-diagnostics.jpg";

const ServiceCategories = () => {
  const categories = [
    {
      icon: Wrench,
      title: "Oil Change",
      description: "Quick lube and filter replacement",
      price: "From $29",
      timeRange: "15-30 min",
      image: oilChangeImage,
      isPopular: true
    },
    {
      icon: Car,
      title: "Brake Service",
      description: "Brake pads, rotors, and inspection",
      price: "From $89",
      timeRange: "45-90 min",
      image: brakesImage,
      isPopular: false
    },
    {
      icon: CircuitBoard,
      title: "Diagnostics",
      description: "Computer diagnostics and troubleshooting",
      price: "From $99",
      timeRange: "30-60 min",
      image: diagnosticsImage,
      isPopular: false
    },
    {
      icon: Settings,
      title: "Tune-Up",
      description: "Complete engine tune-up service",
      price: "From $149",
      timeRange: "60-120 min",
      image: oilChangeImage,
      isPopular: false
    },
    {
      icon: Shield,
      title: "Inspection",
      description: "State inspection and safety check",
      price: "From $25",
      timeRange: "20-45 min",
      image: diagnosticsImage,
      isPopular: true
    },
    {
      icon: Sparkles,
      title: "Auto Detailing",
      description: "Interior and exterior detailing",
      price: "From $79",
      timeRange: "90-180 min",
      image: brakesImage,
      isPopular: false
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Auto Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From routine maintenance to emergency repairs, find trusted professionals 
            for all your automotive needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.title}
                className="bg-card rounded-lg p-6 shadow-card hover:shadow-hover transition-smooth border border-border group cursor-pointer animate-fade-scale"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  {category.isPopular && (
                    <Badge variant="default" className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                      Popular
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-primary">{category.price}</span>
                  <span className="text-sm text-muted-foreground">{category.timeRange}</span>
                </div>
                
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                  Find Providers
                </Button>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;