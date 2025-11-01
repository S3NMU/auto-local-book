import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleCard from "@/components/rental/VehicleCard";
import VehicleFilters from "@/components/rental/VehicleFilters";
import VehicleDetailsDialog from "@/components/rental/VehicleDetailsDialog";

export type VehicleListingType = "rental" | "sale";

// Mock data - will be replaced with Supabase data
const mockVehicles = [
  {
    id: "1",
    listing_type: "rental" as VehicleListingType,
    make: "Toyota",
    model: "Camry",
    year: 2023,
    type: "Sedan",
    price_per_day: 45,
    price_per_week: 280,
    sale_price: null,
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
    listing_type: "rental" as VehicleListingType,
    make: "Honda",
    model: "CR-V",
    year: 2024,
    type: "SUV",
    price_per_day: 65,
    price_per_week: 400,
    sale_price: null,
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
    listing_type: "rental" as VehicleListingType,
    make: "Ford",
    model: "F-150",
    year: 2023,
    type: "Truck",
    price_per_day: 85,
    price_per_week: 520,
    sale_price: null,
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
  // For Sale Vehicles
  {
    id: "4",
    listing_type: "sale" as VehicleListingType,
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    type: "Sedan",
    price_per_day: 0,
    price_per_week: 0,
    sale_price: 18500,
    mileage: 28000,
    engine: "1.8L 4-Cylinder",
    transmission: "CVT",
    drive: "FWD",
    vin: "2T1BURHE5NC123456",
    stock_number: "TC2022-004",
    images: ["/placeholder.svg"],
    color: "White",
    interior: "Gray Cloth",
    rating: 4.7,
    features: ["Backup Camera", "Lane Departure Warning", "Adaptive Cruise Control", "LED Headlights"],
    description: "Certified pre-owned 2022 Toyota Corolla with low mileage and excellent condition.",
  },
  {
    id: "5",
    listing_type: "sale" as VehicleListingType,
    make: "Mazda",
    model: "CX-5",
    year: 2023,
    type: "SUV",
    price_per_day: 0,
    price_per_week: 0,
    sale_price: 32900,
    mileage: 15000,
    engine: "2.5L 4-Cylinder Turbo",
    transmission: "6-Speed Automatic",
    drive: "AWD",
    vin: "JM3KFBDM8N0123456",
    stock_number: "MCX2023-005",
    images: ["/placeholder.svg"],
    color: "Red",
    interior: "Black Leather",
    rating: 4.9,
    features: ["Premium Sound System", "Panoramic Sunroof", "360° Camera", "Power Liftgate"],
    description: "Like-new 2023 Mazda CX-5 with premium features and all-wheel drive capability.",
  },
  {
    id: "6",
    listing_type: "sale" as VehicleListingType,
    make: "Chevrolet",
    model: "Silverado",
    year: 2021,
    type: "Truck",
    price_per_day: 0,
    price_per_week: 0,
    sale_price: 42500,
    mileage: 35000,
    engine: "5.3L V8",
    transmission: "8-Speed Automatic",
    drive: "4WD",
    vin: "1GCUYGEL3MZ123456",
    stock_number: "CS2021-006",
    images: ["/placeholder.svg"],
    color: "Silver",
    interior: "Black Leather",
    rating: 4.5,
    features: ["Tow Package", "Spray-In Bedliner", "Heated Seats", "Apple CarPlay"],
    description: "Well-maintained 2021 Chevrolet Silverado with towing package and leather interior.",
  },
];

export interface Vehicle {
  id: string;
  listing_type: VehicleListingType;
  make: string;
  model: string;
  year: number;
  type: string;
  price_per_day: number;
  price_per_week: number;
  sale_price: number | null;
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
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const [listingType, setListingType] = useState<VehicleListingType>(
    typeParam === "sale" ? "sale" : "rental"
  );
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

  // Update listing type when URL parameter changes
  useEffect(() => {
    if (typeParam === "sale") {
      setListingType("sale");
    } else if (typeParam === "rental") {
      setListingType("rental");
    }
  }, [typeParam]);

  const currentVehicles = vehicles.filter((v) => v.listing_type === listingType);

  const filteredVehicles = currentVehicles.filter((vehicle) => {
    const matchesSearch =
      searchQuery === "" ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMake = filters.make.length === 0 || filters.make.includes(vehicle.make);
    const matchesModel = filters.model.length === 0 || filters.model.includes(vehicle.model);
    const matchesType = filters.type.length === 0 || filters.type.includes(vehicle.type);
    const matchesYear = vehicle.year >= filters.yearRange[0] && vehicle.year <= filters.yearRange[1];
    
    let matchesPrice = true;
    if (listingType === "rental") {
      matchesPrice = vehicle.price_per_day >= filters.priceRange[0] && vehicle.price_per_day <= filters.priceRange[1];
    } else {
      matchesPrice = vehicle.sale_price !== null && 
                    vehicle.sale_price >= filters.priceRange[0] * 1000 && 
                    vehicle.sale_price <= filters.priceRange[1] * 1000;
    }

    return matchesSearch && matchesMake && matchesModel && matchesType && matchesYear && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {listingType === "rental" ? "Rent a Vehicle" : "Buy a Vehicle"}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            {listingType === "rental" 
              ? "Choose from our wide selection of rental vehicles. Competitive rates, flexible terms, and exceptional service."
              : "Find your perfect vehicle from our quality inventory. Thoroughly inspected, competitively priced, and ready to drive."}
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
        {/* Listing Type Tabs */}
        <Tabs value={listingType} onValueChange={(value) => setListingType(value as VehicleListingType)} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="rental">For Rent</TabsTrigger>
            <TabsTrigger value="sale">For Sale</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <VehicleFilters 
              vehicles={currentVehicles} 
              filters={filters} 
              onFiltersChange={setFilters} 
              listingType={listingType}
            />
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
                    listingType={listingType}
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
        listingType={listingType}
        open={!!selectedVehicle}
        onOpenChange={(open) => !open && setSelectedVehicle(null)}
        similarVehicles={currentVehicles.filter(
          (v) => v.id !== selectedVehicle?.id && v.type === selectedVehicle?.type
        )}
      />
    </div>
  );
};

export default Rentals;
