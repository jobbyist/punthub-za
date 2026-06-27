
REVOKE EXECUTE ON FUNCTION public.check_withdrawal_eligibility() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "anyone can submit cv" ON public.cv_submissions;
CREATE POLICY "anyone can submit cv" ON public.cv_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (length(full_name) BETWEEN 2 AND 120 AND email ~* '^.+@.+\..+$' AND length(email) <= 255);

DROP POLICY IF EXISTS "anyone subscribe" ON public.newsletter_subscribers;
CREATE POLICY "anyone subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (email ~* '^.+@.+\..+$' AND length(email) <= 255);
