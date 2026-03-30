'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const [nameHovered, setNameHovered] = useState(false)

  const legalLinks = t.raw('legal_links') as string[]
  const legalHrefs = [
    `/${locale}/legal/mentions-legales`,
    `/${locale}/legal/confidentialite`,
    `/${locale}/legal/cgv`,
  ]

  const navLinks = [
    { label: 'Services',  href: '#services' },
    { label: 'Projets',   href: '#projects' },
    { label: 'À propos',  href: '#about' },
    { label: 'Processus', href: '#process' },
    { label: 'Contact',   href: '#contact' },
  ]

  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>

      {/* ── Giant brand name ── */}
      <div style={{ borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
        <Link
          href={`/${locale}`}
          className="block"
          onMouseEnter={() => setNameHovered(true)}
          onMouseLeave={() => setNameHovered(false)}
        >
          <motion.div
            animate={{ x: nameHovered ? 10 : 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 sm:px-8 pt-10 pb-6"
          >
            <h2
              className="font-display leading-[0.82] tracking-tight select-none"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4.5rem, 18vw, 15rem)' }}
            >
              <span
                style={{
                  color: nameHovered ? 'var(--primary)' : 'var(--text)',
                  transition: 'color 0.4s ease',
                }}
              >
                OVER
              </span>
              <span style={{ color: 'var(--primary)' }}>BRAND</span>
            </h2>
          </motion.div>
        </Link>
      </div>

      {/* ── Footer body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

          {/* Contact */}
          <div className="lg:col-span-2">
            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              {t('tagline')}
            </p>
            <div className="space-y-3">
              <a
                href="mailto:contact@overbrand.net"
                className="flex items-center gap-3 text-sm group transition-opacity hover:opacity-60"
                style={{ color: 'var(--text-muted)' }}
              >
                <Mail size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                contact@overbrand.net
              </a>
              <a
                href="tel:+237652761931"
                className="flex items-center gap-3 text-sm group transition-opacity hover:opacity-60"
                style={{ color: 'var(--text-muted)' }}
              >
                <Phone size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                +237 652 761 931
              </a>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                Douala, Cameroun
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-5" style={{ color: 'var(--text-subtle)' }}>
              Navigation
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm flex items-center gap-1 group transition-opacity hover:opacity-60"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {link.label}
                    <ArrowUpRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--primary)' }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-5" style={{ color: 'var(--text-subtle)' }}>
              {t('legal_title')}
            </p>
            <ul className="space-y-3">
              {legalLinks.map((label, i) => (
                <li key={label}>
                  <Link
                    href={legalHrefs[i]}
                    className="text-sm flex items-center gap-1 group transition-opacity hover:opacity-60"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {label}
                    <ArrowUpRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--primary)' }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>{t('copyright')}</p>
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>{t('made_by')}</p>
        </div>
      </div>
    </footer>
  )
}
