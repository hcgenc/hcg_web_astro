-- Auth tablosu için gerekli ayarları yapalım
-- Önce auth schema'sına erişimi kontrol edelim

-- RLS'i geçici olarak kapatıp yeniden açalım
ALTER TABLE IF EXISTS public.forum_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.forum_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.forum_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.forum_votes DISABLE ROW LEVEL SECURITY;

-- Tabloları yeniden oluşturalım (eğer yoksa)
CREATE TABLE IF NOT EXISTS public.forum_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#f4d03f',
    topic_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    last_post_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES public.forum_categories(id) ON DELETE CASCADE,
    author_id UUID,
    author_name VARCHAR(100) NOT NULL,
    author_avatar TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    vote_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_reply_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    author_id UUID,
    author_name VARCHAR(100) NOT NULL,
    author_avatar TEXT,
    vote_score INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_type VARCHAR(10) NOT NULL CHECK (target_type IN ('topic', 'post')),
    target_id UUID NOT NULL,
    vote_type VARCHAR(4) NOT NULL CHECK (vote_type IN ('up', 'down')),
    voter_id UUID,
    voter_name VARCHAR(100) NOT NULL,
    voter_ip INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(target_type, target_id, voter_id)
);

-- Örnek kategoriler ekle (eğer yoksa)
INSERT INTO public.forum_categories (name, description, color) 
SELECT 'Astroloji Genel', 'Genel astroloji konuları ve tartışmalar', '#f4d03f'
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories WHERE name = 'Astroloji Genel');

INSERT INTO public.forum_categories (name, description, color) 
SELECT 'Burç Yorumları', 'Günlük, haftalık ve aylık burç yorumları', '#3498db'
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories WHERE name = 'Burç Yorumları');

INSERT INTO public.forum_categories (name, description, color) 
SELECT 'Doğum Haritası', 'Doğum haritası analizi ve yorumları', '#9b59b6'
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories WHERE name = 'Doğum Haritası');

INSERT INTO public.forum_categories (name, description, color) 
SELECT 'Tarot ve Fal', 'Tarot kartları ve fal yorumları', '#e74c3c'
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories WHERE name = 'Tarot ve Fal');

INSERT INTO public.forum_categories (name, description, color) 
SELECT 'Spiritüellik', 'Manevi gelişim ve spiritüel konular', '#2ecc71'
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories WHERE name = 'Spiritüellik');

INSERT INTO public.forum_categories (name, description, color) 
SELECT 'Kristaller', 'Kristal terapisi ve enerji çalışmaları', '#f39c12'
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories WHERE name = 'Kristaller');

-- RLS'i şimdilik KAPALI bırakalım (test için)
-- Daha sonra açacağız

-- İndeksler oluştur
CREATE INDEX IF NOT EXISTS idx_forum_topics_category_id ON public.forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_created_at ON public.forum_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_topics_last_reply_at ON public.forum_topics(last_reply_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_topic_id ON public.forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent_id ON public.forum_posts(parent_id);
CREATE INDEX IF NOT EXISTS idx_forum_votes_target ON public.forum_votes(target_type, target_id);

-- RPC Fonksiyonları
CREATE OR REPLACE FUNCTION increment_topic_count(category_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.forum_categories 
    SET topic_count = topic_count + 1 
    WHERE id = category_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_reply_count(topic_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.forum_topics 
    SET reply_count = reply_count + 1 
    WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_reply_count(topic_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.forum_topics 
    SET reply_count = GREATEST(reply_count - 1, 0) 
    WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql; 