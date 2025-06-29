import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import TestimonialsSection from "@/components/testimonials-section"
import AboutSection from "@/components/about-section"
import ImageCarousel from "@/components/image-carousel"
import ContactSection from "@/components/contact-section"
import NeonParticles from "@/components/neon-particles"

export default function Home() {
  return (
    <div className="relative z-10">
      <NeonParticles count={120} size={2} minDistance={40} />
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <AboutSection />
      <ImageCarousel />
      <ContactSection />
    </div>
  )
}
