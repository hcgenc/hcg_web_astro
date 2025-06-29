"use client"

import { useState, useEffect } from 'react'

interface ForumStats {
  topics: number
  messages: number
  activeUsers: number
}

export function useForumStats() {
  const [stats, setStats] = useState<ForumStats>({
    topics: 0,
    messages: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const response = await fetch('/api/forum/stats')
        
        if (!response.ok) {
          throw new Error('İstatistikler yüklenemedi')
        }

        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
        console.error('Forum stats error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
} 