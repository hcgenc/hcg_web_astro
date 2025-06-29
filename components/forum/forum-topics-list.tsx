"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useForumTopics } from "@/hooks/use-forum-topics"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import Link from "next/link"
import { Loader2, MessageCircle, ThumbsUp, ThumbsDown, Eye, Pin, Lock } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function ForumTopicsList() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('category')
  
  const { topics, isLoading, error } = useForumTopics({
    category_id: categoryId,
    page: 1,
    limit: 20,
    sort: 'latest'
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-celestial-gold" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-midnight/40 border-red-400/20 backdrop-blur-lg">
        <CardContent className="p-6 text-center">
          <div className="text-red-400">
            Konular yüklenirken hata oluştu
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!topics || topics.length === 0) {
    return (
      <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
        <CardContent className="p-6 text-center">
          <div className="text-white/60">
            {categoryId ? 'Bu kategoride henüz konu yok' : 'Henüz konu bulunmuyor'}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {topics.map((topic: any) => (
        <Link key={topic.id} href={`/forum/topic/${topic.id}`}>
          <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg hover:bg-midnight/60 hover:border-celestial-gold/40 transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                
                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarImage src={topic.author_avatar} />
                  <AvatarFallback className="bg-celestial-gold/20 text-celestial-gold">
                    {topic.author_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {topic.is_pinned && (
                          <Pin className="h-4 w-4 text-celestial-gold" />
                        )}
                        {topic.is_locked && (
                          <Lock className="h-4 w-4 text-red-400" />
                        )}
                        <h3 className="text-lg font-semibold text-white group-hover:text-celestial-gold transition-colors line-clamp-1">
                          {topic.title}
                        </h3>
                      </div>
                      
                      <p className="text-white/70 text-sm line-clamp-2 mb-3">
                        {topic.content}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-white/60">
                        <span>
                          <strong className="text-white/80">{topic.author_name}</strong> 
                          {' · '}
                          {formatDistanceToNow(new Date(topic.created_at), { 
                            addSuffix: true, 
                            locale: tr 
                          })}
                        </span>
                        
                        {topic.forum_categories && (
                          <Badge 
                            variant="secondary" 
                            className="bg-cosmic-blue/20 text-celestial-gold border-0"
                          >
                            {topic.forum_categories.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-sm text-white/60 ml-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{topic.view_count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{topic.reply_count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4 text-green-400" />
                        <span>{topic.like_count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsDown className="h-4 w-4 text-red-400" />
                        <span>{topic.dislike_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
} 