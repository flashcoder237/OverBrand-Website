import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'OverBrand — Agence Digitale Créative',
  description:
    'OverBrand est votre partenaire digital pour la création de sites web, applications mobiles, branding, SEO et publicité en ligne.',
  keywords: ['agence digitale', 'création site web', 'application mobile', 'branding', 'SEO', 'publicité en ligne'],
  openGraph: {
    title: 'OverBrand — Agence Digitale Créative',
    description: 'Votre partenaire digital pour tous vos projets numériques.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
