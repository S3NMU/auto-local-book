import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award, TrendingUp } from "lucide-react";

const AboutIntro = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To transform local automotive access by connecting customers with trusted services, quality vehicles, and reliable providers.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a network of verified providers and satisfied customers who trust H3 Automo for all their automotive needs.",
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "Every provider, vehicle, and service on our platform meets strict quality standards to ensure your satisfaction.",
    },
    {
      icon: TrendingUp,
      title: "Innovation Driven",
      description: "Continuously improving our platform to make automotive services more accessible, transparent, and convenient.",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left: Welcome Text */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground bg-primary px-6 py-4 rounded-lg inline-block">
              Welcome to H3 Automo
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              H3 Automo is your all-in-one automotive solution, bringing together vehicle rentals, 
              sales, and professional services in one convenient platform. Whether you need a car 
              for a road trip, looking to buy your next vehicle, or require maintenance and repairs, 
              we connect you with trusted local providers.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is simple: <span className="text-foreground font-semibold">Travel smart. Rent the ride. Rest the night.</span> We're 
              revolutionizing how people access automotive services by creating a seamless experience 
              that puts you in control.
            </p>
          </div>

          {/* Right: Value Cards Stacked */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
