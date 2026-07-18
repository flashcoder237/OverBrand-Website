'use client'

import { Fragment } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { ORG } from '@/lib/seo'

// Inline brand icons — lucide-react 1.x doesn't ship them.
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.368-1.852 3.6 0 4.266 2.371 4.266 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.779 13.019H3.555V9h3.561v11.452zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.541C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
      {/* The footer sits on --ink, so inactive locales use the same translucent
          paper as the copyright and legal links. `--text-subtle` is tuned for
          light surfaces and was invisible here. */}
      {routing.locales.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span style={{ color: 'rgba(244, 244, 240, 0.25)' }}>|</span>}
          <Link
            href={pathname}
            locale={l}
            className="px-2 py-1 transition-opacity"
            style={{
              color: locale === l ? 'var(--accent-warm)' : 'rgba(244, 244, 240, 0.5)',
              borderBottom:
                locale === l ? '1.5px solid var(--accent-warm)' : '1.5px solid transparent',
            }}
          >
            {l.toUpperCase()}
          </Link>
        </Fragment>
      ))}
    </div>
  )
}

export function Footer() {
  const t = useTranslations('footer')

  const legalLinks = t.raw('legal_links') as string[]
  const legalHrefs = [
    '/legal/mentions-legales',
    '/legal/confidentialite',
    '/legal/cgv',
  ]

  // Labels come from `footer.company_items` / `footer.services_items`, which are
  // keyed by href rather than positional so a reordering can't desync them.
  const navColumns = [
    {
      title: t('company_title'),
      items: [
        { label: t('company_items.about'),    href: '/a-propos' },
        { label: t('company_items.team'),     href: '/equipe' },
        { label: t('company_items.careers'),  href: '/carrieres' },
        { label: t('company_items.insights'), href: '/insights' },
        { label: t('company_items.contact'),  href: '/contact' },
      ],
    },
    {
      title: t('services_title'),
      items: [
        { label: t('services_items.website'),  href: '/services/creation-sites-web' },
        { label: t('services_items.software'), href: '/services/logiciels-applications' },
        { label: t('services_items.hosting'),  href: '/services/hebergement-gestion' },
        { label: t('services_items.ads'),      href: '/services/publicite-en-ligne' },
        { label: t('services_items.seo'),      href: '/services/visibilite-google' },
        { label: t('services_items.branding'), href: '/services/logo-identite-marque' },
        { label: t('services_items.content'),  href: '/services/creation-contenus' },
      ],
    },
  ]

  return (
    <footer
      className="relative overflow-hidden lg:pl-16"
      style={{ background: 'var(--ink)', color: 'var(--paper)' }}
    >
      {/* ── CTA block ── */}
      <div
        className="px-6 lg:px-12 pt-20 md:pt-32 pb-16"
        style={{ borderBottom: '1px solid var(--line-light)' }}
      >
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            <h2
              className="font-display uppercase tracking-tight"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                lineHeight: 0.9,
              }}
            >
              {t('cta_title_1')} <br />
              <span style={{ color: 'var(--accent-warm)' }}>{t('cta_title_2')}</span>
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 mt-10 px-10 py-5 font-display text-xl md:text-2xl uppercase tracking-wider transition-all duration-300"
              style={{
                background: 'var(--paper)',
                color: 'var(--ink)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-warm)'
                e.currentTarget.style.color = 'var(--paper)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--paper)'
                e.currentTarget.style.color = 'var(--ink)'
              }}
            >
              {t('cta_button')} <ArrowUpRight size={20} />
            </Link>
          </div>

          <div className="md:col-span-5 md:pl-12 flex flex-col gap-8"
               style={{ borderLeft: '1px solid var(--line-light)' }}
          >
            <div>
              <h5 className="font-display text-xl uppercase mb-2" style={{ color: 'var(--accent-warm)' }}>
                {t('hq_title')}
              </h5>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(244, 244, 240, 0.6)' }}>
                {t('hq_address')}<br />{t('hq_country')}
              </p>
            </div>
            <div>
              <h5 className="font-display text-xl uppercase mb-2" style={{ color: 'var(--accent-warm)' }}>
                {t('contact_title')}
              </h5>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(244, 244, 240, 0.6)' }}>
                <a href={`mailto:${ORG.email}`} className="hover:text-[color:var(--paper)]">
                  {ORG.email}
                </a>
                {ORG.phones.map((p) => (
                  <span key={p.e164} className="block">
                    <a href={`tel:${p.e164}`} className="hover:text-[color:var(--paper)]">
                      {p.display}
                    </a>
                    <span className="ml-2 opacity-60">{p.region}</span>
                  </span>
                ))}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/overbrandcm"
                target="_blank" rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                style={{ border: '1px solid var(--line-light)' }}
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="https://www.instagram.com/overbrand"
                target="_blank" rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                style={{ border: '1px solid var(--line-light)' }}
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Giant wordmark ── */}
      <div className="w-full overflow-hidden select-none py-8">
        <h1
          className="font-display w-full text-center whitespace-nowrap text-outline-paper"
          style={{
            fontSize: 'clamp(6rem, 22vw, 20rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.02em',
            opacity: 0.35,
          }}
        >
          OVERBRAND
        </h1>
      </div>

      {/* ── Nav columns + legal bar ── */}
      <div
        className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 md:grid-cols-4 gap-8"
        style={{ borderTop: '1px solid var(--line-light)' }}
      >
        <div className="md:col-span-2">
          <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(244, 244, 240, 0.55)' }}>
            {t('tagline')}
          </p>
        </div>

        {navColumns.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-5" style={{ color: 'rgba(244, 244, 240, 0.4)' }}>
              {col.title}
            </p>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm flex items-center gap-1 group transition-opacity hover:opacity-70"
                    style={{ color: 'rgba(244, 244, 240, 0.8)' }}
                  >
                    {item.label}
                    <ArrowUpRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--accent-warm)' }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid var(--line-light)' }}
      >
        <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(244, 244, 240, 0.4)' }}>
          {t('copyright')}
        </p>
        <LanguageSwitcher />
        <div className="flex gap-5 text-xs uppercase tracking-widest">
          {legalLinks.map((label, i) => (
            <Link
              key={label}
              href={legalHrefs[i]}
              className="transition-opacity hover:opacity-100"
              style={{ color: 'rgba(244, 244, 240, 0.4)' }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
