import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Login user using our custom function
    const { data, error } = await supabase
      .rpc('login_user', {
        user_email: email.toLowerCase().trim(),
        user_password: password
      })

    if (error) {
      console.error('Login error:', error)
      return NextResponse.json({ error: 'Login failed' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = data[0]

    // Create response with user data
    const response = NextResponse.json({
      user: {
        id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      }
    })

    // Set session cookie
    response.cookies.set('auth_token', user.session_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 