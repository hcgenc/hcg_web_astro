"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useForumTopic } from "@/hooks/use-forum-topic"
import { useAuth } from "@/hooks/use-auth"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { Loader2, ThumbsUp, ThumbsDown, Eye, MessageCircle, Pin, Lock, Trash2 } from "lucide-react"
import { useState } from "react"

interface ForumTopicDetailProps {
  topicId: string
}

export default function ForumTopicDetail({ topicId }: ForumTopicDetailProps) {
  const { topic, isLoading, error } = useForumTopic(topicId)
  const { user } = useAuth()
  const [voting, setVoting] = useState(false)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)

  const handleVote = async (voteType: 'up' | 'down') => {
    setVoting(true)
    try {
      const response = await fetch('/api/forum/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_type: 'topic',
          target_id: topicId,
          vote_type: voteType,
          voter_name: 'Anonymous', // Will be replaced with real auth
          voter_ip: null
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.action === 'removed') {
          setUserVote(null)
        } else {
          setUserVote(voteType)
        }
        // Refresh topic data
        window.location.reload()
      }
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setVoting(false)
    }
  }

  const handleDeleteTopic = async () => {
    if (!confirm('Bu konuyu silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/forum/topics?topic_id=${topicId}&author_name=${topic?.author_name}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Redirect to forum main page
        window.location.href = '/forum'
      } else {
        alert('Konu silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Delete topic error:', error)
      alert('Konu silinirken hata oluştu')
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg animate-pulse">
        <CardContent className="p-6">
          <div className="h-8 bg-white/10 rounded mb-4"></div>
          <div className="h-4 bg-white/5 rounded mb-2"></div>
          <div className="h-4 bg-white/5 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-white/5 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  if (error || !topic) {
    return (
      <Card className="bg-midnight/40 border-red-400/20 backdrop-blur-lg">
        <CardContent className="p-6 text-center">
          <div className="text-red-400">
            Konu yüklenirken hata oluştu
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
      <CardContent className="p-6">
        
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            {topic.is_pinned && (
              <Pin className="h-5 w-5 text-celestial-gold" />
            )}
            {topic.is_locked && (
              <Lock className="h-5 w-5 text-red-400" />
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {topic.title}
            </h1>
          </div>
          
          {topic.forum_categories && (
            <Badge 
              variant="secondary" 
              className="bg-cosmic-blue/20 text-celestial-gold border-0 mb-3"
            >
              {topic.forum_categories.name}
            </Badge>
          )}
        </div>

        {/* Author Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={topic.author_avatar} />
              <AvatarFallback className="bg-celestial-gold/20 text-celestial-gold">
                {topic.author_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="font-medium text-white">{topic.author_name}</div>
              <div className="text-sm text-white/60">
                {formatDistanceToNow(new Date(topic.created_at), { 
                  addSuffix: true, 
                  locale: tr 
                })}
              </div>
            </div>
          </div>

          {/* Topic Actions */}
          {user && user.full_name === topic.author_name && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteTopic}
              className="text-white/60 hover:text-red-400"
              title="Konuyu Sil"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-6">
          <div className="text-white/80 whitespace-pre-wrap">
            {topic.content}
          </div>
        </div>



        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-white/60 pt-4 border-t border-celestial-gold/20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{topic.view_count || 0} görüntülenme</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{topic.reply_count || 0} yanıt</span>
            </div>
            {topic.updated_at !== topic.created_at && (
              <div className="text-xs">
                Son düzenleme: {formatDistanceToNow(new Date(topic.updated_at), { 
                  addSuffix: true, 
                  locale: tr 
                })}
              </div>
            )}
          </div>
          
          {/* Vote Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('up')}
              disabled={voting}
              className={`h-8 px-3 ${
                userVote === 'up' 
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                  : 'text-white/60 hover:text-green-400 hover:bg-green-500/10'
              }`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-green-400">{topic.like_count || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('down')}
              disabled={voting}
              className={`h-8 px-3 ${
                userVote === 'down' 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'text-white/60 hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              <span className="text-red-400">{topic.dislike_count || 0}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 