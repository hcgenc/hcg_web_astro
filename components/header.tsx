"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X, User, LogOut, LogIn } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()

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
          <Link href="/forum" className="border-2 border-celestial-gold text-celestial-gold font-semibold px-5 py-2 rounded-full shadow-md bg-transparent hover:bg-transparent hover:text-white hover:border-cosmic-blue transition-all">
            Forum
          </Link>

          {/* Auth Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
                    <AvatarFallback className="bg-celestial-gold text-midnight">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-midnight/95 border-celestial-gold/20 backdrop-blur-xl" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-celestial-gold">
                      {user.full_name || 'Kullanıcı'}
                    </p>
                    <p className="w-[200px] truncate text-sm text-white/70">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem
                  className="text-white hover:bg-celestial-gold/10 focus:bg-celestial-gold/10 cursor-pointer"
                  onClick={() => router.push('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Git</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:bg-celestial-gold/10 focus:bg-celestial-gold/10 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/forum/auth">
              <Button className="bg-celestial-gold hover:bg-celestial-gold/80 text-midnight font-semibold">
                <LogIn className="mr-2 h-4 w-4" />
                Giriş Yap
              </Button>
            </Link>
          )}
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
            <Link
              href="/forum"
              className="border-2 border-celestial-gold text-celestial-gold font-semibold px-5 py-2 rounded-full shadow-md bg-transparent hover:bg-transparent hover:text-white hover:border-cosmic-blue transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Forum
            </Link>

            {/* Mobile Auth Section */}
            {user ? (
              <div className="pt-4 border-t border-celestial-gold/20 space-y-2">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
                    <AvatarFallback className="bg-celestial-gold text-midnight">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-celestial-gold font-medium">
                      {user.full_name || 'Kullanıcı'}
                    </p>
                    <p className="text-white/70 text-sm">{user.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    router.push('/profile')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full bg-transparent border border-celestial-gold/30 text-white hover:bg-celestial-gold/10 mb-2"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile Git
                </Button>
                <Button
                  onClick={() => {
                    signOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full bg-transparent border border-celestial-gold/30 text-white hover:bg-celestial-gold/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </Button>
              </div>
            ) : (
              <Link
                href="/forum/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block"
              >
                <Button className="w-full bg-celestial-gold hover:bg-celestial-gold/80 text-midnight font-semibold">
                  <LogIn className="mr-2 h-4 w-4" />
                  Giriş Yap
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
