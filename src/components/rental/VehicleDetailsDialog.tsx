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
import { Star, Gauge, Cog, Navigation, Calendar, MapPin, Shield, XCircle, CheckCircle, DollarSign } from "lucide-react";
import BookingCalendar from "./BookingCalendar";
import VehicleCard from "./VehicleCard";
import type { Vehicle, VehicleListingType } from "@/pages/Rentals";

interface VehicleDetailsDialogProps {
  vehicle: Vehicle | null;
  listingType: VehicleListingType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  similarVehicles: Vehicle[];
}

const VehicleDetailsDialog = ({ vehicle, listingType, open, onOpenChange, similarVehicles }: VehicleDetailsDialogProps) => {
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
            <TabsTrigger value="booking">{listingType === "rental" ? "Book Now" : "Inquire"}</TabsTrigger>
            <TabsTrigger value="policies">{listingType === "rental" ? "Policies" : "Info"}</TabsTrigger>
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
                {listingType === "rental" ? (
                  <>
                    <div className="text-3xl font-bold text-primary">${vehicle.price_per_day}/day</div>
                    <div className="text-sm text-muted-foreground">${vehicle.price_per_week}/week</div>
                  </>
                ) : (
                  <div className="flex items-baseline justify-end gap-2">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <div className="text-3xl font-bold text-primary">
                      {vehicle.sale_price?.toLocaleString()}
                    </div>
                  </div>
                )}
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
            {listingType === "rental" ? (
              <BookingCalendar vehicle={vehicle} />
            ) : (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg mb-4">Interested in this vehicle?</h3>
                  <p className="text-muted-foreground">
                    Contact us to schedule a test drive or get more information about this vehicle.
                  </p>
                  <div className="space-y-2 pt-4">
                    <Button className="w-full" size="lg">Schedule Test Drive</Button>
                    <Button className="w-full" variant="outline" size="lg">Contact Sales</Button>
                  </div>
                  <div className="border-t pt-4 mt-4 space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Stock Number:</span>
                      <span className="font-medium">{vehicle.stock_number}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">VIN:</span>
                      <span className="font-medium">{vehicle.vin}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="policies" className="space-y-6 mt-6">
            {listingType === "rental" ? (
              <>
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
              </>
            ) : (
              <>
                {/* Vehicle History */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Vehicle Inspection & History
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        Comprehensive multi-point inspection completed
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        Clean vehicle history report available
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        No accidents or damage reported
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        Complete service records maintained
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Warranty */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Warranty & Protection
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        30-day limited warranty included
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        Extended warranty options available
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        7-day return policy if not satisfied
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Financing */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Financing Options
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        Flexible financing plans available
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        Trade-in options accepted
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        Pre-approval available online
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
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
                  listingType={listingType}
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
