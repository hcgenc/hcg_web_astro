import { useEffect, useState } from "react"
import { fetchDailyShares } from "@/lib/supabase"

export interface DailyShare {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  date: string
}

export function useDailyShares() {
  const [shares, setShares] = useState<DailyShare[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchDailyShares().then(({ data, error }) => {
      if (error) setError(error.message)
      else if (data) {
        setShares(
          data.map((item: any) => {
            const userData = Array.isArray(item.user) ? item.user[0] : item.user

            return {
              ...item,
              user: {
                ...userData,
                avatar: userData.avatar
                  .replace('Elif Demir.png', 'elif-demir.png')
                  .replace('Mehmet Yılmaz.png', 'mehmet-yilmaz.png')
              }
            }
          })
        )
      }
      setLoading(false)
    })
  }, [])

  return { shares, loading, error }
} 