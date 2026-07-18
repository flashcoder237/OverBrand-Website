import type { Metadata } from 'next'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { isLocale, routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { MagneticCursor } from '@/components/layout/cursor'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { PageTransition } from '@/components/layout/page-transition'
import { Grain } from '@/components/layout/grain'
import { FloatingButtons } from '@/components/layout/floating-buttons'
import { Loader } from '@/components/layout/loader'
import { LenisProvider } from '@/components/layout/lenis-provider'
import { SideRail } from '@/components/layout/side-rail'
import { siteSchema } from '@/lib/schema'
import { ORG } from '@/lib/seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://overbrand.net'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const title = t('title')
  const description = t('description')
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  const keywordsFr = [
    'agence digitale', 'création site web', 'application mobile', 'branding',
    'référencement SEO', 'publicité en ligne', 'agence web Cameroun',
    'identité visuelle', 'design graphique', 'transformation digitale',
  ]
  const keywordsEn = [
    'digital agency', 'website creation', 'mobile app', 'branding',
    'SEO', 'online advertising', 'web agency Cameroon',
    'visual identity', 'graphic design', 'digital transformation',
  ]
  const keywordsDe = [
    'Digitalagentur', 'Webseitenerstellung', 'mobile App', 'Branding',
    'SEO', 'Online-Werbung', 'Webagentur Kamerun',
    'visuelle Identität', 'Grafikdesign', 'digitale Transformation',
  ]
  const keywords = locale === 'fr' ? keywordsFr : locale === 'de' ? keywordsDe : keywordsEn

  const ogLocales: Record<string, string> = { fr: 'fr_FR', en: 'en_US', de: 'de_DE' }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | OverBrand`,
    },
    description,
    keywords,
    authors: [{ name: 'OverBrand', url: SITE_URL }],
    creator: 'OverBrand',
    publisher: 'OverBrand',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}`])),
        'x-default': `${SITE_URL}/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: 'OverBrand',
      locale: ogLocales[locale] ?? 'fr_FR',
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@overbrand',
      site: '@overbrand',
    },
    verification: {
      // google: 'YOUR_GOOGLE_VERIFICATION_CODE', // add when available
    },
    // Geo meta tags. Superseded by the LocalBusiness JSON-LD for Google, but
    // still read by Bing and several regional/vertical crawlers.
    other: {
      'geo.region': 'CM-LT',
      'geo.placename': 'Douala',
      'geo.position': `${ORG.offices[0].lat};${ORG.offices[0].lng}`,
      ICBM: `${ORG.offices[0].lat}, ${ORG.offices[0].lng}`,
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

  if (!isLocale(locale)) {
    notFound()
  }

  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const organizationSchema = siteSchema(locale, t('description'))

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Cinematic loader (first visit only) */}
      <Loader />
      {/* Lenis smooth scroll */}
      <LenisProvider />
      {/* Global overlays */}
      <MagneticCursor />
      <ScrollProgress />
      <Grain />
      <FloatingButtons />
      {/* Editorial side rail (lg+) */}
      <SideRail />
      {/* Reveal-on-scroll driver for aidesigner's .reveal elements */}
      {/* Page content with transitions */}
      <PageTransition>
        {children}
      </PageTransition>
    </NextIntlClientProvider>
  )
}
