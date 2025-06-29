"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (data: { full_name: string, email: string, avatar_url: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          fullName
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: new Error(data.error || 'Registration failed') }
      }

      setUser(data.user)
      return { error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: new Error(data.error || 'Login failed') }
      }

      setUser(data.user)
      return { error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateProfile = async (data: { full_name: string, email: string, avatar_url: string }) => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Profile update failed')
      }

      const result = await response.json()
      setUser(result.user)
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 