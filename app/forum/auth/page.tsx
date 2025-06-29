"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function ForumAuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const { error } = await signIn(formData.email, formData.password)
        
        if (error) {
          toast({
            title: "Giriş Hatası",
            description: error.message || "Email veya şifre hatalı",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Hoş Geldiniz!",
            description: "Başarıyla giriş yaptınız.",
          })
          router.push('/forum')
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Hata",
            description: "Şifreler eşleşmiyor",
            variant: "destructive",
          })
          return
        }

        if (formData.password.length < 6) {
          toast({
            title: "Hata",
            description: "Şifre en az 6 karakter olmalıdır",
            variant: "destructive",
          })
          return
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName)
        
        if (error) {
          console.error('Signup error details:', error)
          console.error('Error type:', typeof error)
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
          
          let errorMessage = "Kayıt işlemi başarısız"
          
          if (error.message?.includes('User already registered')) {
            errorMessage = "Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin."
          } else if (error.message?.includes('Invalid email')) {
            errorMessage = "Geçerli bir email adresi girin."
          } else if (error.message?.includes('Password should be at least')) {
            errorMessage = "Şifre en az 6 karakter olmalıdır."
          } else if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
            errorMessage = "Çok fazla deneme yaptınız. Lütfen biraz bekleyin."
          } else if (error.message?.includes('Database error')) {
            errorMessage = "Veritabanı hatası. Lütfen tekrar deneyin veya Supabase ayarlarını kontrol edin."
          } else if (error.message) {
            errorMessage = `Hata: ${error.message}`
          }
          
          toast({
            title: "Kayıt Hatası",
            description: errorMessage,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Kayıt Başarılı!",
            description: "Hoş geldiniz! Forum'a yönlendiriliyorsunuz...",
          })
          
          // Clear form
          setFormData({ email: '', password: '', fullName: '', confirmPassword: '' })
          
          // Redirect to forum after a short delay
          setTimeout(() => {
            router.push('/forum')
          }, 1500)
        }
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bir hata oluştu, lütfen tekrar deneyin",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-deep-purple to-cosmic-blue relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-celestial-gold/10 via-transparent to-transparent"></div>
      <div className="fixed top-20 left-20 w-96 h-96 bg-celestial-gold/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-cosmic-blue/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="relative z-10 container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md bg-midnight/90 border-celestial-gold/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white via-celestial-gold to-white bg-clip-text text-transparent">
              {isLogin ? 'Forum\'a Giriş' : 'Forum Üyeliği'}
            </CardTitle>
            <CardDescription className="text-white/70">
              {isLogin 
                ? 'Kozmik topluluğumuza katılmak için giriş yapın' 
                : 'Astroloji dünyasının bir parçası olun'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name (Only for Register) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white/80 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Ad Soyad
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Adınızı ve soyadınızı girin"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-deep-purple/20 border-celestial-gold/20 text-white placeholder:text-white/50 focus:border-celestial-gold"
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-deep-purple/20 border-celestial-gold/20 text-white placeholder:text-white/50 focus:border-celestial-gold"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80 flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Şifre
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifrenizi girin"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-deep-purple/20 border-celestial-gold/20 text-white placeholder:text-white/50 focus:border-celestial-gold pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white/60" />
                    ) : (
                      <Eye className="h-4 w-4 text-white/60" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password (Only for Register) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/80 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Şifre Tekrar
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Şifrenizi tekrar girin"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-deep-purple/20 border-celestial-gold/20 text-white placeholder:text-white/50 focus:border-celestial-gold"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-celestial-gold to-cosmic-blue hover:from-celestial-gold/80 hover:to-cosmic-blue/80 text-white border-0 h-12"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isLogin ? 'Giriş Yap' : 'Üye Ol'}
              </Button>

              {/* Toggle Login/Register */}
              <div className="text-center pt-4">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setFormData({ email: '', password: '', fullName: '', confirmPassword: '' })
                  }}
                  className="text-celestial-gold hover:text-white"
                >
                  {isLogin 
                    ? 'Hesabınız yok mu? Üye olun' 
                    : 'Zaten üye misiniz? Giriş yapın'
                  }
                </Button>
              </div>

              {/* Back to Home */}
              <div className="text-center pt-2">
                <Link href="/">
                  <Button variant="ghost" className="text-white/60 hover:text-celestial-gold">
                    Ana Sayfaya Dön
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 