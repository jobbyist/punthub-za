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

    // Fetch events from Polymarket Gamma API (public, no auth needed)
    const response = await fetch(
      'https://gamma-api.polymarket.com/events?limit=100&active=true&order=volume&ascending=false',
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('Polymarket API error:', response.status, text);
      return new Response(
        JSON.stringify({ success: false, error: `Polymarket API returned ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const events = await response.json();

    const categoryMap: Record<string, string> = {
      'politics': 'Politics',
      'crypto': 'Crypto',
      'sports': 'Sports',
      'pop-culture': 'Entertainment',
      'science': 'Science',
      'business': 'Finance',
      'tech': 'Tech',
    };

    const emojiMap: Record<string, string> = {
      'Politics': '🗳️',
      'Crypto': '₿',
      'Sports': '⚽',
      'Entertainment': '🎬',
      'Science': '🔬',
      'Finance': '📈',
      'Tech': '💻',
      'General': '📊',
    };

    let upsertCount = 0;

    for (const event of events) {
      const markets = event.markets || [];
      for (const market of markets) {
        const slug = (event.slug || '').toLowerCase();
        let category = 'General';
        for (const [key, val] of Object.entries(categoryMap)) {
          if (slug.includes(key) || (market.groupItemTitle || '').toLowerCase().includes(key)) {
            category = val;
            break;
          }
        }

        const yesPrice = market.outcomePrices
          ? parseFloat(JSON.parse(market.outcomePrices)[0] || '0.5')
          : 0.5;

        const volumeNum = parseFloat(market.volume || '0');
        const volumeStr = volumeNum >= 1_000_000
          ? `$${(volumeNum / 1_000_000).toFixed(1)}M`
          : volumeNum >= 1_000
          ? `$${(volumeNum / 1_000).toFixed(0)}K`
          : `$${volumeNum.toFixed(0)}`;

        const trendVal = market.volumeCloseOnly
          ? parseFloat(market.volumeCloseOnly) > 0 ? 'up' : 'down'
          : 'neutral';

        const { error } = await supabase.from('markets').upsert({
          polymarket_id: market.conditionId || market.id,
          question: market.question || event.title,
          description: market.description || event.description || '',
          category,
          image_emoji: emojiMap[category] || '📊',
          image_url: event.image || null,
          yes_price: Math.max(0.01, Math.min(0.99, yesPrice)),
          volume: volumeStr,
          volume_num: volumeNum,
          end_date: market.endDate || event.endDate || null,
          trending: trendVal,
          source: 'polymarket',
          is_active: market.active !== false,
        }, { onConflict: 'polymarket_id' });

        if (error) {
          console.error('Upsert error:', error.message);
        } else {
          upsertCount++;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, upserted: upsertCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
