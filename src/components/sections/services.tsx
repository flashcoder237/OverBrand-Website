'use client'

import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

// Aidesigner: dense hairline-divided list, row inverts to ink on hover.
// Seven services linked to their /services/[slug] detail pages.
const SERVICE_SLUGS = [
  'creation-sites-web',
  'logiciels-applications',
  'hebergement-gestion',
  'publicite-en-ligne',
  'visibilite-google',
  'logo-identite-marque',
  'creation-contenus',
] as const

const SERVICE_KEYS = [
  'website',
  'software',
  'hosting',
  'ads',
  'seo',
  'branding',
  'content',
] as const

export function ServicesSection() {
  const t = useTranslations('services')

  return (
    <section
      id="services"
      className="section px-6 lg:px-12 lg:pl-28"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-5 reveal">
            <p
              className="text-xs font-bold uppercase mb-4"
              style={{ color: 'var(--accent-warm)', letterSpacing: '0.3em' }}
            >
              {t('eyebrow')}
            </p>
            <h2
              className="font-display uppercase tracking-tight leading-[0.9]"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                color: 'var(--text)',
              }}
            >
              {t('title_1')} <br />
              <span style={{ color: 'var(--primary)' }}>{t('title_2')}.</span>
            </h2>
          </div>
          <div
            className="lg:col-span-6 lg:col-start-7 lg:pl-10 flex items-end reveal"
            style={{ borderLeft: '1px solid var(--line)' }}
          >
            <p
              className="text-lg font-light leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="border-t border-b divide-y" style={{ borderColor: 'var(--line)' }}>
          {SERVICE_KEYS.map((key, i) => {
            const slug = SERVICE_SLUGS[i]
            return (
              <Link
                key={key}
                href={`/services/${slug}`}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-5 py-7 md:py-10 px-4 transition-all duration-500"
                style={{ borderColor: 'var(--line)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--ink)'
                  e.currentTarget.style.paddingInline = '2rem'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = ''
                  e.currentTarget.style.paddingInline = '1rem'
                }}
              >
                <div className="flex items-center gap-6 md:gap-8 w-full md:w-1/2">
                  <span
                    className="font-display text-2xl md:text-3xl opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--accent-warm)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="font-display uppercase tracking-wide transition-colors duration-300"
                    style={{
                      fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                      color: 'var(--text)',
                    }}
                  >
                    <span className="service-title">{t(`items.${key}.title`)}</span>
                  </h3>
                </div>
                <p
                  className="text-base md:text-lg transition-colors duration-300 w-full md:w-1/3"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  {t(`items.${key}.description`)}
                </p>
                <ArrowUpRight
                  size={30}
                  strokeWidth={1}
                  className="transition-all duration-300 shrink-0 group-hover:rotate-45"
                  style={{ color: 'var(--text)' }}
                />
                <style jsx>{`
                  .group:hover :global(.service-title),
                  .group:hover p {
                    color: var(--paper) !important;
                  }
                  .group:hover :global(svg) {
                    color: var(--accent-warm) !important;
                  }
                `}</style>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
