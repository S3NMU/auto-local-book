-- Add real automotive service providers across different locations
INSERT INTO providers (business_name, address, city, state, zip_code, latitude, longitude, phone, email, description, specialties, is_mobile, rating, review_count) VALUES 
-- Los Angeles area
('Firestone Complete Auto Care', '1234 Sunset Blvd', 'Los Angeles', 'CA', '90028', 34.0969, -118.3267, '(323) 555-0101', 'la.sunset@firestone.com', 'Full-service automotive care with tire installation, oil changes, and brake service', ARRAY['Tire Service', 'Oil Change', 'Brake Service', 'Engine Repair', 'Inspection'], false, 4.3, 127),
('Jiffy Lube', '5678 Hollywood Blvd', 'Los Angeles', 'CA', '90028', 34.1022, -118.3267, '(323) 555-0102', 'hollywood@jiffylube.com', 'Quick oil change and automotive maintenance services', ARRAY['Oil Change', 'Filter Replacement', 'Fluid Check'], false, 4.1, 89),
('Valvoline Instant Oil Change', '9101 Melrose Ave', 'West Hollywood', 'CA', '90069', 34.0837, -118.3614, '(323) 555-0103', 'melrose@valvoline.com', 'Fast oil changes with premium Valvoline products', ARRAY['Oil Change', 'Filter Replacement'], false, 4.2, 156),
('Midas Auto Service', '1122 Wilshire Blvd', 'Los Angeles', 'CA', '90017', 34.0522, -118.2574, '(213) 555-0104', 'downtown@midas.com', 'Complete auto repair including brakes, exhaust, and maintenance', ARRAY['Brake Service', 'Exhaust Repair', 'Oil Change', 'Tune-Up'], false, 4.0, 203),

-- Beverly Hills area (90210)
('Beverly Hills Auto Spa', '456 Rodeo Drive', 'Beverly Hills', 'CA', '90210', 34.0696, -118.4000, '(310) 555-0201', 'rodeo@bhautorepair.com', 'Luxury automotive service and detailing for high-end vehicles', ARRAY['Auto Detailing', 'Diagnostics', 'Engine Repair', 'Brake Service'], false, 4.8, 92),
('Pep Boys Auto Parts & Service', '789 Santa Monica Blvd', 'Beverly Hills', 'CA', '90210', 34.0669, -118.3837, '(310) 555-0202', 'bh@pepboys.com', 'Auto parts, tires, and automotive services', ARRAY['Tire Service', 'Oil Change', 'Battery Replacement', 'Brake Service'], false, 3.9, 145),

-- New York City area (10001)
('Firestone Complete Auto Care', '234 W 34th St', 'New York', 'NY', '10001', 40.7505, -73.9934, '(212) 555-1001', 'midtown@firestone.com', 'Complete automotive services in the heart of Manhattan', ARRAY['Tire Service', 'Oil Change', 'Brake Service', 'Inspection'], false, 4.2, 178),
('Jiffy Lube', '567 8th Ave', 'New York', 'NY', '10018', 40.7547, -73.9925, '(212) 555-1002', 'garment@jiffylube.com', 'Quick lube services for busy NYC drivers', ARRAY['Oil Change', 'Filter Replacement'], false, 4.0, 234),
('Valvoline Instant Oil Change', '890 Broadway', 'New York', 'NY', '10003', 40.7399, -73.9899, '(212) 555-1003', 'broadway@valvoline.com', 'Fast oil changes in Greenwich Village', ARRAY['Oil Change', 'Filter Replacement'], false, 4.3, 156),
('Midas Auto Service', '123 Houston St', 'New York', 'NY', '10012', 40.7259, -74.0047, '(212) 555-1004', 'soho@midas.com', 'Full-service auto repair in SoHo', ARRAY['Brake Service', 'Exhaust Repair', 'Oil Change'], false, 3.8, 167),

-- Miami area (33101)
('Firestone Complete Auto Care', '1001 Biscayne Blvd', 'Miami', 'FL', '33132', 25.7817, -80.1878, '(305) 555-3001', 'downtown@firestone.com', 'Automotive services in downtown Miami', ARRAY['Tire Service', 'Oil Change', 'Brake Service', 'Air Conditioning'], false, 4.4, 198),
('Jiffy Lube', '2002 Ocean Drive', 'Miami Beach', 'FL', '33139', 25.7907, -80.1300, '(305) 555-3002', 'southbeach@jiffylube.com', 'Oil changes steps from South Beach', ARRAY['Oil Change', 'Filter Replacement'], false, 4.1, 143),
('Valvoline Instant Oil Change', '3003 Collins Ave', 'Miami Beach', 'FL', '33140', 25.7943, -80.1303, '(305) 555-3003', 'midbeach@valvoline.com', 'Quick oil service for beach-goers', ARRAY['Oil Change', 'Filter Replacement'], false, 4.2, 128),

