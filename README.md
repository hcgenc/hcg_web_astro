# Cosmic Services

## Vercel'e Deployment

Bu projeyi Vercel'e deploy etmek için aşağıdaki adımları izleyin:

1. Projeyi GitHub'a push edin
2. [Vercel Dashboard](https://vercel.com/dashboard)'a giriş yapın
3. "New Project" butonuna tıklayın
4. GitHub reponuzu import edin
5. Build ayarlarını kontrol edin (Çoğunlukla default ayarlar yeterlidir)
6. "Environment Variables" bölümünde aşağıdaki environment variable'ları ekleyin:
   - `SUPABASE_URL`: Supabase projenizin URL'si
   - `SUPABASE_ANON_KEY`: Supabase projenizin anonim key'i
7. "Deploy" butonuna tıklayın

## Güvenlik

Bu proje güvenli API proxy yapısı kullanır:
- Supabase bilgileri sadece server-side'da kullanılır
- Client-side'da API keys görünmez
- Tüm database erişimi `/api/supabase/*` endpoints üzerinden

## Lokal Geliştirme

Lokal geliştirme için:

1. Bu repoyu klonlayın
2. `.env.local` dosyası oluşturun ve şu değişkenleri ekleyin:
   ```
   SUPABASE_URL=your-supabase-url-here
   SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```
3. Paketleri yükleyin: `npm install` veya `pnpm install`
4. Geliştirme sunucusunu başlatın: `npm run dev` veya `pnpm dev` 