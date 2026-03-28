'use client'

import { motion } from 'framer-motion'
import { CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function AboutSection() {
  const t = useTranslations('about')

  const VALUES = [
    {
      icon: Zap,
      title: t('value_reactivity_title'),
      description: t('value_reactivity_desc'),
    },
    {
      icon: Shield,
      title: t('value_reliability_title'),
      description: t('value_reliability_desc'),
    },
    {
      icon: TrendingUp,
      title: t('value_performance_title'),
      description: t('value_performance_desc'),
    },
  ]

  const checklist: string[] = t.raw('checklist') as string[]

  return (
    <section id="about" className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
              <span className="badge">{t('eyebrow')}</span>
            </div>
            <h2
              className="font-display leading-none mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                color: 'var(--text)',
              }}
            >
              {t('title_1')}<br />
              <span style={{ color: 'var(--primary)' }}>{t('title_2')}</span>
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              {t('description_1')}
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
              {t('description_2')}
            </p>

            {/* Checklist */}
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            {/* Big card */}
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, var(--primary) 0%, hsl(calc(var(--hue) + 40), 82%, 55%) 100%)`,
              }}
            >
              <div className="absolute inset-0 dot-bg opacity-20" />
              <div className="relative">
                <div className="text-6xl font-black text-white mb-2">5+</div>
                <div className="text-white/80 text-lg font-medium">{t('stat_years')}</div>
                <div className="text-white/60 text-sm mt-1">{t('stat_years_sub')}</div>
              </div>
            </div>

            {/* Value cards */}
            <div className="grid grid-cols-1 gap-4">
              {VALUES.map((val, i) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card card-glass p-5 flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--primary-glow)' }}
                  >
                    <val.icon size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>{val.title}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{val.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