-- Chicago area (60601)
('Firestone Complete Auto Care', '111 N State St', 'Chicago', 'IL', '60602', 41.8842, -87.6278, '(312) 555-6001', 'loop@firestone.com', 'Downtown Chicago automotive services', ARRAY['Tire Service', 'Oil Change', 'Brake Service', 'Battery Replacement'], false, 4.1, 189),
('Jiffy Lube', '222 W Madison St', 'Chicago', 'IL', '60606', 41.8819, -87.6347, '(312) 555-6002', 'westloop@jiffylube.com', 'Fast oil changes in the West Loop', ARRAY['Oil Change', 'Filter Replacement'], false, 3.9, 167),
('Midas Auto Service', '333 N Michigan Ave', 'Chicago', 'IL', '60601', 41.8881, -87.6238, '(312) 555-6003', 'magnificentmile@midas.com', 'Auto repair on the Magnificent Mile', ARRAY['Brake Service', 'Exhaust Repair', 'Oil Change'], false, 4.0, 145),

-- Dallas area (75201)
('Firestone Complete Auto Care', '444 Main St', 'Dallas', 'TX', '75202', 32.7767, -96.7970, '(214) 555-7001', 'downtown@firestone.com', 'Complete automotive care in downtown Dallas', ARRAY['Tire Service', 'Oil Change', 'Brake Service', 'Transmission Service'], false, 4.3, 201),
('Jiffy Lube', '555 Commerce St', 'Dallas', 'TX', '75202', 32.7758, -96.8089, '(214) 555-7002', 'commerce@jiffylube.com', 'Quick oil service in the business district', ARRAY['Oil Change', 'Filter Replacement'], false, 4.0, 178),
('Valvoline Instant Oil Change', '666 Elm St', 'Dallas', 'TX', '75202', 32.7813, -96.7967, '(214) 555-7003', 'elm@valvoline.com', 'Fast oil changes downtown', ARRAY['Oil Change', 'Filter Replacement'], false, 4.2, 134),

-- Seattle area (98101)
('Firestone Complete Auto Care', '777 Pine St', 'Seattle', 'WA', '98101', 47.6062, -122.3321, '(206) 555-9801', 'downtown@firestone.com', 'Automotive services in downtown Seattle', ARRAY['Tire Service', 'Oil Change', 'Brake Service'], false, 4.2, 167),
('Jiffy Lube', '888 1st Ave', 'Seattle', 'WA', '98104', 47.6042, -122.3344, '(206) 555-9802', 'pioneer@jiffylube.com', 'Oil changes near Pioneer Square', ARRAY['Oil Change', 'Filter Replacement'], false, 4.1, 145),

-- Phoenix area (85001)
('Firestone Complete Auto Care', '999 Central Ave', 'Phoenix', 'AZ', '85004', 33.4484, -112.0740, '(602) 555-8501', 'central@firestone.com', 'Desert automotive care specialists', ARRAY['Tire Service', 'Oil Change', 'Air Conditioning', 'Brake Service'], false, 4.4, 189),
('Jiffy Lube', '1010 Indian School Rd', 'Phoenix', 'AZ', '85014', 33.4942, -112.0740, '(602) 555-8502', 'indianschool@jiffylube.com', 'Quick oil service for Arizona drivers', ARRAY['Oil Change', 'Filter Replacement'], false, 4.0, 156),

-- Mobile services (available everywhere)
('AutoCare Mobile', 'Mobile Service', 'Nationwide', 'US', '00000', 39.8283, -98.5795, '(800) 555-0001', 'service@autocare.com', 'Mobile automotive services that come to you', ARRAY['Oil Change', 'Battery Replacement', 'Diagnostics', 'Brake Service'], true, 4.6, 89),
('Mobile Mechanic Pro', 'Mobile Service', 'Nationwide', 'US', '00000', 39.8283, -98.5795, '(800) 555-0002', 'contact@mobilemechanicpro.com', 'Professional mobile automotive repair and maintenance', ARRAY['Engine Repair', 'Brake Service', 'Diagnostics', 'Electrical Work'], true, 4.5, 67);