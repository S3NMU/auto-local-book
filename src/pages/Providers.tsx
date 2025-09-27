import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Phone } from "lucide-react";

const Providers = () => {
  const providers = [
    {
      id: 1,
      name: "Quick Lube Express",
      rating: 4.8,
      reviewCount: 124,
      distance: "0.8 miles",
      address: "123 Main St, Downtown",
      phone: "(555) 123-4567",
      specialties: ["Oil Change", "Fluid Check"],
      isOpen: true,
      nextAvailable: "Today 2:00 PM"
    },
    {
      id: 2,
      name: "Metro Auto Care",
      rating: 4.9,
      reviewCount: 89,
      distance: "1.2 miles", 
      address: "456 Oak Ave, Midtown",
      phone: "(555) 987-6543",
      specialties: ["Brake Service", "Diagnostic"],
      isOpen: true,
      nextAvailable: "Tomorrow 9:00 AM"
    },
    {
      id: 3,
      name: "Mobile Mechanic Pro",
      rating: 4.7,
      reviewCount: 56,
      distance: "Will come to you",
      address: "Mobile Service",
      phone: "(555) 456-7890",
      specialties: ["Mobile Service", "Emergency Repair"],
      isOpen: false,
      nextAvailable: "Monday 8:00 AM"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Service Providers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted automotive professionals in your area
          </p>
        </div>

        <div className="space-y-6">
          {providers.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center space-x-2">
                      <span>{provider.name}</span>
                      {provider.isOpen && (
                        <Badge variant="default" className="bg-green-500">Open</Badge>
                      )}
                      {!provider.isOpen && (
                        <Badge variant="secondary">Closed</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.distance}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button>Book Service</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{provider.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{provider.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Next available: {provider.nextAvailable}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Providers;