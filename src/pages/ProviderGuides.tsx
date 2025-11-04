import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search, 
  Clock, 
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Settings,
  MessageSquare,
  Award,
  ChevronRight
} from "lucide-react";

const ProviderGuides = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "getting-started", label: "Getting Started", icon: Star },
    { id: "bookings", label: "Managing Bookings", icon: Calendar },
    { id: "pricing", label: "Pricing & Revenue", icon: DollarSign },
    { id: "customers", label: "Customer Relations", icon: Users },
    { id: "marketing", label: "Marketing Tips", icon: TrendingUp },
    { id: "platform", label: "Platform Features", icon: Settings },
  ];

  const guides = [
    {
      id: 1,
      title: "Complete Provider Onboarding Guide",
      description: "Step-by-step guide to set up your provider account and start receiving bookings",
      category: "getting-started",
      type: "guide",
      duration: "15 min read",
      difficulty: "Beginner",
      featured: true,
      icon: BookOpen,
    },
    {
      id: 2,
      title: "Setting Up Your Service Catalog",
      description: "Learn how to create and price your automotive services effectively",
      category: "getting-started",
      type: "tutorial",
      duration: "10 min read",
      difficulty: "Beginner",
      featured: true,
      icon: FileText,
    },
    {
      id: 3,
      title: "Optimizing Your Booking Acceptance Rate",
      description: "Best practices for managing and responding to booking requests",
      category: "bookings",
      type: "guide",
      duration: "8 min read",
      difficulty: "Intermediate",
      featured: false,
      icon: BookOpen,
    },
    {
      id: 4,
      title: "Video Tutorial: Dashboard Overview",
      description: "Complete walkthrough of your provider dashboard and all its features",
      category: "platform",
      type: "video",
      duration: "12 min watch",
      difficulty: "Beginner",
      featured: true,
      icon: Video,
    },
    {
      id: 5,
      title: "Dynamic Pricing Strategies",
      description: "How to adjust your pricing based on demand, season, and competition",
      category: "pricing",
      type: "guide",
      duration: "12 min read",
      difficulty: "Advanced",
      featured: false,
      icon: BookOpen,
    },
    {
      id: 6,
      title: "Maximizing Your Revenue",
      description: "Proven strategies to increase bookings and revenue on H3 Automo",
      category: "pricing",
      type: "guide",
      duration: "15 min read",
      difficulty: "Intermediate",
      featured: true,
      icon: FileText,
    },
    {
      id: 7,
      title: "Building Customer Loyalty",
      description: "Tips for creating repeat customers and getting 5-star reviews",
      category: "customers",
      type: "guide",
      duration: "10 min read",
      difficulty: "Intermediate",
      featured: false,
      icon: BookOpen,
    },
    {
      id: 8,
      title: "Video: Responding to Customer Reviews",
      description: "Learn how to effectively respond to both positive and negative reviews",
      category: "customers",
      type: "video",
      duration: "8 min watch",
      difficulty: "Beginner",
      featured: false,
      icon: Video,
    },
    {
      id: 9,
      title: "Social Media Marketing for Auto Shops",
      description: "How to promote your services on social media to attract more customers",
      category: "marketing",
      type: "guide",
      duration: "14 min read",
      difficulty: "Intermediate",
      featured: false,
      icon: FileText,
    },
    {
      id: 10,
      title: "Using Analytics to Grow Your Business",
      description: "Understanding your dashboard analytics to make data-driven decisions",
      category: "platform",
      type: "tutorial",
      duration: "11 min read",
      difficulty: "Advanced",
      featured: false,
      icon: BookOpen,
    },
    {
      id: 11,
      title: "Seasonal Service Strategies",
      description: "Capitalize on seasonal demand for different automotive services",
      category: "marketing",
      type: "guide",
      duration: "9 min read",
      difficulty: "Intermediate",
      featured: false,
      icon: FileText,
    },
    {
      id: 12,
      title: "Managing Multiple Locations",
      description: "Best practices for providers with multiple shop locations",
      category: "platform",
      type: "guide",
      duration: "13 min read",
      difficulty: "Advanced",
      featured: false,
      icon: BookOpen,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredGuides = guides.filter(guide => {
    const matchesCategory = selectedCategory === "all" || guide.category === selectedCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredGuides = guides.filter(guide => guide.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "Advanced":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Guides & Tutorials</h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to succeed as an H3 Automo provider
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search guides and tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Featured Guides */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Featured Guides</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {guide.title}
                    </CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {guide.duration}
                        </span>
                      </div>
                      <Badge className={getDifficultyColor(guide.difficulty)} variant="secondary">
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Read Guide
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* All Guides with Categories */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse All Guides</h2>
          
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 hidden lg:inline" />
                    <span className="hidden lg:inline">{category.label}</span>
                    <span className="lg:hidden">{category.label.split(" ")[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-0">
              {filteredGuides.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No guides found matching your search.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredGuides.map((guide) => {
                    const Icon = guide.icon;
                    return (
                      <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                                {guide.title}
                              </CardTitle>
                              <CardDescription>{guide.description}</CardDescription>
                            </div>
                            <Icon className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {guide.duration}
                              </span>
                            </div>
                            <Badge className={getDifficultyColor(guide.difficulty)} variant="secondary">
                              {guide.difficulty}
                            </Badge>
                          </div>
                          <Button className="w-full" variant="outline" size="sm">
                            {guide.type === "video" ? "Watch Video" : "Read Guide"}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Help Card */}
        <Card className="mt-12 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Need More Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help you succeed.
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

export default ProviderGuides;
