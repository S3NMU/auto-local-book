import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  BookOpen,
  Wrench,
  TrendingUp,
  Car
} from "lucide-react";

const Blog = () => {
  const featuredPost = {
    title: "The Complete Guide to Preventive Vehicle Maintenance",
    excerpt: "Learn how regular maintenance can save you thousands in repairs and keep your vehicle running smoothly for years to come.",
    author: "Sarah Johnson",
    date: "March 20, 2024",
    readTime: "8 min read",
    category: "Maintenance Tips",
    image: "/api/placeholder/600/300"
  };

  const blogPosts = [
    {
      title: "5 Warning Signs Your Brakes Need Immediate Attention",
      excerpt: "Don't ignore these critical brake warning signs that could save your life and prevent costly repairs.",
      author: "Mike Chen",
      date: "March 18, 2024",
      readTime: "5 min read",
      category: "Safety",
      image: "/api/placeholder/400/200"
    },
    {
      title: "How to Choose the Right Motor Oil for Your Vehicle",
      excerpt: "Understanding the differences between conventional, synthetic blend, and full synthetic oils.",
      author: "Lisa Rodriguez",
      date: "March 15, 2024",
      readTime: "6 min read",
      category: "Maintenance Tips",
      image: "/api/placeholder/400/200"
    },
    {
      title: "The Rise of Mobile Automotive Services",
      excerpt: "Exploring how on-location car services are changing the automotive industry landscape.",
      author: "David Kim",
      date: "March 12, 2024",
      readTime: "7 min read",
      category: "Industry News",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Electric Vehicle Maintenance: What's Different?",
      excerpt: "Understanding the unique maintenance needs and schedules for electric vehicles.",
      author: "Emma Wilson",
      date: "March 10, 2024",
      readTime: "5 min read",
      category: "Electric Vehicles",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Seasonal Car Care: Preparing for Winter Driving",
      excerpt: "Essential maintenance steps to ensure your vehicle is ready for harsh winter conditions.",
      author: "Tom Anderson",
      date: "March 8, 2024",
      readTime: "6 min read",
      category: "Seasonal Tips",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Understanding Your Vehicle's Diagnostic Codes",
      excerpt: "Learn how to interpret those mysterious check engine light codes and what they mean.",
      author: "Jennifer Lee",
      date: "March 5, 2024",
      readTime: "4 min read",
      category: "Diagnostics",
      image: "/api/placeholder/400/200"
    }
  ];

  const categories = [
    { name: "Maintenance Tips", icon: Wrench, count: 12 },
    { name: "Safety", icon: Car, count: 8 },
    { name: "Industry News", icon: TrendingUp, count: 6 },
    { name: "Electric Vehicles", icon: Car, count: 4 },
    { name: "Seasonal Tips", icon: Calendar, count: 5 },
    { name: "Diagnostics", icon: Search, count: 7 }
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            H3 Automo Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Automotive Insights & Tips
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Expert advice, industry news, and practical tips to help you make informed 
            decisions about your vehicle's care and maintenance.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search articles..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Featured Post */}
        <Card className="mb-16 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <Badge className="mb-4">{featuredPost.category}</Badge>
              <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center text-sm text-muted-foreground mb-6">
                <User className="w-4 h-4 mr-1" />
                <span className="mr-4">{featuredPost.author}</span>
                <Calendar className="w-4 h-4 mr-1" />
                <span className="mr-4">{featuredPost.date}</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>{featuredPost.readTime}</span>
              </div>
              <Button asChild>
                <Link to="/contact" className="group">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <User className="w-4 h-4 mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-3">{post.date}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/contact" className="group">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-4 h-4 text-primary" />
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Newsletter</CardTitle>
                <CardDescription>
                  Get the latest automotive tips delivered to your inbox
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input placeholder="Your email address" />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;