import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (güvenli, API keys gizli)
export const supabaseServer = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Client-side için API proxy kullanacağız
export const supabaseClient = {
  // Blog posts
  async getBlogPosts() {
    const response = await fetch('/api/supabase/blog-posts')
    if (!response.ok) throw new Error('Failed to fetch blog posts')
    return response.json()
  },

  // Daily shares
  async getDailyShares() {
    const response = await fetch('/api/supabase/daily-shares')
    if (!response.ok) throw new Error('Failed to fetch daily shares')
    return response.json()
  },

  // Generic query method
  async query(table: string, options: any = {}) {
    const response = await fetch('/api/supabase/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ table, ...options })
    })
    if (!response.ok) throw new Error('Failed to execute query')
    return response.json()
  }
}

// Backward compatibility için
export const supabase = supabaseClient 