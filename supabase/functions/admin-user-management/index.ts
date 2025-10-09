import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the caller is an admin
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

    const url = new URL(req.url);
    const body = await req.json();
    const action = body.action || url.searchParams.get("action");

    switch (action) {
      case "list-users": {
        const { data: users, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;

        // Get roles for each user
        const usersWithRoles = await Promise.all(
          users.users.map(async (user) => {
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id);

            return {
              id: user.id,
              email: user.email || '',
              created_at: user.created_at,
              user_metadata: user.user_metadata,
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
        const { email, password, roles } = body;

        // Create user
        const { data, error } = await supabase.auth.admin.createUser({
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

          const { error: roleError } = await supabase
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
        const { userId, roles } = body;

        // Delete existing roles
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        // Insert new roles
        if (roles && roles.length > 0) {
          const roleInserts = roles.map((role: string) => ({
            user_id: userId,
            role: role
          }));

          const { error: roleError } = await supabase
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
        const { userId, role } = body;

        const { error } = await supabase
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
        const { userId, role } = body;

        const { error } = await supabase
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
        const { userId, email, full_name, phone } = body;

        // Update user email and metadata
        const updateData: any = {};
        
        if (email) {
          updateData.email = email;
        }
        
        updateData.user_metadata = {
          full_name: full_name || '',
          phone: phone || ''
        };

        const { data, error } = await supabase.auth.admin.updateUserById(userId, updateData);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, user: data.user }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete-user": {
        const { userId } = body;

        const { error } = await supabase.auth.admin.deleteUser(userId);
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);