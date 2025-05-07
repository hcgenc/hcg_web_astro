# Cosmic Services

## Vercel'e Deployment

Bu projeyi Vercel'e deploy etmek için aşağıdaki adımları izleyin:

1. Projeyi GitHub'a push edin
2. [Vercel Dashboard](https://vercel.com/dashboard)'a giriş yapın
3. "New Project" butonuna tıklayın
4. GitHub reponuzu import edin
5. Build ayarlarını kontrol edin (Çoğunlukla default ayarlar yeterlidir)
6. "Environment Variables" bölümünde aşağıdaki environment variable'ları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase projenizin URL'si
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase projenizin anonim key'i
7. "Deploy" butonuna tıklayın

## Lokal Geliştirme

Lokal geliştirme için:

1. Bu repoyu klonlayın
2. `.env.local` dosyası oluşturun ve şu değişkenleri ekleyin:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```
3. Paketleri yükleyin: `npm install` veya `pnpm install`
4. Geliştirme sunucusunu başlatın: `npm run dev` veya `pnpm dev` 