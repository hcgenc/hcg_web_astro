"use client"

import { useState } from "react"
import Image from "next/image"
import { useDailyShares } from "@/hooks/use-daily-shares"
import { AnimatePresence, motion } from "framer-motion"

export function DailySharesList() {
  const { shares, loading, error } = useDailyShares()
  const [showAll, setShowAll] = useState(false)
  const [expandedShares, setExpandedShares] = useState<Set<string>>(new Set())

  const toggleExpanded = (shareId: string) => {
    setExpandedShares(prev => {
      const newSet = new Set(prev)
      if (newSet.has(shareId)) {
        newSet.delete(shareId)
      } else {
        newSet.add(shareId)
      }
      return newSet
    })
  }

  const truncateContent = (content: string, shareId: string) => {
    const maxLength = 300
    if (content.length <= maxLength) return content
    
    const isExpanded = expandedShares.has(shareId)
    if (isExpanded) return content
    
    return content.substring(0, maxLength) + "..."
  }



  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-pulse text-white/60">Paylaşımlar Yükleniyor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-center">
        <p className="text-red-400">Paylaşımlar yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>
      </div>
    )
  }

  if (shares.length === 0) {
    return (
      <div className="bg-black/40 rounded-lg p-8 text-center">
        <p className="text-white/70">Henüz paylaşım bulunmuyor.</p>
      </div>
    )
  }

  // Sadece ilk 3 paylaşımı göster
  const visibleShares = showAll ? shares : shares.slice(0, 3)
  const hasMore = shares.length > 3 && !showAll
  const canShowLess = shares.length > 3 && showAll
  const latestShareId = shares.length > 0 ? shares[0].id : null

  return (
    <div className="flex flex-col gap-5">
      {/* Gönderiler */}
      <div className="flex flex-col gap-5">
        <AnimatePresence initial={false}>
          {visibleShares.map((share, idx) => {
            // Sadece Supabase'den dönen en güncel gönderinin id'siyle kontrol
            const isLatest = share.id === latestShareId;
            const isExpanded = expandedShares.has(share.id);
            const needsTruncation = share.content.length > 300;
            const displayContent = truncateContent(share.content, share.id);
            
            return (
              <motion.div
                key={share.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.45, ease: [0.4, 0.2, 0.2, 1] }}
                className="relative group bg-gradient-to-r from-deep-purple/80 via-black/70 to-cosmic-blue/60 rounded-xl shadow-xl p-5 flex flex-row items-start transition-transform duration-300 hover:-translate-y-1 hover:shadow-celestial-gold/40 border border-celestial-gold/10 overflow-hidden min-h-[120px]"
              >
                {/* Sol: Profil ve Tarih */}
                <div className="flex flex-col items-center mr-6 min-w-[90px]">
                  <div className="relative mb-2">
                    <Image
                      src="/images/andromeda.png"
                      alt="Admin"
                      width={56}
                      height={56}
                      className="rounded-full object-cover shadow"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-100 text-base leading-tight whitespace-nowrap">Admin</div>
                    <div className="text-xs text-gray-300 whitespace-nowrap">{new Date(share.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
                {/* Sağ: İçerik */}
                <div className="relative w-full flex-1 flex flex-col justify-center">
                  <div className="absolute inset-0 bg-cosmic-blue/10 rounded-lg blur-[2px] opacity-30 pointer-events-none"></div>
                  <div className="relative z-10">
                    <pre className="text-white/90 text-sm md:text-base leading-snug drop-shadow break-words whitespace-pre-line font-sans bg-transparent p-0 m-0 min-h-[80px]">
                      {displayContent}
                    </pre>
                    {needsTruncation && (
                      <button
                        onClick={() => toggleExpanded(share.id)}
                        className="mt-2 text-celestial-gold/80 hover:text-celestial-gold text-sm font-medium transition-colors underline decoration-dotted underline-offset-2 cursor-pointer select-none"
                      >
                        {isExpanded ? "Daha az göster" : "Devamını gör"}
                      </button>
                    )}
                  </div>
                </div>
                {/* YENİ etiketi (sadece en güncel paylaşımda) */}
                {isLatest && (
                  <div className="absolute top-2 right-2 z-20 badge-latest">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium border border-celestial-gold/60 bg-deep-purple/70 text-celestial-gold shadow-sm animate-fade-badge" style={{letterSpacing: '0.04em'}}>YENİ</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {/* Daha Fazla Göster kutusu */}
      {hasMore && (
        <div className="flex items-center justify-center mt-2">
          <div
            className="backdrop-blur-md bg-black/30 border border-cosmic-blue/20 rounded-xl px-6 py-3 text-white/70 text-sm font-medium cursor-pointer transition-all hover:bg-cosmic-blue/20 hover:text-celestial-gold shadow-lg min-w-[160px] flex items-center gap-2 select-none"
            style={{filter: 'blur(0.5px)'}}
            onClick={() => setShowAll(true)}
          >
            <svg className="w-5 h-5 text-celestial-gold/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            Daha Fazla Göster
          </div>
        </div>
      )}
      {/* Daha Az Göster kutusu */}
      {canShowLess && (
        <div className="flex items-center justify-center mt-2">
          <div
            className="backdrop-blur-md bg-black/30 border border-cosmic-blue/20 rounded-xl px-6 py-3 text-white/70 text-sm font-medium cursor-pointer transition-all hover:bg-cosmic-blue/20 hover:text-celestial-gold shadow-lg min-w-[160px] flex items-center gap-2 select-none"
            style={{filter: 'blur(0.5px)'}}
            onClick={() => setShowAll(false)}
          >
            <svg className="w-5 h-5 text-celestial-gold/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            Daha Az Göster
          </div>
        </div>
      )}
    </div>
  )
} 