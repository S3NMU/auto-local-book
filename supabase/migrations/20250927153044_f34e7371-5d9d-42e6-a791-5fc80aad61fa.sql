-- First, let's enhance the provider_services table to include currency support
ALTER TABLE provider_services 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS pickup_available BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pickup_fee DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS dropoff_available BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS dropoff_fee DECIMAL(10,2) DEFAULT 0.00;

-- Update the bookings table to include more detailed information
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS pickup_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pickup_address TEXT,
ADD COLUMN IF NOT EXISTS dropoff_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS dropoff_address TEXT,
ADD COLUMN IF NOT EXISTS pickup_fee DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS dropoff_fee DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS service_ids TEXT[], -- Array of service IDs
ADD COLUMN IF NOT EXISTS total_service_cost DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS additional_fees DECIMAL(10,2) DEFAULT 0.00;