import Link from "next/link"
import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react"

export default function Footer() {
  // Sayfa içi ya da sayfa arası link oluşturur
  const LinkComponent = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
    // Eğer link # ile başlıyorsa sayfa içi linktir
    const isInternalAnchor = href.startsWith("#");
    // Eğer link "/" ile başlıyorsa ama "#" içermiyorsa normal sayfa linkidir
    const isRouterLink = href.startsWith("/") && !href.includes("#");
    // Eğer link "/#" şeklinde başlıyorsa anasayfadaki bir bölüme linktir
    const isHomeWithAnchor = href.startsWith("/#");

    if (isInternalAnchor) {
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    } else if (isHomeWithAnchor) {
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    } else {
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    }
  };

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
              <LinkComponent href="#" className="text-white/70 hover:text-celestial-gold transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </LinkComponent>
              <LinkComponent href="#" className="text-white/70 hover:text-celestial-gold transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </LinkComponent>
              <LinkComponent href="#" className="text-white/70 hover:text-celestial-gold transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </LinkComponent>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white/90">Hizmetler</h4>
            <ul className="space-y-2">
              <li>
                <LinkComponent href="/#services" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Doğum Haritası Okuması
                </LinkComponent>
              </li>
              <li>
                <LinkComponent href="/#services" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Öngörü Danışmanlığı
                </LinkComponent>
              </li>
              <li>
                <LinkComponent href="/#services" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  İlişki Danışmanlığı
                </LinkComponent>
              </li>
              <li>
                <LinkComponent href="/#services" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Tek Soru Danışmanlığı
                </LinkComponent>
              </li>
              <li>
                <LinkComponent href="/#services" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Rüya Tabiri
                </LinkComponent>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white/90">Keşfet</h4>
            <ul className="space-y-2">
              <li>
                <LinkComponent href="/#about" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Hakkımızda
                </LinkComponent>
              </li>
              <li>
                <LinkComponent href="/#testimonials" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Yorumlar
                </LinkComponent>
              </li>
              <li>
                <LinkComponent href="/blog" className="text-white/70 hover:text-celestial-gold transition-colors text-sm">
                  Blog Yazıları
                </LinkComponent>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white/90">İletişim</h4>
            <ul className="space-y-2">
              <li>
                <LinkComponent href="/#contact" className="text-white/70 hover:text-celestial-gold transition-colors text-sm flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp İletişim
                </LinkComponent>
              </li>
              <li>
                <p className="text-white/70 text-sm">
                  7/24 Hizmet
                </p>
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
