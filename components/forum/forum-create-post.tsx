"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ForumCreatePostProps {
  topicId: string
  parentId?: string
  placeholder?: string
}

export default function ForumCreatePost({ topicId, parentId, placeholder }: ForumCreatePostProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    content: ''
  })
  
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          topic_id: topicId,
          parent_id: parentId || null
        }),
      })

      if (!response.ok) {
        throw new Error('Yorum oluşturulamadı')
      }

      toast({
        title: "Başarılı!",
        description: "Yorumunuz başarıyla eklendi.",
      })

      setFormData({
        content: ''
      })
      
      // Refresh the page to show new post
      window.location.reload()
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Yorum eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-midnight/40 border-celestial-gold/20 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-white text-lg">
          {parentId ? 'Yanıt Yaz' : 'Yorum Yap'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info Display */}
          <div className="bg-deep-purple/10 p-3 rounded-lg border border-celestial-gold/20">
            <p className="text-white/80 text-sm">
              <span className="text-celestial-gold">Kullanıcı:</span> {user?.user_metadata?.full_name || user?.email || 'Kullanıcı'}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="post_content" className="text-white/80">
              {parentId ? 'Yanıtınız' : 'Yorumunuz'}
            </Label>
            <Textarea
              id="post_content"
              placeholder={placeholder || "Düşüncelerinizi paylaşın..."}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-deep-purple/20 border-celestial-gold/20 text-white placeholder:text-white/50 focus:border-celestial-gold min-h-[100px]"
              required
              minLength={1}
              maxLength={5000}
            />
          </div>



          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-celestial-gold to-cosmic-blue hover:from-celestial-gold/80 hover:to-cosmic-blue/80 text-white border-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {parentId ? 'Yanıt Gönder' : 'Yorum Gönder'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 