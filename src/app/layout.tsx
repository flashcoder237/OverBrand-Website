import type { Metadata } from 'next'
import { Bebas_Neue, Montserrat } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'

const bebasNeue = Bebas_Neue({
  variable: '--font-display',
  subsets: ['latin'],
  weight: '400',
})

const montserrat = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
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
      <body className={`${bebasNeue.variable} ${montserrat.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
