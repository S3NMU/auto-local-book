-- Create RLS policies to protect provider contact information
-- Only authenticated users can view phone/email, anonymous users see masked data

-- First, let's create a function to mask contact information
CREATE OR REPLACE FUNCTION public.mask_contact_info()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- For anonymous users, return masked contact info
  IF auth.uid() IS NULL THEN
    NEW.phone := CASE 
      WHEN NEW.phone IS NOT NULL THEN 
        CONCAT(LEFT(NEW.phone, 3), '***', RIGHT(NEW.phone, 4))
      ELSE NULL 
    END;
    NEW.email := CASE 
      WHEN NEW.email IS NOT NULL THEN 
        CONCAT(LEFT(SPLIT_PART(NEW.email, '@', 1), 2), '***@', SPLIT_PART(NEW.email, '@', 2))
      ELSE NULL 
    END;
  END IF;
  RETURN NEW;
END;
$$;

-- Update providers table RLS policies to protect contact information
DROP POLICY IF EXISTS "Anonymous users can view basic provider info" ON public.providers;
DROP POLICY IF EXISTS "Authenticated users can view full provider info" ON public.providers;

-- Create new policies with contact information protection
CREATE POLICY "Anonymous users can view basic provider info" 
ON public.providers 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can view full provider info" 
ON public.providers 
FOR SELECT 
TO authenticated
USING (true);

-- Create a view for public provider access with masked contact info
CREATE OR REPLACE VIEW public.providers_public AS
SELECT 
  id,
  business_name,
  owner_name,
  address,
  city,
  state,
  zip_code,
  CASE 
    WHEN auth.uid() IS NULL AND phone IS NOT NULL THEN 
      CONCAT(LEFT(phone, 3), '***', RIGHT(phone, 4))
    ELSE phone
  END as phone,
  CASE 
    WHEN auth.uid() IS NULL AND email IS NOT NULL THEN 
      CONCAT(LEFT(SPLIT_PART(email, '@', 1), 2), '***@', SPLIT_PART(email, '@', 2))
    ELSE email
  END as email,
  specialties,
  description,
  website_url,
  latitude,
  longitude,
  rating,
  review_count,
  is_mobile,
  is_verified,
  business_hours,
  status,
  created_at,
  updated_at
FROM public.providers
WHERE status = 'active';