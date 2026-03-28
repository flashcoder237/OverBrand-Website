'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
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
          className="mb-16"
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
            <p className="text-sm leading-relaxed max-w-xs lg:text-right pb-2" style={{ color: 'var(--text-muted)' }}>
              {t('subtitle')}
            </p>
          </div>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div
                className="overflow-hidden"
                style={{
                  border: '1px solid var(--border)',
                  background: openIndex === i ? 'var(--surface)' : 'var(--card-bg)',
                  transition: 'background 0.3s',
                }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span
                    className="font-semibold text-sm lg:text-base transition-colors duration-200"
                    style={{ color: openIndex === i ? 'var(--primary)' : 'var(--text)' }}
                  >
                    {item.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: openIndex === i ? 'var(--primary)' : 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: openIndex === i ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    {openIndex === i ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="px-6 pb-5">
                        <div
                          className="h-px mb-4"
                          style={{ background: 'var(--border)' }}
                        />
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {/* Bilingual inline */}
          </p>
          <a href="#contact">
            <button className="btn-primary text-xs px-8 py-3.5">
              Démarrer →
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
