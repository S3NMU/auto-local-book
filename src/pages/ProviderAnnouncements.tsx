import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Star, Wrench, TrendingUp, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ProviderAnnouncements = () => {
  const announcements = [
    {
      id: 1,
      title: "New Provider Dashboard Features Released",
      category: "Platform Update",
      date: "2025-11-01",
      priority: "high",
      icon: Star,
      content: "We've launched enhanced analytics and reporting tools in your provider dashboard. Track revenue, bookings, and customer satisfaction metrics with new interactive charts and export capabilities.",
      tags: ["Dashboard", "Analytics", "New Feature"]
    },
    {
      id: 2,
      title: "Mobile Booking Optimization",
      category: "Improvement",
      date: "2025-10-28",
      priority: "medium",
      icon: TrendingUp,
      content: "Customer booking flow has been optimized for mobile devices, resulting in 35% faster booking completion. This means more conversions and easier scheduling for your customers.",
      tags: ["Mobile", "UX", "Booking"]
    },
    {
      id: 3,
      title: "Winter Service Preparation Tips",
      category: "Seasonal",
      date: "2025-10-25",
      priority: "medium",
      icon: Wrench,
      content: "As winter approaches, make sure your service offerings include winter-specific maintenance like antifreeze checks, battery testing, and tire changes. Update your service catalog to capture seasonal demand.",
      tags: ["Seasonal", "Services", "Tips"]
    },
    {
      id: 4,
      title: "Payment Processing Update - Action Required",
      category: "Important",
      date: "2025-10-20",
      priority: "high",
      icon: AlertCircle,
      content: "We're upgrading our payment processing system on November 15th. Please verify your bank account details in your profile settings to ensure uninterrupted payment processing.",
      tags: ["Payment", "Action Required", "Important"]
    },
    {
      id: 5,
      title: "Customer Review Response Feature",
      category: "New Feature",
      date: "2025-10-15",
      priority: "low",
      icon: Bell,
      content: "You can now respond directly to customer reviews from your dashboard. Engaging with reviews helps build trust and shows potential customers your commitment to service quality.",
      tags: ["Reviews", "Customer Service", "New Feature"]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Announcements & Updates</h1>
          <p className="text-muted-foreground text-lg">
            Stay informed about platform updates, new features, and important notices for H3 Automo providers.
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Announcements List */}
        <div className="space-y-6">
          {announcements.map((announcement) => {
            const Icon = announcement.icon;
            return (
              <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getPriorityColor(announcement.priority)}>
                            {announcement.category}
                          </Badge>
                          {announcement.priority === "high" && (
                            <Badge variant="outline" className="text-destructive border-destructive">
                              High Priority
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-2">{announcement.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(announcement.date)}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {announcement.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {announcement.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Stay Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Important announcements will also be sent to your registered email address. 
              Make sure your contact information is up to date in your{" "}
              <a href="/account" className="text-primary hover:underline font-medium">
                account settings
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderAnnouncements;
