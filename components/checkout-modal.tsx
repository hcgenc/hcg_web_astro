"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: string
  image: string
  popular?: boolean
}

interface CheckoutModalProps {
  service: Service
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ service, isOpen, onClose }: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      alert(`${service.title} satın aldığınız için teşekkürler! E-postanıza bir onay gönderildi.`)
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="cosmic-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">{service.title} Satın Al</DialogTitle>
          <DialogDescription className="text-white/70">
            Kozmik yolculuğunuza başlamak için ödemenizi tamamlayın.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ayşe Yılmaz"
              required
              value={formData.name}
              onChange={handleChange}
              className="cosmic-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ayse@ornek.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="cosmic-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Kart Numarası</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              required
              value={formData.cardNumber}
              onChange={handleChange}
              className="cosmic-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Son Kullanma Tarihi</Label>
              <Input
                id="expiry"
                name="expiry"
                placeholder="AA/YY"
                required
                value={formData.expiry}
                onChange={handleChange}
                className="cosmic-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                name="cvc"
                placeholder="123"
                required
                value={formData.cvc}
                onChange={handleChange}
                className="cosmic-input"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-cosmic-blue/20">
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Hizmet:</span>
              <span className="text-white">{service.title}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Süre:</span>
              <span className="text-white">{service.duration}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Toplam:</span>
              <span className="text-celestial-gold">{service.price.toFixed(2)} ₺</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-cosmic-blue/30 hover:border-white/50 hover:bg-deep-purple/20"
              disabled={isProcessing}
            >
              İptal
            </Button>
            <Button type="submit" className="cosmic-button" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                `${service.price.toFixed(2)} ₺ Öde`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
