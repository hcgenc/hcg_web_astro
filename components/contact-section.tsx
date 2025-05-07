"use client"
import { MessageCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactSection() {
  // WhatsApp phone number - should match the one in services-section.tsx
  const whatsappNumber = "905514687143" // Format: country code + number without +

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Merhaba, Kozmik Yollar web sitesinden yazıyorum. Hizmetleriniz hakkında bilgi almak istiyorum.",
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-deep-purple/10 to-midnight z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Bizimle İletişime Geçin</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Hizmetlerimiz veya kozmik yolculuğunuz hakkında sorularınız mı var? WhatsApp üzerinden hemen bize ulaşın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* WhatsApp Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="cosmic-card p-8 h-full flex flex-col justify-between">
              <div className="text-center">
                <div
                  className="bg-cosmic-blue/20 p-5 rounded-full mx-auto mb-6 w-20 h-20 flex items-center justify-center cursor-pointer hover:bg-cosmic-blue/40 transition-all hover:scale-105"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="h-10 w-10 text-celestial-gold" />
                </div>

                <h3 className="text-xl font-semibold mb-4 text-white">WhatsApp İletişim</h3>

                <p className="text-white/70 mb-6">
                  Sorularınız için bize WhatsApp üzerinden hemen ulaşabilirsiniz. 7/24 mesajlarınıza en kısa sürede
                  dönüş yapıyoruz.
                </p>
              </div>

              <div className="text-center">
                <div
                  className="inline-block py-3 px-8 bg-gradient-to-r from-deep-purple to-cosmic-blue rounded-full text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-cosmic-blue/30 hover:scale-105 transition-all"
                  onClick={handleWhatsAppClick}
                >
                  WhatsApp'ta Mesaj Gönder
                </div>
              </div>
            </div>
          </motion.div>

          {/* Working Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="cosmic-card p-8 h-full">
              <div className="flex items-start">
                <div className="bg-cosmic-blue/20 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-celestial-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4 text-white">Çalışma Saatleri</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Tüm Günler:</span>
                      <span className="text-white font-medium">7/24 Açık</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-cosmic-blue/30">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Online Hizmet:</span>
                        <span className="text-celestial-gold font-medium">Her Zaman</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
