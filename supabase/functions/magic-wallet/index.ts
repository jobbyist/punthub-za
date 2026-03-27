import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const magicKey = Deno.env.get('MAGIC_PUBLISHABLE_KEY');

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'get-config') {
      return new Response(JSON.stringify({
        success: true,
        publishableKey: magicKey || '',
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'deposit') {
      const { amount } = body;
      if (!amount || amount <= 0) {
        return new Response(JSON.stringify({ error: 'Invalid amount' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { error: txError } = await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        type: 'deposit',
        amount,
        currency: 'ZAR',
        status: 'completed',
      });

      if (txError) throw txError;

      // Update wallet balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      const newBalance = (profile?.wallet_balance || 0) + amount;
      await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', user.id);

      return new Response(JSON.stringify({ success: true, balance: newBalance }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'withdraw') {
      const { amount } = body;
      if (!amount || amount <= 0) {
        return new Response(JSON.stringify({ error: 'Invalid amount' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      if ((profile?.wallet_balance || 0) < amount) {
        return new Response(JSON.stringify({ error: 'Insufficient balance' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { error: txError } = await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        type: 'withdrawal',
        amount: -amount,
        currency: 'ZAR',
        status: 'completed',
      });

      if (txError) throw txError;

      const newBalance = (profile?.wallet_balance || 0) - amount;
      await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', user.id);

      return new Response(JSON.stringify({ success: true, balance: newBalance }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'balance') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_balance, punt_points')
        .eq('id', user.id)
        .single();

      return new Response(JSON.stringify({
        success: true,
        balance: profile?.wallet_balance || 0,
        puntPoints: profile?.punt_points || 0,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
