import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Vehicle, VehicleFilters as Filters } from "@/pages/Rentals";

interface VehicleFiltersProps {
  vehicles: Vehicle[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const VehicleFilters = ({ vehicles, filters, onFiltersChange }: VehicleFiltersProps) => {
  const makes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
  const models = Array.from(new Set(vehicles.map((v) => v.model))).sort();
  const types = Array.from(new Set(vehicles.map((v) => v.type))).sort();

  const handleMakeToggle = (make: string) => {
    const newMakes = filters.make.includes(make)
      ? filters.make.filter((m) => m !== make)
      : [...filters.make, make];
    onFiltersChange({ ...filters, make: newMakes });
  };

  const handleModelToggle = (model: string) => {
    const newModels = filters.model.includes(model)
      ? filters.model.filter((m) => m !== model)
      : [...filters.model, model];
    onFiltersChange({ ...filters, model: newModels });
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.type.includes(type)
      ? filters.type.filter((t) => t !== type)
      : [...filters.type, type];
    onFiltersChange({ ...filters, type: newTypes });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      make: [],
      model: [],
      type: [],
      yearRange: [2020, 2025],
      priceRange: [0, 200],
    });
  };

  const hasActiveFilters =
    filters.make.length > 0 ||
    filters.model.length > 0 ||
    filters.type.length > 0 ||
    filters.yearRange[0] !== 2020 ||
    filters.yearRange[1] !== 2025 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 200;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Filters</CardTitle>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Vehicle Type */}
        <div className="space-y-3">
          <h3 className="font-semibold">Type</h3>
          {types.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.type.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
              />
              <Label htmlFor={`type-${type}`} className="cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>

        {/* Make */}
        <div className="space-y-3">
          <h3 className="font-semibold">Make</h3>
          {makes.map((make) => (
            <div key={make} className="flex items-center space-x-2">
              <Checkbox
                id={`make-${make}`}
                checked={filters.make.includes(make)}
                onCheckedChange={() => handleMakeToggle(make)}
              />
              <Label htmlFor={`make-${make}`} className="cursor-pointer">
                {make}
              </Label>
            </div>
          ))}
        </div>

        {/* Model */}
        <div className="space-y-3">
          <h3 className="font-semibold">Model</h3>
          {models.map((model) => (
            <div key={model} className="flex items-center space-x-2">
              <Checkbox
                id={`model-${model}`}
                checked={filters.model.includes(model)}
                onCheckedChange={() => handleModelToggle(model)}
              />
              <Label htmlFor={`model-${model}`} className="cursor-pointer">
                {model}
              </Label>
            </div>
          ))}
        </div>

        {/* Year Range */}
        <div className="space-y-3">
          <h3 className="font-semibold">Year</h3>
          <div className="px-2">
            <Slider
              min={2015}
              max={2025}
              step={1}
              value={filters.yearRange}
              onValueChange={(value) => onFiltersChange({ ...filters, yearRange: value as [number, number] })}
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{filters.yearRange[0]}</span>
              <span>{filters.yearRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h3 className="font-semibold">Price per Day</h3>
          <div className="px-2">
            <Slider
              min={0}
              max={200}
              step={5}
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleFilters;
