import { supabase } from "@/integrations/supabase/client";

export const marketsApi = {
  async fetchMarkets(category?: string, search?: string) {
    let query = supabase
      .from('markets')
      .select('*')
      .eq('is_active', true)
      .order('volume_num', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('question', `%${search}%`);
    }

    const { data, error } = await query.limit(200);
    if (error) throw error;
    return data || [];
  },

  async syncPolymarketEvents() {
    const { data, error } = await supabase.functions.invoke('polymarket-events');
    if (error) throw error;
    return data;
  },

  async placePrediction(marketId: string, position: 'yes' | 'no', amount: number, priceAtPrediction: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.from('predictions').insert({
      user_id: user.id,
      market_id: marketId,
      position,
      amount,
      price_at_prediction: priceAtPrediction,
    }).select().single();

    if (error) throw error;
    return data;
  },

  async getUserPredictions() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('predictions')
      .select('*, markets(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
