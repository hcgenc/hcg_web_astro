"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-deep-purple/10 to-midnight z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Kozmik Yolculuğumuz</h2>

            <div className="space-y-4 text-white/80">
              <p>
                Kozmik Yollar, astronomi ve maneviyat arasındaki derin bir bağlantıdan doğdu. Kurucumuz Dr. Aylin
                Yıldız, astronominin bilimsel yönlerini ve kadim göksel geleneklerde bulunan ruhsal bilgeliği yıllarca
                inceledi.
              </p>

              <p>
                Yeni Meksika çöllerinde bir meteor yağmuru altında dönüştürücü bir an yaşadıktan sonra, Dr. Yıldız,
                çağrısının kozmosun bilimsel anlayışı ile insanlık için taşıdığı ruhsal önem arasında köprü kurmak
                olduğunu fark etti.
              </p>

              <p>
                Bugün, astronomlar, ruhsal rehberler ve kozmik meraklılardan oluşan ekibimiz, evrenin hem bilimsel
                harikasına hem de ruhsal gizemlerine saygı duyan hizmetler sunmak için birlikte çalışıyor. Kozmosdaki
                yerinizi anlamanın derin kişisel gelişime ve ruhsal uyanışa yol açabileceğine inanıyoruz.
              </p>

              <blockquote className="border-l-4 border-celestial-gold pl-4 italic my-6">
                "Yıldızlar sadece uzak güneşler değil, insanlığın doğuşuna tanıklık eden ve sayısız medeniyetin
                bilgeliğini barındıran kadim rehberlerdir."
              </blockquote>
            </div>

            <div className="mt-8">
              <Button className="cosmic-button" asChild>
                <a href="#contact">Bizimle İletişime Geçin</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative mx-auto max-w-md lg:max-w-full">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden glow-effect">
                <Image
                  src="/images/1.png"
                  alt="Dr. Aylin Yıldız, Kozmik Yollar'ın kurucusu"
                  fill
                  className="object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent"></div>
              </div>

              <div className="absolute -top-5 -right-5 h-32 w-32 rounded-full bg-cosmic-blue/20 blur-2xl"></div>
              <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-deep-purple/20 blur-2xl"></div>

              <div className="absolute top-6 left-0 md:-left-12 p-4 bg-deep-purple/40 backdrop-blur-md rounded-xl border border-cosmic-blue/20 max-w-[200px] shadow-lg z-10">
                <p className="text-white/90 text-sm">"Her ruhun keşfedilmeyi bekleyen kozmik bir planı vardır."</p>
              </div>

              <div className="absolute bottom-6 right-0 md:-right-12 p-4 bg-deep-purple/40 backdrop-blur-md rounded-xl border border-cosmic-blue/20 max-w-[200px] shadow-lg z-10">
                <div className="flex items-center space-x-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-celestial-gold"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/90 text-xs">
                  Dünya çapında 10.000'den fazla ruhsal arayıcı tarafından güvenilir
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
