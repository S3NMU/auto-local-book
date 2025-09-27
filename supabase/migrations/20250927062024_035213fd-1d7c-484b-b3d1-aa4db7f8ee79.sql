-- Add provider role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'provider';

-- Create provider profiles table for additional provider information
CREATE TABLE public.provider_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  business_name TEXT,
  business_description TEXT,
  business_phone TEXT,
  business_address TEXT,
  business_city TEXT,
  business_state TEXT,
  business_zip_code TEXT,
  specialties TEXT[],
  years_experience INTEGER,
  license_number TEXT,
  is_mobile_service BOOLEAN DEFAULT false,
  service_radius_miles INTEGER DEFAULT 25,
  business_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on provider_profiles
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for provider_profiles
CREATE POLICY "Providers can view and update their own profile" 
ON public.provider_profiles 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all provider profiles" 
ON public.provider_profiles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create bookings table for tracking service appointments
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  customer_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  service_type TEXT NOT NULL,
  service_description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  price_quoted NUMERIC(10,2),
  price_final NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  location_address TEXT,
  location_city TEXT,
  location_state TEXT,
  location_zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Providers can manage their own bookings" 
ON public.bookings 
FOR ALL 
USING (provider_id = auth.uid());

CREATE POLICY "Customers can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (customer_id = auth.uid());

CREATE POLICY "Admin can view all bookings" 
ON public.bookings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create revenue_entries table for tracking income
CREATE TABLE public.revenue_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  booking_id UUID,
  amount NUMERIC(10,2) NOT NULL,
  description TEXT NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  is_paid BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on revenue_entries
ALTER TABLE public.revenue_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for revenue_entries
CREATE POLICY "Providers can manage their own revenue entries" 
ON public.revenue_entries 
FOR ALL 
USING (provider_id = auth.uid());

CREATE POLICY "Admin can view all revenue entries" 
ON public.revenue_entries 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create customer_records table for provider customer management
CREATE TABLE public.customer_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_vin TEXT,
  notes TEXT,
  last_service_date DATE,
  total_services INTEGER DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id, customer_email)
);

-- Enable RLS on customer_records
ALTER TABLE public.customer_records ENABLE ROW LEVEL SECURITY;

-- Create policies for customer_records
CREATE POLICY "Providers can manage their own customer records" 
ON public.customer_records 
FOR ALL 
USING (provider_id = auth.uid());

CREATE POLICY "Admin can view all customer records" 
ON public.customer_records 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at columns
CREATE TRIGGER update_provider_profiles_updated_at
BEFORE UPDATE ON public.provider_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_revenue_entries_updated_at
BEFORE UPDATE ON public.revenue_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_records_updated_at
BEFORE UPDATE ON public.customer_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();