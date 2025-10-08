import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProviderRatingProps {
  providerId: string;
  providerName: string;
}

const ProviderRating = ({ providerId, providerName }: ProviderRatingProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          provider_id: providerId,
          rating,
          customer_name: customerName.trim(),
          review_text: reviewText.trim() || null,
          service_type: serviceType.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });

      // Reset form
      setRating(0);
      setReviewText('');
      setCustomerName('');
      setServiceType('');
      setOpen(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Star className="w-4 h-4 mr-2" />
          Rate Provider
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {providerName}</DialogTitle>
          <DialogDescription>
            Share your experience with this provider
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customer-name">Your Name *</Label>
            <Input
              id="customer-name"
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="service-type">Service Type (optional)</Label>
            <Input
              id="service-type"
              placeholder="e.g., Oil Change, Brake Repair"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            />
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review-text">Review (optional)</Label>
            <Textarea
              id="review-text"
              placeholder="Share details about your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderRating;
