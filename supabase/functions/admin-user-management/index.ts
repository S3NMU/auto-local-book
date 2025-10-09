import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Basic log to help debug in Supabase logs
  console.log('[admin-user-management] request received');

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Service-role client for privileged operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the caller is authenticated and capture their user id
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Validate and extract the user from the provided access token
    const { data: { user }, error: authError } = await adminClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is admin
    const { data: adminCheck } = await adminClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!adminCheck) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const action = (body?.action as string) || url.searchParams.get("action");

    switch (action) {
      case "list-users": {
        const { data: usersPage, error } = await adminClient.auth.admin.listUsers();
        if (error) throw error;

        // Get roles for each user
        const usersWithRoles = await Promise.all(
          (usersPage?.users || []).map(async (u: any) => {
            const { data: roles } = await adminClient
              .from('user_roles')
              .select('role')
              .eq('user_id', u.id);

            return {
              id: u.id,
              email: u.email || '',
              created_at: u.created_at,
              user_metadata: u.user_metadata,
              roles: roles || []
            };
          })
        );

        return new Response(JSON.stringify({ users: usersWithRoles }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create-user": {
        const { email, password, roles } = body as { email: string; password: string; roles?: string[] };

        // Create user
        const { data, error } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true
        });

        if (error) throw error;

        // Assign roles
        if (data.user && roles && roles.length > 0) {
          const roleInserts = roles.map((role: string) => ({
            user_id: data.user!.id,
            role: role
          }));

          const { error: roleError } = await adminClient
            .from('user_roles')
            .insert(roleInserts);

          if (roleError) throw roleError;
        }

        return new Response(JSON.stringify({ success: true, user: data.user }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update-roles": {
        const { userId, roles } = body as { userId: string; roles: string[] };

        // Delete existing roles
        await adminClient
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        // Insert new roles
        if (roles && roles.length > 0) {
          const roleInserts = roles.map((role: string) => ({
            user_id: userId,
            role: role
          }));

          const { error: roleError } = await adminClient
            .from('user_roles')
            .insert(roleInserts);

          if (roleError) throw roleError;
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "grant-role": {
        const { userId, role } = body as { userId: string; role: string };

        const { error } = await adminClient
          .from('user_roles')
          .insert({
            user_id: userId,
            role: role
          });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "revoke-role": {
        const { userId, role } = body as { userId: string; role: string };

        const { error } = await adminClient
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update-profile": {
        const { userId, email, full_name, phone } = body as { userId: string; email?: string; full_name?: string; phone?: string };

        // Update user email and metadata
        const updateData: any = {};
        if (email) updateData.email = email;
        updateData.user_metadata = {
          full_name: full_name || '',
          phone: phone || ''
        };

        const { data, error } = await adminClient.auth.admin.updateUserById(userId, updateData);
        if (error) throw error;

        return new Response(JSON.stringify({ success: true, user: data.user }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete-user": {
        const { userId } = body as { userId: string };

        const { error } = await adminClient.auth.admin.deleteUser(userId);
        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: any) {
    console.error("Error in admin-user-management function:", error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
