'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function ProcessSection() {
  const t = useTranslations('process')
  const steps = t.raw('steps') as { title: string; description: string }[]

  return (
    <section id="process" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 lg:mb-24"
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

        {/* ── Desktop: horizontal timeline ── */}
        <div className="hidden lg:block relative">

          {/* Connecting line */}
          <div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ top: '1.5rem', background: 'var(--border)' }}
          >
            <motion.div
              className="h-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'var(--primary)', transformOrigin: 'left center' }}
            />
          </div>

          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative pt-0"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                {/* Dot on the timeline */}
                <motion.div
                  className="w-3 h-3 rounded-full mb-8 relative z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 + 0.3, type: 'spring', stiffness: 300 }}
                  style={{
                    background: 'var(--primary)',
                    boxShadow: '0 0 0 4px var(--bg-secondary)',
                  }}
                />

                {/* Outlined number */}
                <span
                  className="block font-display leading-none mb-5 select-none"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3.5rem, 5vw, 5rem)',
                    WebkitTextStroke: '1.5px var(--primary)',
                    color: 'transparent',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3
                  className="font-bold text-sm mb-2"
                  style={{ color: 'var(--text)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Mobile: vertical timeline ── */}
        <div className="lg:hidden relative pl-8">

          {/* Vertical line */}
          <div
            className="absolute left-[5px] top-0 bottom-0 w-px pointer-events-none"
            style={{ background: 'var(--border)' }}
          >
            <motion.div
              className="w-full"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'var(--primary)', transformOrigin: 'top center', height: '100%' }}
            />
          </div>

          <div className="space-y-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
              >
                {/* Dot */}
                <div
                  className="absolute -left-8 top-1 w-[11px] h-[11px] rounded-full"
                  style={{
                    background: 'var(--primary)',
                    boxShadow: '0 0 0 3px var(--bg-secondary)',
                  }}
                />

                {/* Outlined number */}
                <span
                  className="block font-display leading-none mb-3 select-none"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    WebkitTextStroke: '1.5px var(--primary)',
                    color: 'transparent',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="font-bold text-sm mb-1.5" style={{ color: 'var(--text)' }}>
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
