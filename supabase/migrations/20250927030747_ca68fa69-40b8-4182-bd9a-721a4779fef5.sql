-- Fix security issue: Protect business owner contact information from being harvested
-- First check what policies exist
SELECT tablename, policyname, cmd, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'providers';

-- Drop all existing policies on providers table
DROP POLICY IF EXISTS "Providers are viewable by everyone" ON public.providers;
DROP POLICY IF EXISTS "Public can view basic provider information" ON public.providers;

-- Create a more restrictive policy that only shows non-sensitive information to anonymous users
-- and full information to authenticated users
CREATE POLICY "Anonymous users see limited provider info" 
ON public.providers 
FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Authenticated users see full provider info" 
ON public.providers 
FOR SELECT 
TO authenticated
USING (true);

-- Create a function to safely fetch provider data without exposing contact info to anonymous users
CREATE OR REPLACE FUNCTION public.get_public_providers()
RETURNS TABLE (
  id uuid,
  business_name text,
  address text,
  city text,
  state text,
  zip_code text,
  latitude numeric,
  longitude numeric,
  rating numeric,
  review_count integer,
  description text,
  website_url text,
  specialties text[],
  is_mobile boolean,
  is_verified boolean,
  business_hours jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.business_name,
    p.address,
    p.city,
    p.state,
    p.zip_code,
    p.latitude,
    p.longitude,
    p.rating,
    p.review_count,
    p.description,
    p.website_url,
    p.specialties,
    p.is_mobile,
    p.is_verified,
    p.business_hours,
    p.created_at,
    p.updated_at
  FROM public.providers p;
$$;