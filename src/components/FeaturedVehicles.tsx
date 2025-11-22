import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, DollarSign, Users, Gauge } from "lucide-react";
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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        <Car className="w-24 h-24 text-muted-foreground/30" />
        <Badge className="absolute top-4 right-4 bg-primary">
          {vehicle.type === "rental" ? "For Rent" : "For Sale"}
        </Badge>
      </div>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {vehicle.year} {vehicle.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              ${vehicle.price.toLocaleString()}
              {vehicle.priceType === "day" && <span className="text-sm text-muted-foreground">/day</span>}
            </span>
          </div>
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{vehicle.passengers}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{vehicle.transmission}</span>
          </div>
          {vehicle.mileage && (
            <div className="flex items-center gap-1">
              <span>{vehicle.mileage}</span>
            </div>
          )}
        </div>

        <Link to={`/rentals?type=${vehicle.type}`}>
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Rental Vehicles */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Rentals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quality vehicles available for daily, weekly, or monthly rental
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {rentalVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/rentals?type=rental">
              <Button variant="outline" size="lg">
                View All Rentals
              </Button>
            </Link>
          </div>
        </div>

        {/* Sale Vehicles */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Vehicles for Sale
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quality pre-owned vehicles from trusted sellers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {saleVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/rentals?type=sale">
              <Button variant="outline" size="lg">
                View All Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
