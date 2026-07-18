import { SITE_URL, ORG, AREA_SERVED, OG_LOCALE, LOCALES } from '@/lib/seo'
import { getServices, type Service } from '@/lib/services-data'

/** schema.org expects English language names, derived from the served locales. */
const LANGUAGE_LABEL: Record<string, string> = {
  fr: 'French',
  en: 'English',
  de: 'German',
}
const LANGUAGE_NAMES = LOCALES.map((l) => LANGUAGE_LABEL[l] ?? l)

const CATALOG_NAME: Record<string, string> = {
  fr: 'Prestations OverBrand',
  en: 'OverBrand services',
  de: 'OverBrand Leistungen',
}

/**
 * Site-wide JSON-LD graph.
 *
 * Modelled as `ProfessionalService` (a LocalBusiness subtype) rather than a bare
 * `Organization`: local packs and map results need a business type, an address,
 * geo coordinates and opening hours. Each office is emitted as its own
 * LocalBusiness node so Douala and Yaoundé can rank independently.
 */
export function siteSchema(locale: string, description: string) {
  // OG_LOCALE is keyed by the same locales and only differs in separator.
  const inLanguage = (OG_LOCALE[locale] ?? OG_LOCALE.fr).replace('_', '-')

  const officeNodes = ORG.offices.map((o) => ({
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#office-${o.id}`,
    name: o.name,
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    url: `${SITE_URL}/${locale}/contact`,
    telephone: ORG.phone,
    email: ORG.email,
    priceRange: ORG.priceRange,
    currenciesAccepted: ORG.currency,
    image: `${SITE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: o.postalBox ? `${o.street} — ${o.postalBox}` : o.street,
      addressLocality: o.city,
      addressRegion: o.region,
      addressCountry: o.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: o.lat,
      longitude: o.lng,
    },
    openingHoursSpecification: o.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: [...AREA_SERVED].map((a) => ({ '@type': 'Place', name: a })),
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': `${SITE_URL}/#organization`,
        name: ORG.name,
        legalName: ORG.legalName,
        url: SITE_URL,
        description,
        slogan: ORG.slogan,
        foundingDate: ORG.founded,
        email: ORG.email,
        priceRange: ORG.priceRange,
        currenciesAccepted: ORG.currency,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/logo.png`,
          width: 192,
          height: 192,
        },
        image: { '@id': `${SITE_URL}/#logo` },
        // Headquarters doubles as the organization-level address.
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${ORG.offices[0].street} — ${ORG.offices[0].postalBox}`,
          addressLocality: ORG.offices[0].city,
          addressRegion: ORG.offices[0].region,
          addressCountry: ORG.offices[0].country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: ORG.offices[0].lat,
          longitude: ORG.offices[0].lng,
        },
        location: ORG.offices.map((o) => ({ '@id': `${SITE_URL}/#office-${o.id}` })),
        areaServed: [...AREA_SERVED].map((a) => ({ '@type': 'Place', name: a })),
        telephone: ORG.phones.map((p) => p.e164),
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: ORG.phone,
            email: ORG.email,
            contactType: 'customer service',
            areaServed: 'CM',
            availableLanguage: LANGUAGE_NAMES,
          },
          {
            '@type': 'ContactPoint',
            telephone: ORG.phone,
            contactType: 'sales',
            areaServed: ['CM', 'GA', 'CI', 'SN', 'CG', 'TD'],
            availableLanguage: LANGUAGE_NAMES,
          },
          // European line — the founders relaying from Switzerland/Germany/France.
          {
            '@type': 'ContactPoint',
            telephone: '+41793603649',
            email: ORG.email,
            contactType: 'sales',
            areaServed: ['CH', 'DE', 'FR', 'BE', 'AT'],
            availableLanguage: LANGUAGE_NAMES,
          },
        ],
        knowsAbout: [
          'Web Development', 'Mobile App Development', 'Branding & Identity',
          'SEO', 'Digital Marketing', 'UI/UX Design', 'E-commerce',
          'Next.js', 'React', 'Design Systems',
        ],
        // Every service rendered as a catalogue entry — lets engines answer
        // "what does OverBrand do" without parsing the page copy.
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: CATALOG_NAME[locale] ?? CATALOG_NAME.fr,
          itemListElement: getServices(locale).map((s, i) => ({
            '@type': 'Offer',
            position: i + 1,
            itemOffered: {
              '@type': 'Service',
              '@id': `${SITE_URL}/#service-${s.slug}`,
              name: s.title,
              description: s.tagline,
              url: `${SITE_URL}/${locale}/services/${s.slug}`,
              serviceType: s.title,
              provider: { '@id': `${SITE_URL}/#organization` },
              areaServed: [...AREA_SERVED].map((a) => ({ '@type': 'Place', name: a })),
            },
          })),
        },
        sameAs: [...ORG.sameAs],
      },
      ...officeNodes,
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: ORG.name,
        description,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: LOCALES.map((l) => (OG_LOCALE[l] ?? OG_LOCALE.fr).replace('_', '-')),
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/${locale}/#webpage`,
        url: `${SITE_URL}/${locale}`,
        name: ORG.name,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage,
        about: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }
}

/** Per-service JSON-LD for the /services/[slug] landing pages. */
export function serviceSchema(locale: string, service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-${service.slug}`,
    name: service.title,
    description: service.description,
    serviceType: service.title,
    url: `${SITE_URL}/${locale}/services/${service.slug}`,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: [...AREA_SERVED].map((a) => ({ '@type': 'Place', name: a })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE_URL}/${locale}/contact`,
      servicePhone: ORG.phone,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.title,
      itemListElement: service.deliverables.map((d, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: { '@type': 'Service', name: d },
      })),
    },
  }
}
