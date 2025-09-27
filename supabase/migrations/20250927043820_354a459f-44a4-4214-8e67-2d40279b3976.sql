-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create provider requests table
CREATE TABLE public.provider_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    owner_name TEXT,
    phone TEXT,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    description TEXT,
    website_url TEXT,
    specialties TEXT[],
    business_hours JSONB,
    is_mobile BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_by UUID REFERENCES auth.users(id),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on provider_requests
ALTER TABLE public.provider_requests ENABLE ROW LEVEL SECURITY;

-- Add status column to providers table for soft deletes
ALTER TABLE public.providers ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for provider_requests
CREATE POLICY "Users can view their own requests" 
ON public.provider_requests 
FOR SELECT 
USING (auth.uid() = submitted_by);

CREATE POLICY "Admins can view all requests" 
ON public.provider_requests 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can submit requests" 
ON public.provider_requests 
FOR INSERT 
WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Only admins can update requests" 
ON public.provider_requests 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Update providers table RLS policies for admin access
CREATE POLICY "Admins can manage all providers" 
ON public.providers 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Update provider_services RLS policies for admin access
CREATE POLICY "Admins can manage provider services" 
ON public.provider_services 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for provider_requests updated_at
CREATE TRIGGER update_provider_requests_updated_at
BEFORE UPDATE ON public.provider_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();