-- Create providers table with location data
CREATE TABLE public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_mobile BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  business_hours JSONB,
  specialties TEXT[],
  description TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  base_price_min DECIMAL(8, 2),
  base_price_max DECIMAL(8, 2),
  duration_minutes INTEGER,
  is_mobile_available BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create provider_services junction table for pricing
CREATE TABLE public.provider_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  price_min DECIMAL(8, 2),
  price_max DECIMAL(8, 2),
  duration_minutes INTEGER,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id, service_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  service_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Providers are viewable by everyone" 
ON public.providers 
FOR SELECT 
USING (true);

CREATE POLICY "Services are viewable by everyone" 
ON public.services 
FOR SELECT 
USING (true);

CREATE POLICY "Provider services are viewable by everyone" 
ON public.provider_services 
FOR SELECT 
USING (true);

CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

-- Create indexes for geospatial queries
CREATE INDEX idx_providers_location ON public.providers (latitude, longitude);
CREATE INDEX idx_providers_city_state ON public.providers (city, state);
CREATE INDEX idx_providers_rating ON public.providers (rating DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_providers_updated_at
BEFORE UPDATE ON public.providers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert realistic services data
INSERT INTO public.services (name, category, description, base_price_min, base_price_max, duration_minutes, is_mobile_available) VALUES
('Oil Change', 'Maintenance', 'Standard oil change with filter replacement', 35.00, 89.99, 30, true),
('Brake Pad Replacement', 'Brakes', 'Front or rear brake pad replacement', 150.00, 400.00, 120, false),
('Brake Inspection', 'Brakes', 'Complete brake system inspection', 50.00, 100.00, 45, true),
('Tire Rotation', 'Tires', 'Rotate all four tires for even wear', 25.00, 60.00, 30, true),
('Tire Installation', 'Tires', 'Mount and balance new tires', 80.00, 200.00, 90, false),
('Battery Replacement', 'Electrical', 'Car battery replacement and testing', 120.00, 300.00, 45, true),
('Engine Diagnostic', 'Diagnostics', 'Computer diagnostic scan and analysis', 100.00, 200.00, 60, true),
('Transmission Service', 'Transmission', 'Transmission fluid change and inspection', 150.00, 350.00, 90, false),
('Air Filter Replacement', 'Maintenance', 'Engine air filter replacement', 25.00, 60.00, 15, true),
('Spark Plug Replacement', 'Engine', 'Replace spark plugs and inspect ignition system', 120.00, 300.00, 75, false),
('Coolant Flush', 'Cooling System', 'Complete coolant system flush and refill', 100.00, 200.00, 60, false),
('Power Steering Service', 'Steering', 'Power steering fluid change and inspection', 80.00, 150.00, 45, false),
('Wheel Alignment', 'Suspension', 'Four-wheel alignment service', 80.00, 200.00, 60, false),
('AC Service', 'Climate Control', 'Air conditioning inspection and recharge', 100.00, 250.00, 75, true),
('Windshield Wiper Replacement', 'Maintenance', 'Replace windshield wiper blades', 20.00, 50.00, 15, true);

-- Insert sample providers across major US cities
INSERT INTO public.providers (business_name, phone, address, city, state, zip_code, latitude, longitude, rating, review_count, is_mobile, specialties, description) VALUES
-- New York
('Manhattan Auto Care', '(212) 555-0101', '123 Broadway', 'New York', 'NY', '10001', 40.7589, -73.9851, 4.8, 124, false, ARRAY['Oil Change', 'Brake Service'], 'Full-service auto repair in Manhattan'),
('NYC Mobile Mechanic', '(718) 555-0102', 'Mobile Service', 'Brooklyn', 'NY', '11201', 40.6892, -73.9442, 4.6, 89, true, ARRAY['Diagnostics', 'Battery'], 'Mobile auto repair serving all boroughs'),

-- Los Angeles
('Hollywood Auto Repair', '(323) 555-0201', '456 Hollywood Blvd', 'Los Angeles', 'CA', '90028', 34.1022, -118.3267, 4.7, 156, false, ARRAY['Transmission', 'Engine Repair'], 'Trusted auto repair in Hollywood'),
('LA Mobile Service', '(310) 555-0202', 'Mobile Service', 'Santa Monica', 'CA', '90401', 34.0195, -118.4912, 4.9, 67, true, ARRAY['Oil Change', 'Tire Service'], 'Premium mobile auto service'),

-- Chicago
('Windy City Auto', '(312) 555-0301', '789 Michigan Ave', 'Chicago', 'IL', '60611', 41.8955, -87.6244, 4.5, 203, false, ARRAY['Brake Service', 'AC Service'], 'Complete automotive services downtown'),
('Chicago Mobile Repair', '(773) 555-0302', 'Mobile Service', 'Chicago', 'IL', '60614', 41.9242, -87.6431, 4.8, 91, true, ARRAY['Diagnostics', 'Battery'], 'Mobile mechanic serving Chicagoland'),

-- Houston
('Space City Auto', '(713) 555-0401', '321 Main St', 'Houston', 'TX', '77002', 29.7589, -95.3677, 4.6, 142, false, ARRAY['Oil Change', 'Transmission'], 'Houston premier auto service center'),
('Texas Mobile Mechanic', '(281) 555-0402', 'Mobile Service', 'Houston', 'TX', '77056', 29.7633, -95.4612, 4.7, 78, true, ARRAY['Engine Repair', 'Electrical'], 'Mobile auto repair across Houston'),

-- Phoenix
('Desert Auto Care', '(602) 555-0501', '654 Central Ave', 'Phoenix', 'AZ', '85004', 33.4484, -112.0740, 4.8, 118, false, ARRAY['AC Service', 'Cooling System'], 'Specializing in desert climate auto care'),
('Phoenix Mobile Service', '(480) 555-0502', 'Mobile Service', 'Scottsdale', 'AZ', '85251', 33.4942, -111.9261, 4.5, 63, true, ARRAY['Oil Change', 'Tire Service'], 'Mobile service for the Valley'),

-- Philadelphia
('Liberty Auto Repair', '(215) 555-0601', '987 Market St', 'Philadelphia', 'PA', '19107', 39.9526, -75.1652, 4.7, 134, false, ARRAY['Brake Service', 'Suspension'], 'Philly trusted auto repair since 1995'),

-- San Antonio
('Alamo Auto Service', '(210) 555-0701', '147 Commerce St', 'San Antonio', 'TX', '78205', 29.4241, -98.4936, 4.6, 97, false, ARRAY['Oil Change', 'Diagnostics'], 'Reliable service in the heart of San Antonio'),

-- San Diego
('Pacific Auto Care', '(619) 555-0801', '258 Harbor Dr', 'San Diego', 'CA', '92101', 32.7157, -117.1611, 4.9, 145, false, ARRAY['Engine Repair', 'Transmission'], 'San Diego premier auto service'),

-- Dallas
('Big D Auto Repair', '(214) 555-0901', '369 Elm St', 'Dallas', 'TX', '75202', 32.7767, -96.7970, 4.4, 189, false, ARRAY['Brake Service', 'AC Service'], 'Full-service auto repair in downtown Dallas');

-- Insert provider services relationships
INSERT INTO public.provider_services (provider_id, service_id, price_min, price_max, duration_minutes)
SELECT 
  p.id,
  s.id,
  s.base_price_min + (RANDOM() * 10 - 5), -- Slight price variation
  s.base_price_max + (RANDOM() * 20 - 10),
  s.duration_minutes + (RANDOM() * 20 - 10)::INTEGER
FROM public.providers p
CROSS JOIN public.services s
WHERE RANDOM() > 0.3; -- Each provider offers about 70% of services

-- Insert sample reviews
INSERT INTO public.reviews (provider_id, customer_name, rating, review_text, service_type)
SELECT 
  p.id,
  CASE (RANDOM() * 10)::INTEGER 
    WHEN 0 THEN 'John D.'
    WHEN 1 THEN 'Sarah M.'
    WHEN 2 THEN 'Mike R.'
    WHEN 3 THEN 'Lisa K.'
    WHEN 4 THEN 'David W.'
    WHEN 5 THEN 'Jennifer L.'
    WHEN 6 THEN 'Robert T.'
    WHEN 7 THEN 'Maria G.'
    WHEN 8 THEN 'James H.'
    ELSE 'Ashley P.'
  END,
  (4 + RANDOM())::INTEGER, -- Rating between 4-5
  CASE (RANDOM() * 5)::INTEGER
    WHEN 0 THEN 'Great service, very professional!'
    WHEN 1 THEN 'Quick and affordable, highly recommend.'
    WHEN 2 THEN 'Excellent work, will definitely return.'
    WHEN 3 THEN 'Very satisfied with the quality of service.'
    ELSE 'Outstanding customer service and fair pricing.'
  END,
  'Oil Change'
FROM public.providers p
WHERE RANDOM() > 0.5; -- About half the providers get reviews