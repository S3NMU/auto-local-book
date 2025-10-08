-- Create storage buckets for provider files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('provider-logos', 'provider-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('provider-photos', 'provider-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('provider-documents', 'provider-documents', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- RLS policies for provider-logos bucket
CREATE POLICY "Providers can upload their own logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'provider-logos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Providers can update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'provider-logos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Providers can delete their own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'provider-logos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'provider-logos');

-- RLS policies for provider-photos bucket
CREATE POLICY "Providers can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'provider-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Providers can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'provider-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Providers can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'provider-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'provider-photos');

-- RLS policies for provider-documents bucket (private)
CREATE POLICY "Providers can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'provider-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Providers can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'provider-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Providers can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'provider-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Providers can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'provider-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admin can view all documents
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'provider-documents' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);