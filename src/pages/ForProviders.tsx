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
  MessageCircle,
  Download,
  Shield,
  Clock,
  Award,
  FileText,
  Phone,
  Mail,
  MapPin,
  Wrench,
  GraduationCap,
  HelpCircle
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
      linkTo: "/for-providers"
    },
    {
      icon: CreditCard,
      title: "Low Fees",
      description: "Competitive 10% platform fee only when you get paid. No monthly subscriptions.",
      linkText: "View pricing",
      linkTo: "/for-providers"
    },
    {
      icon: MessageCircle,
      title: "Expert Support",
      description: "Dedicated support team to help you maximize your bookings and grow your business.",
      linkText: "Contact support",
      linkTo: "/for-providers"
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

  const howItWorksSteps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Complete our quick online application with your business details and credentials"
    },
    {
      step: "2",
      title: "Get Approved",
      description: "Our team reviews your application within 24-48 hours and verifies your credentials"
    },
    {
      step: "3",
      title: "Set Up Profile",
      description: "List your services, set your pricing, and customize your availability"
    },
    {
      step: "4",
      title: "Receive Bookings",
      description: "Start getting matched with customers in your area looking for your services"
    },
    {
      step: "5",
      title: "Get Paid",
      description: "Provide excellent service and receive guaranteed payments within 2 days"
    }
  ];

  const requirements = [
    {
      icon: Shield,
      title: "Valid Business License",
      description: "Current business license or permit to operate automotive services"
    },
    {
      icon: Award,
      title: "Insurance Coverage",
      description: "Liability insurance (minimum $1M coverage recommended)"
    },
    {
      icon: Wrench,
      title: "Professional Experience",
      description: "Minimum 2 years of automotive service experience"
    },
    {
      icon: Phone,
      title: "Technology Requirements",
      description: "Smartphone or tablet with internet access for managing bookings"
    }
  ];

  const faqs = [
    {
      question: "How do I get paid?",
      answer: "Payments are processed automatically within 2 business days after service completion. Funds are transferred directly to your linked bank account."
    },
    {
      question: "What happens if a customer cancels?",
      answer: "Customers can cancel free of charge up to 24 hours before the appointment. Late cancellations or no-shows may result in a partial payment to you based on your cancellation policy."
    },
    {
      question: "What equipment or software do I need?",
      answer: "You need a smartphone or tablet with internet access to manage bookings through our provider app. All other equipment should be standard for your automotive services."
    },
    {
      question: "Are there any startup fees?",
      answer: "No! There are zero startup fees, monthly subscriptions, or hidden costs. You only pay our platform commission when you receive a booking."
    },
    {
      question: "Can I set my own prices?",
      answer: "Yes, you have full control over your service pricing. We provide suggested price ranges based on local market data, but the final decision is yours."
    },
    {
      question: "What support is available?",
      answer: "All providers receive onboarding training, access to our support team via phone/email, and ongoing resources through our provider portal."
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
            Join the H3 Automo Network – Earn More, Work Flexibly
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
            Whether you're a mobile mechanic, repair shop, or service center, H3 Automo connects you with thousands of 
            customers actively searching for automotive services in your area.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our verified network of professional automotive service providers and grow your business with guaranteed bookings, streamlined payments, and powerful tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/list-shop">
                <Users className="w-5 h-5" />
                Become a Provider
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Download className="w-5 h-5" />
              Download Provider Hub
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>100+ Active Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Avg 30% Revenue Increase</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>2-Day Payouts</span>
            </div>
          </div>
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

        {/* How It Works Section */}
        <div id="how-it-works" className="mb-16 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in 5 simple steps and start receiving bookings within days
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {howItWorksSteps.map((item, index) => (
              <Card key={index} className="p-6 text-center relative">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < howItWorksSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Requirements Section */}
        <div id="requirements" className="mb-16 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Requirements & Eligibility</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple requirements to join our verified provider network
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((req, index) => {
              const IconComponent = req.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{req.title}</h3>
                  <p className="text-sm text-muted-foreground">{req.description}</p>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-8 p-6 bg-card border rounded-lg">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Service Area Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  We're currently serving providers across the United States. Geographic coverage includes all 50 states, 
                  with particular focus on urban and suburban areas. Mobile mechanics can set their service radius (typically 25-50 miles).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features Section */}
        <div id="features" className="mb-16 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Features & Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage and grow your business in one place
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

        {/* Support & Training Section */}
        <div id="support" className="mb-16 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Support & Training</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're here to help you succeed every step of the way
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Onboarding Training</h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive onboarding program including video tutorials, live webinars, and one-on-one sessions to get you up and running quickly.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Platform walkthrough</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Best practices guide</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Marketing tips</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
              <p className="text-muted-foreground mb-4">
                Our provider support team is available via phone, email, and chat to answer questions and resolve issues quickly.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Email support (24hr response)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Phone support (Mon-Fri 8AM-8PM)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Live chat support</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Provider Community</h3>
              <p className="text-muted-foreground mb-4">
                Join our network of professional providers to share insights, tips, and grow together.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Provider forums & discussions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Monthly networking events</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Industry updates & insights</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mb-16 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about joining H3 Automo
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results from auto service providers who've grown with H3 Automo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 text-primary mr-2" />
                <Badge variant="secondary">Verified Provider</Badge>
              </div>
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
              <div className="text-sm text-muted-foreground">Phoenix, AZ • Member since 2023</div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 text-primary mr-2" />
                <Badge variant="secondary">Verified Provider</Badge>
              </div>
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
              <div className="text-sm text-muted-foreground">Austin, TX • Member since 2023</div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div id="get-started" className="text-center bg-card p-12 rounded-lg border scroll-mt-20 mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join successful auto service providers already growing with H3 Automo. 
            Get started today with no upfront costs, no monthly fees, no hidden charges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" asChild>
              <Link to="/list-shop" className="group">
                Become a Provider
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Our Team
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-sm mb-1">Phone Support</div>
                <a href="tel:1-800-H3-AUTOMO" className="text-sm text-primary hover:underline">1-800-H3-AUTOMO</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-sm mb-1">Email</div>
                <a href="mailto:providers@h3automo.com" className="text-sm text-primary hover:underline">providers@h3automo.com</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-sm mb-1">Info Pack</div>
                <button className="text-sm text-primary hover:underline">Download PDF</button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links Footer */}
        <div className="border-t pt-8 pb-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Provider Agreement
            </Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Service Standards
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Code of Conduct
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            All providers must comply with local business regulations and maintain proper licensing and insurance coverage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForProviders;
