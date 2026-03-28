'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useTranslations } from 'next-intl'

const AVATARS = ['SM', 'JK', 'MN']

export function TestimonialsSection() {
  const t = useTranslations('testimonials')
  const items = t.raw('items') as { name: string; role: string; text: string }[]

  return (
    <section className="section">
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card card-glass p-7 relative"
            >
              <Quote
                size={32}
                className="absolute top-6 right-6 opacity-10"
                style={{ color: 'var(--primary)' }}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" style={{ color: '#f59e0b' }} />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'var(--primary)' }}
                >
                  {AVATARS[i]}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
