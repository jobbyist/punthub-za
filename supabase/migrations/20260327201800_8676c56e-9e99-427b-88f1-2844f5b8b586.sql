-- Markets table for prediction events
CREATE TABLE public.markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'General',
  image_url text,
  image_emoji text DEFAULT '📊',
  yes_price numeric(5,4) NOT NULL DEFAULT 0.5000,
  volume text DEFAULT '$0',
  volume_num numeric DEFAULT 0,
  end_date timestamptz,
  trending text DEFAULT 'neutral',
  source text DEFAULT 'punthub',
  polymarket_id text,
  is_active boolean DEFAULT true,
  resolved boolean DEFAULT false,
  resolution text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active markets" ON public.markets
  FOR SELECT USING (is_active = true);

-- User predictions
CREATE TABLE public.predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  market_id uuid NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  position text NOT NULL,
  amount integer NOT NULL DEFAULT 0,
  price_at_prediction numeric(5,4) NOT NULL,
  status text DEFAULT 'active',
  payout integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, market_id)
);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions" ON public.predictions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create predictions" ON public.predictions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions" ON public.predictions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Wallet transactions
CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'ZAR',
  status text DEFAULT 'pending',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.wallet_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions" ON public.wallet_transactions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Add wallet_balance to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_balance numeric DEFAULT 0;

-- Enable realtime for markets
ALTER PUBLICATION supabase_realtime ADD TABLE public.markets;