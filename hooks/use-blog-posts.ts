import { useEffect, useState } from "react"
import { fetchBlogPosts } from "@/lib/supabase"

export interface BlogPost {
  id: string
  slug: string
  title: string
  summary: string
  image: string
  date: string
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchBlogPosts().then(({ data, error }) => {
      if (error) setError(error.message)
      else setPosts(data as BlogPost[])
      setLoading(false)
    })
  }, [])

  return { posts, loading, error }
} 