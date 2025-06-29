"use client"

import { useState, useEffect } from 'react'

export interface ForumCategory {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  topic_count: number
  post_count: number
  last_post_id?: string
  created_at: string
  updated_at: string
}

export function useForumCategories() {
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/forum/categories')
        
        if (!response.ok) {
          throw new Error('Categories could not be loaded')
        }

        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, isLoading, error }
} 