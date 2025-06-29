-- Forum tablolarını Users tablosuna bağla
-- Bu scripti users tablosu ve forum tabloları oluşturulduktan SONRA çalıştırın

-- FORUM TABLOLARI VAR MI KONTROL ET
DO $$
BEGIN
    -- Forum_topics tablosu varsa author_id'yi users'a bağla
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'forum_topics') THEN
        -- Önce eski constraint'i kaldır
        ALTER TABLE public.forum_topics DROP CONSTRAINT IF EXISTS forum_topics_author_id_fkey;
        
        -- Yeni constraint ekle
        ALTER TABLE public.forum_topics ADD CONSTRAINT forum_topics_author_id_fkey 
            FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;
            
        RAISE NOTICE 'forum_topics tablosu users tablosuna bağlandı';
    ELSE
        RAISE NOTICE 'forum_topics tablosu bulunamadı - önce forum tablolarını oluşturun';
    END IF;

    -- Forum_posts tablosu varsa author_id'yi users'a bağla
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'forum_posts') THEN
        ALTER TABLE public.forum_posts DROP CONSTRAINT IF EXISTS forum_posts_author_id_fkey;
        ALTER TABLE public.forum_posts ADD CONSTRAINT forum_posts_author_id_fkey 
            FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;
            
        RAISE NOTICE 'forum_posts tablosu users tablosuna bağlandı';
    ELSE
        RAISE NOTICE 'forum_posts tablosu bulunamadı';
    END IF;

    -- Forum_votes tablosu varsa voter_id'yi users'a bağla
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'forum_votes') THEN
        ALTER TABLE public.forum_votes DROP CONSTRAINT IF EXISTS forum_votes_voter_id_fkey;
        ALTER TABLE public.forum_votes ADD CONSTRAINT forum_votes_voter_id_fkey 
            FOREIGN KEY (voter_id) REFERENCES public.users(id) ON DELETE SET NULL;
            
        RAISE NOTICE 'forum_votes tablosu users tablosuna bağlandı';
    ELSE
        RAISE NOTICE 'forum_votes tablosu bulunamadı';
    END IF;
END
$$; 