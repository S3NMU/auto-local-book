-- Add is_approved column to provider_profiles for approval workflow
ALTER TABLE public.provider_profiles
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT null;

-- Create index for faster queries on pending approvals
CREATE INDEX IF NOT EXISTS idx_provider_profiles_is_approved 
ON public.provider_profiles(is_approved) 
WHERE is_approved IS NULL;