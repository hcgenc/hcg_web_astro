"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useState } from "react"

interface Service {
  id: string
  title: string
  description: string
  image: string
  popular?: boolean
}

export default function ServicesSection() {
  // WhatsApp phone number - replace with your actual business number
  const whatsappNumber = "905514687143" // Format: country code + number without +

  const services: Service[] = [
    {
      id: "dogum-haritasi-okumasi",
      title: "Doğum Haritası Okuması",
      description:
        "Kişiselleştirilmiş doğum haritası analizi ile karakterinizi, yaşam amacınızı ve potansiyelinizi keşfedin. Gök cisimlerinin doğum anınızdaki konumlarının hayatınıza etkilerini öğrenin.",
      image: "/images/birth-chart2.png",
      popular: true,
    },
    {
      id: "ongoru-danismanligi",
      title: "Öngörü Danışmanlığı",
      description:
        "Hayatınızın önemli dönemeçlerinde, yıldızların rehberliğinde geleceğe dair öngörüler ve yol haritası. Kişisel potansiyelinizi ve fırsat dönemlerinizi keşfedin.",
      image: "/images/prediction.png",
    },
    {
      id: "iliski-danismanligi",
      title: "İlişki Danışmanlığı",
      description:
        "İlişkilerinizde astrolojik uyumu, iletişim dinamiklerini ve birlikte büyüme fırsatlarını analiz edin. Sağlıklı ve dengeli ilişkiler için kozmik rehberlik alın.",
      image: "/images/relationship.png",
    },
    {
      id: "tek-soru-danismanligi",
      title: "Tek Soru Danışmanlığı",
      description:
        "Hayatınızda merak ettiğiniz tek bir konuya özel, hızlı ve net astrolojik analiz. Kısa sürede yol gösterici cevaplar alın.",
      image: "/images/single-q.png",
    },
    {
      id: "ruya-tabiri",
      title: "Rüya Tabiri",
      description:
        "Gördüğünüz rüyaların sembolik anlamlarını ve bilinçaltı mesajlarını astrolojik bakış açısıyla yorumlayın. Ruhsal farkındalığınızı artırın.",
      image: "/images/dream.png",
    },
  ]

  // Function to create WhatsApp link with pre-filled message
  const createWhatsAppLink = (service: Service) => {
    const message = encodeURIComponent(
      `Merhaba, Kozmik Yollar'dan şu hizmet hakkında bilgi almak istiyorum:\n\n` +
        `Hizmet: ${service.title}\n\n` +
        `Lütfen bana bu hizmet hakkında daha fazla bilgi verir misiniz?`,
    )

    return `https://wa.me/${whatsappNumber}?text=${message}`
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="services" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-deep-purple/10 to-midnight z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-cosmic-blue/30 text-celestial-gold">
            Hizmetlerimiz
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Göksel Hizmetler</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Yolunuza rehberlik eden kozmik enerjilerle bağlantı kurmanız için tasarlanmış astronomi temelli ruhsal
            hizmetlerimizi keşfedin.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          style={{maxWidth: '1400px', margin: '0 auto'}}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={item}>
              <FlipCard service={service} createWhatsAppLink={createWhatsAppLink} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <p className="text-white/70 mb-6">
            Ruhsal yolculuğunuz için hangi hizmetin doğru olduğundan emin değil misiniz?
          </p>
          <Button
            variant="outline"
            className="border-cosmic-blue/30 hover:border-celestial-gold/50 hover:bg-deep-purple/20"
            asChild
          >
            <a href="#contact">Rehberlik İçin İletişime Geçin</a>
          </Button>
        </div>
      </div>
    </section>
  )
}

// FlipCard bileşeni
function FlipCard({ service, createWhatsAppLink }: { service: Service; createWhatsAppLink: (service: Service) => string }) {
  const [flipped, setFlipped] = useState(false)

  // Kart oranı: 4:6 (örnek)
  return (
    <div
      className="flip-card group cursor-pointer w-full aspect-[4/6] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto relative overflow-visible"
      tabIndex={0}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
      style={{ perspective: "1200px" }}
    >
      {/* Popüler etiketi kartın üstünde ve sağında, sadece ön yüzde göster */}
      {service.popular && (
        <div
          className={`absolute -top-3 right-4 z-[60] flex items-center pointer-events-none select-none transition-opacity duration-700 ${flipped ? 'opacity-0' : 'opacity-100'}`}
        >
          <span
            className="px-4 py-1 text-xs sm:text-sm font-semibold rounded-full animate-popular-glow border border-yellow-300 shadow-md"
            style={{
              background: 'linear-gradient(90deg, #ffe066 60%, #fffbe6 100%)',
              color: '#7c5e10',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 12px 0 #ffe06655',
              textShadow: '0 1px 4px #fffbe6cc',
              borderWidth: '1.5px',
              borderColor: '#ffe066',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="inline mr-1 -mt-0.5 align-middle"><circle cx="10" cy="10" r="9" stroke="#e6c200" strokeWidth="2" fill="#ffe066"/><path d="M10 5v5l3 2" stroke="#7c5e10" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Popüler
          </span>
        </div>
      )}
      <div
        className={`flip-card-inner relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        {/* Ön yüz: Sadece görsel */}
        <div className="flip-card-front absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden shadow-lg">
          <Image
            src={service.image || "/placeholder.svg"}
            alt={service.title}
            fill
            className="object-cover w-full h-full"
            priority
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        {/* Arka yüz: Yazılar ve buton */}
        <div className="flip-card-back absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-b from-black/80 via-black/60 to-black/80 flex flex-col justify-between rounded-xl overflow-hidden shadow-lg p-6">
          <div>
            <CardHeader className="bg-transparent p-0 mb-4">
              <CardTitle className="text-xl text-white group-hover:text-celestial-gold transition-colors drop-shadow-lg">
                {service.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <p className="text-white/90 text-sm drop-shadow-md bg-black/30 rounded-lg px-2 py-1 inline-block">
                {service.description}
              </p>
            </CardContent>
          </div>
          <CardFooter className="flex justify-end items-center border-t border-cosmic-blue/20 pt-4 mt-6 bg-black/30 rounded-lg">
            <Button
              className="cosmic-button text-white px-6 py-2 rounded-full bg-gradient-to-r from-cosmic-blue to-celestial-gold shadow-lg hover:from-celestial-gold hover:to-cosmic-blue transition-all text-base font-semibold tracking-wide border-0"
              onClick={(e) => { e.stopPropagation(); window.open(createWhatsAppLink(service), "_blank") }}
            >
              Bilgi Al
            </Button>
          </CardFooter>
        </div>
      </div>
    </div>
  )
}

/*
Ek CSS (global.css veya tailwind ile):
.flip-card { perspective: 1200px; }
.flip-card-inner { transition: transform 0.7s cubic-bezier(.4,2,.6,1); transform-style: preserve-3d; }
.flip-card-front, .flip-card-back { backface-visibility: hidden; }
.flip-card-back { transform: rotateY(180deg); }
@keyframes popular-glow {
  0%, 100% { box-shadow: 0 0 0 0 #ffe066, 0 0 8px 2px #ffe06699, 0 0 0 0 #fff0; opacity: 1; }
  50% { box-shadow: 0 0 16px 6px #ffe066, 0 0 24px 8px #ffe06699, 0 0 0 0 #fff0; opacity: 0.85; }
}
.animate-popular-glow {
  animation: popular-glow 1.6s infinite cubic-bezier(.4,0,.6,1);
}
*/
