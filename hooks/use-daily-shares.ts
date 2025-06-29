import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface DailyShare {
  id: string
  content: string
  date: string
  created_at?: string
  user_id?: string | null
}

export function useDailyShares() {
  const [shares, setShares] = useState<DailyShare[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    supabase
      .getDailyShares()
      .then((data) => {
        if (data) {
          // API'den dönen data'yı olduğu gibi kullan
          setShares(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Daily shares error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { shares, loading, error }
} 