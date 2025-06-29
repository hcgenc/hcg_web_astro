-- COMPLETE USERS SYSTEM - VERİ TİPLERİ DÜZELTİLMİŞ
-- Supabase SQL Editor'de tamamını seçip çalıştırın

-- ==============================================
-- STEP 1: TEMIZLEME (Mevcut tabloları sil)
-- ==============================================

-- Önce foreign key constraint'leri kaldır
DO $$
BEGIN
    -- Forum constraint'lerini kaldır
    IF EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_name = 'forum_topics_author_id_fkey') THEN
        ALTER TABLE public.forum_topics DROP CONSTRAINT forum_topics_author_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_name = 'forum_posts_author_id_fkey') THEN
        ALTER TABLE public.forum_posts DROP CONSTRAINT forum_posts_author_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_name = 'forum_votes_voter_id_fkey') THEN
        ALTER TABLE public.forum_votes DROP CONSTRAINT forum_votes_voter_id_fkey;
    END IF;
END
$$;

-- Function'ları sil
DROP FUNCTION IF EXISTS public.login_user(text, text);
DROP FUNCTION IF EXISTS public.register_user(text, text, text);
DROP FUNCTION IF EXISTS public.validate_session(text);
DROP FUNCTION IF EXISTS public.hash_password(text);

-- Tabloları sil
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ==============================================
-- STEP 2: USERS TABLOSU OLUŞTUR
-- ==============================================

CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================
-- STEP 3: USER SESSIONS TABLOSU OLUŞTUR
-- ==============================================

CREATE TABLE public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- STEP 4: INDEKSLER
-- ==============================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_active ON public.users(is_active);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires ON public.user_sessions(expires_at);

-- ==============================================
-- STEP 5: RLS AYARLARI
-- ==============================================

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions DISABLE ROW LEVEL SECURITY;

-- ==============================================
-- STEP 6: PASSWORD HASH FUNCTION
-- ==============================================

CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text AS $$
BEGIN
    RETURN encode(digest(password || 'cosmic_salt_2024', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STEP 7: LOGIN FUNCTION (TİPLER DÜZELTİLDİ)
-- ==============================================

CREATE OR REPLACE FUNCTION public.login_user(user_email text, user_password text)
RETURNS TABLE(
    user_id uuid,
    email text,
    full_name text,
    avatar_url text,
    session_token text
) AS $$
DECLARE
    found_user_id uuid;
    found_email text;
    found_full_name text;
    found_avatar_url text;
    new_session_token text;
BEGIN
    -- Kullanıcıyı bul
    SELECT 
        u.id,
        u.email,
        u.full_name,
        u.avatar_url
    INTO 
        found_user_id,
        found_email,
        found_full_name,
        found_avatar_url
    FROM public.users u
    WHERE u.email = lower(trim(user_email))
    AND u.password_hash = hash_password(user_password)
    AND u.is_active = true;
    
    -- Kullanıcı bulunamadıysa boş döndür
    IF found_user_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Session token oluştur
    new_session_token := encode(gen_random_bytes(32), 'hex');
    
    -- Eski session'ları temizle
    DELETE FROM public.user_sessions 
    WHERE user_sessions.user_id = found_user_id;
    
    -- Yeni session oluştur
    INSERT INTO public.user_sessions (user_id, session_token, expires_at)
    VALUES (found_user_id, new_session_token, NOW() + INTERVAL '7 days');
    
    -- Last login güncelle
    UPDATE public.users 
    SET last_login_at = NOW(), updated_at = NOW()
    WHERE users.id = found_user_id;
    
    -- Sonucu döndür
    user_id := found_user_id;
    email := found_email;
    full_name := found_full_name;
    avatar_url := found_avatar_url;
    session_token := new_session_token;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STEP 8: REGISTER FUNCTION (TİPLER DÜZELTİLDİ)
-- ==============================================

CREATE OR REPLACE FUNCTION public.register_user(user_email text, user_password text, user_full_name text)
RETURNS TABLE(
    user_id uuid,
    email text,
    full_name text,
    avatar_url text,
    session_token text
) AS $$
DECLARE
    new_user_id uuid;
    new_avatar_url text;
    new_session_token text;
    clean_email text;
    clean_name text;
BEGIN
    -- Input temizle
    clean_email := lower(trim(user_email));
    clean_name := trim(user_full_name);
    
    -- Avatar URL oluştur
    new_avatar_url := 'https://ui-avatars.com/api/?name=' || 
                      replace(replace(clean_name, ' ', '+'), '''', '') || 
                      '&background=f4d03f&color=1a1a2e&size=128';
    
    -- Kullanıcı oluştur
    INSERT INTO public.users (email, password_hash, full_name, avatar_url)
    VALUES (clean_email, hash_password(user_password), clean_name, new_avatar_url)
    RETURNING id INTO new_user_id;
    
    -- Session token oluştur
    new_session_token := encode(gen_random_bytes(32), 'hex');
    
    -- Session oluştur
    INSERT INTO public.user_sessions (user_id, session_token, expires_at)
    VALUES (new_user_id, new_session_token, NOW() + INTERVAL '7 days');
    
    -- Sonucu döndür
    user_id := new_user_id;
    email := clean_email;
    full_name := clean_name;
    avatar_url := new_avatar_url;
    session_token := new_session_token;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STEP 9: SESSION VALIDATION FUNCTION
-- ==============================================

CREATE OR REPLACE FUNCTION public.validate_session(token text)
RETURNS TABLE(
    user_id uuid,
    email text,
    full_name text,
    avatar_url text
) AS $$
BEGIN
    RETURN QUERY 
    SELECT u.id, u.email, u.full_name, u.avatar_url
    FROM public.users u
    INNER JOIN public.user_sessions s ON u.id = s.user_id
    WHERE s.session_token = token 
    AND s.expires_at > NOW()
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STEP 10: TEST KULLANICISI EKLE
-- ==============================================

INSERT INTO public.users (email, password_hash, full_name, avatar_url) 
VALUES (
    'test@example.com', 
    hash_password('123456'),
    'Test Kullanıcısı',
    'https://ui-avatars.com/api/?name=Test+Kullanicisi&background=f4d03f&color=1a1a2e&size=128'
) ON CONFLICT (email) DO NOTHING;

-- ==============================================
-- STEP 11: FORUM BAGLANTILARI (Opsiyonel)
-- ==============================================

DO $$
BEGIN
    -- Forum_topics
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'forum_topics') THEN
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'forum_topics' AND column_name = 'author_id') THEN
            BEGIN
                ALTER TABLE public.forum_topics ADD CONSTRAINT forum_topics_author_id_fkey 
                    FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;
                RAISE NOTICE 'forum_topics bağlandı';
            EXCEPTION WHEN duplicate_object THEN
                RAISE NOTICE 'forum_topics zaten bağlı';
            END;
        END IF;
    END IF;
    
    -- Forum_posts
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'forum_posts') THEN
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'forum_posts' AND column_name = 'author_id') THEN
            BEGIN
                ALTER TABLE public.forum_posts ADD CONSTRAINT forum_posts_author_id_fkey 
                    FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;
                RAISE NOTICE 'forum_posts bağlandı';
            EXCEPTION WHEN duplicate_object THEN
                RAISE NOTICE 'forum_posts zaten bağlı';
            END;
        END IF;
    END IF;
    
    -- Forum_votes
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'forum_votes') THEN
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'forum_votes' AND column_name = 'voter_id') THEN
            BEGIN
                ALTER TABLE public.forum_votes ADD CONSTRAINT forum_votes_voter_id_fkey 
                    FOREIGN KEY (voter_id) REFERENCES public.users(id) ON DELETE SET NULL;
                RAISE NOTICE 'forum_votes bağlandı';
            EXCEPTION WHEN duplicate_object THEN
                RAISE NOTICE 'forum_votes zaten bağlı';
            END;
        END IF;
    END IF;
END
$$;

-- ==============================================
-- STEP 12: TEST QUERIES
-- ==============================================

-- Test hash function
SELECT 'HASH TEST:' as test_type, 
       length(hash_password('123456')) as hash_length,
       hash_password('123456') as sample_hash;

-- Test login
SELECT 'LOGIN TEST:' as test_type, 
       user_id, email, full_name,
       length(session_token) as token_length
FROM login_user('test@example.com', '123456');

-- Kullanıcı listesi
SELECT 'USERS:' as test_type,
       id, email, full_name, is_active, created_at
FROM public.users
ORDER BY created_at DESC;

-- Session listesi
SELECT 'SESSIONS:' as test_type,
       count(*) as total_sessions,
       count(CASE WHEN expires_at > NOW() THEN 1 END) as active_sessions
FROM public.user_sessions;

-- Function listesi
SELECT 'FUNCTIONS:' as test_type,
       routine_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND (routine_name LIKE '%user%' OR routine_name LIKE '%login%' OR routine_name LIKE '%session%')
ORDER BY routine_name; 