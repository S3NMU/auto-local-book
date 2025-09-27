import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Newspaper,
  Calendar,
  Download,
  ExternalLink,
  Award,
  TrendingUp,
  Users,
  Building
} from "lucide-react";

const Press = () => {
  const pressReleases = [
    {
      date: "March 15, 2024",
      title: "H3 Automo Reaches 500 Verified Service Providers Milestone",
      description: "Company announces significant growth in provider network across major metropolitan areas.",
      category: "Company News"
    },
    {
      date: "February 8, 2024", 
      title: "H3 Automo Introduces Mobile Mechanic Services",
      description: "Platform expansion includes on-location automotive services for customer convenience.",
      category: "Product Update"
    },
    {
      date: "January 22, 2024",
      title: "Series A Funding Round Raises $5M for Platform Expansion",
      description: "Investment will accelerate growth and enhance technology platform capabilities.",
      category: "Funding"
    },
    {
      date: "December 10, 2023",
      title: "Partnership with Local Auto Parts Retailers Announced",
      description: "Strategic partnerships enable same-day parts availability for service providers.",
      category: "Partnership"
    }
  ];

  const mediaKit = [
    {
      title: "Company Logo Pack",
      description: "High-resolution logos in various formats (PNG, SVG, EPS)",
      type: "ZIP Archive"
    },
    {
      title: "Brand Guidelines",
      description: "Complete brand standards and usage guidelines",
      type: "PDF Document"
    },
    {
      title: "Product Screenshots",
      description: "High-quality screenshots of our platform interface",
      type: "ZIP Archive"
    },
    {
      title: "Executive Headshots",
      description: "Professional photos of company leadership team",
      type: "ZIP Archive"
    }
  ];

  const awards = [
    {
      title: "Best Automotive Technology Startup",
      organization: "Auto Innovation Awards 2024",
      date: "March 2024"
    },
    {
      title: "Top 50 B2B SaaS Companies to Watch",
      organization: "SaaS Weekly",
      date: "February 2024"
    },
    {
      title: "Excellence in Customer Experience",
      organization: "Local Business Chamber",
      date: "January 2024"
    }
  ];

  const companyFacts = [
    {
      icon: Users,
      label: "Active Customers",
      value: "10,000+"
    },
    {
      icon: Building,
      label: "Service Providers",
      value: "500+"
    },
    {
      icon: TrendingUp,
      label: "Services Booked",
      value: "25,000+"
    },
    {
      icon: Award,
      label: "Average Rating",
      value: "4.8/5"
    }
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Press & Media
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            H3 Automo in the News
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest news, announcements, and media coverage about 
            H3 Automo's mission to transform the automotive service industry.
          </p>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {companyFacts.map((fact, index) => {
            const IconComponent = fact.icon;
            return (
              <Card key={index} className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {fact.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {fact.label}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Press Releases */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Press Releases</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recent announcements and company updates
            </p>
          </div>
          
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{release.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {release.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                    <p className="text-muted-foreground">{release.description}</p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/contact">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read More
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Industry recognition for our innovation and customer service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{award.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{award.organization}</p>
                <p className="text-xs text-muted-foreground">{award.date}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Media Kit</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download our media resources for press coverage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Download className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Media Contact */}
        <div className="text-center bg-card p-12 rounded-lg border">
          <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            For press inquiries, interview requests, or additional information, 
            please contact our media relations team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">
                <Newspaper className="w-4 h-4 mr-2" />
                Contact Press Team
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Media Kit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;