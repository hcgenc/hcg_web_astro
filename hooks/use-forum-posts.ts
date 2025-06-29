"use client"

import { useState, useEffect } from 'react'

export interface ForumPost {
  id: string
  content: string
  topic_id: string
  parent_id?: string
  author_id?: string
  author_name: string
  author_avatar?: string
  vote_score: number
  like_count: number
  dislike_count: number
  is_edited: boolean
  created_at: string
  updated_at: string
  replies?: ForumPost[]
}

export interface ForumPostsOptions {
  topic_id: string
  page?: number
  limit?: number
  sort?: 'oldest' | 'newest' | 'popular'
}

export function useForumPosts(options: ForumPostsOptions) {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  })

  useEffect(() => {
    const fetchPosts = async () => {
      if (!options.topic_id) return

      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.append('topic_id', options.topic_id)
        
        if (options.page) params.append('page', options.page.toString())
        if (options.limit) params.append('limit', options.limit.toString())
        if (options.sort) params.append('sort', options.sort)

        const response = await fetch(`/api/forum/posts?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Posts could not be loaded')
        }

        const result = await response.json()
        setPosts(result.data || [])
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

    fetchPosts()
  }, [options.topic_id, options.page, options.limit, options.sort])

  return { posts, pagination, isLoading, error }
} 