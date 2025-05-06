"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Anchor linkler için özel yönlendirme
  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, hash: string) {
    if (pathname !== "/") {
      e.preventDefault()
      router.push(`/${hash}`)
      setIsMobileMenuOpen(false)
    }
    // Ana sayfadaysa normal anchor çalışsın
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-midnight/80 backdrop-blur-md py-2 shadow-lg" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-white via-celestial-gold to-white bg-clip-text text-transparent">
            Kozmik Yollar
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#services" onClick={e => handleNav(e, "#services")} className="text-white/80 hover:text-celestial-gold transition-colors animate-fade-pulse">
            Hizmetler
          </Link>
          <Link href="#testimonials" onClick={e => handleNav(e, "#testimonials")} className="text-white/80 hover:text-celestial-gold transition-colors">
            Yorumlar
          </Link>
          <Link href="#about" onClick={e => handleNav(e, "#about")} className="text-white/80 hover:text-celestial-gold transition-colors">
            Hakkımızda
          </Link>
          <Link href="#contact" onClick={e => handleNav(e, "#contact")} className="text-white/80 hover:text-celestial-gold transition-colors">
            İletişim
          </Link>
          <Link href="/blog" className="border-2 border-celestial-gold text-celestial-gold font-semibold px-5 py-2 rounded-full shadow-md bg-transparent hover:bg-transparent hover:text-white hover:border-cosmic-blue transition-all">
            Paylaşımlar
          </Link>
          <span className="relative inline-flex items-center px-5 py-2 rounded-full font-semibold text-celestial-gold border-2 border-celestial-gold/50 bg-transparent opacity-60 cursor-not-allowed select-none">
            Forum
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-cosmic-blue/80 text-white font-medium border border-celestial-gold/40">Yakında</span>
          </span>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mr-2 rounded-full border-cosmic-blue/30 hover:border-celestial-gold/50 hover:bg-deep-purple/20"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-celestial-gold" />
            ) : (
              <Menu className="h-5 w-5 text-celestial-gold" />
            )}
            <span className="sr-only">Menüyü aç/kapat</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden cosmic-gradient absolute top-full left-0 right-0 p-4 shadow-lg border-t border-cosmic-blue/20 backdrop-blur-md">
          <nav className="flex flex-col space-y-4">
            <Link
              href="#services"
              onClick={e => handleNav(e, "#services")}
              className="text-white/80 hover:text-celestial-gold transition-colors py-2 px-4 rounded-lg hover:bg-deep-purple/20 animate-fade-pulse"
            >
              Hizmetler
            </Link>
            <Link
              href="#testimonials"
              onClick={e => handleNav(e, "#testimonials")}
              className="text-white/80 hover:text-celestial-gold transition-colors py-2 px-4 rounded-lg hover:bg-deep-purple/20"
            >
              Yorumlar
            </Link>
            <Link
              href="#about"
              onClick={e => handleNav(e, "#about")}
              className="text-white/80 hover:text-celestial-gold transition-colors py-2 px-4 rounded-lg hover:bg-deep-purple/20"
            >
              Hakkımızda
            </Link>
            <Link
              href="#contact"
              onClick={e => handleNav(e, "#contact")}
              className="text-white/80 hover:text-celestial-gold transition-colors py-2 px-4 rounded-lg hover:bg-deep-purple/20"
            >
              İletişim
            </Link>
            <Link
              href="/blog"
              className="border-2 border-celestial-gold text-celestial-gold font-semibold px-5 py-2 rounded-full shadow-md bg-transparent hover:bg-transparent hover:text-white hover:border-cosmic-blue transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Paylaşımlar
            </Link>
            <span className="relative inline-flex items-center px-5 py-2 rounded-full font-semibold text-celestial-gold border-2 border-celestial-gold/50 bg-transparent opacity-60 cursor-not-allowed select-none">
              Forum
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-cosmic-blue/80 text-white font-medium border border-celestial-gold/40">Yakında</span>
            </span>
          </nav>
        </div>
      )}
    </header>
  )
}
