
-- Phase 2/3 schema additions

-- Verification status enum
DO $$ BEGIN
  CREATE TYPE public.verification_status AS ENUM ('unverified','pending','approved','rejected','resubmit');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Profile additions
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS preferred_currency TEXT NOT NULL DEFAULT 'ZAR',
  ADD COLUMN IF NOT EXISTS preferred_language TEXT NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'light',
  ADD COLUMN IF NOT EXISTS first_login_at TIMESTAMPTZ;

-- Deposits
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'ZAR',
  status TEXT NOT NULL DEFAULT 'pending',
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.deposits TO authenticated;
GRANT ALL ON public.deposits TO service_role;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users view own deposits" ON public.deposits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users create own deposits" ON public.deposits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Withdrawals
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  fee NUMERIC(14,2) NOT NULL DEFAULT 10.00,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  status TEXT NOT NULL DEFAULT 'pending',
  destination JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.withdrawals TO authenticated;
GRANT ALL ON public.withdrawals TO service_role;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Require verified to withdraw, enforce method limits
CREATE OR REPLACE FUNCTION public.check_withdrawal_eligibility()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_status public.verification_status;
BEGIN
  SELECT verification_status INTO v_status FROM public.profiles WHERE id = NEW.user_id;
  IF v_status IS DISTINCT FROM 'approved' THEN
    RAISE EXCEPTION 'Account must be verified before withdrawing';
  END IF;
  IF NEW.method IN ('1voucher','fnb_ewallet','absa_cashsend','sb_instant_money') AND NEW.amount > 3000 THEN
    RAISE EXCEPTION 'Method % limited to R3000 per transaction', NEW.method;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_withdrawal_eligibility ON public.withdrawals;
CREATE TRIGGER trg_withdrawal_eligibility BEFORE INSERT ON public.withdrawals
  FOR EACH ROW EXECUTE FUNCTION public.check_withdrawal_eligibility();

CREATE POLICY "users view own withdrawals" ON public.withdrawals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users create own withdrawals" ON public.withdrawals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Support tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own tickets" ON public.support_tickets FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Responsible gaming settings
CREATE TABLE IF NOT EXISTS public.responsible_gaming_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_deposit_limit NUMERIC(14,2),
  weekly_deposit_limit NUMERIC(14,2),
  monthly_deposit_limit NUMERIC(14,2),
  session_limit_minutes INT,
  reality_check_minutes INT,
  cooling_off_until TIMESTAMPTZ,
  self_excluded_until TIMESTAMPTZ,
  account_suspended BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.responsible_gaming_settings TO authenticated;
GRANT ALL ON public.responsible_gaming_settings TO service_role;
ALTER TABLE public.responsible_gaming_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own rg settings" ON public.responsible_gaming_settings FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Legal acceptances
CREATE TABLE IF NOT EXISTS public.legal_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document TEXT NOT NULL,
  version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.legal_acceptances TO authenticated;
GRANT ALL ON public.legal_acceptances TO service_role;
ALTER TABLE public.legal_acceptances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own legal" ON public.legal_acceptances FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- CV submissions (public form, anyone can submit)
CREATE TABLE IF NOT EXISTS public.cv_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cv_url TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.cv_submissions TO anon, authenticated;
GRANT ALL ON public.cv_submissions TO service_role;
ALTER TABLE public.cv_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit cv" ON public.cv_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Newsletter
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
