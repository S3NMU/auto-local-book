import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Calendar, 
  CreditCard,
  Users,
  CheckCircle,
  Target,
  ArrowRight,
  Star,
  ExternalLink,
  DollarSign,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ForProviders = () => {
  const [liveStats, setLiveStats] = useState({
    activeProviders: 0,
    totalBookings: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: providerCount } = await supabase
          .from('providers')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        const { count: bookingCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        setLiveStats({
          activeProviders: providerCount || 0,
          totalBookings: bookingCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const businessBenefits = [
    {
      icon: TrendingUp,
      title: "Quick Setup",
      description: "Get started in minutes with our simple onboarding process. No technical skills required.",
      linkText: "Learn more",
      linkTo: "#how-we-help"
    },
    {
      icon: CreditCard,
      title: "Low Fees",
      description: "Competitive 10% platform fee only when you get paid. No monthly subscriptions.",
      linkText: "View pricing",
      linkTo: "#pricing"
    },
    {
      icon: MessageCircle,
      title: "Expert Support",
      description: "Dedicated support team to help you maximize your bookings and grow your business.",
      linkText: "Contact support",
      linkTo: "/contact"
    },
    {
      icon: Users,
      title: "Customer Base Growth",
      description: "Access thousands of potential customers actively searching for automotive services in your area.",
      linkText: "Get Started",
      linkTo: "#get-started"
    }
  ];

  const growthStrategies = [
    {
      title: "Digital Presence",
      points: [
        "Professional profile with photos and service descriptions",
        "Customer reviews and ratings that build trust",
        "SEO-optimized listings that appear in local searches"
      ]
    },
    {
      title: "Operational Efficiency",
      points: [
        "Automated booking confirmations and reminders",
        "Integrated payment processing eliminates cash handling",
        "Customer management tools to track service history"
      ]
    },
    {
      title: "Marketing Support",
      points: [
        "Featured listings for premium providers",
        "Social media promotion and local advertising",
        "Referral programs that encourage repeat business"
      ]
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      fee: "10%",
      features: [
        "Basic profile listing",
        "Customer messaging",
        "Payment processing",
        "Customer reviews"
      ]
    },
    {
      name: "Professional",
      fee: "8%",
      features: [
        "Everything in Starter",
        "Featured listings",
        "Advanced analytics",
        "Priority support",
        "Custom scheduling"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      fee: "Custom",
      features: [
        "Everything in Professional",
        "Multiple location management",
        "API integration",
        "Dedicated account manager",
        "White-label options"
      ]
    }
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            For Auto Service Providers
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Grow Your Auto Service Business
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join H3 Automo and transform your automotive service business with modern tools, 
            increased visibility, and a steady stream of qualified customers.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {liveStats.activeProviders}+
              </div>
              <div className="text-sm text-muted-foreground">
                Active Providers
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                30%
              </div>
              <div className="text-sm text-muted-foreground">
                Avg. Revenue Increase
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {liveStats.totalBookings > 1000 ? Math.floor(liveStats.totalBookings / 1000) + 'k' : liveStats.totalBookings}+
              </div>
              <div className="text-sm text-muted-foreground">
                Total Bookings
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                2-day
              </div>
              <div className="text-sm text-muted-foreground">
                Fast Payouts
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose H3 Automo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed specifically for automotive service providers who want to grow efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {businessBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              const isHashLink = benefit.linkTo.startsWith('#');
              
              return (
                <Card key={index} className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground mb-3">{benefit.description}</p>
                      </div>
                    </div>
                    {isHashLink ? (
                      <a 
                        href={benefit.linkTo}
                        className="text-primary hover:underline inline-flex items-center text-sm font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelector(benefit.linkTo)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {benefit.linkText} <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    ) : (
                      <Link 
                        to={benefit.linkTo}
                        className="text-primary hover:underline inline-flex items-center text-sm font-medium"
                      >
                        {benefit.linkText} <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Growth Strategies Section */}
        <div id="how-we-help" className="mb-16 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Help You Grow</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to expand your automotive service business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {growthStrategies.map((strategy, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 text-primary mr-2" />
                  {strategy.title}
                </h3>
                <ul className="space-y-3">
                  {strategy.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="mb-16 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No monthly fees, no setup costs. You only pay when you get paid.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`p-6 ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
                {tier.popular && (
                  <Badge className="mb-4">Most Popular</Badge>
                )}
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-primary mb-4">
                  {tier.fee}
                  {tier.fee !== 'Custom' && <span className="text-sm text-muted-foreground"> platform fee</span>}
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={tier.popular ? "default" : "outline"} 
                  className="w-full"
                  asChild
                >
                  <Link to="/list-shop">Get Started</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results from auto service providers who've grown with H3 Automo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">5.0 rating</span>
              </div>
              <blockquote className="text-muted-foreground mb-4">
                "Since joining H3 Automo, my mobile mechanic business has grown by 40%. The automated booking system 
                saves me hours each week, and the steady stream of customers means I can focus on what I do best - 
                fixing cars."
              </blockquote>
              <div className="font-semibold">Mike's Mobile Mechanics</div>
              <div className="text-sm text-muted-foreground">Phoenix, AZ</div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">5.0 rating</span>
              </div>
              <blockquote className="text-muted-foreground mb-4">
                "The platform's transparency and customer reviews have helped us build trust with new customers. 
                We've seen a 25% increase in repeat business since we started using H3 Automo's customer management tools."
              </blockquote>
              <div className="font-semibold">Downtown Auto Repair</div>
              <div className="text-sm text-muted-foreground">Austin, TX</div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div id="get-started" className="text-center bg-card p-12 rounded-lg border scroll-mt-20">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join successful auto service providers already growing with H3 Automo. 
            Get started today with no upfront costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/list-shop" className="group">
                Start Growing Your Business
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForProviders;
