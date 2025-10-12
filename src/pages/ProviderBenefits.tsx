import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Shield,
  BarChart3,
  MapPin,
  Smartphone,
  MessageSquare,
  Award,
  Clock,
  CreditCard,
  FileText
} from "lucide-react";

const ProviderBenefits = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Your H3 Automo Provider Benefits</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you get as an H3 Automo verified provider
          </p>
        </div>

        {/* Main Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Digital Presence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-primary" />
                Digital Presence
              </CardTitle>
              <CardDescription>
                Stand out online with a professional digital footprint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Professional Searchable Profile</h4>
                  <p className="text-sm text-muted-foreground">Get discovered by local customers searching for auto services</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Customer Reviews & Ratings</h4>
                  <p className="text-sm text-muted-foreground">Build trust with verified customer feedback and ratings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">SEO-Optimized Local Listings</h4>
                  <p className="text-sm text-muted-foreground">Appear in search results when customers need your services</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Verified Provider Badge</h4>
                  <p className="text-sm text-muted-foreground">Stand out with our trust badge that shows you're verified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Operational Tools
              </CardTitle>
              <CardDescription>
                Streamline your business operations with powerful tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Automated Booking Management</h4>
                  <p className="text-sm text-muted-foreground">Accept and manage bookings 24/7 without manual scheduling</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Integrated Payment Processing</h4>
                  <p className="text-sm text-muted-foreground">Track payments and revenue with our built-in tools</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Customer History Tracking</h4>
                  <p className="text-sm text-muted-foreground">Maintain detailed records of all customer interactions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Mobile-Friendly Dashboard</h4>
                  <p className="text-sm text-muted-foreground">Manage your business from anywhere on any device</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Growth Support
              </CardTitle>
              <CardDescription>
                Tools and resources to help your business grow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Featured Listing Opportunities</h4>
                  <p className="text-sm text-muted-foreground">Get highlighted placement to attract more customers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Analytics & Insights</h4>
                  <p className="text-sm text-muted-foreground">Understand your business performance with detailed analytics</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Marketing Support</h4>
                  <p className="text-sm text-muted-foreground">Benefit from our platform-wide marketing efforts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Business Protection</h4>
                  <p className="text-sm text-muted-foreground">Verified bookings and secure transaction processing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-primary" />
                Financial Benefits
              </CardTitle>
              <CardDescription>
                Maximize your revenue and simplify accounting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Revenue Tracking</h4>
                  <p className="text-sm text-muted-foreground">Monitor all income and payments in one place</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Automated Invoicing</h4>
                  <p className="text-sm text-muted-foreground">Generate professional invoices for every service</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Financial Reports</h4>
                  <p className="text-sm text-muted-foreground">Export reports for accounting and tax purposes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Time-Saving Automation</h4>
                  <p className="text-sm text-muted-foreground">Reduce administrative work with automated processes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>What Makes H3 Automo Different</CardTitle>
            <CardDescription>
              We provide everything you need to succeed in one platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Badge variant="default" className="mb-2">All-in-One Platform</Badge>
                <p className="text-sm text-muted-foreground">
                  No need for multiple tools - bookings, payments, customer management, and analytics all in one place
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="default" className="mb-2">No Setup Fees</Badge>
                <p className="text-sm text-muted-foreground">
                  Get started immediately with no upfront costs or hidden fees
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="default" className="mb-2">24/7 Support</Badge>
                <p className="text-sm text-muted-foreground">
                  Our team is here to help you succeed whenever you need assistance
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="default" className="mb-2">Quality Customers</Badge>
                <p className="text-sm text-muted-foreground">
                  Connect with verified customers who are ready to book and pay for services
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="default" className="mb-2">Growing Network</Badge>
                <p className="text-sm text-muted-foreground">
                  Join a rapidly expanding network of providers and customers across the country
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="default" className="mb-2">Regular Updates</Badge>
                <p className="text-sm text-muted-foreground">
                  Benefit from continuous platform improvements and new features
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderBenefits;
