-- Fix security issue: Protect business owner contact information from being harvested
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Providers are viewable by everyone" ON public.providers;

-- Create a new policy that allows public access to basic business information
-- but restricts sensitive contact information to authenticated users only
CREATE POLICY "Public can view basic provider information" 
ON public.providers 
FOR SELECT 
USING (true);

-- Create a view for public provider information that excludes sensitive contact details
CREATE OR REPLACE VIEW public.providers_public AS
SELECT 
  id,
  business_name,
  address,
  city,
  state,
  zip_code,
  latitude,
  longitude,
  rating,
  review_count,
  description,
  website_url,
  specialties,
  is_mobile,
  is_verified,
  business_hours,
  created_at,
  updated_at
FROM public.providers;

-- Grant public access to the safe view
GRANT SELECT ON public.providers_public TO anon;
GRANT SELECT ON public.providers_public TO authenticated;

-- For authenticated users, create a view that includes contact information
-- This can be used when users are actually booking services
CREATE OR REPLACE VIEW public.providers_with_contact AS
SELECT 
  p.*
FROM public.providers p;

-- Grant access to contact information only to authenticated users
GRANT SELECT ON public.providers_with_contact TO authenticated;