import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const email = 'admin@globalid.com';
    const password = 'Admin@123456';

    // Check if admin role already exists
    const { count: adminCount } = await supabaseAdmin
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    if ((adminCount || 0) > 0) {
      return new Response(
        JSON.stringify({ error: 'An admin already exists.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);
    
    let userId: string;

    if (existingUser) {
      // User exists, use their ID
      userId = existingUser.id;
      console.log('User already exists, assigning admin role');
    } else {
      // Create new admin user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: 'Admin User'
        }
      });

      if (authError) {
        console.error('Error creating admin user:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      userId = authData.user.id;

      // Create profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          full_name: 'Admin User',
          email: email
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin'
      });

    if (roleError) {
      console.error('Error assigning admin role:', roleError);
      throw roleError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        email,
        password,
        message: 'Admin account created successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Create admin error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
