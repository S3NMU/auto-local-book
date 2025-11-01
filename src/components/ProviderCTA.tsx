import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProviderCTA = () => {
  const [stats, setStats] = useState({
    activeProviders: 0,
    totalBookings: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get active provider count
        const { count: providerCount } = await supabase
          .from('providers')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Get total bookings count
        const { count: bookingCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        setStats({
          activeProviders: providerCount || 0,
          totalBookings: bookingCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const benefits = [
    "Get more bookings without phone tag",
    "Lightweight CRM and calendar management",
    "Automated payment processing",
    "Customer review system",
    "Mobile-friendly provider dashboard"
  ];

  const displayStats = [
    { icon: Users, value: `${stats.activeProviders}+`, label: "Active Providers" },
    { icon: TrendingUp, value: "30%", label: "Avg. Revenue Increase" },
    { icon: Calendar, value: `${stats.totalBookings > 1000 ? Math.floor(stats.totalBookings / 1000) + 'k' : stats.totalBookings}+`, label: "Bookings Total" },
    { icon: CreditCard, value: "2-day", label: "Fast Payouts" }
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <Badge variant="secondary" className="mb-4">
              For Service Providers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Grow Your Auto Service Business
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of shops and mobile mechanics already using H3 Automo 
              to increase bookings and streamline operations.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {displayStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="text-center p-4 bg-background rounded-lg border border-border animate-fade-scale"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <IconComponent className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Benefits List */}
            <div className="space-y-6 animate-slide-up">
              <h3 className="text-2xl font-semibold text-foreground">
                Why Choose H3 Automo?
              </h3>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 animate-fade-scale"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/for-providers#application-form">
                  <Button variant="hero" size="lg" className="group">
                    Apply to Become a Provider
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-fast" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6 animate-fade-scale">
              <div className="bg-gradient-subtle rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-3">Quick Setup</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Get started in minutes with our simple onboarding process. 
                  No technical skills required.
                </p>
                <Link to="/for-providers" className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="bg-gradient-subtle rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-3">Low Fees</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Competitive 10% platform fee only when you get paid. 
                  No monthly subscriptions.
                </p>
                <Link to="/for-providers" className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
                  <span>View pricing</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="bg-gradient-subtle rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-3">Expert Support</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Dedicated support team to help you maximize your bookings 
                  and grow your business.
                </p>
                <Link to="/for-providers" className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
                  <span>Contact support</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderCTA;