
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthCheckRequest {
  action: 'check_leak_protection' | 'check_mfa_status'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const body: AuthCheckRequest = await req.json()
    console.log('Auth config check request:', {
      action: body.action,
      timestamp: new Date().toISOString()
    })

    // Check if password leak protection is enabled
    if (body.action === 'check_leak_protection') {
      // In a production implementation, this would use the actual Supabase Management API
      // to check if leaked password protection is enabled
      // For this implementation, we'll use the REST API
      
      try {
        const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/admin/config`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch auth config: ${response.status}`);
        }
        
        const config = await response.json();
        console.log('Auth config retrieved:', config);
        
        // Check if password checking is enabled (this depends on the exact structure of the API response)
        const leakProtectionEnabled = config.security?.password_checks_enabled || false;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            leak_protection_enabled: leakProtectionEnabled 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } catch (error) {
        console.error('Error checking auth config:', error);
        
        // Fallback to default (pre-configured) value
        // In a real implementation, we should handle this error properly
        return new Response(
          JSON.stringify({ 
            success: false, 
            leak_protection_enabled: false,
            error: error.message
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Auth config check error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
