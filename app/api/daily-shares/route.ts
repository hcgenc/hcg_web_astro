import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

export async function GET() {
  const { data, error } = await supabase
    .from('daily_shares')
    .select('id, content, date, user:user_id(name, avatar)')
    .order('date', { ascending: false })

  return NextResponse.json({ data, error })
}
