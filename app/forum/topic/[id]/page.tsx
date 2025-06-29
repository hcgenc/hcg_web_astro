"use client"

import { Suspense, use } from "react"
import AuthGuard from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ForumTopicDetail from "@/components/forum/forum-topic-detail"
import ForumPostsList from "@/components/forum/forum-posts-list"
import ForumCreatePost from "@/components/forum/forum-create-post"
import { useForumTopic } from "@/hooks/use-forum-topic"
import { ArrowLeft, MessageCircle, ThumbsUp, ThumbsDown, Share2, Eye } from "lucide-react"
import Link from "next/link"

interface TopicPageProps {
  params: Promise<{
    id: string
  }>
}

export default function TopicPage({ params }: TopicPageProps) {
  const { id } = use(params)
  const { topic, isLoading: topicLoading } = useForumTopic(id)
  
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-midnight via-deep-purple to-cosmic-blue relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-celestial-gold/10 via-transparent to-transparent"></div>
      <div className="fixed top-20 left-20 w-96 h-96 bg-celestial-gold/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-cosmic-blue/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="relative z-10 container mx-auto px-4 py-24">
        
        {/* Test Notice */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-celestial-gold/10 border border-celestial-gold/20 rounded-lg backdrop-blur-sm">
            <div className="w-2 h-2 bg-celestial-gold rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-celestial-gold/90">
              Forum sayfası şu an için test aşamasındadır. Herhangi bir sorun olursa belirtiniz lütfen.
            </span>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/forum">
            <Button variant="outline" className="bg-midnight/40 border-celestial-gold/20 text-white hover:bg-celestial-gold/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Forum'a Dön
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Topic Detail */}
            <Suspense fallback={
              <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="h-8 bg-white/10 rounded mb-4"></div>
                  <div className="h-4 bg-white/5 rounded mb-2"></div>
                  <div className="h-4 bg-white/5 rounded w-3/4"></div>
                </CardContent>
              </Card>
            }>
              <ForumTopicDetail topicId={id} />
            </Suspense>

            <Separator className="bg-celestial-gold/20" />

            {/* Posts List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-celestial-gold" />
                  Yorumlar
                </h2>
              </div>

              <Suspense fallback={
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="h-10 w-10 bg-white/10 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-white/10 rounded mb-2"></div>
                            <div className="h-3 bg-white/5 rounded w-2/3"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              }>
                <ForumPostsList topicId={id} />
              </Suspense>

              {/* Create Post */}
              <ForumCreatePost topicId={id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Topic Stats */}
            <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white text-sm">Konu İstatistikleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70 flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    Görüntülenme
                  </span>
                  <span className="text-white font-medium">
                    {topicLoading ? "..." : (topic?.view_count || 0).toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Yanıt
                  </span>
                  <span className="text-white font-medium">
                    {topicLoading ? "..." : (topic?.reply_count || 0).toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70 flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1 text-green-400" />
                    Beğeni
                  </span>
                  <span className="text-white font-medium">
                    {topicLoading ? "..." : (topic?.like_count || 0).toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70 flex items-center">
                    <ThumbsDown className="h-4 w-4 mr-1 text-red-400" />
                    Beğenmeme
                  </span>
                  <span className="text-white font-medium">
                    {topicLoading ? "..." : (topic?.dislike_count || 0).toLocaleString('tr-TR')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white text-sm">Paylaş</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-celestial-gold to-cosmic-blue hover:from-celestial-gold/80 hover:to-cosmic-blue/80 text-white border-0"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Kozmik Forum - Konu',
                        url: window.location.href
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Konuyu Paylaş
                </Button>
              </CardContent>
            </Card>

            {/* Similar Topics */}
            <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white text-sm">Benzer Konular</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Link href="#" className="block text-sm text-white/80 hover:text-celestial-gold transition-colors">
                    Astroloji haritası nasıl yorumlanır?
                  </Link>
                  <Link href="#" className="block text-sm text-white/80 hover:text-celestial-gold transition-colors">
                    Burç uyumluluğu hakkında düşünceler
                  </Link>
                  <Link href="#" className="block text-sm text-white/80 hover:text-celestial-gold transition-colors">
                    Ay tutulmasının etkileri
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
} 