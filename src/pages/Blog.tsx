import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "5 Signs Your Car Needs Immediate Attention",
    excerpt: "Learn to recognize the warning signs that indicate your vehicle requires professional service right away.",
    category: "Maintenance Tips",
    date: "2025-10-01",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "How to Choose the Right Auto Repair Shop",
    excerpt: "A comprehensive guide to finding a trustworthy and reliable automotive service provider in your area.",
    category: "Guide",
    date: "2025-09-28",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Understanding Your Vehicle's Maintenance Schedule",
    excerpt: "Why following your manufacturer's recommended maintenance schedule is crucial for your car's longevity.",
    category: "Maintenance Tips",
    date: "2025-09-25",
    readTime: "6 min read"
  }
];

const Blog = () => {
  return (
    <main className="min-h-screen bg-background">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Auto Repair Blog</h1>
              <p className="text-lg text-muted-foreground">
                Expert tips, maintenance guides, and industry insights to help you keep your vehicle running smoothly.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {blogPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-sm text-muted-foreground">• {post.readTime}</span>
                    </div>
                    <CardTitle className="text-2xl hover:text-primary transition-colors cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
  );
};

export default Blog;
