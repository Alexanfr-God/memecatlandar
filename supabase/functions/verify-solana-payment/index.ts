import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const LAMPORTS_PER_SOL = 1000000000; // 1 SOL = 1 billion lamports

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Clone request for multiple reads
    const reqClone = req.clone();
    const reqData = await reqClone.json();
    console.log('Received verification request:', {
      ...reqData,
      user_id: '[REDACTED]'
    });

    const { transaction_signature, expected_amount, meme_id, user_id } = reqData;
    const solscanApiToken = Deno.env.get('SOLSCAN_API_TOKEN')!;
    
    // Wait for transaction to be indexed by Solscan
    console.log('Waiting for transaction to be indexed...');
    await delay(5000); // Wait 5 seconds
    
    // Verify transaction on Solscan
    const solscanResponse = await fetch(
      `https://public-api.solscan.io/transaction/${transaction_signature}`,
      { headers: { 'token': solscanApiToken } }
    );

    if (!solscanResponse.ok) {
      throw new Error(`Solscan API error: ${solscanResponse.status}`);
    }

    const transactionData = await solscanResponse.json();
    console.log('Solscan response:', transactionData);
    
    if (!transactionData || transactionData.status !== 'Success') {
      throw new Error('Transaction failed or not found');
    }

    // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
    const transactionAmount = Number((transactionData.lamport / LAMPORTS_PER_SOL).toFixed(9));
    console.log('Transaction amount:', transactionAmount, 'SOL', 'Expected:', expected_amount, 'SOL');
    
    // Allow for small rounding differences (within 0.000000001 SOL)
    if (Math.abs(transactionAmount - expected_amount) > 0.000000001) {
      throw new Error(`Invalid amount: expected ${expected_amount} SOL, got ${transactionAmount} SOL`);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    console.log('Updating meme status:', {
      meme_id,
      tuzemoonUntil
    });

    // First update the meme status
    const { error: memeError } = await supabase
      .from('Memes')
      .update({
        is_featured: true,
        tuzemoon_until: tuzemoonUntil
      })
      .eq('id', meme_id);

    if (memeError) {
      console.error('Error updating meme:', memeError);
      throw memeError;
    }

    // Then log successful transaction
    const { error: logError } = await supabase
      .from('TransactionLogs')
      .insert({
        user_id,
        meme_id,
        transaction_status: 'success',
        amount: expected_amount,
        transaction_signature,
        wallet_address: transactionData.signer
      });

    if (logError) {
      console.error('Error logging transaction:', logError);
      // Don't throw here, as the main operation succeeded
    }

    console.log('Verification completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verified and meme updated successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Verification error:', error);
    
    try {
      const reqData = await req.json();
      const { user_id, meme_id } = reqData;
      
      if (user_id && meme_id) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        await supabase
          .from('TransactionLogs')
          .insert({
            user_id,
            meme_id,
            transaction_status: 'failed',
            error_message: error.message
          });
      }
    } catch (logError) {
      console.error('Error creating error log:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: 'Payment verification failed'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 400 
      }
    );
  }
})