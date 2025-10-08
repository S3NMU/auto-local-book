-- Update RLS policies for reviews table to allow authenticated users to submit reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can submit reviews" ON public.reviews;

CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can submit reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to update provider rating when a review is added
CREATE OR REPLACE FUNCTION public.update_provider_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the provider's rating and review count
  UPDATE public.providers
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews
      WHERE provider_id = NEW.provider_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update provider ratings
DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_provider_rating();