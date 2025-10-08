-- Add is_featured column to providers table
ALTER TABLE public.providers 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_providers_featured ON public.providers(is_featured) WHERE is_featured = true;