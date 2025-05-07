"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function HeroSection() {
  const starsCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!starsCanvasRef.current) return

    const canvas = starsCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Star properties
    const stars: { x: number; y: number; radius: number; color: string; velocity: number }[] = []

    // Create stars
    const createStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 3000)

      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 1.5
        const color = i % 20 === 0 ? "#FFD700" : i % 10 === 0 ? "#4169E1" : "#FFFFFF"
        const velocity = Math.random() * 0.05

        stars.push({ x, y, radius, color, velocity })
      }
    }

    // Animate stars
    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.fill()

        // Move star
        star.y += star.velocity

        // Reset star position if it goes off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animateStars)
    }

    createStars()
    animateStars()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <canvas ref={starsCanvasRef} className="absolute inset-0 z-0 overflow-hidden" style={{ opacity: 0.7 }} />

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-midnight/0 via-midnight/20 to-midnight"></div>

      <div className="container mx-auto px-4 z-20 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block">Yolunuzu Keşfedin</span>
              <span className="bg-gradient-to-r from-white via-celestial-gold to-cosmic-blue bg-clip-text text-transparent">
                Yıldızlar Arasında
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Astronomi temelli hizmetlerimiz ve göksel içgörülerimizle ruhsal yolculuğunuza rehberlik eden kozmik
              bilgeliğin kapılarını aralayın.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="cosmic-button" asChild>
                <a href="#services">Hizmetleri Keşfet</a>
              </Button>
              <Button
                variant="outline"
                className="border-cosmic-blue/30 hover:border-celestial-gold/50 hover:bg-deep-purple/20"
                asChild
              >
                <a href="#contact">Bize Ulaşın</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full aspect-[3/2] bg-gradient-to-b from-midnight via-deep-purple/80 to-cosmic-blue/80 rounded-2xl overflow-hidden glow-effect flex items-center justify-center p-0">
              <Image
                src="/images/carl-sagan.png"
                alt="Carl Sagan"
                fill
                className="object-contain rounded-2xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent"></div>
            </div>

            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cosmic-blue/20 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-deep-purple/20 blur-3xl"></div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20 animate-bounce">
        <a href="#services" className="text-white/70 hover:text-celestial-gold transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span className="sr-only">Aşağı kaydır</span>
        </a>
      </div>
    </section>
  )
}
