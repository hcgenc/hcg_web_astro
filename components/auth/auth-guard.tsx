"use client"

import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Lock, UserPlus } from 'lucide-react'
import Link from 'next/link'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight via-deep-purple to-cosmic-blue relative overflow-hidden">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-celestial-gold/10 via-transparent to-transparent"></div>
        <div className="fixed top-20 left-20 w-96 h-96 bg-celestial-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="fixed bottom-20 right-20 w-80 h-80 bg-cosmic-blue/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
          <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-celestial-gold mx-auto mb-4" />
              <p className="text-white/80">Yükleniyor...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show auth required message if user is not logged in
  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight via-deep-purple to-cosmic-blue relative overflow-hidden">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-celestial-gold/10 via-transparent to-transparent"></div>
        <div className="fixed top-20 left-20 w-96 h-96 bg-celestial-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="fixed bottom-20 right-20 w-80 h-80 bg-cosmic-blue/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-celestial-gold/20 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-celestial-gold" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Forum Girişi Gerekli</h2>
                <p className="text-white/70">
                  Kozmik forumumuza katılmak için giriş yapmanız gerekiyor
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/forum/auth" className="block">
                  <Button className="w-full bg-gradient-to-r from-celestial-gold to-cosmic-blue hover:from-celestial-gold/80 hover:to-cosmic-blue/80 text-white border-0">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Giriş Yap / Üye Ol
                  </Button>
                </Link>
                
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full bg-transparent border-celestial-gold/30 text-white hover:bg-celestial-gold/10">
                    Ana Sayfaya Dön
                  </Button>
                </Link>
              </div>

              <div className="text-xs text-white/50 space-y-1">
                <p>✨ Ücretsiz üyelik</p>
                <p>🌟 Astroloji topluluğu</p>
                <p>💫 Kendi deneyimlerinizi paylaşın</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // User is authenticated, show protected content
  return <>{children}</>
} 