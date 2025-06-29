"use client"

import { Suspense } from "react"
import AuthGuard from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ForumCategoriesList from "@/components/forum/forum-categories-list"
import ForumTopicsList from "@/components/forum/forum-topics-list"
import ForumCreateTopic from "@/components/forum/forum-create-topic"
import { useForumStats } from "@/hooks/use-forum-stats"
import { Plus, MessageCircle, TrendingUp, Clock } from "lucide-react"

export default function ForumPage() {
  const { stats, loading: statsLoading } = useForumStats()

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
          {/* Test Notice */}
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-celestial-gold/10 border border-celestial-gold/20 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-celestial-gold rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm text-celestial-gold/90">
                Forum sayfası şu an için test aşamasındadır. Herhangi bir sorun olursa belirtiniz lütfen.
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-celestial-gold to-white bg-clip-text text-transparent mb-4">
            Kozmik Forum
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Astroloji, spiritüellik ve kozmik bilgiler hakkında paylaşımlarınızı yapın, deneyimlerinizi tartışın
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-6 w-6 text-celestial-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {statsLoading ? "..." : stats.messages.toLocaleString('tr-TR')}
                </div>
                <div className="text-sm text-white/70">Mesaj</div>
              </CardContent>
            </Card>
            <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-celestial-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {statsLoading ? "..." : stats.topics.toLocaleString('tr-TR')}
                </div>
                <div className="text-sm text-white/70">Konu</div>
              </CardContent>
            </Card>
            <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-celestial-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {statsLoading ? "..." : stats.activeUsers.toLocaleString('tr-TR')}
                </div>
                <div className="text-sm text-white/70">Aktif Üye</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Create Topic Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Son Konular</h2>
              <ForumCreateTopic>
                <Button className="bg-gradient-to-r from-celestial-gold to-cosmic-blue hover:from-celestial-gold/80 hover:to-cosmic-blue/80 text-white border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Konu
                </Button>
              </ForumCreateTopic>
            </div>

            {/* Topics List */}
            <Suspense fallback={
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 bg-white/5 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }>
              <ForumTopicsList />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Categories */}
            <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-celestial-gold" />
                  Kategoriler
                </CardTitle>
                <CardDescription className="text-white/70">
                  İlgilendiğiniz konulara göz atın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 bg-white/10 rounded animate-pulse"></div>
                    ))}
                  </div>
                }>
                  <ForumCategoriesList />
                </Suspense>
              </CardContent>
            </Card>



            {/* Forum Rules */}
            <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white">Forum Kuralları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-white/70">
                <p>• Saygılı ve yapıcı olmaya özen gösterin</p>
                <p>• Kişisel saldırılardan kaçının</p>
                <p>• Konuyla ilgili paylaşımlar yapın</p>
                <p>• Spam ve reklam yasaktır</p>
                <p>• Telif haklarına saygı gösterin</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
} 