import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Gauge, Cog, Navigation, Calendar, MapPin, Shield, XCircle, CheckCircle } from "lucide-react";
import BookingCalendar from "./BookingCalendar";
import VehicleCard from "./VehicleCard";
import type { Vehicle } from "@/pages/Rentals";

interface VehicleDetailsDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  similarVehicles: Vehicle[];
}

const VehicleDetailsDialog = ({ vehicle, open, onOpenChange, similarVehicles }: VehicleDetailsDialogProps) => {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </DialogTitle>
          <DialogDescription>Stock #{vehicle.stock_number} • VIN: {vehicle.vin}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="booking">Book Now</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Image Gallery */}
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={vehicle.images[0]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Rating and Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-semibold">{vehicle.rating}</span>
                </div>
                <Badge variant="outline">{vehicle.type}</Badge>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">${vehicle.price_per_day}/day</div>
                <div className="text-sm text-muted-foreground">${vehicle.price_per_week}/week</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">{vehicle.description}</p>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Gauge className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mileage</p>
                    <p className="font-medium">{vehicle.mileage.toLocaleString()} mi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Cog className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Engine</p>
                    <p className="font-medium">{vehicle.engine}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Transmission</p>
                    <p className="font-medium">{vehicle.transmission}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Drive</p>
                    <p className="font-medium">{vehicle.drive}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-medium">{vehicle.color}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interior */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Interior</h3>
              <p className="text-muted-foreground">{vehicle.interior}</p>
            </div>
          </TabsContent>

          <TabsContent value="booking" className="mt-6">
            <BookingCalendar vehicle={vehicle} />
          </TabsContent>

          <TabsContent value="policies" className="space-y-6 mt-6">
            {/* Rental Rules */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Rental Rules
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Minimum age requirement: 25 years old
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Valid driver's license and insurance required
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Security deposit required at pickup
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    No smoking allowed in vehicle
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Insurance Coverage */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Insurance Coverage
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Basic liability coverage included
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Collision damage waiver available for additional fee
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Roadside assistance included 24/7
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  Cancellation Policy
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Free cancellation up to 48 hours before pickup
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    50% refund for cancellations 24-48 hours before pickup
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    No refund for cancellations within 24 hours of pickup
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Vehicles */}
        {similarVehicles.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4">Similar Vehicles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {similarVehicles.slice(0, 2).map((similarVehicle) => (
                <VehicleCard
                  key={similarVehicle.id}
                  vehicle={similarVehicle}
                  onViewDetails={() => {
                    // This would typically update the dialog with the new vehicle
                    console.log("View similar vehicle:", similarVehicle.id);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
