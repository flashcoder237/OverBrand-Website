'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

const TIMELINE = [
  { year: '2019', label: 'Fondation', desc: 'Création de l\'agence à Paris.' },
  { year: '2020', label: 'Premiers projets', desc: '10 clients servis, branding & web.' },
  { year: '2021', label: 'Expansion', desc: 'Équipe x3, clients internationaux.' },
  { year: '2022', label: 'Digitale 360°', desc: 'Lancement des services SEO & Ads.' },
  { year: '2023', label: 'Applications', desc: 'Dev mobile & logiciels sur mesure.' },
  { year: '2024', label: 'OverBrand Pro', desc: '50+ projets, dashboard client.' },
]

export function AboutSection() {
  const t = useTranslations('about')
  const timelineRef = useRef<HTMLDivElement>(null)

  const VALUES = [
    { icon: Zap, title: t('value_reactivity_title'), description: t('value_reactivity_desc') },
    { icon: Shield, title: t('value_reliability_title'), description: t('value_reliability_desc') },
    { icon: TrendingUp, title: t('value_performance_title'), description: t('value_performance_desc') },
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
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--text)' }}
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
              className="p-8 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' }}
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

        {/* Horizontal timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>Notre histoire</span>
          </div>

          <div
            ref={timelineRef}
            className="relative overflow-x-auto scrollbar-none pb-6"
          >
            {/* Connecting line */}
            <div
              className="absolute top-[28px] left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, var(--primary), var(--accent), transparent)' }}
            />

            <div className="flex gap-0 min-w-max">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative flex flex-col items-center group"
                  style={{ width: '160px', paddingTop: '0' }}
                >
                  {/* Dot */}
                  <motion.div
                    className="w-3 h-3 rounded-full relative z-10 mb-4 transition-all duration-300"
                    style={{ background: i === TIMELINE.length - 1 ? 'var(--primary)' : 'var(--border)', border: '2px solid var(--primary)' }}
                    whileHover={{ scale: 1.6, background: 'var(--accent)' }}
                  />

                  {/* Content alternating */}
                  <div
                    className="text-center px-3"
                    style={{ marginTop: i % 2 === 0 ? '0' : '0' }}
                  >
                    <div
                      className="font-display text-2xl mb-1 group-hover:text-primary transition-colors duration-200"
                      style={{ fontFamily: 'var(--font-display)', color: i === TIMELINE.length - 1 ? 'var(--primary)' : 'var(--text)' }}
                    >
                      {item.year}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--primary)' }}>
                      {item.label}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {item.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
