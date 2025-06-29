import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

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
    supabase
      .getBlogPosts()
      .then((data) => {
        setPosts(data as BlogPost[])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { posts, loading, error }
} 