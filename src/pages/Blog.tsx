import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Search, Tag } from "lucide-react";
import maintenanceGuide from "@/assets/blog-maintenance-guide.jpg";
import brakeSafety from "@/assets/blog-brake-safety.jpg";
import electricVsGas from "@/assets/blog-electric-vs-gas.jpg";
import mechanicTrust from "@/assets/blog-mechanic-trust.jpg";
import dashboardLights from "@/assets/blog-dashboard-lights.jpg";
import winterPrep from "@/assets/blog-winter-prep.jpg";
import mobileService from "@/assets/blog-mobile-service.jpg";

const Blog = () => {
  const featuredPost = {
    title: "The Complete Guide to Preventive Auto Maintenance",
    excerpt: "Learn how regular maintenance can save you thousands and keep your car running smoothly for years to come.",
    author: "Sarah Johnson",
    date: "March 20, 2024",
    readTime: "8 min read",
    category: "Maintenance Tips",
    image: maintenanceGuide
  };

  const blogPosts = [
    {
      title: "5 Signs Your Brakes Need Immediate Attention",
      excerpt: "Don't ignore these warning signs that could save your life and prevent costly repairs.",
      author: "Mike Rodriguez",
      date: "March 18, 2024",
      readTime: "5 min read",
      category: "Safety",
      image: brakeSafety
    },
    {
      title: "Electric vs. Gas: Total Cost of Ownership Comparison",
      excerpt: "A comprehensive analysis of what it really costs to own and maintain electric vs. gasoline vehicles.",
      author: "Emily Chen",
      date: "March 15, 2024",
      readTime: "12 min read",
      category: "Electric Vehicles",
      image: electricVsGas
    },
    {
      title: "How to Find a Trustworthy Auto Mechanic",
      excerpt: "Essential tips for choosing a reliable service provider you can trust with your vehicle.",
      author: "David Thompson",
      date: "March 12, 2024",
      readTime: "6 min read",
      category: "Tips & Advice",
      image: mechanicTrust
    },
    {
      title: "Understanding Your Car's Dashboard Warning Lights",
      excerpt: "Decode those mysterious dashboard symbols and know when to take immediate action.",
      author: "Lisa Park",
      date: "March 10, 2024",
      readTime: "7 min read",
      category: "Education",
      image: dashboardLights
    },
    {
      title: "Seasonal Car Care: Preparing for Winter Driving",
      excerpt: "Essential maintenance tasks to ensure your vehicle is ready for harsh winter conditions.",
      author: "Robert Kim",
      date: "March 8, 2024",
      readTime: "9 min read",
      category: "Seasonal Care",
      image: winterPrep
    },
    {
      title: "The Rise of Mobile Auto Services: Convenience Meets Quality",
      excerpt: "Explore how mobile auto services are changing the industry and what it means for consumers.",
      author: "Jennifer Walsh",
      date: "March 5, 2024",
      readTime: "4 min read",
      category: "Industry Trends",
      image: mobileService
    }
  ];

  const categories = [
    "All Posts",
    "Maintenance Tips",
    "Safety",
    "Electric Vehicles",
    "Tips & Advice",
    "Education",
    "Seasonal Care",
    "Industry Trends"
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-overlay opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold text-primary-foreground mb-6">
            H3 Automo Blog
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Expert insights, tips, and guides to help you maintain your vehicle 
            and make informed decisions about auto services.
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10 bg-background/95 backdrop-blur-sm border-primary-foreground/20 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Article
            </h2>
          </div>

          <Card className="max-w-4xl mx-auto hover:shadow-elegant transition-all duration-300 overflow-hidden border-accent/20">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-accent/10 relative overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">{featuredPost.category}</Badge>
                <CardTitle className="text-2xl mb-4 text-foreground">{featuredPost.title}</CardTitle>
                <p className="text-muted-foreground mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Read Full Article</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-10 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Latest Articles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with our latest insights and expert advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden border-accent/20 bg-card/50 backdrop-blur-sm">
                <div className="h-48 bg-accent/10 relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2 bg-primary/10 text-primary hover:bg-primary/20">{post.category}</Badge>
                  <CardTitle className="text-lg leading-tight text-foreground group-hover:text-primary transition-colors">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">Read More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-overlay opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and never miss our latest articles, 
            tips, and industry insights.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input 
              placeholder="Enter your email" 
              className="flex-1 bg-background/95 backdrop-blur-sm border-accent/30 shadow-sm" 
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">Subscribe</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Blog;