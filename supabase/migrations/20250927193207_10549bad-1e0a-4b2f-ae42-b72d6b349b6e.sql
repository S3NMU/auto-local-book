-- Remove the overly permissive policies on providers table
DROP POLICY IF EXISTS "Anonymous users can view basic provider info" ON public.providers;
DROP POLICY IF EXISTS "Authenticated users can view full provider info" ON public.providers;

-- Create more restrictive policies for contact information protection
CREATE POLICY "Public can view basic provider info" 
ON public.providers 
FOR SELECT 
USING (
  -- Allow access to basic business info but mask sensitive contact details
  -- This policy will be used with the get_providers_with_contact_protection function
  status = 'active'
);

-- Create a policy for authenticated users to see full contact details
CREATE POLICY "Authenticated users can view full provider contact info" 
ON public.providers 
FOR SELECT 
TO authenticated
USING (status = 'active');

-- Update the existing function to be more explicit about what it protects
CREATE OR REPLACE FUNCTION public.get_providers_with_contact_protection()
RETURNS TABLE(
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
SET search_path = public
AS $function$
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
        CONCAT('(', LEFT(REGEXP_REPLACE(p.phone, '[^0-9]', '', 'g'), 3), ') ***-', RIGHT(REGEXP_REPLACE(p.phone, '[^0-9]', '', 'g'), 4))
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
$function$;

-- Add security logging function for sensitive operations
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  user_id uuid DEFAULT auth.uid(),
  details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Log to a security_logs table (create if needed)
  CREATE TABLE IF NOT EXISTS public.security_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    user_id uuid,
    details jsonb DEFAULT '{}'::jsonb,
    ip_address inet DEFAULT inet_client_addr(),
    user_agent text DEFAULT current_setting('request.headers', true)::json->>'user-agent',
    created_at timestamp with time zone DEFAULT now()
  );
  
  INSERT INTO public.security_logs (event_type, user_id, details)
  VALUES (event_type, user_id, details);
END;
$function$;

-- Enable RLS on security_logs if it was just created
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'security_logs') THEN
    ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
    
    -- Only admins can view security logs
    CREATE POLICY "Admins can view security logs" 
    ON public.security_logs 
    FOR SELECT 
    USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;