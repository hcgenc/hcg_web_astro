"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useForumCategories } from "@/hooks/use-forum-categories"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function ForumCategoriesList() {
  const { categories, isLoading, error } = useForumCategories()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-celestial-gold" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm text-center py-4">
        Kategoriler yüklenirken hata oluştu
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-white/60 text-sm text-center py-4">
        Henüz kategori bulunmuyor
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={`/forum?category=${category.id}`}
          className="block"
        >
          <Button
            variant="ghost"
            className="w-full justify-between h-auto p-3 bg-deep-purple/20 hover:bg-celestial-gold/20 border border-transparent hover:border-celestial-gold/30 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color || '#f4d03f' }}
              />
              <div className="text-left">
                <div className="font-medium text-white group-hover:text-celestial-gold transition-colors">
                  {category.name}
                </div>
                {category.description && (
                  <div className="text-xs text-white/60 mt-0.5">
                    {category.description}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-cosmic-blue/20 text-white/80 border-0">
                {category.topic_count || 0}
              </Badge>
            </div>
          </Button>
        </Link>
      ))}
    </div>
  )
} 