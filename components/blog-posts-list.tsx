"use client"

import Image from "next/image"
import Link from "next/link"
import { useBlogPosts } from "@/hooks/use-blog-posts"

export function BlogPostsList() {
  const { posts, loading, error } = useBlogPosts()

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-pulse text-white/60">Blog Yazıları Yükleniyor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-center">
        <p className="text-red-400">Blog yazıları yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-black/40 rounded-lg p-8 text-center">
        <p className="text-white/70">Henüz blog yazısı bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, idx) => {
        const isLatest = idx === 0;
        return (
          <div
            key={post.slug}
            className="relative bg-gradient-to-br from-deep-purple/80 via-black/70 to-cosmic-blue/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full transition-transform hover:-translate-y-2 hover:shadow-celestial-gold/40 duration-300 border border-celestial-gold/10 group"
          >
            {isLatest && (
              <div className="absolute top-3 right-3 z-20">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium border border-celestial-gold/60 bg-deep-purple/70 text-celestial-gold shadow-sm animate-fade-badge" style={{letterSpacing: '0.04em'}}>YENİ</span>
              </div>
            )}
            <div className="relative w-full h-48 md:h-44 lg:h-40 overflow-hidden">
              <Image
                src={post.image || "/placeholder.jpg"}
                alt={post.title}
                fill
                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                priority={isLatest}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-base md:text-lg font-bold text-celestial-gold mb-1 drop-shadow-lg line-clamp-2">{post.title}</h3>
              <p className="text-white/80 text-xs md:text-sm mb-3 flex-1 line-clamp-3">{post.summary}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[11px] text-white/50">{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="cosmic-button text-white px-3 py-1.5 rounded-full bg-gradient-to-r from-cosmic-blue to-celestial-gold shadow-md hover:from-celestial-gold hover:to-cosmic-blue transition-all text-xs font-semibold border-0 drop-shadow-lg"
                >
                  Devamını Oku
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
} 