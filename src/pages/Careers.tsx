import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Heart, Lightbulb, Target } from "lucide-react";

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Join our engineering team to build scalable solutions for the auto service industry.",
      requirements: ["5+ years experience", "React/Node.js", "TypeScript", "PostgreSQL"]
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      description: "Lead product strategy and development for our core platform features.",
      requirements: ["3+ years PM experience", "B2B SaaS", "Analytics", "Agile methodologies"]
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Help our service providers succeed and grow their businesses on our platform.",
      requirements: ["2+ years CS experience", "B2B relationships", "Problem solving", "Communication skills"]
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Austin, TX",
      type: "Full-time",
      description: "Drive growth through digital marketing campaigns and content strategy.",
      requirements: ["Marketing degree", "Digital marketing", "Content creation", "Analytics tools"]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs."
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      description: "Flexible hours, remote work options, and unlimited PTO policy."
    },
    {
      icon: Lightbulb,
      title: "Growth & Learning",
      description: "Professional development budget, conference attendance, and mentorship programs."
    },
    {
      icon: Users,
      title: "Great Culture",
      description: "Collaborative environment, team events, and inclusive workplace policies."
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Customer-Centric",
      description: "We put our customers at the center of everything we do."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of teamwork and open communication."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously seek new ways to improve and innovate."
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "We operate with honesty, transparency, and ethical standards."
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-primary-foreground mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Help us revolutionize the auto service industry. Build innovative solutions 
            that connect drivers with trusted service providers.
          </p>
          <Button size="lg" variant="accent">
            View Open Positions
          </Button>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape our company culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Work With Us?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer competitive benefits and a supportive work environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Open Positions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find your next opportunity to make an impact in the auto service industry.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{position.department}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {position.type}
                        </Badge>
                      </div>
                    </div>
                    <Button>Apply Now</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Requirements:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Don't See a Perfect Match?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion for innovation. 
            Send us your resume and let us know how you'd like to contribute.
          </p>
          <Button size="lg">Send Us Your Resume</Button>
        </div>
      </section>
    </div>
  );
};

export default Careers;