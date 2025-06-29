-- Önce mevcut politikaları kaldır
DROP POLICY IF EXISTS "Allow read access to forum_categories" ON public.forum_categories;
DROP POLICY IF EXISTS "Allow read access to forum_topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Allow read access to forum_posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Allow authenticated users to create topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Allow authenticated users to create posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Allow authenticated users to vote" ON public.forum_votes;
DROP POLICY IF EXISTS "Allow users to update own topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Allow users to delete own topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Allow users to update own posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Allow users to delete own posts" ON public.forum_posts;

-- Yeni, daha esnek politikalar
-- Kategoriler - herkes okuyabilir
CREATE POLICY "Enable read access for categories" ON public.forum_categories FOR SELECT USING (true);

-- Konular - herkes okuyabilir, authenticated kullanıcılar oluşturabilir
CREATE POLICY "Enable read access for topics" ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users on topics" ON public.forum_topics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for topic owners" ON public.forum_topics FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Enable delete for topic owners" ON public.forum_topics FOR DELETE USING (auth.uid() = author_id);

-- Mesajlar - herkes okuyabilir, authenticated kullanıcılar oluşturabilir
CREATE POLICY "Enable read access for posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users on posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for post owners" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Enable delete for post owners" ON public.forum_posts FOR DELETE USING (auth.uid() = author_id);

-- Oylar - herkes okuyabilir, authenticated kullanıcılar oy verebilir
CREATE POLICY "Enable read access for votes" ON public.forum_votes FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users on votes" ON public.forum_votes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for vote owners" ON public.forum_votes FOR UPDATE USING (auth.uid() = voter_id);
CREATE POLICY "Enable delete for vote owners" ON public.forum_votes FOR DELETE USING (auth.uid() = voter_id);

-- Realtime subscriptions için
ALTER publication supabase_realtime ADD TABLE public.forum_categories;
ALTER publication supabase_realtime ADD TABLE public.forum_topics;
ALTER publication supabase_realtime ADD TABLE public.forum_posts;
ALTER publication supabase_realtime ADD TABLE public.forum_votes; 