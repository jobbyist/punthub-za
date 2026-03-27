import { supabase } from "@/integrations/supabase/client";

export const walletApi = {
  async getConfig() {
    const { data, error } = await supabase.functions.invoke('magic-wallet', {
      body: { action: 'get-config' },
    });
    if (error) throw error;
    return data;
  },

  async getBalance() {
    const { data, error } = await supabase.functions.invoke('magic-wallet', {
      body: { action: 'balance' },
    });
    if (error) throw error;
    return data;
  },

  async deposit(amount: number) {
    const { data, error } = await supabase.functions.invoke('magic-wallet', {
      body: { action: 'deposit', amount },
    });
    if (error) throw error;
    return data;
  },

  async withdraw(amount: number) {
    const { data, error } = await supabase.functions.invoke('magic-wallet', {
      body: { action: 'withdraw', amount },
    });
    if (error) throw error;
    return data;
  },
};
