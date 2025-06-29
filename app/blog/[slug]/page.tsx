"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  image: string
  date: string
}

export default function BlogPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        if (!slug) {
          setError(true)
          setLoading(false)
          return
        }

        setLoading(true)
        
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, slug, title, content, image, date")
          .eq("slug", slug)
          .single()

        if (error) {
          console.error("Error fetching blog post:", error)
          setError(true)
        } else {
          setPost(data as BlogPost)
        }
      } catch (err) {
        console.error("Error in fetchPost:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  // Yükleniyor durumu
  if (loading) {
    return (
      <section className="py-20 min-h-[60vh] bg-gradient-to-b from-midnight via-deep-purple/10 to-midnight">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="animate-pulse text-white/60">Yazı Yükleniyor...</div>
        </div>
      </section>
    )
  }

  // Hata durumu
  if (error || !post) {
    return (
      <section className="py-20 min-h-[60vh] bg-gradient-to-b from-midnight via-deep-purple/10 to-midnight">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-red-400">Blog Yazısı Bulunamadı</h1>
          <p className="text-white/70">Aradığınız blog yazısı bulunamadı veya bir hata oluştu.</p>
        </div>
      </section>
    )
  }

  // Post bulundu, normal render yap
  const formattedDate = new Date(post.date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <section className="py-20 min-h-[60vh] bg-gradient-to-b from-midnight via-deep-purple/10 to-midnight">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-celestial-gold drop-shadow-lg">{post.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-white/50">{formattedDate}</span>
            <span className="text-xs sm:text-sm text-cosmic-blue bg-white/10 rounded px-2 py-0.5 ml-2">slug: {post.slug}</span>
          </div>
        </div>
        
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image 
            src={post.image || "/placeholder.jpg"} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        <article className="prose prose-invert prose-lg max-w-none text-white/90 bg-black/40 p-6 sm:p-8 rounded-xl shadow whitespace-pre-line">
          {post.content}
        </article>
      </div>
    </section>
  )
} 