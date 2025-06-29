import type React from "react"
import type { Metadata } from "next/types"
import { Marcellus } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-marcellus",
})

export const metadata: Metadata = {
  title: "Kozmik Yollar",
  description:
    "Astronomi temelli ruhsal hizmetlerimizle yıldızlar arasında kendi yolunuzu keşfedin. Doğum haritası okumaları, kozmik uyum seansları ve kişiselleştirilmiş yıldız gözlem rehberleri.",
  icons: {
    icon: "/images/andromeda.png",
  },
  openGraph: {
    title: "kozmik yollar",
    description: "Astronomi temelli ruhsal hizmetlerimizle yıldızlar arasında kendi yolunuzu keşfedin.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kozmik Yollar",
      },
    ],
  },
    generator: 'v0dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${marcellus.variable} font-serif bg-midnight text-white min-h-screen flex flex-col overflow-x-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {/* Background is now handled by the neon particles only */}
            <Header />
            <main className="flex-grow relative z-10 w-full overflow-x-hidden">{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
