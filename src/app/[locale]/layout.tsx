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
    title: t('title'),
    description: t('description'),
    keywords: ['digital agency', 'website creation', 'mobile app', 'branding', 'SEO', 'online advertising'],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
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
      <body className={`${bebasNeue.variable} ${montserrat.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {/* Global overlays */}
            <MagneticCursor />
            <ScrollProgress />
            <Grain />
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
