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
  ArrowRight
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
      description: "All service providers are verified and background-checked for your peace of mind.",
      linkTo: "/for-providers#how-we-help"
    },
    {
      icon: Shield,
      title: "Transparent Pricing",
      description: "No hidden fees. See exact pricing upfront before booking any service.",
      linkTo: "/for-providers#pricing"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "We stand behind every service with our satisfaction guarantee and dispute resolution.",
      linkTo: "/for-providers#how-we-help"
    },
    {
      icon: Handshake,
      title: "Local Focus",
      description: "Supporting local businesses while providing convenient service to our community.",
      linkTo: "/for-providers"
    }
  ];

  const forUsers = [
    "Find trusted auto services near you instantly",
    "Compare prices and reviews before booking",
    "Book online 24/7 with transparent pricing",
    "Track service history and maintenance",
    "Get instant confirmations and reminders"
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
            H3 Automo is the modern platform that makes finding and booking automotive services 
            simple, transparent, and reliable.
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
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    H3 Automo was founded to solve the frustration of finding reliable automotive services. 
                    We believe that getting your car serviced shouldn't involve phone tag, surprise fees, 
                    or uncertainty about quality.
                  </p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform connects drivers with vetted local professionals who provide transparent pricing 
                and quality service, while helping local businesses grow through modern digital tools and 
                marketing support.
              </p>
            </div>
          </div>
        </div>

        {/* For Users and Providers Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built for Everyone</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're looking for auto services or providing them, H3 Automo has you covered.
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
                <Link key={index} to={value.linkTo}>
                  <Card className="h-full transition-colors hover:border-primary">
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
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center bg-card p-8 rounded-lg border">
            <h3 className="text-2xl font-bold mb-4">Need Auto Service?</h3>
            <p className="text-muted-foreground mb-6">
              Find trusted local providers and book instantly with transparent pricing.
            </p>
            <Button size="lg" asChild>
              <Link to="/providers">Find Providers</Link>
            </Button>
          </div>

          <div className="text-center bg-card p-8 rounded-lg border border-primary">
            <h3 className="text-2xl font-bold mb-4">Grow Your Business</h3>
            <p className="text-muted-foreground mb-6">
              Join our platform and start getting more customers today.
            </p>
            <Button size="lg" asChild>
              <Link to="/for-providers">Join as Provider</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
