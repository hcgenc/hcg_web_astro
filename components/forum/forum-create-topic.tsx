"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useForumCategories } from "@/hooks/use-forum-categories"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ForumCreateTopicProps {
  children: React.ReactNode
}

export default function ForumCreateTopic({ children }: ForumCreateTopicProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: ''
  })
  
  const { categories, isLoading: categoriesLoading } = useForumCategories()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/forum/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Konu oluşturulamadı')
      }

      toast({
        title: "Başarılı!",
        description: "Konu başarıyla oluşturuldu.",
      })

      setFormData({
        title: '',
        content: '',
        category_id: ''
      })
      setOpen(false)
      
      // Refresh the page to show new topic
      window.location.reload()
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Konu oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-midnight/95 border-celestial-gold/20 backdrop-blur-xl text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-celestial-gold">Yeni Konu Oluştur</DialogTitle>
          <DialogDescription className="text-white/70">
            Astroloji, spiritüellik ve kozmik konular hakkında yeni bir tartışma başlatın
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* User Info Display */}
          <div className="bg-deep-purple/10 p-3 rounded-lg border border-celestial-gold/20">
            <p className="text-white/80 text-sm">
              <span className="text-celestial-gold">Kullanıcı:</span> {user?.user_metadata?.full_name || user?.email || 'Kullanıcı'}
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-white/80">Kategori</Label>
            <Select 
              value={formData.category_id} 
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              required
            >
              <SelectTrigger className="bg-deep-purple/20 border-celestial-gold/20 text-white">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent className="bg-midnight/95 border-celestial-gold/20 text-white">
                {categoriesLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/80">Başlık</Label>
            <Input
              id="title"
              placeholder="Konu başlığını girin"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-deep-purple/20 border-celestial-gold/20 text-white placeholder:text-white/50 focus:border-celestial-gold"
              required
              minLength={5}
              maxLength={200}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white/80">İçerik</Label>
            <Textarea
              id="content"
              placeholder="Konunuz hakkında detayları yazın..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-deep-purple/20 border-celestial-gold/20 text-white placeholder:text-white/50 focus:border-celestial-gold min-h-[120px]"
              required
              minLength={10}
              maxLength={10000}
            />
          </div>



          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-transparent border-celestial-gold/30 text-white hover:bg-celestial-gold/10"
            >
              İptal
            </Button>
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
              Konu Oluştur
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 