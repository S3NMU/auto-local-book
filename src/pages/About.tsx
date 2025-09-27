import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Users, 
  Shield, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar, 
  CreditCard,
  CheckCircle,
  Target,
  Lightbulb,
  Handshake,
  Star,
  ArrowRight
} from "lucide-react";

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

  const businessBenefits = [
    {
      icon: TrendingUp,
      title: "Increase Revenue",
      description: "Providers see an average 30% increase in monthly revenue within their first quarter on our platform."
    },
    {
      icon: Calendar,
      title: "Streamlined Booking",
      description: "Automated scheduling eliminates phone tag and reduces administrative overhead by up to 60%."
    },
    {
      icon: CreditCard,
      title: "Fast Payments",
      description: "Get paid faster with automated payment processing and 2-day direct deposit transfers."
    },
    {
      icon: Users,
      title: "Customer Base Growth",
      description: "Access thousands of potential customers actively searching for automotive services in your area."
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
      ]
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

        {/* Business Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Auto Service Providers Choose H3 Automo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed specifically for automotive service providers who want to grow their business efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {businessBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Growth Strategies Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Help You Grow</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides everything you need to expand your automotive service business.
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
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No monthly fees, no setup costs. You only pay when you get paid.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`p-6 ${index === 1 ? 'border-primary shadow-lg' : ''}`}>
                {index === 1 && (
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
                  variant={index === 1 ? "default" : "outline"} 
                  className="w-full"
                  asChild
                >
                  <Link to="/list-shop">Get Started</Link>
                </Button>
              </Card>
            ))}
          </div>
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
                their customer base through modern digital tools and marketing support.
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

        {/* Success Stories Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results from auto service providers who've grown their business with H3 Automo.
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
        <div className="text-center bg-card p-12 rounded-lg border">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Auto Service Business?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of successful auto service providers who are already growing their business with H3 Automo. 
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

export default About;