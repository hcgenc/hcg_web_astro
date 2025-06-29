"use client"

import { useState, useEffect } from 'react'

export interface ForumTopic {
  id: string
  title: string
  content: string
  category_id: string
  author_id?: string
  author_name: string
  author_avatar?: string
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  reply_count: number
  vote_score: number
  like_count: number
  dislike_count: number
  created_at: string
  updated_at: string
  last_reply_at?: string
  forum_categories?: {
    id: string
    name: string
    color?: string
  }
}

export interface ForumTopicsOptions {
  category_id?: string | null
  page?: number
  limit?: number
  sort?: 'latest' | 'popular' | 'oldest'
}

export function useForumTopics(options: ForumTopicsOptions = {}) {
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  })

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        
        if (options.category_id) params.append('category_id', options.category_id)
        if (options.page) params.append('page', options.page.toString())
        if (options.limit) params.append('limit', options.limit.toString())
        if (options.sort) params.append('sort', options.sort)

        const response = await fetch(`/api/forum/topics?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Topics could not be loaded')
        }

        const result = await response.json()
        setTopics(result.data || [])
        setPagination(result.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          total_pages: 0
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopics()
  }, [options.category_id, options.page, options.limit, options.sort])

  return { topics, pagination, isLoading, error }
} 