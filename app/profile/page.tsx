"use client"

import { useState } from "react"
import AuthGuard from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { User, Save, Upload, Calendar, Mail } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    avatar_url: user?.avatar_url || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(formData)
      setIsEditing(false)
      toast.success('Profil başarıyla güncellendi!')
    } catch (error) {
      toast.error('Profil güncellenirken hata oluştu')
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      email: user?.email || '',
      avatar_url: user?.avatar_url || ''
    })
    setIsEditing(false)
  }

  if (!user) {
    return null
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-midnight via-deep-purple to-cosmic-blue relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-celestial-gold/10 via-transparent to-transparent"></div>
        <div className="fixed top-20 left-20 w-96 h-96 bg-celestial-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="fixed bottom-20 right-20 w-80 h-80 bg-cosmic-blue/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="relative z-10 container mx-auto px-4 py-24">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-celestial-gold to-white bg-clip-text text-transparent mb-4">
              Profil Ayarları
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Hesap bilgilerinizi görüntüleyin ve güncelleyin
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-2 border-celestial-gold/30">
                    <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
                    <AvatarFallback className="bg-celestial-gold text-midnight text-2xl">
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-white text-2xl">
                  {user.full_name || 'Kullanıcı'}
                </CardTitle>
                <CardDescription className="text-white/70">
                  Üyelik Tarihi: {new Date(user.created_at || '').toLocaleDateString('tr-TR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {!isEditing ? (
                  // View Mode
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-white/80 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Ad Soyad
                        </Label>
                        <div className="bg-white/5 border border-white/10 rounded-md p-3 text-white">
                          {user.full_name || 'Belirtilmemiş'}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white/80 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          E-posta
                        </Label>
                        <div className="bg-white/5 border border-white/10 rounded-md p-3 text-white">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80 flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Avatar URL
                      </Label>
                      <div className="bg-white/5 border border-white/10 rounded-md p-3 text-white break-all">
                        {user.avatar_url || 'Belirtilmemiş'}
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="flex justify-center">
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-celestial-gold to-cosmic-blue hover:from-celestial-gold/80 hover:to-cosmic-blue/80 text-white border-0"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profili Düzenle
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-white/80 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Ad Soyad
                        </Label>
                        <Input
                          id="full_name"
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-celestial-gold"
                          placeholder="Adınızı ve soyadınızı girin"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/80 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          E-posta
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-celestial-gold"
                          placeholder="E-posta adresinizi girin"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar_url" className="text-white/80 flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Avatar URL
                      </Label>
                      <Input
                        id="avatar_url"
                        type="url"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-celestial-gold"
                        placeholder="Avatar resim URL'i girin"
                      />
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="flex justify-center space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="border-white/20 text-white hover:bg-white/10"
                        disabled={loading}
                      >
                        İptal
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-celestial-gold to-cosmic-blue hover:from-celestial-gold/80 hover:to-cosmic-blue/80 text-white border-0"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 