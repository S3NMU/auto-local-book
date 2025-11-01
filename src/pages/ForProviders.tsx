import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  CreditCard,
  Users,
  CheckCircle,
  Shield,
  Award,
  Clock,
  MapPin,
  Phone,
  Star,
  Quote,
  BarChart3,
  FileText,
  DollarSign,
  Settings,
  Smartphone,
  Database
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ForProviders = () => {
  const [scrollToForm, setScrollToForm] = useState(false);

  const handleApplyClick = () => {
    const form = document.getElementById('application-form');
    form?.scrollIntoView({ behavior: 'smooth' });
    setScrollToForm(true);
  };

  const whyJoinReasons = [
    {
      icon: Users,
      title: "Steady Clients",
      description: "Access a growing network of customers actively searching for automotive services in your area"
    },
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "Get paid automatically within 2 business days. No chasing invoices or handling cash"
    },
    {
      icon: Calendar,
      title: "Online Booking Tools",
      description: "Modern scheduling system that syncs with your calendar and sends automatic reminders"
    },
    {
      icon: Award,
      title: "Training & Support",
      description: "Dedicated onboarding, ongoing training, and 24/7 support to help you succeed"
    }
  ];

  const testimonials = [
    {
      name: "Mike Johnson",
      business: "Mike's Auto Repair",
      quote: "H3 Automo has helped me fill my schedule and grow my revenue by 40% in just 6 months. The platform is easy to use and customers love the convenience.",
      rating: 5
    },
    {
      name: "Sarah Chen",
      business: "Chen's Mobile Mechanics",
      quote: "Best decision I made for my business. I get quality leads daily and the payment system is seamless. No more chasing down payments!",
      rating: 5
    },
    {
      name: "David Martinez",
      business: "Martinez Auto Service",
      quote: "The support team is incredible. They helped me set up my profile and I started getting bookings within the first week. Highly recommend!",
      rating: 5
    }
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: "Apply",
      description: "Fill out our simple application form with your business details and credentials"
    },
    {
      step: "2",
      title: "Verify",
      description: "We review your application and verify your business license and credentials within 24-48 hours"
    },
    {
      step: "3",
      title: "List Services",
      description: "Set up your profile, list your services, set your pricing and availability"
    },
    {
      step: "4",
      title: "Accept Jobs",
      description: "Start receiving booking requests from customers in your area and accept the ones you want"
    },
    {
      step: "5",
      title: "Get Paid",
      description: "Complete the service and get paid automatically within 2 business days"
    }
  ];

  const requirements = [
    {
      icon: Shield,
      title: "Valid Business",
      description: "Registered business with proper business license or permit to operate"
    },
    {
      icon: Award,
      title: "License (if required)",
      description: "Required licenses or certifications for your specific services in your state"
    },
    {
      icon: MapPin,
      title: "Verified Location",
      description: "Consistent business location with at least 6 months of operation history"
    },
    {
      icon: CheckCircle,
      title: "Reliable Service",
      description: "Commitment to quality work, professional conduct, and excellent customer service"
    }
  ];

  const faqs = [
    {
      question: "How do payouts work?",
      answer: "After you complete a service, payment is automatically processed and transferred to your bank account within 2 business days. All payments are handled securely through our platform, and you'll receive detailed transaction records for your bookkeeping."
    },
    {
      question: "How do I receive bookings?",
      answer: "When a customer requests a service you offer in your area, you'll receive a notification via email and SMS (if enabled). You can review the job details and choose to accept or decline. Once accepted, the booking appears in your dashboard with all customer information and service details."
    },
    {
      question: "Do I need to pay to join?",
      answer: "No! There are no signup fees, monthly subscriptions, or hidden costs. We only charge a 10% platform fee on completed bookings. You only pay when you earn."
    },
    {
      question: "What areas do you serve?",
      answer: "We're currently expanding across the United States. Enter your location in the application form to see if we serve your area. If we don't yet, we'll add you to our waitlist and notify you when we launch in your region."
    },
    {
      question: "Can I set my own prices?",
      answer: "Yes! You have complete control over your service pricing. We provide suggested price ranges based on local market data to help you stay competitive, but you make the final decision on your rates."
    }
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 py-12">
          <Badge variant="secondary" className="mb-6">
            For Auto Service Providers
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Grow Your Garage with H3 Automo
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Access more clients, get booked faster, and manage everything in one platform.
          </p>
          <Button size="lg" onClick={handleApplyClick} className="gap-2">
            <Users className="w-5 h-5" />
            Apply to Become a Provider
          </Button>
        </div>

        {/* Why Join Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Join H3 Automo?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to grow your automotive business in one powerful platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {whyJoinReasons.map((reason, index) => {
              const IconComponent = reason.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                  <p className="text-muted-foreground">{reason.description}</p>
                </Card>
              );
            })}
          </div>

          {/* Testimonials */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">What Our Providers Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 relative">
                  <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in 5 simple steps
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {howItWorksSteps.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Requirements</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What you need to join our provider network
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
        </div>

        {/* H3 Provider HUB Section */}
        <div className="mb-20 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4 bg-primary">
              Management Software
            </Badge>
            <h2 className="text-4xl font-bold mb-4">H3 Provider HUB</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run your automotive business in one powerful platform
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer Management</h3>
              <p className="text-sm text-muted-foreground">
                Track customer information, service history, vehicle details, and communication all in one place
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Revenue Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor daily, weekly, and monthly revenue. Track payments, outstanding invoices, and financial performance
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Service Management</h3>
              <p className="text-sm text-muted-foreground">
                List and manage your services, set pricing, availability, and track service completion rates
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Booking Calendar</h3>
              <p className="text-sm text-muted-foreground">
                Interactive calendar to manage appointments, view schedules, and prevent double-bookings
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Real-time insights into bookings, revenue trends, customer behavior, and business performance
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile Access</h3>
              <p className="text-sm text-muted-foreground">
                Access your dashboard from any device - desktop, tablet, or smartphone. Manage on the go
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Invoicing & Reports</h3>
              <p className="text-sm text-muted-foreground">
                Generate professional invoices, service reports, and export financial data for accounting
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Review Management</h3>
              <p className="text-sm text-muted-foreground">
                Monitor and respond to customer reviews. Build your reputation and improve service quality
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Inventory Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track rental vehicles, vehicles for sale, parts inventory, and stock levels in real-time
              </p>
            </Card>
          </div>

          {/* Pricing Section */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Simple, Transparent Pricing</h3>
              <p className="text-muted-foreground">Everything you need to manage and grow your business</p>
            </div>

            <Card className="p-8 bg-card relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-6 py-2 rounded-bl-lg font-semibold">
                Limited Time Offer
              </div>
              
              <div className="text-center mb-6 pt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-5xl font-bold text-foreground">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <Badge variant="secondary" className="text-base px-4 py-2">
                  First 6 Months FREE for New Providers
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Unlimited customers & bookings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Advanced analytics & reporting</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Revenue & expense tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Mobile app access</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Automated invoicing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Customer communication tools</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Inventory management</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Priority customer support</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-center">
                  <strong>Special Launch Offer:</strong> Sign up today and get your first 6 months completely free! 
                  After your free trial, continue for just $49/month. Cancel anytime.
                </p>
              </div>

              <div className="text-center">
                <Button size="lg" className="w-full md:w-auto px-8" onClick={handleApplyClick}>
                  Start Your Free 6 Months
                </Button>
                <p className="text-xs text-muted-foreground mt-3">No credit card required to start</p>
              </div>
            </Card>
          </div>
        </div>

        <div id="application-form" className="mb-20 scroll-mt-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">Apply Now</h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and we'll review your application within 24-48 hours
              </p>
            </div>
            
            <Card className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="business-name" className="block text-sm font-medium mb-2">
                      Business Name *
                    </label>
                    <input
                      id="business-name"
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-input rounded-md bg-background"
                      placeholder="Your Auto Shop"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="owner-name" className="block text-sm font-medium mb-2">
                      Owner Name *
                    </label>
                    <input
                      id="owner-name"
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-input rounded-md bg-background"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-input rounded-md bg-background"
                      placeholder="contact@yourshop.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      className="w-full px-4 py-2 border border-input rounded-md bg-background"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Business Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-input rounded-md bg-background"
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-input rounded-md bg-background"
                      placeholder="Springfield"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-2">
                      State *
                    </label>
                    <input
                      id="state"
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-input rounded-md bg-background"
                      placeholder="IL"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium mb-2">
                      ZIP Code *
                    </label>
                    <input
                      id="zip"
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-input rounded-md bg-background"
                      placeholder="62701"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="services" className="block text-sm font-medium mb-2">
                    Services Offered *
                  </label>
                  <textarea
                    id="services"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-input rounded-md bg-background"
                    placeholder="List the services you provide (e.g., Oil Changes, Brake Repair, Diagnostics, etc.)"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium mb-2">
                    Years of Experience *
                  </label>
                  <select
                    id="experience"
                    required
                    className="w-full px-4 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select...</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="license" className="block text-sm font-medium mb-2">
                    Business License Number
                  </label>
                  <input
                    id="license"
                    type="text"
                    className="w-full px-4 py-2 border border-input rounded-md bg-background"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Documents
                  </label>
                  <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="documents"
                      multiple
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="documents" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Phone className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload business license, insurance, or certifications
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, or PNG (max 10MB)
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the terms and conditions and confirm that all information provided is accurate
                  </label>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Application
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got answers.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-16 bg-primary/5 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of successful providers already growing with H3 Automo
          </p>
          <Button size="lg" onClick={handleApplyClick} className="gap-2">
            <Users className="w-5 h-5" />
            Join Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForProviders;
