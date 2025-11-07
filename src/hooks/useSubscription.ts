import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const SUBSCRIPTION_TIERS = {
  basic: {
    product_id: 'prod_TNPoMPh5dXDr1V',
    price_id: 'price_1SQezF2F0WT0jEz9ItJkO5JQ',
    name: 'Basic',
    price: 29,
    features: [
      'Customer Management',
      'Basic Booking System',
      'Revenue Tracking',
      'Email Support'
    ]
  },
  pro: {
    product_id: 'prod_TNPpKggZBeHFgD',
    price_id: 'price_1SQeza2F0WT0jEz9ET20xvdq',
    name: 'Pro',
    price: 99,
    features: [
      'Everything in Basic',
      'Advanced Analytics',
      'Automated Workflows',
      'Priority Support',
      'Custom Branding'
    ]
  }
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user) {
      setSubscribed(false);
      setProductId(null);
      setSubscriptionEnd(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscribed(data.subscribed || false);
      setProductId(data.product_id || null);
      setSubscriptionEnd(data.subscription_end || null);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscribed(false);
      setProductId(null);
      setSubscriptionEnd(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();

    // Auto-refresh every minute
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const getTierName = () => {
    if (!productId) return null;
    if (productId === SUBSCRIPTION_TIERS.basic.product_id) return 'basic';
    if (productId === SUBSCRIPTION_TIERS.pro.product_id) return 'pro';
    return null;
  };

  return {
    subscribed,
    productId,
    subscriptionEnd,
    loading,
    tierName: getTierName(),
    refreshSubscription: checkSubscription,
  };
};
