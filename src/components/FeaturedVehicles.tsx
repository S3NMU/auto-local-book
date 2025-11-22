import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, DollarSign, Users, Gauge, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Vehicle {
  id: string;
  name: string;
  year: number;
  type: "rental" | "sale";
  price: number;
  priceType: "day" | "total";
  image: string;
  passengers: number;
  transmission: string;
  mileage?: string;
}

const FeaturedVehicles = () => {
  // Mock featured vehicles - replace with real data from Supabase later
  const vehicles: Vehicle[] = [
    {
      id: "1",
      name: "Toyota Camry",
      year: 2023,
      type: "rental",
      price: 55,
      priceType: "day",
      image: "/placeholder.svg",
      passengers: 5,
      transmission: "Automatic",
    },
    {
      id: "2",
      name: "Honda CR-V",
      year: 2022,
      type: "rental",
      price: 75,
      priceType: "day",
      image: "/placeholder.svg",
      passengers: 5,
      transmission: "Automatic",
    },
    {
      id: "3",
      name: "Ford F-150",
      year: 2021,
      type: "sale",
      price: 32500,
      priceType: "total",
      image: "/placeholder.svg",
      passengers: 5,
      transmission: "Automatic",
      mileage: "45,000 mi",
    },
    {
      id: "4",
      name: "Tesla Model 3",
      year: 2023,
      type: "sale",
      price: 42000,
      priceType: "total",
      image: "/placeholder.svg",
      passengers: 5,
      transmission: "Electric",
      mileage: "12,000 mi",
    },
  ];

  const rentalVehicles = vehicles.filter(v => v.type === "rental");
  const saleVehicles = vehicles.filter(v => v.type === "sale");

  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-border/50 hover:border-primary/30">
      <div className="relative h-48 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center overflow-hidden">
        <Car className="w-24 h-24 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-300" />
        <Badge className={`absolute top-4 right-4 ${
          vehicle.type === "rental" 
            ? "bg-blue-600 hover:bg-blue-700" 
            : "bg-green-600 hover:bg-green-700"
        }`}>
          {vehicle.type === "rental" ? "For Rent" : "For Sale"}
        </Badge>
      </div>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {vehicle.year} {vehicle.name}
          </h3>
          <div className="flex items-center gap-2 mt-3">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              ${vehicle.price.toLocaleString()}
              {vehicle.priceType === "day" && <span className="text-sm text-muted-foreground font-normal">/day</span>}
            </span>
          </div>
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{vehicle.passengers}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4" />
            <span>{vehicle.transmission}</span>
          </div>
          {vehicle.mileage && (
            <div className="flex items-center gap-1.5">
              <span>{vehicle.mileage}</span>
            </div>
          )}
        </div>

        <Link to={`/rentals?type=${vehicle.type}`}>
          <Button className="w-full group/btn" variant="outline">
            View Details
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Rental Vehicles */}
        <div className="mb-24">
          <div className="mb-12">
            <div className="inline-block mb-3">
              <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">
                Rentals
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Featured Rental Vehicles
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4"></div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Premium vehicles available for daily, weekly, or monthly rental. Flexible options for every journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
            {rentalVehicles.map((vehicle, index) => (
              <div 
                key={vehicle.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/rentals?type=rental">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Browse All Rentals
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-24">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-6 text-sm text-muted-foreground">or</span>
          </div>
        </div>

        {/* Sale Vehicles */}
        <div>
          <div className="mb-12">
            <div className="inline-block mb-3">
              <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                For Sale
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Quality Vehicles for Sale
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4"></div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Certified pre-owned vehicles from trusted sellers. Find your perfect ride today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
            {saleVehicles.map((vehicle, index) => (
              <div 
                key={vehicle.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/rentals?type=sale">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Browse All Vehicles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
