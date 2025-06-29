-- Auth schema'sını kontrol et ve düzelt
-- Bu kodu Supabase SQL Editor'de çalıştırın

-- Auth tabloları var mı kontrol et
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    AND table_name = 'users'
);

-- Auth users tablosunun yapısını kontrol et
\d auth.users;

-- Auth policies'i kontrol et
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'auth';

-- Public schema'daki RLS durumunu kontrol et
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'forum_%';

-- Eğer auth.users'a erişim sorunu varsa, geçici workaround
-- (Sadece auth sorunu varsa kullanın)

-- Forum tablolarında RLS'i tamamen kapat (geçici)
ALTER TABLE IF EXISTS public.forum_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.forum_topics DISABLE ROW LEVEL SECURITY; 
ALTER TABLE IF EXISTS public.forum_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.forum_votes DISABLE ROW LEVEL SECURITY;

-- Mevcut RLS policies'i kaldır
DROP POLICY IF EXISTS "Enable read access for categories" ON public.forum_categories;
DROP POLICY IF EXISTS "Enable read access for topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Enable insert for authenticated users on topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Enable update for topic owners" ON public.forum_topics;
DROP POLICY IF EXISTS "Enable delete for topic owners" ON public.forum_topics;
DROP POLICY IF EXISTS "Enable read access for posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users on posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Enable update for post owners" ON public.forum_posts;
DROP POLICY IF EXISTS "Enable delete for post owners" ON public.forum_posts;
DROP POLICY IF EXISTS "Enable read access for votes" ON public.forum_votes;
DROP POLICY IF EXISTS "Enable insert for authenticated users on votes" ON public.forum_votes;
DROP POLICY IF EXISTS "Enable update for vote owners" ON public.forum_votes;
DROP POLICY IF EXISTS "Enable delete for vote owners" ON public.forum_votes;

-- Test için basit bir user oluşturmayı dene
-- NOT: Bu sadece test amaçlı, production'da kullanmayın
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token) 
-- VALUES (gen_random_uuid(), 'test@example.com', crypt('123456', gen_salt('bf')), now(), now(), now(), '', '', '', '');

-- Authentication service durumunu kontrol et
SELECT current_setting('app.settings.auth.external_url', true) as auth_external_url;
SELECT current_setting('app.settings.auth.jwt_secret', true) as jwt_secret_exists; 