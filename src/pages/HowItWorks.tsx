import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Search, 
  Calendar, 
  CreditCard, 
  CheckCircle,
  MapPin,
  Clock,
  Shield,
  Star,
  ArrowRight,
  User,
  Store
} from "lucide-react";

const HowItWorks = () => {
  const customerSteps = [
    {
      icon: Search,
      title: "Find Services",
      description: "Search for automotive services in your area using our location-based search or browse by service type."
    },
    {
      icon: Calendar,
      title: "Book Appointment", 
      description: "Select your preferred provider, choose a convenient time slot, and book your service appointment instantly."
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Pay securely through our platform with transparent pricing - no hidden fees or surprise costs."
    },
    {
      icon: CheckCircle,
      title: "Get Service",
      description: "Receive professional automotive service from verified providers and rate your experience."
    }
  ];

  const providerSteps = [
    {
      icon: Store,
      title: "Create Profile",
      description: "Set up your business profile with services, pricing, availability, and service area coverage."
    },
    {
      icon: User,
      title: "Get Verified",
      description: "Complete our verification process including background checks and insurance validation."
    },
    {
      icon: Calendar,
      title: "Receive Bookings",
      description: "Accept booking requests from customers and manage your schedule through our dashboard."
    },
    {
      icon: CreditCard,
      title: "Get Paid",
      description: "Receive payments automatically after service completion with fast 2-day transfers."
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Providers",
      description: "All service providers are background-checked and insurance-verified for your safety and peace of mind."
    },
    {
      icon: MapPin,
      title: "Location-Based Matching",
      description: "Find services exactly where you need them, whether at home, work, or on the road."
    },
    {
      icon: Clock,
      title: "Real-Time Availability",
      description: "See live availability and book appointments that fit your schedule, including same-day service."
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Make informed decisions with authentic customer reviews and detailed provider ratings."
    }
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            How H3 Automo Works
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Simple. Fast. Reliable.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connecting drivers with trusted automotive service providers has never been easier. 
            Here's how H3 Automo works for customers and service providers.
          </p>
        </div>

        {/* Customer Process */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-primary mr-3" />
              For Customers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your vehicle serviced in four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="relative">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Provider Process */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <Store className="w-8 h-8 text-primary mr-3" />
              For Service Providers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start growing your automotive service business today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {providerSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="relative">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-success" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-success text-success-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with safety, convenience, and reliability in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card p-12 rounded-lg border">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and successful service providers on H3 Automo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/services" className="group">
                Find Services
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/list-shop">List Your Shop</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;