-- Add custom service name field to provider_services table
ALTER TABLE public.provider_services 
ADD COLUMN custom_name TEXT;