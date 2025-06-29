"use client"
import { useEffect, useRef } from "react"

export default function CometCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let shootingStars: Array<{
      x: number
      y: number
      vx: number
      vy: number
      length: number
      alpha: number
      life: number
      maxLife: number
    }> = []
    let lastSpawn = 0
    const SHOOTING_STAR_INTERVAL = 10000 // 10 saniye

    // Responsive canvas
    const setCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    function spawnShootingStar() {
      if (!canvas) return;
      // Rastgele bir başlangıç noktası (genellikle üstte veya solda)
      const fromTop = Math.random() < 0.5
      const margin = 40
      let x, y, vx, vy
      if (fromTop) {
        x = Math.random() * (canvas.width - margin * 2) + margin
        y = margin
        const angle = Math.PI / 4 + (Math.random() - 0.5) * (Math.PI / 12)
        vx = Math.cos(angle) * (7 + Math.random() * 3)
        vy = Math.sin(angle) * (7 + Math.random() * 3)
      } else {
        x = margin
        y = Math.random() * (canvas.height * 0.7) + margin
        const angle = Math.PI / 6 + (Math.random() - 0.5) * (Math.PI / 10)
        vx = Math.cos(angle) * (7 + Math.random() * 3)
        vy = Math.sin(angle) * (7 + Math.random() * 3)
      }
      shootingStars.push({
        x,
        y,
        vx,
        vy,
        length: 90 + Math.random() * 40,
        alpha: 1,
        life: 0,
        maxLife: 0.7 + Math.random() * 0.4, // saniye
      })
    }

    function drawShootingStars(dt: number) {
      if (!ctx || !canvas) return;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        // Fade out
        s.alpha = Math.max(0, 1 - s.life / s.maxLife)
        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.strokeStyle = "#fff"
        ctx.shadowColor = "#fff"
        ctx.shadowBlur = 16
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx * s.length * 0.12, s.y - s.vy * s.length * 0.12)
        ctx.stroke()
        ctx.restore()
      }
    }

    let lastTime = performance.now()
    function animate(now: number) {
      if (!ctx || !canvas) return
      const dt = (now - lastTime) / 1000
      lastTime = now
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Shooting stars update
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.x += s.vx
        s.y += s.vy
        s.life += dt
        if (
          s.x > canvas.width + 100 ||
          s.y > canvas.height + 100 ||
          s.alpha <= 0.01 ||
          s.life > s.maxLife
        ) {
          shootingStars.splice(i, 1)
        }
      }
      drawShootingStars(dt)

      // Her 10 saniyede bir shooting star oluştur
      if (now - lastSpawn > SHOOTING_STAR_INTERVAL) {
        spawnShootingStar()
        lastSpawn = now
      }

      animationFrameId = requestAnimationFrame(animate)
    }
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  )
} 