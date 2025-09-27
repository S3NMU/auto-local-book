-- Fix security definer view issue by removing SECURITY DEFINER from the view
-- and creating a proper function instead

-- Drop the problematic view
DROP VIEW IF EXISTS public.providers_public;

-- Create a secure function to get provider data with proper contact masking
CREATE OR REPLACE FUNCTION public.get_providers_with_contact_protection()
RETURNS TABLE (
  id uuid,
  business_name text,
  owner_name text,
  address text,
  city text,
  state text,
  zip_code text,
  phone text,
  email text,
  specialties text[],
  description text,
  website_url text,
  latitude numeric,
  longitude numeric,
  rating numeric,
  review_count integer,
  is_mobile boolean,
  is_verified boolean,
  business_hours jsonb,
  status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.business_name,
    p.owner_name,
    p.address,
    p.city,
    p.state,
    p.zip_code,
    CASE 
      WHEN auth.uid() IS NULL AND p.phone IS NOT NULL THEN 
        CONCAT(LEFT(p.phone, 3), '***', RIGHT(p.phone, 4))
      ELSE p.phone
    END as phone,
    CASE 
      WHEN auth.uid() IS NULL AND p.email IS NOT NULL THEN 
        CONCAT(LEFT(SPLIT_PART(p.email, '@', 1), 2), '***@', SPLIT_PART(p.email, '@', 2))
      ELSE p.email
    END as email,
    p.specialties,
    p.description,
    p.website_url,
    p.latitude,
    p.longitude,
    p.rating,
    p.review_count,
    p.is_mobile,
    p.is_verified,
    p.business_hours,
    p.status,
    p.created_at,
    p.updated_at
  FROM public.providers p
  WHERE p.status = 'active';
$$;

-- Remove the mask_contact_info function as it's not needed anymore
DROP FUNCTION IF EXISTS public.mask_contact_info();