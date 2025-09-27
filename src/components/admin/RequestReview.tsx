import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

interface ProviderRequest {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  description: string;
  website_url: string;
  specialties: string[];
  is_mobile: boolean;
  status: string;
  created_at: string;
  submitted_by: string;
}

export const RequestReview = () => {
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: ProviderRequest) => {
    try {
      // Create provider from request
      const { error: providerError } = await supabase
        .from('providers')
        .insert({
          business_name: request.business_name,
          owner_name: request.owner_name,
          phone: request.phone,
          email: request.email,
          address: request.address,
          city: request.city,
          state: request.state,
          zip_code: request.zip_code,
          latitude: request.latitude,
          longitude: request.longitude,
          description: request.description,
          website_url: request.website_url,
          specialties: request.specialties,
          is_mobile: request.is_mobile,
          status: 'active',
        });

      if (providerError) throw providerError;

      // Update request status
      const { error: updateError } = await supabase
        .from('provider_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Request approved and provider created",
      });

      fetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('provider_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Request rejected",
      });

      fetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No provider requests found.
        </div>
      ) : (
        requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{request.business_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Submitted {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(request.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Owner:</strong> {request.owner_name}</p>
                    <p><strong>Phone:</strong> {request.phone}</p>
                    <p><strong>Email:</strong> {request.email}</p>
                    {request.website_url && (
                      <p className="flex items-center gap-1">
                        <strong>Website:</strong>
                        <a
                          href={request.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <div className="space-y-1 text-sm">
                    <p>{request.address}</p>
                    <p>{request.city}, {request.state} {request.zip_code}</p>
                    <p><strong>Coordinates:</strong> {request.latitude}, {request.longitude}</p>
                    <p><strong>Mobile Service:</strong> {request.is_mobile ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {request.description && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                </div>
              )}

              {request.specialties && request.specialties.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {request.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => handleApprove(request)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(request.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};