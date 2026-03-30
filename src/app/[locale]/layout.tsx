import type { Metadata } from 'next'
import '../globals.css'
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

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | OverBrand`,
    },
    description,
    keywords: locale === 'fr' ? keywordsFr : keywordsEn,
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
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/fr`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: 'OverBrand',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? 'en_US' : 'fr_FR',
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
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'OverBrand',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
          width: 192,
          height: 192,
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+237-652-761-931',
            email: 'contact@overbrand.net',
            contactType: 'customer service',
            availableLanguage: ['French', 'English'],
          },
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'CM',
        },
        description: t('description'),
        foundingDate: '2019',
        numberOfEmployees: {
          '@type': 'QuantitativeValue',
          value: 10,
        },
        knowsAbout: [
          'Web Development',
          'Mobile App Development',
          'Branding & Identity',
          'SEO',
          'Digital Marketing',
        ],
        sameAs: [
          'https://www.linkedin.com/company/overbrand',
          'https://www.instagram.com/overbrand',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'OverBrand',
        description: t('description'),
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: ['fr-FR', 'en-US'],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/fr?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/${locale}/#webpage`,
        url: `${SITE_URL}/${locale}`,
        name: t('title'),
        description: t('description'),
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
        about: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }

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
      {/* Page content with transitions */}
      <PageTransition>
        {children}
      </PageTransition>
    </NextIntlClientProvider>
  )
}
