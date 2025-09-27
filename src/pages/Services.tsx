import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Car, Settings, CheckCircle } from "lucide-react";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Oil Change",
      description: "Quick and professional oil change service",
      price: "$35-60",
      duration: "30 min",
      icon: Settings,
      features: ["Synthetic oil options", "Filter replacement", "Fluid top-off"]
    },
    {
      id: 2,
      title: "Brake Service",
      description: "Complete brake inspection and repair",
      price: "$150-400",
      duration: "1-2 hours",
      icon: Car,
      features: ["Brake pad replacement", "Rotor inspection", "Brake fluid check"]
    },
    {
      id: 3,
      title: "Diagnostic",
      description: "Computer diagnostic and troubleshooting",
      price: "$100-150",
      duration: "45 min",
      icon: Wrench,
      features: ["OBD scan", "Error code analysis", "System check"]
    }
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Auto Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional automotive services from trusted local providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-primary">{service.price}</span>
                    <span className="text-sm text-muted-foreground">{service.duration}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">Find Providers</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;