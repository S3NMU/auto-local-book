import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Image, Video, Smartphone, Laptop, FileSpreadsheet, BookOpen, ExternalLink } from "lucide-react";

const ProviderHub = () => {
  const downloadCategories = [
    {
      title: "Marketing Materials",
      icon: Image,
      description: "Promotional materials to help grow your business",
      items: [
        {
          name: "H3 Automo Provider Logo Pack",
          description: "High-resolution logos in various formats (PNG, SVG, AI)",
          size: "2.4 MB",
          format: "ZIP",
          downloadUrl: "#",
        },
        {
          name: "Social Media Graphics Template",
          description: "Ready-to-use templates for Instagram, Facebook, and Twitter",
          size: "8.1 MB",
          format: "ZIP",
          downloadUrl: "#",
        },
        {
          name: "Business Card Templates",
          description: "Professional business card designs with H3 branding",
          size: "1.2 MB",
          format: "PDF",
          downloadUrl: "#",
        },
        {
          name: "Window Decal Designs",
          description: "Printable window decals showing H3 partnership",
          size: "3.5 MB",
          format: "PDF",
          downloadUrl: "#",
        },
      ],
    },
    {
      title: "Mobile & Desktop Apps",
      icon: Smartphone,
      description: "Download apps to manage your provider account on the go",
      items: [
        {
          name: "H3 Provider App - iOS",
          description: "Manage bookings and services from your iPhone or iPad",
          size: "45 MB",
          format: "App Store",
          downloadUrl: "#",
          badge: "Coming Soon",
        },
        {
          name: "H3 Provider App - Android",
          description: "Manage bookings and services from your Android device",
          size: "38 MB",
          format: "Play Store",
          downloadUrl: "#",
          badge: "Coming Soon",
        },
        {
          name: "Desktop Dashboard App",
          description: "Native desktop application for Windows and Mac",
          size: "120 MB",
          format: "EXE/DMG",
          downloadUrl: "#",
          badge: "Beta",
        },
      ],
    },
    {
      title: "Training & Documentation",
      icon: BookOpen,
      description: "Guides and training materials for providers",
      items: [
        {
          name: "Provider Onboarding Guide",
          description: "Complete guide to getting started on H3 Automo",
          size: "4.2 MB",
          format: "PDF",
          downloadUrl: "#",
        },
        {
          name: "Best Practices Handbook",
          description: "Tips and strategies to maximize your bookings",
          size: "6.8 MB",
          format: "PDF",
          downloadUrl: "#",
        },
        {
          name: "Platform Training Videos",
          description: "Video tutorials on using all platform features",
          size: "250 MB",
          format: "MP4",
          downloadUrl: "#",
        },
        {
          name: "Customer Service Scripts",
          description: "Template responses for common customer inquiries",
          size: "890 KB",
          format: "DOCX",
          downloadUrl: "#",
        },
      ],
    },
    {
      title: "Business Tools",
      icon: FileSpreadsheet,
      description: "Templates and tools to streamline your operations",
      items: [
        {
          name: "Service Pricing Calculator",
          description: "Excel template to calculate competitive pricing",
          size: "1.5 MB",
          format: "XLSX",
          downloadUrl: "#",
        },
        {
          name: "Invoice Template",
          description: "Professional invoice template with H3 branding",
          size: "580 KB",
          format: "DOCX",
          downloadUrl: "#",
        },
        {
          name: "Appointment Schedule Template",
          description: "Weekly and monthly scheduling templates",
          size: "920 KB",
          format: "XLSX",
          downloadUrl: "#",
        },
        {
          name: "Customer Intake Form",
          description: "Printable form for collecting customer information",
          size: "450 KB",
          format: "PDF",
          downloadUrl: "#",
        },
      ],
    },
  ];

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return FileText;
      case "zip":
        return Download;
      case "mp4":
        return Video;
      case "app store":
      case "play store":
        return Smartphone;
      case "exe/dmg":
        return Laptop;
      default:
        return FileSpreadsheet;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">H3 Provider HUB</h1>
          <p className="text-muted-foreground text-lg">
            Download resources, tools, and materials to help grow your automotive service business
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Download className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">25+</p>
                <p className="text-sm text-muted-foreground">Resources Available</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Training Documents</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Image className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Marketing Templates</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Smartphone className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Mobile Apps</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download Categories */}
        <div className="space-y-12">
          {downloadCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CategoryIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {category.items.map((item, itemIndex) => {
                    const FormatIcon = getFormatIcon(item.format);
                    return (
                      <Card key={itemIndex} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <CardDescription>{item.description}</CardDescription>
                            </div>
                            <FormatIcon className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{item.format}</span>
                              <span>•</span>
                              <span>{item.size}</span>
                            </div>
                            {item.badge === "Coming Soon" ? (
                              <Button size="sm" disabled>
                                <Download className="w-4 h-4 mr-2" />
                                Coming Soon
                              </Button>
                            ) : (
                              <Button size="sm" asChild>
                                <a href={item.downloadUrl} download>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Resources */}
        <Card className="mt-12 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Need Something Else?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Can&apos;t find the resource you&apos;re looking for? Our support team can help you get what you need.
            </p>
            <Button asChild variant="outline">
              <a href="/provider-resources/support">
                Contact Support
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderHub;
