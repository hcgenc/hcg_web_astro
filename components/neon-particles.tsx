"use client"

import { useEffect, useRef } from "react"

interface NeonParticlesProps {
  count?: number
  size?: number
  minDistance?: number
}

export default function NeonParticles({ count = 100, size = 2, minDistance = 30 }: NeonParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Array of neon colors for the particles
  const neonColors = [
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FF9900", // Orange
    "#39FF14", // Neon green
    "#FF3131", // Neon red
    "#1E90FF", // Dodger blue
    "#FFFF00", // Yellow
    "#FF1493", // Deep pink
    "#00FF7F", // Spring green
    "#FF00FF", // Fuchsia
  ]

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.style.height = "100vh"
    container.style.width = "100vw"
    container.style.position = "fixed"

    const containerWidth = window.innerWidth
    const containerHeight = window.innerHeight

    // Clear any existing particles
    container.innerHTML = ""

    // Keep track of particle positions to ensure minimum distance
    const positions: Array<{ x: number; y: number }> = []
    // Her partikül için animasyon parametreleri
    const fadeParams: Array<{ phase: number; speed: number }> = []
    // Her partikül için referans
    const particleDivs: HTMLDivElement[] = []

    // Function to check if a position is too close to existing particles
    const isTooClose = (x: number, y: number): boolean => {
      return positions.some((pos) => {
        const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2))
        return distance < minDistance
      })
    }

    // Create static particles with better spacing
    let attempts = 0
    const maxAttempts = count * 10 // Limit attempts to avoid infinite loops

    for (let i = 0; i < count && attempts < maxAttempts; attempts++) {
      // Random position across the entire viewport
      const x = Math.random() * containerWidth
      const y = Math.random() * containerHeight

      // Check if this position is too close to existing particles
      if (isTooClose(x, y)) continue

      // If we get here, the position is good
      positions.push({ x, y })

      const particle = document.createElement("div")
      particleDivs.push(particle)

      // Random size variation - smaller range for better balance
      const sizeVariation = Math.random() * size + 0.5

      // Random color from neon palette
      const color = neonColors[Math.floor(Math.random() * neonColors.length)]

      // Random opacity for depth effect - more subtle range
      // Başlangıç opacity'si 0.5
      particle.style.opacity = "0.5"

      // Set particle styles
      particle.style.position = "absolute"
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      particle.style.width = `${sizeVariation}px`
      particle.style.height = `${sizeVariation}px`
      particle.style.backgroundColor = color
      particle.style.borderRadius = "50%" // Ensure they're perfect circles

      // More balanced glare effect
      particle.style.boxShadow = `0 0 ${sizeVariation * 2}px ${sizeVariation * 0.8}px ${color}`
      particle.style.zIndex = "0"

      // Fade animasyon parametreleri
      fadeParams.push({
        phase: Math.random() * Math.PI * 2,
        speed: 0.7 + Math.random() * 0.7, // 0.7-1.4 saniye arası bir döngü
      })

      container.appendChild(particle)
      i++
    }

    // Fade animasyonu
    let running = true
    function animateFade() {
      const now = performance.now() / 1000
      for (let i = 0; i < particleDivs.length; i++) {
        const { phase, speed } = fadeParams[i]
        // Opacity 0.25-0.85 arası smooth sinüs ile değişsin
        const opacity = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin((now * (1 / speed)) + phase))
        particleDivs[i].style.opacity = opacity.toString()
      }
      if (running) requestAnimationFrame(animateFade)
    }
    animateFade()

    // Handle window resize to reposition particles
    const handleResize = () => {
      running = false
      // Re-run the effect to reposition particles
      container.innerHTML = ""
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      running = false
      container.innerHTML = ""
    }
  }, [count, size, minDistance, neonColors])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none neon-particles-container"
      style={{
        background: "transparent",
        height: "100vh",
        width: "100vw",
      }}
    />
  )
}
