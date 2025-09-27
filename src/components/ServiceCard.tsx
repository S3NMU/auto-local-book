import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, MapPin, Star } from "lucide-react";

interface ServiceCardProps {
  title: string;
  provider: string;
  location: string;
  price: string;
  duration: string;
  rating: number;
  reviewCount: number;
  image: string;
  isMobileAvailable?: boolean;
  isPopular?: boolean;
}

const ServiceCard = ({
  title,
  provider,
  location,
  price,
  duration,
  rating,
  reviewCount,
  image,
  isMobileAvailable = false,
  isPopular = false,
}: ServiceCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-card hover:shadow-hover transition-smooth border border-border overflow-hidden group">
      {/* Image */}
      <div className="relative">
        <img 
          src={image} 
          alt={`${title} service`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {isPopular && (
            <Badge variant="default" className="bg-accent text-accent-foreground">
              Popular
            </Badge>
          )}
          {isMobileAvailable && (
            <Badge variant="secondary">
              Mobile Service
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-md">
          <span className="text-lg font-bold text-foreground">{price}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1">{title}</h3>
          <p className="text-primary font-medium">{provider}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-accent fill-accent" />
            <span className="text-sm font-medium text-foreground mr-1">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="hero" size="sm" className="flex-1">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;