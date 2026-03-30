'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

// Per-service gradient — all within the existing brand blue palette
const SERVICE_GRADIENTS: Record<string, string> = {
  website:  'linear-gradient(135deg, #0d2240 0%, #2855a0 100%)',
  software: 'linear-gradient(160deg, #1a3a6b 0%, #3a6fd8 100%)',
  hosting:  'linear-gradient(120deg, #080f1e 0%, #1a3a6b 60%, #2855a0 100%)',
  ads:      'linear-gradient(145deg, #2855a0 0%, #6b9fd4 100%)',
  seo:      'linear-gradient(135deg, #0d2240 0%, #3a6fd8 100%)',
  branding: 'linear-gradient(160deg, #0a1528 0%, #2855a0 80%, #3a6fd8 100%)',
  content:  'linear-gradient(135deg, #0d2240 0%, #4a7fe0 70%, #6b9fd4 100%)',
}

const SERVICE_IDS = [
  { id: 'website',  icon: 'Globe' },
  { id: 'software', icon: 'Smartphone' },
  { id: 'hosting',  icon: 'Cloud' },
  { id: 'ads',      icon: 'Megaphone' },
  { id: 'seo',      icon: 'Search' },
  { id: 'branding', icon: 'Palette' },
  { id: 'content',  icon: 'Clapperboard' },
]

export function ServicesSection() {
  const t = useTranslations('services')
  const [activeId, setActiveId] = useState(SERVICE_IDS[0].id)

  const activeIndex  = SERVICE_IDS.findIndex(s => s.id === activeId)
  const activeService = SERVICE_IDS[activeIndex]
  const ActiveIcon   = ICON_MAP[activeService.icon] ?? Globe

  return (
    <section id="services" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
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
            <p
              className="text-sm leading-relaxed max-w-xs lg:max-w-sm lg:text-right pb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('subtitle')}
            </p>
          </div>
        </motion.div>

        {/* ── Split layout (desktop) ── */}
        <div className="hidden lg:flex gap-12 items-start">

          {/* LEFT — service list */}
          <div className="w-[44%] flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
            {SERVICE_IDS.map((service, i) => {
              const isActive = activeId === service.id
              const Icon = ICON_MAP[service.icon] ?? Globe

              return (
                <motion.div
                  key={service.id}
                  className="relative overflow-hidden cursor-pointer"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  onHoverStart={() => setActiveId(service.id)}
                >
                  {/* Active background fill */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ background: 'var(--surface)' }}
                  />

                  {/* Left accent bar */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ background: 'var(--primary)', originY: 0.5 }}
                  />

                  <div className="relative z-10 flex items-center gap-4 px-6 py-5">
                    {/* Number */}
                    <span
                      className="flex-shrink-0 font-display leading-none select-none"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.4rem',
                        color: isActive ? 'var(--primary)' : 'var(--border)',
                        width: '2.25rem',
                        transition: 'color 0.3s',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                      style={{
                        background: isActive ? 'var(--primary-glow)' : 'transparent',
                        border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                        clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                        transition: 'background 0.3s, border-color 0.3s',
                      }}
                    >
                      <Icon
                        size={17}
                        style={{
                          color: isActive ? 'var(--primary)' : 'var(--text-subtle)',
                          transition: 'color 0.3s',
                        }}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className="flex-1 font-bold text-sm"
                      style={{
                        color: isActive ? 'var(--text)' : 'var(--text-muted)',
                        transition: 'color 0.3s',
                      }}
                    >
                      {t(`items.${service.id}.title`)}
                    </h3>

                    {/* Arrow */}
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 6 }}
                      transition={{ duration: 0.2 }}
                      style={{ color: 'var(--primary)', flexShrink: 0 }}
                    >
                      <ArrowUpRight size={17} />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* RIGHT — sticky visual panel */}
          <div className="flex-1">
            <div className="sticky top-24">
              <div
                className="relative overflow-hidden"
                style={{
                  height: '490px',
                  clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    className="absolute inset-0 flex flex-col justify-between p-10"
                    style={{ background: SERVICE_GRADIENTS[activeId] ?? SERVICE_GRADIENTS.website }}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Dot grid */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                        opacity: 0.18,
                      }}
                    />

                    {/* Giant number watermark */}
                    <div
                      className="absolute top-0 right-4 leading-none select-none pointer-events-none"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '13rem',
                        color: 'rgba(255,255,255,0.05)',
                        lineHeight: 0.82,
                      }}
                    >
                      {String(activeIndex + 1).padStart(2, '0')}
                    </div>

                    {/* Top chip */}
                    <div className="relative z-10">
                      <motion.span
                        key={activeId + '-chip'}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.28, delay: 0.08 }}
                        className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-white/70 px-3 py-1.5 bg-white/10"
                        style={{ clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
                      >
                        {t(`items.${activeId}.title`)}
                      </motion.span>
                    </div>

                    {/* Giant icon — center */}
                    <div className="relative z-10 flex items-center justify-center flex-1">
                      <motion.div
                        key={activeId + '-icon'}
                        initial={{ opacity: 0, scale: 0.65, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
                      >
                        <ActiveIcon
                          size={136}
                          strokeWidth={0.55}
                          style={{ color: 'rgba(255,255,255,0.88)' }}
                        />
                      </motion.div>
                    </div>

                    {/* Bottom: description + CTA */}
                    <motion.div
                      key={activeId + '-desc'}
                      className="relative z-10"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.32, delay: 0.1 }}
                    >
                      <p className="text-sm leading-relaxed text-white/78 max-w-sm mb-5">
                        {t(`items.${activeId}.description`)}
                      </p>
                      <a href="#contact">
                        <button
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white px-5 py-3 transition-all hover:bg-white/20"
                          style={{
                            background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.22)',
                            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                          }}
                        >
                          {t('cta_button')} <ArrowUpRight size={14} />
                        </button>
                      </a>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>

        {/* ── Mobile: accordion ── */}
        <div className="lg:hidden mt-0" style={{ borderTop: '1px solid var(--border)' }}>
          {SERVICE_IDS.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? Globe
            const isOpen = activeId === service.id

            return (
              <div key={service.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <button
                  className="w-full flex items-center gap-4 py-4 text-left"
                  onClick={() => setActiveId(service.id)}
                >
                  <span
                    className="flex-shrink-0 font-display leading-none select-none"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      color: isOpen ? 'var(--primary)' : 'var(--border)',
                      width: '2.25rem',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Icon
                    size={17}
                    style={{ color: isOpen ? 'var(--primary)' : 'var(--text-subtle)', flexShrink: 0 }}
                  />
                  <span
                    className="flex-1 font-bold text-sm"
                    style={{ color: isOpen ? 'var(--text)' : 'var(--text-muted)' }}
                  >
                    {t(`items.${service.id}.title`)}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ color: 'var(--primary)' }}
                  >
                    <ArrowUpRight size={16} />
                  </motion.div>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? '100px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  <p
                    className="text-sm leading-relaxed pl-16 pr-4 pb-4"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {t(`items.${service.id}.description`)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Bottom CTA ── */}
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
