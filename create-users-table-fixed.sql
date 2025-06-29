-- Custom Users sistemi - ADIM ADIM
-- Supabase SQL Editor'de sırayla çalıştırın

-- ADIM 1: Users tablosu oluştur
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- ADIM 2: Sessions tablosu oluştur
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADIM 3: İndeksler
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON public.user_sessions(expires_at);

-- ADIM 4: RLS'i kapat
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions DISABLE ROW LEVEL SECURITY;

-- ADIM 5: Password hash function
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text AS $$
BEGIN
    RETURN encode(digest(password || 'cosmic_salt_2024', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- ADIM 6: Test kullanıcısı ekle
INSERT INTO public.users (email, password_hash, full_name, avatar_url) 
VALUES (
    'test@example.com', 
    hash_password('123456'),
    'Test Kullanıcı',
    'https://ui-avatars.com/api/?name=Test%20Kullanici&background=f4d03f&color=1a1a2e&size=128'
) ON CONFLICT (email) DO NOTHING;

-- ADIM 7: Login function
CREATE OR REPLACE FUNCTION login_user(user_email text, user_password text)
RETURNS TABLE(
    user_id uuid,
    email text,
    full_name text,
    avatar_url text,
    session_token text
) AS $$
DECLARE
    user_record public.users%ROWTYPE;
    new_session_token text;
BEGIN
    -- Kullanıcıyı bul
    SELECT * INTO user_record 
    FROM public.users 
    WHERE users.email = user_email 
    AND users.password_hash = hash_password(user_password)
    AND users.is_active = true;
    
    IF user_record.id IS NULL THEN
        RETURN;
    END IF;
    
    -- Session token oluştur
    new_session_token := encode(gen_random_bytes(32), 'hex');
    
    -- Eski session'ları temizle
    DELETE FROM public.user_sessions 
    WHERE user_sessions.user_id = user_record.id;
    
    -- Yeni session oluştur
    INSERT INTO public.user_sessions (user_id, session_token, expires_at)
    VALUES (user_record.id, new_session_token, NOW() + INTERVAL '7 days');
    
    -- Last login güncelle
    UPDATE public.users 
    SET last_login_at = NOW(), updated_at = NOW()
    WHERE users.id = user_record.id;
    
    -- Kullanıcı bilgilerini döndür
    RETURN QUERY SELECT 
        user_record.id,
        user_record.email,
        user_record.full_name,
        user_record.avatar_url,
        new_session_token;
END;
$$ LANGUAGE plpgsql;

-- ADIM 8: Register function  
CREATE OR REPLACE FUNCTION register_user(user_email text, user_password text, user_full_name text)
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
BEGIN
    -- Avatar URL oluştur (basit)
    new_avatar_url := 'https://ui-avatars.com/api/?name=' || 
                      replace(user_full_name, ' ', '%20') || 
                      '&background=f4d03f&color=1a1a2e&size=128';
    
    -- Kullanıcı oluştur
    INSERT INTO public.users (email, password_hash, full_name, avatar_url)
    VALUES (user_email, hash_password(user_password), user_full_name, new_avatar_url)
    RETURNING id INTO new_user_id;
    
    -- Session token oluştur
    new_session_token := encode(gen_random_bytes(32), 'hex');
    
    -- Session oluştur
    INSERT INTO public.user_sessions (user_id, session_token, expires_at)
    VALUES (new_user_id, new_session_token, NOW() + INTERVAL '7 days');
    
    -- Kullanıcı bilgilerini döndür
    RETURN QUERY SELECT 
        new_user_id,
        user_email,
        user_full_name,
        new_avatar_url,
        new_session_token;
END;
$$ LANGUAGE plpgsql;

-- ADIM 9: Validate session function
CREATE OR REPLACE FUNCTION validate_session(token text)
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
    JOIN public.user_sessions s ON u.id = s.user_id
    WHERE s.session_token = token 
    AND s.expires_at > NOW()
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql; 