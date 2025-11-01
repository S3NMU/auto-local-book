import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Car, Settings, CheckCircle, ClipboardCheck, UserCheck, Calendar } from "lucide-react";
import RepairRequestForm from "@/components/services/RepairRequestForm";

const Services = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);

  const benefits = [
    {
      icon: UserCheck,
      title: "Verified Providers",
      description: "All mechanics are licensed, insured, and thoroughly vetted for quality service.",
    },
    {
      icon: Settings,
      title: "Fair Pricing",
      description: "Transparent pricing with no hidden fees. Get quotes before committing.",
    },
    {
      icon: CheckCircle,
      title: "Customer Protection",
      description: "Warranty on all services and 24/7 customer support for your peace of mind.",
    },
  ];

  const steps = [
    {
      icon: ClipboardCheck,
      title: "Submit Request",
      description: "Fill out a simple form with your vehicle and service needs.",
    },
    {
      icon: UserCheck,
      title: "Get Matched",
      description: "We connect you with qualified mechanics in your area.",
    },
    {
      icon: Calendar,
      title: "Confirm Appointment",
      description: "Choose your preferred date and confirm your service booking.",
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-glow py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Keep Your Car Running Smoothly
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-6">
                Connect with trusted H3 Automo mechanics for all your vehicle maintenance and repair needs.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setShowRequestForm(true)}
                className="font-semibold"
              >
                Schedule Your Service
              </Button>
            </div>
            <div className="hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Professional mechanic working on vehicle"
                className="rounded-lg shadow-elegant w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get your vehicle serviced in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="text-center h-full hover:shadow-elegant transition-smooth">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-0.5 bg-primary/30" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => setShowRequestForm(true)}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose H3 Automo Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose H3 Automo Mechanics</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your vehicle deserves the best care from trusted professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="hover:shadow-elegant transition-smooth">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-glow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Service Your Vehicle?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Schedule your appointment today and experience quality service from verified mechanics.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setShowRequestForm(true)}
            className="font-semibold"
          >
            Schedule Your Service
          </Button>
        </div>
      </section>

      {/* Repair Request Form Modal */}
      <RepairRequestForm 
        open={showRequestForm}
        onOpenChange={setShowRequestForm}
      />
    </div>
  );
};

export default Services;
