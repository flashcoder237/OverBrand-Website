'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function FAQSection() {
  const t = useTranslations('faq')
  const items = t.raw('items') as { q: string; a: string }[]
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="section" style={{ background: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

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
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
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
            <p className="text-sm leading-relaxed max-w-xs lg:text-right pb-2" style={{ color: 'var(--text-muted)' }}>
              {t('subtitle')}
            </p>
          </div>
        </motion.div>

        {/* Borderless numbered accordion */}
        <div className="space-y-0">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <button
                className="w-full flex items-start gap-6 py-7 text-left group"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {/* Outlined number */}
                <span
                  className="font-display leading-none select-none flex-shrink-0 pt-0.5"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    WebkitTextStroke: `1.5px ${openIndex === i ? 'var(--primary)' : 'var(--border-strong)'}`,
                    color: 'transparent',
                    transition: 'all 0.3s',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Question */}
                <span
                  className="flex-1 font-semibold text-sm lg:text-base transition-colors duration-200 pt-1"
                  style={{ color: openIndex === i ? 'var(--primary)' : 'var(--text)' }}
                >
                  {item.q}
                </span>

                {/* Plus icon — rotates 45° when open */}
                <motion.span
                  className="flex-shrink-0 mt-1"
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  style={{ color: openIndex === i ? 'var(--primary)' : 'var(--text-subtle)' }}
                >
                  <Plus size={18} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="pb-7 pl-[3.25rem]">
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Bottom border */}
          <div style={{ borderTop: '1px solid var(--border)' }} />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14"
        >
          <a href="#contact">
            <button className="btn-primary text-xs px-8 py-3.5">
              {t('cta')}
            </button>
          </a>
        </motion.div>

      </div>
    </section>
  )
}
