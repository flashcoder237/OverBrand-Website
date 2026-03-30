'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function TestimonialsSection() {
  const t = useTranslations('testimonials')
  const items = t.raw('items') as { name: string; role: string; text: string }[]

  return (
    <section className="section" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
            <span className="badge">{t('eyebrow')}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="font-display leading-none"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                color: 'var(--text)',
              }}
            >
              {t('title_1')}{' '}
              <span style={{ color: 'var(--primary)' }}>{t('title_2')}</span>
            </h2>
            <p className="text-sm max-w-xs lg:text-right" style={{ color: 'var(--text-muted)' }}>
              {t('subtitle')}
            </p>
          </div>
        </motion.div>

        {/* Stacked editorial quotes */}
        <div className="space-y-0">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="group relative py-10 lg:py-14"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 lg:gap-16 items-start">

                {/* Number */}
                <span
                  className="font-display leading-none select-none flex-shrink-0"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                    WebkitTextStroke: '1.5px var(--accent-warm)',
                    color: 'transparent',
                    lineHeight: 1,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Quote text */}
                <div className="flex-1">
                  <p
                    className="italic leading-relaxed"
                    style={{
                      fontSize: 'clamp(1.05rem, 2vw, 1.45rem)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                {/* Author — right-aligned */}
                <div className="lg:text-right flex-shrink-0 lg:pt-1">
                  <div
                    className="font-bold text-sm uppercase tracking-widest"
                    style={{ color: 'var(--text)', letterSpacing: '0.1em' }}
                  >
                    {item.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>
                    {item.role}
                  </div>
                  {/* Accent line under author */}
                  <motion.div
                    className="h-[1.5px] mt-3 lg:ml-auto"
                    style={{ background: 'var(--primary)', width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 + 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bottom border */}
          <div style={{ borderTop: '1px solid var(--border)' }} />
        </div>

      </div>
    </section>
  )
}
