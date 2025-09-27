import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/hooks/useLocation";
import { useToast } from "@/hooks/use-toast";
import SearchDialog from "./SearchDialog";
import { 
  Search, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  ArrowRight 
} from "lucide-react";

const HowItWorks = () => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { location } = useLocation();
  const { toast } = useToast();

  const handleStartBooking = () => {
    if (!location) {
      toast({
        title: "Location required",
        description: "Please set your location first to start booking services.",
        variant: "destructive",
      });
      return;
    }
    setSearchDialogOpen(true);
  };

  const steps = [
    {
      icon: Search,
      title: "Find Services",
      description: "Search for auto services by location, type, or provider. Compare prices, ratings, and availability.",
      color: "text-primary"
    },
    {
      icon: Calendar,
      title: "Book Instantly",
      description: "Select your preferred time slot and book instantly. No phone calls or waiting for callbacks.",
      color: "text-accent"
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Pay securely online with transparent pricing. Hold your spot with a small deposit.",
      color: "text-success"
    },
    {
      icon: CheckCircle,
      title: "Get Service",
      description: "Arrive at your scheduled time or have mobile service come to you. Rate your experience.",
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
            Get your car serviced in four simple steps. No more phone tag or 
            uncertain pricing.
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
          <Button variant="hero" size="lg" onClick={handleStartBooking}>
            Start Booking Now
          </Button>
          <p className="text-sm text-muted-foreground">
            Join thousands of satisfied customers • No setup fees
          </p>
        </div>

        <SearchDialog
          open={searchDialogOpen}
          onOpenChange={setSearchDialogOpen}
        />
      </div>
    </section>
  );
};

export default HowItWorks;