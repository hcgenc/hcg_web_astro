import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-cosmic-blue/20 bg-midnight/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white via-celestial-gold to-white bg-clip-text text-transparent">
              Kozmik Yollar
            </h3>
            <p className="text-white/70 text-sm">
              Kendini keşfetme ve kozmik uyum yolculuğunda size rehberlik ediyoruz.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white/70 hover:text-celestial-gold transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-white/70 hover:text-celestial-gold transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white/70 hover:text-celestial-gold transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white/90">Hizmetler</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Doğum Haritası Okuması
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Kozmik Uyum
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Yıldız Gözlem Rehberleri
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Göksel Meditasyon
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cosmic-blue/20 text-center text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Kozmik Yollar. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
