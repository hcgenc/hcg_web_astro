import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Public API - no auth required for reading daily shares
    const { data, error } = await supabase
      .from('daily_shares')
      .select(`
        id,
        content,
        date,
        created_at,
        user_id
      `)
      .order('date', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Supabase error:', error)
      // If daily_shares table doesn't exist, return mock data
      if (error.code === '42P01') {
        console.log('daily_shares table not found, returning mock data')
        return NextResponse.json([
          {
            id: '1',
            content: 'Bugün Merkür retrosu başlıyor! İletişimde dikkatli olalım. 🌟',
            date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
            user_id: null
          },
          {
            id: '2', 
            content: 'Ay Boğa burcunda - maddi konularda kararlı adımlar atmak için güzel bir zaman. 💫',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            created_at: new Date(Date.now() - 86400000).toISOString(),
            user_id: null
          },
          {
            id: '3',
            content: 'Venüs ve Jüpiter kavuşumu aşk ve bolluk getiriyor! ✨',
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
            created_at: new Date(Date.now() - 172800000).toISOString(),
            user_id: null
          }
        ])
      }
      return NextResponse.json({ error: 'Failed to fetch daily shares' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 