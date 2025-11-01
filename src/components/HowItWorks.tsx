import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  ArrowRight,
  MapPin
} from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/providers');
  };

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
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you need repairs, a rental, or looking to buy - get what you need in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={step.title}
                className="text-center animate-fade-scale"
                style={{animationDelay: `${index * 0.15}s`}}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto shadow-card border border-border">
                    <IconComponent className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-12 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center space-y-4">
          <Button variant="hero" size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
          <p className="text-sm text-muted-foreground">
            Join thousands of satisfied customers • No setup fees
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;