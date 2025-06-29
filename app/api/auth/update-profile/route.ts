import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value

    if (!authToken) {
      return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 })
    }

    // Session'ı doğrula
    const { data, error: sessionError } = await supabase
      .rpc('validate_session', {
        token: authToken
      })

    if (sessionError || !data || data.length === 0) {
      return NextResponse.json({ error: 'Geçersiz oturum' }, { status: 401 })
    }

    const sessionUser = data[0]

    const { full_name, email, avatar_url } = await request.json()

    // Kullanıcı bilgilerini güncelle
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        full_name,
        email,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionUser.user_id)
      .select('id, email, full_name, avatar_url, created_at')
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: 'Profil güncellenemedi' }, { status: 500 })
    }

    return NextResponse.json({ 
      user: updatedUser,
      message: 'Profil başarıyla güncellendi'
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
} 