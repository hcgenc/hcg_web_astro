"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import { motion } from "framer-motion"

interface Testimonial {
  id: number
  name: string
  location: string
  quote: string
  image: string
  rating: number
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Zeynep Kaya",
      location: "İstanbul, Türkiye",
      quote:
        "Doğum haritası okumam inanılmaz derecede doğru ve aydınlatıcıydı. Yıllardır mücadele ettiğim hayatımdaki kalıpları anlamama yardımcı oldu. Kozmik bakış açısı gerçekten bakış açımı değiştirdi.",
      image: "/images/zeynep.png",
      rating: 5,
    },
    {
      id: 2,
      name: "Mehmet Yılmaz",
      location: "Ankara, Türkiye",
      quote:
        "Kozmik Uyum Seansı derin bir deneyimdi. Evrenle derin bir bağlantı hissettim ve ruhsal yolum hakkında netlik kazandım. Öğrendiğim meditasyon teknikleri huzur bulmama yardımcı olmaya devam ediyor.",
      image: "/images/mehmet.png",
      rating: 5,
    },
    {
      id: 3,
      name: "Elif Demir",
      location: "İzmir, Türkiye",
      quote:
        "Kişiselleştirilmiş yıldız gözlem rehberim, astronomiye olan sevgimi yeniden canlandırdı. Ruhsal içgörüler ve pratik görüntüleme ipuçları, yıldızlar altında büyülü geceler yaşattı. Kesinlikle tavsiye ederim!",
      image: "/images/elif.png",
      rating: 4,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-deep-purple/10 to-midnight z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ruhsal Yolculuklar</h2>
          <p className="text-white/70 max-w-2xl mx-auto">Bizimle kozmik yolculuğa çıkanların deneyimlerini dinleyin.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative h-[400px] md:h-[300px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: index === activeIndex ? 1 : 0,
                  x: index === activeIndex ? 0 : 100,
                  zIndex: index === activeIndex ? 10 : 0,
                }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                <Card className="cosmic-card h-full">
                  <CardContent className="p-8 h-full flex flex-col justify-between">
                    <div>
                      <Quote className="h-10 w-10 text-celestial-gold/50 mb-4" />
                      <p className="text-white/90 text-lg italic mb-6">"{testimonial.quote}"</p>
                    </div>

                    <div className="flex items-center">
                      <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-cosmic-blue/30">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-white font-medium">{testimonial.name}</h4>
                        <p className="text-white/60 text-sm">{testimonial.location}</p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={i < testimonial.rating ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={i < testimonial.rating ? "text-celestial-gold" : "text-white/30"}
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-8 bg-celestial-gold" : "bg-white/30"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Yorum ${index + 1}'i görüntüle`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
