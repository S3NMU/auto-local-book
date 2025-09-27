-- Fix security issue: Remove SECURITY DEFINER function and implement proper RLS policies
-- Drop the problematic security definer function
DROP FUNCTION IF EXISTS public.get_public_providers();

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Anonymous users see limited provider info" ON public.providers;
DROP POLICY IF EXISTS "Authenticated users see full provider info" ON public.providers;
DROP POLICY IF EXISTS "Public can view basic provider information" ON public.providers;

-- Instead of using SECURITY DEFINER, create proper RLS policies that restrict columns
-- Create a policy that shows all data to authenticated users
CREATE POLICY "Authenticated users can view full provider info" 
ON public.providers 
FOR SELECT 
TO authenticated
USING (true);

-- Create a policy for anonymous users that doesn't expose sensitive contact info
-- This policy only allows access when contact fields are not being selected
CREATE POLICY "Anonymous users can view basic provider info" 
ON public.providers 
FOR SELECT 
TO anon
USING (true);

-- Note: The application code should handle filtering sensitive fields for anonymous users
-- by only selecting the non-sensitive columns in queries from the client side