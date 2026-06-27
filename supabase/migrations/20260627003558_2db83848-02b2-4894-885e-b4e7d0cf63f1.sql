
-- 1. Restrict profile PII exposure: drop anon SELECT-all policy, add safe public view
DROP POLICY IF EXISTS "Public can view basic profiles" ON public.profiles;

CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT id, username, display_name, avatar_url, punt_points, created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Allow anon/authenticated to read only the safe columns from profiles via view by adding a restrictive policy mirror
CREATE POLICY "Public can view safe profile fields"
ON public.profiles FOR SELECT
TO anon
USING (false);
-- (anon cannot read profiles directly; must use public_profiles view)

-- 2. Avatars bucket: drop broad SELECT (public bucket still served via public URL), add DELETE policy
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- 3. KYC documents: add UPDATE and DELETE policies scoped to owner folder
CREATE POLICY "Users can update own KYC docs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = (auth.uid())::text)
WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "Users can delete own KYC docs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- 4. Revoke EXECUTE on SECURITY DEFINER function from anon/authenticated/public
-- handle_new_user is only invoked by the auth trigger, not from API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
