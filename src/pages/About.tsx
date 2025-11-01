import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  Shield, 
  Clock, 
  Award,
  Target,
  Lightbulb,
  Handshake,
  ArrowRight,
  Car,
  Wrench,
  ShoppingCart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const [liveStats, setLiveStats] = useState({
    activeProviders: 0,
    avgRating: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: providerCount } = await supabase
          .from('providers')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        const { data: providersData } = await supabase
          .from('providers')
          .select('rating')
          .eq('status', 'active');

        const avgRating = providersData && providersData.length > 0
          ? providersData.reduce((sum, p) => sum + (p.rating || 0), 0) / providersData.length
          : 0;

        setLiveStats({
          activeProviders: providerCount || 0,
          avgRating: avgRating
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { icon: Users, label: "Active Providers", value: `${liveStats.activeProviders}+` },
    { icon: Shield, label: "Verified Services", value: "100%" },
    { icon: Clock, label: "Average Response", value: "< 2hrs" },
    { icon: Award, label: "Customer Rating", value: liveStats.avgRating > 0 ? liveStats.avgRating.toFixed(1) : "0.0" }
  ];

  const values = [
    {
      icon: Target,
      title: "Trust & Safety",
      description: "All service providers are verified and background-checked for your peace of mind."
    },
    {
      icon: Shield,
      title: "Transparent Pricing",
      description: "No hidden fees. See exact pricing upfront before booking any service."
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "We stand behind every service with our satisfaction guarantee and dispute resolution."
    },
    {
      icon: Handshake,
      title: "Local Focus",
      description: "Supporting local businesses while providing convenient service to our community."
    }
  ];

  const forUsers = [
    "Rent vehicles with flexible terms and competitive rates",
    "Browse quality pre-owned vehicles for purchase",
    "Find trusted auto repair services near you instantly",
    "Compare prices and reviews before booking",
    "Track service history and vehicle maintenance"
  ];

  const forProviders = [
    "Grow your customer base with digital marketing",
    "Streamline bookings and reduce phone tag",
    "Get paid faster with automated processing",
    "Manage customers with built-in CRM tools",
    "Build reputation with customer reviews"
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            About H3 Automo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Connecting Drivers with
            <span className="block text-primary">Trusted Auto Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            H3 Automo is the comprehensive automotive platform offering vehicle rentals, 
            sales, and repair services — making all your automotive needs simple, transparent, and reliable.
          </p>
        </div>

        {/* Services Overview Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-elegant transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Vehicle Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Wide selection of rental vehicles with competitive daily and weekly rates. 
                  Flexible terms and exceptional service for all your transportation needs.
                </CardDescription>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/rentals?type=rental">Browse Rentals</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Vehicle Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Quality pre-owned vehicles thoroughly inspected and ready to drive. 
                  Transparent pricing and comprehensive vehicle history reports.
                </CardDescription>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/rentals?type=sale">View Inventory</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Auto Repairs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect with verified mechanics for all your vehicle maintenance and repair needs. 
                  Trusted professionals with transparent pricing.
                </CardDescription>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/services">Find Services</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
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
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    H3 Automo was founded to provide a comprehensive solution for all automotive needs. 
                    Whether you need to rent a vehicle, purchase a quality pre-owned car, or find reliable repair services, 
                    we believe the process shouldn't involve phone tag, surprise fees, or uncertainty about quality.
                  </p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform offers vehicle rentals and sales alongside connections to vetted local repair professionals, 
                all with transparent pricing and quality assurance. We're helping drivers access everything they need 
                while empowering local businesses to grow through modern digital tools and marketing support.
              </p>
            </div>
          </div>
        </div>

        {/* For Users and Providers Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built for Everyone</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you need a vehicle, want to buy one, or looking for repair services, H3 Automo has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Users */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">For Drivers</h3>
              </div>
              <ul className="space-y-3 mb-6">
                {forUsers.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/providers">Find Services</Link>
              </Button>
            </Card>

            {/* For Providers */}
            <Card className="p-6 border-primary">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">For Service Providers</h3>
              </div>
              <ul className="space-y-3 mb-6">
                {forProviders.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" asChild>
                <Link to="/for-providers">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center bg-card p-8 rounded-lg border">
            <h3 className="text-2xl font-bold mb-4">Rent a Vehicle</h3>
            <p className="text-muted-foreground mb-6">
              Browse our selection of rental vehicles with flexible terms and competitive rates.
            </p>
            <Button size="lg" asChild>
              <Link to="/rentals?type=rental">View Rentals</Link>
            </Button>
          </div>

          <div className="text-center bg-card p-8 rounded-lg border">
            <h3 className="text-2xl font-bold mb-4">Buy a Vehicle</h3>
            <p className="text-muted-foreground mb-6">
              Explore quality pre-owned vehicles thoroughly inspected and ready to drive.
            </p>
            <Button size="lg" asChild>
              <Link to="/rentals?type=sale">Browse Inventory</Link>
            </Button>
          </div>

          <div className="text-center bg-card p-8 rounded-lg border border-primary">
            <h3 className="text-2xl font-bold mb-4">Need Repairs?</h3>
            <p className="text-muted-foreground mb-6">
              Connect with verified mechanics for all your vehicle maintenance and repair needs.
            </p>
            <Button size="lg" asChild>
              <Link to="/services">Find Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
