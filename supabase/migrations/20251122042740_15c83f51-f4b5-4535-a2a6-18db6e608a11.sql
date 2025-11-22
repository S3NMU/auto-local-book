-- Add is_featured column to rental_vehicles
ALTER TABLE public.rental_vehicles
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Add is_featured column to vehicles_for_sale
ALTER TABLE public.vehicles_for_sale
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX idx_rental_vehicles_featured ON public.rental_vehicles(is_featured) WHERE is_featured = true AND deleted_at IS NULL;
CREATE INDEX idx_vehicles_for_sale_featured ON public.vehicles_for_sale(is_featured) WHERE is_featured = true AND deleted_at IS NULL;