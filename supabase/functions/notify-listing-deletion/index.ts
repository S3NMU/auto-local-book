import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  listingId: string;
  providerId: string;
  listingType: "rental" | "sale";
  listingTitle: string;
  reason: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[notify-listing-deletion] Request received');

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is admin
    const { data: adminCheck } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!adminCheck) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { listingId, providerId, listingType, listingTitle, reason }: NotificationRequest = await req.json();

    console.log('[notify-listing-deletion] Processing notification for:', { listingId, listingType });

    // Get provider email from auth.users
    const { data: providerAuth, error: providerError } = await supabase.auth.admin.getUserById(providerId);
    
    if (providerError || !providerAuth?.user?.email) {
      console.error('[notify-listing-deletion] Error fetching provider email:', providerError);
      throw new Error("Provider email not found");
    }

    const providerEmail = providerAuth.user.email;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error('[notify-listing-deletion] RESEND_API_KEY not configured');
      throw new Error("Email service not configured");
    }

    // Send email notification using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "H3 Automo <onboarding@resend.dev>",
        to: [providerEmail],
        subject: `Your ${listingType === 'rental' ? 'Rental' : 'Vehicle Sale'} Listing Has Been Removed`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Listing Removal Notification</h1>
            
            <p>Hello,</p>
            
            <p>We're writing to inform you that your ${listingType === 'rental' ? 'rental vehicle' : 'vehicle for sale'} listing has been removed from H3 Automo.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #666;">Listing Details</h3>
              <p style="margin: 5px 0;"><strong>Title:</strong> ${listingTitle}</p>
              <p style="margin: 5px 0;"><strong>Type:</strong> ${listingType === 'rental' ? 'Rental Vehicle' : 'Vehicle for Sale'}</p>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="margin-top: 0; color: #856404;">Reason for Removal</h3>
              <p style="margin: 0; color: #856404;">${reason}</p>
            </div>
            
            <p>If you have any questions or concerns about this removal, please contact our support team.</p>
            
            <p style="margin-top: 30px;">Best regards,<br>The H3 Automo Team</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999;">
              This is an automated notification from H3 Automo. Please do not reply to this email.
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('[notify-listing-deletion] Email API error:', errorText);
      throw new Error(`Email service error: ${errorText}`);
    }

    const emailData = await emailResponse.json();
    console.log('[notify-listing-deletion] Email sent successfully:', emailData);

    return new Response(JSON.stringify({ 
      success: true,
      messageId: emailData.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('[notify-listing-deletion] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
