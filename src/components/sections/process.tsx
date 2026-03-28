'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function ProcessSection() {
  const t = useTranslations('process')
  const steps = t.raw('steps') as { title: string; description: string }[]

  return (
    <section id="process" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
            <span className="badge">{t('eyebrow')}</span>
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
          </div>
          <h2
            className="font-display leading-none mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              color: 'var(--text)',
            }}
          >
            {t('title_1')} <span style={{ color: 'var(--primary)' }}>{t('title_2')}</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="card card-glass p-7 relative overflow-hidden group"
            >
              {/* Number bg */}
              <div
                className="absolute top-4 right-4 text-6xl font-black opacity-5 group-hover:opacity-10 transition-opacity select-none"
                style={{ color: 'var(--primary)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Step badge */}
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-black mb-4"
                style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text)' }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
