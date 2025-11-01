import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Gauge, Cog, Navigation, Calendar } from "lucide-react";
import type { Vehicle } from "@/pages/Rentals";

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: () => void;
}

const VehicleCard = ({ vehicle, onViewDetails }: VehicleCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-elegant transition-smooth">
      {/* Vehicle Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-3 right-3 bg-background/90 text-foreground">
          {vehicle.type}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Stock #{vehicle.stock_number}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-semibold">{vehicle.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="w-4 h-4" />
            <span>{vehicle.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cog className="w-4 h-4" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Navigation className="w-4 h-4" />
            <span>{vehicle.drive}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{vehicle.engine}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">${vehicle.price_per_day}</span>
            <span className="text-muted-foreground">/day</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            ${vehicle.price_per_week}/week
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button variant="outline" className="flex-1" onClick={onViewDetails}>
          View Details
        </Button>
        <Button className="flex-1" onClick={onViewDetails}>
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
