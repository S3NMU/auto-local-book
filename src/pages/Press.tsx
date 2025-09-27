import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, ExternalLink, Award, TrendingUp, Users } from "lucide-react";

const Press = () => {
  const pressReleases = [
    {
      title: "H3 Automo Raises $10M Series A to Expand Auto Service Platform",
      date: "March 15, 2024",
      excerpt: "Leading auto service booking platform secures funding to accelerate growth and enhance technology offerings.",
      category: "Funding"
    },
    {
      title: "H3 Automo Partners with National Auto Chain for Enhanced Service Coverage",
      date: "February 8, 2024",
      excerpt: "Strategic partnership expands service network to over 500 locations nationwide, improving customer access.",
      category: "Partnership"
    },
    {
      title: "H3 Automo Wins 'Best Auto Tech Innovation' Award at Industry Summit",
      date: "January 22, 2024",
      excerpt: "Platform recognized for revolutionary approach to connecting drivers with trusted auto service providers.",
      category: "Award"
    },
    {
      title: "H3 Automo Launches AI-Powered Service Recommendations",
      date: "December 10, 2023",
      excerpt: "New machine learning capabilities help drivers find the most suitable service providers based on their specific needs.",
      category: "Product"
    }
  ];

  const mediaAssets = [
    {
      title: "Company Logo Package",
      type: "ZIP",
      size: "2.4 MB",
      description: "High-resolution logos in various formats (PNG, SVG, EPS)"
    },
    {
      title: "Executive Headshots",
      type: "ZIP",
      size: "15.2 MB",
      description: "Professional photos of leadership team"
    },
    {
      title: "Product Screenshots",
      type: "ZIP",
      size: "8.7 MB",
      description: "App interface and dashboard screenshots"
    },
    {
      title: "Company Fact Sheet",
      type: "PDF",
      size: "1.1 MB",
      description: "Key company information and statistics"
    }
  ];

  const stats = [
    {
      icon: Users,
      number: "50,000+",
      label: "Active Users",
      description: "Drivers using our platform monthly"
    },
    {
      icon: TrendingUp,
      number: "1,200+",
      label: "Service Providers",
      description: "Verified auto shops in our network"
    },
    {
      icon: Award,
      number: "4.8/5",
      label: "Average Rating",
      description: "Customer satisfaction score"
    }
  ];

  const coverage = [
    {
      publication: "TechCrunch",
      title: "H3 Automo is revolutionizing how we book auto services",
      date: "March 2024",
      url: "#"
    },
    {
      publication: "Forbes",
      title: "The Future of Auto Service: How H3 Automo is Leading the Change",
      date: "February 2024",
      url: "#"
    },
    {
      publication: "AutoNews",
      title: "Digital Transformation in Auto Service Industry",
      date: "January 2024",
      url: "#"
    },
    {
      publication: "VentureBeat",
      title: "H3 Automo's Series A Signals Strong Market Demand",
      date: "March 2024",
      url: "#"
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-primary-foreground mb-6">
            Press & Media
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Latest news, press releases, and media resources for H3 Automo. 
            Stay updated on our journey to transform the auto service industry.
          </p>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Company at a Glance
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key metrics that showcase our growth and impact in the auto service industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <CardTitle className="text-xl">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Latest Press Releases
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed about our latest announcements and company milestones.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">{release.category}</Badge>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Calendar className="w-4 h-4" />
                          {release.date}
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{release.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Media Coverage
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what leading publications are saying about H3 Automo.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {coverage.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{article.publication}</Badge>
                        <span className="text-muted-foreground text-sm">{article.date}</span>
                      </div>
                      <h3 className="font-semibold text-foreground">{article.title}</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Read Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Media Assets
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download high-quality assets for your articles and publications.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaAssets.map((asset, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{asset.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{asset.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{asset.type}</Badge>
                        <span>{asset.size}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Media Inquiries
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            For press inquiries, interview requests, or additional information, 
            please contact our media relations team.
          </p>
          <div className="space-y-4">
            <p className="text-foreground">
              <strong>Email:</strong> press@h3automo.com
            </p>
            <p className="text-foreground">
              <strong>Phone:</strong> (555) 123-PRESS
            </p>
          </div>
          <Button size="lg" className="mt-8">
            Contact Media Team
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Press;