import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Public API - no auth required for reading blog posts
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, summary, image, date, content')
      .order('date', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Supabase error:', error)
      // If blog_posts table doesn't exist, return mock data
      if (error.code === '42P01') {
        console.log('blog_posts table not found, returning mock data')
        return NextResponse.json([
          {
            id: '1',
            slug: 'astroloji-nedir',
            title: 'Astroloji Nedir ve Nasıl Çalışır?',
            summary: 'Astrolojinin temellerini ve günlük yaşamımızdaki etkisini keşfedin.',
            content: 'Astroloji, gök cisimlerinin hareketlerinin insan yaşamına etkisini inceleyen kadim bir bilimdir. Bu yazımızda astrolojinin temellerini ve günlük yaşamımızdaki etkilerini inceleyeceğiz.',
            image: '/images/andromeda.png',
            date: new Date().toISOString().split('T')[0]
          },
          {
            id: '2',
            slug: 'mercury-retrosu',
            title: 'Merkür Retrosu: Nelere Dikkat Etmeliyiz?',
            summary: 'Merkür retrosunun etkileri ve bu dönemde nelere dikkat etmemiz gerektiği.',
            content: 'Merkür retrosu döneminde iletişim, teknoloji ve seyahat konularında dikkatli olmamız gerekir. Bu yazımızda bu özel dönemin etkilerini detaylı olarak ele alıyoruz.',
            image: '/images/aurora.png',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
          },
          {
            id: '3',
            slug: 'burc-uyumlulugu',
            title: 'Burç Uyumluluğu: Gerçek mi, Efsane mi?',
            summary: 'Burç uyumluluğunun bilimsel temelleri ve gerçekler.',
            content: 'Burç uyumluluğu konusu merak edilen konuların başında gelir. Bu yazımızda burç uyumluluğunun ne kadar gerçek olduğunu ve nasıl değerlendirilmesi gerektiğini ele alıyoruz.',
            image: '/images/zodiac.png',
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0]
          }
        ])
      }
      return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 