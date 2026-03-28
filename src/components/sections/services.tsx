'use client'

import { motion } from 'framer-motion'
import {
  Globe, Smartphone, Cloud, Megaphone,
  Search, Palette, Clapperboard, ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  Cloud,
  Megaphone,
  Search,
  Palette,
  Clapperboard,
}

const SERVICE_IDS = [
  { id: 'website', icon: 'Globe' },
  { id: 'software', icon: 'Smartphone' },
  { id: 'hosting', icon: 'Cloud' },
  { id: 'ads', icon: 'Megaphone' },
  { id: 'seo', icon: 'Search' },
  { id: 'branding', icon: 'Palette' },
  { id: 'content', icon: 'Clapperboard' },
]

export function ServicesSection() {
  const t = useTranslations('services')

  return (
    <section id="services" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header — editorial style, left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 lg:mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
            <span className="badge">{t('eyebrow')}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              className="font-display leading-none tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                color: 'var(--text)',
              }}
            >
              {t('title_1')}<br />
              <span style={{ color: 'var(--primary)' }}>{t('title_2')}</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-xs lg:max-w-sm lg:text-right pb-2" style={{ color: 'var(--text-muted)' }}>
              {t('subtitle')}
            </p>
          </div>
        </motion.div>

        {/* Services list — numbered editorial style */}
        <div className="divide-y" style={{ borderTop: '1px solid var(--border)', borderColor: 'var(--border)' }}>
          {SERVICE_IDS.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? Globe
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <div
                  className="group flex items-center gap-6 py-6 lg:py-7 cursor-pointer transition-all duration-300 hover:pl-4"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  {/* Number */}
                  <span
                    className="service-number flex-shrink-0 w-14 text-right transition-colors duration-300 group-hover:text-transparent"
                    style={{
                      fontFamily: 'var(--font-display)',
                      WebkitTextStroke: '1px var(--primary)',
                    } as React.CSSProperties}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-11 h-11 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: 'var(--primary)', transition: 'color 0.3s' }}
                      className="group-hover:text-accent"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-base lg:text-lg mb-1 group-hover:text-primary transition-colors duration-300"
                      style={{ color: 'var(--text)' }}
                    >
                      {t(`items.${service.id}.title`)}
                    </h3>
                    <p className="text-xs lg:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {t(`items.${service.id}.description`)}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight
                    size={20}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                    style={{ color: 'var(--primary)' }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
            {t('cta_text')}
          </p>
          <a href="#contact">
            <button className="btn-primary text-xs px-6 py-3 flex items-center gap-2">
              {t('cta_button')} <ArrowUpRight size={14} />
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
