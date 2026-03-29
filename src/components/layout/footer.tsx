'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Globe, AtSign, ExternalLink, Share2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const logoSrc = mounted && resolvedTheme === 'dark' ? '/logo-bg.png' : '/logo.png'

  const servicesLinks = t.raw('services_links') as string[]
  const companyLinks = t.raw('company_links') as string[]
  const legalLinks = t.raw('legal_links') as string[]

  const companyHrefs = [
    '#about',
    '#process',
    '#contact',
    `/${locale}/dashboard`,
    `/${locale}/team`,
  ]

  const legalHrefs = [
    `/${locale}/legal/mentions-legales`,
    `/${locale}/legal/confidentialite`,
    `/${locale}/legal/cgv`,
  ]

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-4 group">
              <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
                <Image src={logoSrc} alt="OverBrand" fill className="object-contain" />
              </div>
              <span className="text-xl font-black" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>
                Over<span style={{ color: 'var(--primary)' }}>Brand</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              {t('tagline')}
            </p>
            <div className="space-y-2">
              <a href="mailto:contact@overbrand.net" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                <Mail size={14} />
                contact@overbrand.net
              </a>
              <a href="tel:+237652761931" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                <Phone size={14} />
                +237 652 761 931
              </a>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={14} />
                Douala, Cameroun
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[Globe, AtSign, ExternalLink, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>{t('services_title')}</h4>
            <ul className="space-y-2.5">
              {servicesLinks.map((label) => (
                <li key={label}>
                  <a href="#services" className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>{t('company_title')}</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((label, i) => (
                <li key={label}>
                  <a href={companyHrefs[i]} className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>{t('legal_title')}</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((label, i) => (
                <li key={label}>
                  <Link href={legalHrefs[i]} className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            {t('copyright')}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            {t('made_by')}
          </p>
        </div>
      </div>
    </footer>
  )
}
