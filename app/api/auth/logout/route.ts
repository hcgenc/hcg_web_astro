import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const authToken = request.cookies.get('auth_token')?.value

    if (authToken) {
      // Delete session from database
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_token', authToken)
    }

    // Create response
    const response = NextResponse.json({ message: 'Logged out successfully' })

    // Clear session cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 