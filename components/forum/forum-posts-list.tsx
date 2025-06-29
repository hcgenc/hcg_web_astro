"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useForumPosts } from "@/hooks/use-forum-posts"
import { useAuth } from "@/hooks/use-auth"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { Loader2, ThumbsUp, ThumbsDown, Reply, Trash2, Send } from "lucide-react"
import { useState } from "react"

interface ForumPostsListProps {
  topicId: string
}

export default function ForumPostsList({ topicId }: ForumPostsListProps) {
  const { posts, isLoading, error } = useForumPosts({ topic_id: topicId })
  const { user } = useAuth()
  const [votingPosts, setVotingPosts] = useState<Set<string>>(new Set())
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    setVotingPosts(prev => new Set(prev).add(postId))
    
    try {
      const response = await fetch('/api/forum/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_type: 'post',
          target_id: postId,
          vote_type: voteType,
          voter_name: 'Anonymous', // Will be replaced with real auth
          voter_ip: null
        }),
      })

      if (response.ok) {
        // Refresh posts
        window.location.reload()
      }
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setVotingPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  const handleDelete = async (postId: string, authorName: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/forum/posts?post_id=${postId}&author_name=${authorName}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh posts
        window.location.reload()
      } else {
        alert('Yorum silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Yorum silinirken hata oluştu')
    }
  }

  const handleReply = (authorName: string) => {
    if (!user) {
      alert('Cevap yazmak için giriş yapmalısınız')
      return
    }
    setReplyingTo(authorName)
    setReplyContent(`@${authorName} `)
  }

  const submitReply = async () => {
    if (!replyContent.trim() || !user) {
      return
    }

    setSubmittingReply(true)
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic_id: topicId,
          content: replyContent,
          author_name: user.full_name,
          author_avatar: user.avatar_url,
          parent_id: null // Ana topic'e reply olarak
        }),
      })

      if (response.ok) {
        setReplyingTo(null)
        setReplyContent('')
        // Refresh posts
        window.location.reload()
      } else {
        alert('Cevap gönderilirken hata oluştu')
      }
    } catch (error) {
      console.error('Reply error:', error)
      alert('Cevap gönderilirken hata oluştu')
    } finally {
      setSubmittingReply(false)
    }
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setReplyContent('')
  }

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
            Yorumlar yüklenirken hata oluştu
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
        <CardContent className="p-6 text-center">
          <div className="text-white/60">
            Henüz yorum yok. İlk yorumu siz yapın!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <Card key={post.id} className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              


              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author_avatar} />
                <AvatarFallback className="bg-celestial-gold/20 text-celestial-gold">
                  {post.author_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{post.author_name}</span>
                    <span className="text-sm text-white/60">
                      {formatDistanceToNow(new Date(post.created_at), { 
                        addSuffix: true, 
                        locale: tr 
                      })}
                    </span>
                    {post.is_edited && (
                      <span className="text-xs text-white/50">(düzenlendi)</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReply(post.author_name)}
                      className="h-8 w-8 p-0 text-white/60 hover:text-celestial-gold"
                      title="Cevapla"
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                    {user && user.full_name === post.author_name && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id, post.author_name)}
                        className="h-8 w-8 p-0 text-white/60 hover:text-red-400"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-white/80 whitespace-pre-wrap">
                  {post.content}
                </div>

                {/* Stats with Vote Buttons */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-sm text-white/60">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs">
                      {formatDistanceToNow(new Date(post.created_at), { 
                        addSuffix: true, 
                        locale: tr 
                      })}
                    </span>
                  </div>
                  
                  {/* Vote Buttons */}
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(post.id, 'up')}
                      disabled={votingPosts.has(post.id)}
                      className="h-8 px-3 text-white/60 hover:text-green-400 hover:bg-green-500/10"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span className="text-green-400 font-medium text-sm">
                        {post.like_count || 0}
                      </span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(post.id, 'down')}
                      disabled={votingPosts.has(post.id)}
                      className="h-8 px-3 text-white/60 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      <span className="text-red-400 font-medium text-sm">
                        {post.dislike_count || 0}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Replies */}
                {post.replies && post.replies.length > 0 && (
                  <div className="mt-4 pl-4 space-y-3 border-l-2 border-celestial-gold/20">
                    {post.replies.map((reply: any) => (
                      <div key={reply.id} className="flex items-start space-x-3">


                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.author_avatar} />
                          <AvatarFallback className="bg-cosmic-blue/20 text-white text-xs">
                            {reply.author_name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-white/90">{reply.author_name}</span>
                              <span className="text-xs text-white/50">
                                {formatDistanceToNow(new Date(reply.created_at), { 
                                  addSuffix: true, 
                                  locale: tr 
                                })}
                              </span>
                            </div>

                            {/* Reply Actions */}
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReply(reply.author_name)}
                                className="h-6 w-6 p-0 text-white/40 hover:text-celestial-gold"
                                title="Cevapla"
                              >
                                <Reply className="h-3 w-3" />
                              </Button>
                              {user && user.full_name === reply.author_name && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(reply.id, reply.author_name)}
                                  className="h-6 w-6 p-0 text-white/40 hover:text-red-400"
                                  title="Sil"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-white/70">
                            {reply.content}
                          </div>

                          {/* Reply Stats with Vote Buttons */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs text-white/60">
                            <div>
                              <span>
                                {formatDistanceToNow(new Date(reply.created_at), { 
                                  addSuffix: true, 
                                  locale: tr 
                                })}
                              </span>
                            </div>
                            
                            {/* Vote Buttons */}
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVote(reply.id, 'up')}
                                disabled={votingPosts.has(reply.id)}
                                className="h-6 px-2 text-white/40 hover:text-green-400 hover:bg-green-500/10"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                <span className="text-green-400 font-medium text-xs">
                                  {reply.like_count || 0}
                                </span>
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVote(reply.id, 'down')}
                                disabled={votingPosts.has(reply.id)}
                                className="h-6 px-2 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                <span className="text-red-400 font-medium text-xs">
                                  {reply.dislike_count || 0}
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Reply Form */}
      {replyingTo && user && (
        <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-celestial-gold/20 text-celestial-gold">
                  {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div className="text-sm text-white/70">
                  <span className="text-celestial-gold">{replyingTo}</span> kullanıcısına cevap yazıyorsunuz
                </div>
                
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Cevabınızı yazın..."
                  className="min-h-[100px] bg-midnight/20 border-celestial-gold/20 text-white placeholder:text-white/40 resize-none focus:border-celestial-gold/40"
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/60">
                    {replyContent.length}/1000 karakter
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelReply}
                      className="text-white/60 hover:text-white"
                    >
                      İptal
                    </Button>
                    
                    <Button
                      onClick={submitReply}
                      disabled={submittingReply || !replyContent.trim() || replyContent.length > 1000}
                      className="bg-celestial-gold/20 hover:bg-celestial-gold/30 text-celestial-gold border border-celestial-gold/20"
                    >
                      {submittingReply ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Gönder
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 