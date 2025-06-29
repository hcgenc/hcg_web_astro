import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { email, password, fullName } = await request.json()

    // Validation
    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Email, password and full name are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 })
    }

    // Register user using our custom function
    const { data, error } = await supabase
      .rpc('register_user', {
        user_email: email.toLowerCase().trim(),
        user_password: password,
        user_full_name: fullName.trim()
      })

    if (error) {
      console.error('Register error:', error)
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
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
    console.error('Register API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 