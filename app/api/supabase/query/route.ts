import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { table, select = '*', filters = {}, order = {} } = body

    // Güvenlik için sadece belirli tabloları izin ver
    const allowedTables = ['blog_posts', 'daily_shares']
    if (!allowedTables.includes(table)) {
      return NextResponse.json({ error: 'Table not allowed' }, { status: 403 })
    }

    let query = supabaseServer.from(table).select(select)

    // Filtreleri uygula
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    // Sıralama uygula
    if (order.column) {
      query = query.order(order.column, { ascending: order.ascending || false })
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to execute query' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
} 