-- Create rental_vehicles table
CREATE TABLE public.rental_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  daily_rate NUMERIC(10,2) NOT NULL,
  mileage INTEGER,
  transmission TEXT,
  fuel_type TEXT,
  seats INTEGER,
  features TEXT[],
  images TEXT[],
  availability_status TEXT NOT NULL DEFAULT 'available',
  location_city TEXT,
  location_state TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  deletion_reason TEXT
);

-- Create vehicles_for_sale table
CREATE TABLE public.vehicles_for_sale (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  mileage INTEGER,
  vin TEXT,
  transmission TEXT,
  fuel_type TEXT,
  body_type TEXT,
  exterior_color TEXT,
  interior_color TEXT,
  features TEXT[],
  images TEXT[],
  condition TEXT,
  location_city TEXT,
  location_state TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  deletion_reason TEXT
);

-- Enable RLS
ALTER TABLE public.rental_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles_for_sale ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rental_vehicles
CREATE POLICY "Anyone can view active rentals"
  ON public.rental_vehicles FOR SELECT
  USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Providers can manage their own rentals"
  ON public.rental_vehicles FOR ALL
  USING (provider_id = auth.uid());

CREATE POLICY "Admins can manage all rentals"
  ON public.rental_vehicles FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for vehicles_for_sale
CREATE POLICY "Anyone can view active vehicles for sale"
  ON public.vehicles_for_sale FOR SELECT
  USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Providers can manage their own vehicles for sale"
  ON public.vehicles_for_sale FOR ALL
  USING (provider_id = auth.uid());

CREATE POLICY "Admins can manage all vehicles for sale"
  ON public.vehicles_for_sale FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_rental_vehicles_updated_at
  BEFORE UPDATE ON public.rental_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_for_sale_updated_at
  BEFORE UPDATE ON public.vehicles_for_sale
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();