import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import VehicleCard from "@/components/rental/VehicleCard";
import VehicleFilters from "@/components/rental/VehicleFilters";
import VehicleDetailsDialog from "@/components/rental/VehicleDetailsDialog";

// Mock data - will be replaced with Supabase data
const mockVehicles = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    type: "Sedan",
    price_per_day: 45,
    price_per_week: 280,
    mileage: 15000,
    engine: "2.5L 4-Cylinder",
    transmission: "Automatic",
    drive: "FWD",
    vin: "1HGBH41JXMN109186",
    stock_number: "TC2023-001",
    images: ["/placeholder.svg"],
    color: "Silver",
    interior: "Black Cloth",
    rating: 4.5,
    features: ["Backup Camera", "Bluetooth", "Cruise Control", "USB Ports"],
    description: "Well-maintained 2023 Toyota Camry with excellent fuel economy and reliability.",
  },
  {
    id: "2",
    make: "Honda",
    model: "CR-V",
    year: 2024,
    type: "SUV",
    price_per_day: 65,
    price_per_week: 400,
    mileage: 8000,
    engine: "1.5L Turbo",
    transmission: "CVT",
    drive: "AWD",
    vin: "2HKRW2H88NH123456",
    stock_number: "HCV2024-002",
    images: ["/placeholder.svg"],
    color: "Blue",
    interior: "Gray Leather",
    rating: 4.8,
    features: ["Apple CarPlay", "Lane Assist", "Sunroof", "Heated Seats"],
    description: "Brand new 2024 Honda CR-V with advanced safety features and spacious interior.",
  },
  {
    id: "3",
    make: "Ford",
    model: "F-150",
    year: 2023,
    type: "Truck",
    price_per_day: 85,
    price_per_week: 520,
    mileage: 12000,
    engine: "3.5L V6 EcoBoost",
    transmission: "10-Speed Automatic",
    drive: "4WD",
    vin: "1FTFW1E84NFA12345",
    stock_number: "FF2023-003",
    images: ["/placeholder.svg"],
    color: "Black",
    interior: "Black Leather",
    rating: 4.6,
    features: ["Towing Package", "Bed Liner", "4x4", "Navigation"],
    description: "Powerful 2023 Ford F-150 perfect for hauling and towing needs.",
  },
];

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  price_per_day: number;
  price_per_week: number;
  mileage: number;
  engine: string;
  transmission: string;
  drive: string;
  vin: string;
  stock_number: string;
  images: string[];
  color: string;
  interior: string;
  rating: number;
  features: string[];
  description: string;
}

export interface VehicleFilters {
  make: string[];
  model: string[];
  type: string[];
  yearRange: [number, number];
  priceRange: [number, number];
}

const Rentals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<VehicleFilters>({
    make: [],
    model: [],
    type: [],
    yearRange: [2020, 2025],
    priceRange: [0, 200],
  });
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicles] = useState<Vehicle[]>(mockVehicles);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      searchQuery === "" ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMake = filters.make.length === 0 || filters.make.includes(vehicle.make);
    const matchesModel = filters.model.length === 0 || filters.model.includes(vehicle.model);
    const matchesType = filters.type.length === 0 || filters.type.includes(vehicle.type);
    const matchesYear = vehicle.year >= filters.yearRange[0] && vehicle.year <= filters.yearRange[1];
    const matchesPrice =
      vehicle.price_per_day >= filters.priceRange[0] && vehicle.price_per_day <= filters.priceRange[1];

    return matchesSearch && matchesMake && matchesModel && matchesType && matchesYear && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rent a Vehicle</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Choose from our wide selection of vehicles. Competitive rates, flexible terms, and exceptional service.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-background text-foreground"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <VehicleFilters vehicles={vehicles} filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Vehicle Listings */}
          <main className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {filteredVehicles.length} Vehicle{filteredVehicles.length !== 1 ? "s" : ""} Available
              </h2>
            </div>

            {filteredVehicles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No vehicles match your criteria.</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onViewDetails={() => setSelectedVehicle(vehicle)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Vehicle Details Dialog */}
      <VehicleDetailsDialog
        vehicle={selectedVehicle}
        open={!!selectedVehicle}
        onOpenChange={(open) => !open && setSelectedVehicle(null)}
        similarVehicles={vehicles.filter(
          (v) => v.id !== selectedVehicle?.id && v.type === selectedVehicle?.type
        )}
      />
    </div>
  );
};

export default Rentals;
