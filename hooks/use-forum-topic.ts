"use client"

import { useState, useEffect } from 'react'
import { ForumTopic } from './use-forum-topics'

export function useForumTopic(topicId: string) {
  const [topic, setTopic] = useState<ForumTopic | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopic = async () => {
      if (!topicId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/forum/topics?id=${topicId}`)
        
        if (!response.ok) {
          throw new Error('Topic could not be loaded')
        }

        const result = await response.json()
        
        // If the response is paginated, get the first item
        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
          setTopic(result.data[0])
        } else if (result.id) {
          // If the response is a single topic
          setTopic(result)
        } else {
          throw new Error('Topic not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopic()
  }, [topicId])

  return { topic, isLoading, error }
} 