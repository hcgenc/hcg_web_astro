import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, content, image, date')
      .eq('slug', slug)
      .single()
    return NextResponse.json({ data, error })
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, summary, image, date')
    .order('date', { ascending: false })

  return NextResponse.json({ data, error })
}
