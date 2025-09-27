-- Add vehicle transportation columns to provider_profiles table
ALTER TABLE provider_profiles 
ADD COLUMN IF NOT EXISTS pickup_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS dropoff_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pickup_fee NUMERIC(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS dropoff_fee NUMERIC(10,2) DEFAULT 0.00;