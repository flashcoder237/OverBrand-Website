import type { Metadata } from 'next'
import { Bebas_Neue, Montserrat } from 'next/font/google'
import '../globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { MagneticCursor } from '@/components/layout/cursor'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { PageTransition } from '@/components/layout/page-transition'
import { Grain } from '@/components/layout/grain'
import { FloatingButtons } from '@/components/layout/floating-buttons'
import { Loader } from '@/components/layout/loader'
import { LenisProvider } from '@/components/layout/lenis-provider'

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://overbrand.fr'),
    title: t('title'),
    description: t('description'),
    keywords: ['digital agency', 'website creation', 'mobile app', 'branding', 'SEO', 'online advertising'],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(t('title'))}&description=${encodeURIComponent(t('description'))}`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/api/og?title=${encodeURIComponent(t('title'))}&description=${encodeURIComponent(t('description'))}`],
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2855a0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="OverBrand" />
      </head>
      <body className={`${bebasNeue.variable} ${montserrat.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {/* Cinematic loader (first visit only) */}
            <Loader />
            {/* Lenis smooth scroll */}
            <LenisProvider />
            {/* Global overlays */}
            <MagneticCursor />
            <ScrollProgress />
            <Grain />
            <FloatingButtons />
            {/* Page content with transitions */}
            <PageTransition>
              {children}
            </PageTransition>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
