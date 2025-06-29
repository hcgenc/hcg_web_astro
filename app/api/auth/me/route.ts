import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const authToken = request.cookies.get('auth_token')?.value

    if (!authToken) {
      return NextResponse.json({ error: 'No session token' }, { status: 401 })
    }

    // Validate session using our custom function
    const { data, error } = await supabase
      .rpc('validate_session', {
        token: authToken
      })

    if (error) {
      console.error('Session validation error:', error)
      return NextResponse.json({ error: 'Session validation failed' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
    }

    const user = data[0]

    return NextResponse.json({
      user: {
        id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      }
    })
  } catch (error) {
    console.error('Me API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 