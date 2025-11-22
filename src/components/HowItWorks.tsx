import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  CheckCircle,
  ArrowRight,
  MapPin
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Set Your Location",
      description: "Enter your location to discover nearby repair shops, rental vehicles, and vehicles for sale in your area.",
      color: "text-primary"
    },
    {
      icon: Search,
      title: "Browse & Compare",
      description: "Compare services, rental rates, or vehicle prices. Read reviews, check availability, and view detailed information.",
      color: "text-accent"
    },
    {
      icon: Calendar,
      title: "Book or Inquire",
      description: "Schedule repair appointments, reserve rental vehicles, or contact sellers directly through our platform.",
      color: "text-success"
    },
    {
      icon: CheckCircle,
      title: "Complete & Review",
      description: "Get your service completed, pick up your rental, or finalize your purchase. Share your experience with others.",
      color: "text-warning"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-3">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Simple Process
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            How It Works
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you need repairs, a rental, or looking to buy - get what you need in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={step.title}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <IconComponent className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-14 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <p className="text-lg text-foreground font-semibold mb-4">
              Ready to get started?
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Browse Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Join thousands of satisfied customers • No setup fees • Secure & trusted
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;