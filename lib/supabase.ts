import { createClient } from '@supabase/supabase-js'

// Ortam değişkenlerini kontrol edip güvenli bir şekilde kullanıyoruz
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Ortam değişkenleri yoksa hata fırlat
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Anon Key eksik! Lütfen .env.local dosyasını veya Vercel ortam değişkenlerini kontrol edin.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 