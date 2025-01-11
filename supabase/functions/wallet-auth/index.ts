import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { decode as decodeBase58 } from "https://deno.land/std@0.208.0/encoding/base58.ts"
import * as ed25519 from "https://esm.sh/@noble/ed25519@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  walletAddress?: string
  signature?: string
  nonce?: string
  action?: 'generate-nonce' | 'verify-signature'
  memeId?: string
  amount?: number
}

serve(async (req) => {
  console.log('Wallet auth function called:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body: RequestBody = await req.json()
    console.log('Request body:', {
      action: body.action,
      hasWalletAddress: !!body.walletAddress,
      hasSignature: !!body.signature,
      hasNonce: !!body.nonce,
      memeId: body.memeId,
      amount: body.amount,
      timestamp: new Date().toISOString()
    });

    // Generate nonce
    if (body.action === 'generate-nonce' && body.walletAddress) {
      
      const nonce = crypto.randomUUID()
      
      const { error: insertError } = await supabaseClient
        .from('WalletNonces')
        .insert([{ 
          nonce, 
          wallet_address: body.walletAddress,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
        }])

      if (insertError) {
        console.error('Error storing nonce:', {
          error: insertError,
          wallet: body.walletAddress,
          timestamp: new Date().toISOString()
        });
        return new Response(
          JSON.stringify({ error: 'Failed to generate nonce' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      console.log('Nonce generated successfully:', { 
        nonce,
        wallet: body.walletAddress,
        timestamp: new Date().toISOString()
      });
      return new Response(
        JSON.stringify({ nonce }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify signature
    if (body.action === 'verify-signature' && body.signature && body.nonce && body.walletAddress) {
      console.log('Starting signature verification process:', {
        walletAddress: body.walletAddress,
        nonceLength: body.nonce.length,
        signatureLength: body.signature.length,
        timestamp: new Date().toISOString()
      });

      // Verify nonce exists and hasn't expired
      const { data: nonceData, error: nonceError } = await supabaseClient
        .from('WalletNonces')
        .select('*')
        .eq('nonce', body.nonce)
        .eq('wallet_address', body.walletAddress)
        .eq('is_used', false)
        .single()

      if (nonceError || !nonceData) {
        console.error('Invalid or expired nonce:', {
          error: nonceError,
          wallet: body.walletAddress,
          timestamp: new Date().toISOString()
        });
        return new Response(
          JSON.stringify({ error: 'Invalid or expired nonce' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      try {
        console.log('Starting signature verification process');
        
        // Convert signature string to Uint8Array
        const signatureArray = body.signature.split(',').map(Number);
        const signatureBytes = new Uint8Array(signatureArray);
        
        // Convert wallet address to public key bytes
        const publicKeyBytes = decodeBase58(body.walletAddress);
        
        // Convert message to bytes
        const messageBytes = new TextEncoder().encode(body.nonce);

        console.log('Verification parameters:', {
          signatureLength: signatureBytes.length,
          publicKeyLength: publicKeyBytes.length,
          messageLength: messageBytes.length,
          nonce: body.nonce,
          timestamp: new Date().toISOString()
        });

        const isValid = await ed25519.verify(signatureBytes, messageBytes, publicKeyBytes);
        console.log('Signature verification result:', {
          isValid,
          timestamp: new Date().toISOString()
        });

        if (!isValid) {
          console.error('Invalid signature detected');
          return new Response(
            JSON.stringify({ error: 'Invalid signature' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        // After successful verification, log the transaction
        if (body.memeId && body.amount) {
          console.log('Logging transaction...', {
            walletAddress: body.walletAddress,
            memeId: body.memeId,
            amount: body.amount,
            timestamp: new Date().toISOString()
          });

          const logPayload = {
            user_id: body.walletAddress,
            meme_id: body.memeId,
            amount: body.amount,
            transaction_status: 'pending',
            wallet_address: body.walletAddress,
            created_at: new Date().toISOString()
          };

          const logResponse = await supabaseClient.functions.invoke('log-transaction', {
            body: logPayload
          });

          console.log('Transaction logging response:', {
            success: !logResponse.error,
            error: logResponse.error,
            data: logResponse.data,
            timestamp: new Date().toISOString()
          });

          if (logResponse.error) {
            console.error('Error logging transaction:', {
              error: logResponse.error,
              payload: logPayload,
              timestamp: new Date().toISOString()
            });
          }
        }

        // Mark nonce as used
        await supabaseClient
          .from('WalletNonces')
          .update({ is_used: true })
          .eq('nonce', body.nonce)

        console.log('Wallet verification completed successfully');
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Wallet verified successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Error verifying signature:', {
          error,
          wallet: body.walletAddress,
          timestamp: new Date().toISOString()
        });
        return new Response(
          JSON.stringify({ error: 'Failed to verify signature' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Unexpected error:', {
      error,
      timestamp: new Date().toISOString()
    });
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
