"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryImage {
  id: number
  src: string
  alt: string
  caption: string
}

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const images: GalleryImage[] = [
    {
      id: 1,
      src: "/images/eagle-nebula.png",
      alt: "Kartal Bulutsusu – Yıldızların kozmik tozdan doğduğu yer",
      caption: "Kartal Bulutsusu – Yıldızların kozmik tozdan doğduğu yer",
    },
    {
      id: 2,
      src: "/images/andromeda.png",
      alt: "Andromeda Galaksisi – Kozmik komşumuz",
      caption: "Andromeda Galaksisi – Kozmik komşumuz",
    },
    {
      id: 3,
      src: "/images/aurora.png",
      alt: "Kuzey Işıkları – Dünyanın güneş enerjisiyle bağlantısı",
      caption: "Kuzey Işıkları – Dünyanın güneş enerjisiyle bağlantısı",
    },
    {
      id: 4,
      src: "/images/lunar.png",
      alt: "Ay Döngüsü – Kozmik enerjinin ritmi",
      caption: "Ay Döngüsü – Kozmik enerjinin ritmi",
    },
    {
      id: 5,
      src: "/images/zodiac.png",
      alt: "Burç Takımyıldızları – Kadim göksel rehberler",
      caption: "Burç Takımyıldızları – Kadim göksel rehberler",
    },
  ]

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  useEffect(() => {
    autoPlayRef.current = setInterval(nextSlide, 6000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [])

  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    autoPlayRef.current = setInterval(nextSlide, 6000)
  }

  const handleNavigation = (direction: "prev" | "next") => {
    resetAutoPlay()
    if (direction === "prev") {
      prevSlide()
    } else {
      nextSlide()
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-deep-purple/10 to-midnight z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Kozmik Galeri</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Göksel görüntülerimiz aracılığıyla kozmosun güzelliğini ve harikalarını keşfedin.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentIndex].src || "/placeholder.svg"}
                alt={images[currentIndex].alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent"></div>

              <div className="absolute bottom-6 left-6 right-6 p-4 bg-deep-purple/40 backdrop-blur-md rounded-xl border border-cosmic-blue/20">
                <p className="text-white/90 text-sm md:text-base">{images[currentIndex].caption}</p>
              </div>
            </motion.div>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-deep-purple/40 backdrop-blur-md border border-cosmic-blue/20 hover:bg-deep-purple/60"
              onClick={() => handleNavigation("prev")}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-deep-purple/40 backdrop-blur-md border border-cosmic-blue/20 hover:bg-deep-purple/60"
              onClick={() => handleNavigation("next")}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-celestial-gold" : "bg-white/30"
                }`}
                onClick={() => {
                  resetAutoPlay()
                  setCurrentIndex(index)
                }}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
