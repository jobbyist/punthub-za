
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  
  -- KYC / verification
  age_verified BOOLEAN NOT NULL DEFAULT false,
  kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected')),
  government_id_url TEXT,
  bank_confirmation_url TEXT,
  proof_of_address_url TEXT,
  
  -- Social accounts
  social_twitter TEXT,
  social_discord TEXT,
  social_telegram TEXT,
  
  -- PuntPoints
  punt_points INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for trigger fallback)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Public can view basic profile info (for leaderboard)
CREATE POLICY "Public can view basic profiles"
  ON public.profiles FOR SELECT
  TO anon
  USING (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, display_name)
  VALUES (
    NEW.id,
    '@' || LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)), ' ', '')),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public) VALUES ('kyc-documents', 'kyc-documents', false);

-- KYC bucket policies
CREATE POLICY "Users can upload own KYC docs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own KYC docs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'avatars');

-- Support messages table
CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own support messages"
  ON public.support_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create support messages"
  ON public.support_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
