import { DailySharesList } from "@/components/daily-shares-list"
import { BlogPostsList } from "@/components/blog-posts-list"
import NeonParticles from "@/components/neon-particles"
import CometCanvas from "@/components/comet-canvas"

export default function SocialPage() {
  return (
    <>
      {/* Yıldız partikülleri ve kuyruklu yıldız arka planı */}
      <NeonParticles count={220} size={2.2} minDistance={28} />
      <CometCanvas />
      <section className="py-20 min-h-[60vh] bg-gradient-to-b from-midnight via-deep-purple/10 to-midnight relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-celestial-gold drop-shadow-lg">Sosyal</h1>
            <p className="text-white/70 max-w-2xl mx-auto">Astroloji, rüya tabirleri ve ruhsal gelişim üzerine güncel yazılarımızı ve günlük paylaşımlarımızı keşfedin.</p>
          </div>
          {/* Günlük Paylaşımlar */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-celestial-gold mb-6">Günlük Paylaşımlar</h2>
            <DailySharesList />
          </div>
          {/* Blog Yazıları */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-celestial-gold mb-6">Blog Yazıları</h2>
            <BlogPostsList />
          </div>
        </div>
      </section>
    </>
  )
} 