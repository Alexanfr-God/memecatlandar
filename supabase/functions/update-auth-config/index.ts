
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthUpdateRequest {
  enable_leak_protection?: boolean
  enable_mfa?: boolean
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

    const body: AuthUpdateRequest = await req.json()
    console.log('Auth config update request:', {
      enableLeakProtection: body.enable_leak_protection,
      enableMFA: body.enable_mfa,
      timestamp: new Date().toISOString()
    })

    // If leak protection is requested to be enabled
    if (body.enable_leak_protection) {
      console.log('Enabling leaked password protection');
      
      try {
        // Update the auth config to enable password checking
        const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/admin/config`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          },
          body: JSON.stringify({
            security: {
              password_checks_enabled: true
            }
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update auth config: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Auth config update result:', result);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Auth configuration updated successfully'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } catch (error) {
        console.error('Error updating auth config:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to update auth configuration',
            error: error.message
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'No changes were requested to auth configuration'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Auth config update error:', error)
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
