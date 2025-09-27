import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Clock, Award } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, label: "Active Providers", value: "500+" },
    { icon: Shield, label: "Verified Services", value: "100%" },
    { icon: Clock, label: "Average Response", value: "< 2hrs" },
    { icon: Award, label: "Customer Rating", value: "4.8/5" }
  ];

  const values = [
    {
      title: "Trust & Safety",
      description: "All service providers are verified and background-checked for your peace of mind."
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees. See exact pricing upfront before booking any service."
    },
    {
      title: "Quality Guarantee",
      description: "We stand behind every service with our satisfaction guarantee and dispute resolution."
    },
    {
      title: "Local Focus",
      description: "Supporting local businesses while providing convenient service to our community."
    }
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            About H3 Automo
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're connecting drivers with trusted local automotive service providers, 
            making car maintenance simple, transparent, and convenient.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
            <div className="bg-card p-8 rounded-lg border">
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                H3 Automo was founded to solve the frustration of finding reliable automotive services. 
                We believe that getting your car serviced shouldn't involve phone tag, surprise fees, 
                or uncertainty about quality. Our platform connects you with vetted local professionals 
                who provide transparent pricing and quality service, while helping local businesses grow 
                their customer base.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card p-12 rounded-lg border">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust H3 Automo for their automotive needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Find Services</Button>
            <Button variant="outline" size="lg">List Your Shop</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;