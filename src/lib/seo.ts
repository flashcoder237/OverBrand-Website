import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://overbrand.net'

// Derived from the routing config, never hardcoded: hreflang clusters and the
// sitemap must cover every locale the site actually serves, or adding one
// silently leaves its pages out of the index.
export const LOCALES = routing.locales
export const DEFAULT_LOCALE = routing.defaultLocale
export type Locale = (typeof LOCALES)[number]

/** Canonical business facts — single source for structured data and metadata. */
export const ORG = {
  name: 'OverBrand',
  legalName: 'OverBrand',
  email: 'contact@overbrand.net',

  // `phone` / `phoneDisplay` stay the primary Cameroon line — they are what the
  // Organization node and the WhatsApp button use. Additional lines go in
  // `phones` so every consumer renders the same set instead of hardcoding one.
  phone: '+237652761931',
  phoneDisplay: '+237 652 761 931',
  whatsapp: 'https://wa.me/237652761931',
  phones: [
    {
      e164: '+237652761931',
      display: '+237 652 761 931',
      region: 'Cameroun',
      areaServed: 'CM',
      whatsapp: true,
    },
    {
      e164: '+41793603649',
      display: '+41 79 360 36 49',
      region: 'Europe',
      areaServed: 'CH',
      whatsapp: false,
    },
  ],
  founded: '2019',
  slogan: "Où la créativité n'a pas de limite, l'innovation est infinie",
  priceRange: '$$',
  currency: 'XAF',
  // Every profile listed here should be a real, live page: `sameAs` is how
  // search engines merge these accounts into one business entity. A dead URL
  // weakens the association rather than helping it.
  sameAs: [
    'https://web.facebook.com/OverBrandCm',
    'https://www.linkedin.com/company/overbrandcm',
    'https://www.instagram.com/overbrand',
  ],
  offices: [
    {
      id: 'douala',
      name: 'OverBrand — Douala',
      hq: true,
      street: 'Boulevard de la Liberté, Akwa',
      postalBox: 'BP 1541',
      city: 'Douala',
      region: 'Littoral',
      country: 'CM',
      // Approximate centroid of Akwa, Douala. Replace with the exact rooftop
      // coordinates from the Google Business Profile once it is claimed —
      // local pack ranking is sensitive to this.
      lat: 4.0483,
      lng: 9.7043,
      hours: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' }],
    },
    {
      id: 'yaounde',
      name: 'OverBrand — Yaoundé',
      hq: false,
      street: 'Quartier Bastos, Rue 1.839',
      postalBox: null,
      city: 'Yaoundé',
      region: 'Centre',
      country: 'CM',
      // Approximate centroid of Bastos, Yaoundé — see note above.
      lat: 3.8944,
      lng: 11.5165,
      hours: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' }],
    },
  ],
} as const

/** Cities and regions we actively sell into — feeds `areaServed`. */
export const AREA_SERVED = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 'Buea', 'Kribi', 'Limbé',
  'Cameroun', 'Gabon', 'Côte d’Ivoire', 'Sénégal', 'Congo', 'Tchad',
] as const

/** BCP-47 → Open Graph locale codes. */
export const OG_LOCALE: Record<string, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  de: 'de_DE',
}

type PageMetaInput = {
  locale: string
  /** Route path with a leading slash and no locale prefix, e.g. `/services`. Use '' for home. */
  path: string
  title: string
  description: string
  /** Absolute URL or site-root-relative path. Falls back to the generated OG image. */
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  noIndex?: boolean
}

/**
 * Builds page metadata with the canonical URL and the full hreflang cluster.
 *
 * Every localized page must emit these: without `canonical` + `languages`,
 * /fr/<path> and /en/<path> look like duplicates to search engines rather than
 * translations of one another.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}/${locale}${path}`
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image}`
    : `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]),
  )
  // x-default points at the default locale (French): the primary market is francophone.
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: ORG.name,
      locale: OG_LOCALE[locale] ?? OG_LOCALE[DEFAULT_LOCALE],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

/** BreadcrumbList JSON-LD. Pass crumbs without the locale prefix. */
export function breadcrumbSchema(
  locale: string,
  crumbs: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}/${locale}${c.path}`,
    })),
  }
}
