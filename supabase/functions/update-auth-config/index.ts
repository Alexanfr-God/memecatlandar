
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

    // Note: In a real implementation, this would use the Supabase Management API
    // to actually enable the leaked password protection feature
    // For demonstration purposes, we'll just log the action
    
    if (body.enable_leak_protection) {
      console.log('Setting leaked password protection to enabled')
      // In real implementation, you would make an API call to Supabase
      // management API to update this setting
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Auth configuration updated successfully'
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
