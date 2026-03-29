'use client'

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'

const TIMELINE = [
  {
    year: '2019',
    label: 'Fondation',
    desc: 'Création de l\'agence — première identité, premiers clients, premières ambitions.',
    color: '#2855a0',
    stat: '3 clients',
  },
  {
    year: '2020',
    label: 'Premiers projets',
    desc: 'Branding, sites web et une réputation qui commence à se bâtir projet après projet.',
    color: '#2f62b8',
    stat: '10 projets',
  },
  {
    year: '2021',
    label: 'Expansion',
    desc: 'L\'équipe triple. Premiers clients internationaux. Le studio prend de l\'ampleur.',
    color: '#3a6fd8',
    stat: '3× l\'équipe',
  },
  {
    year: '2022',
    label: 'Digitale 360°',
    desc: 'Lancement SEO & Ads. OverBrand devient une agence full-service end-to-end.',
    color: '#4a80e8',
    stat: '7 services',
  },
  {
    year: '2023',
    label: 'Applications',
    desc: 'Développement mobile & logiciels sur mesure. La tech s\'intègre à l\'ADN créatif.',
    color: '#5a8ff0',
    stat: '20+ apps',
  },
  {
    year: '2024',
    label: 'OverBrand Pro',
    desc: '50+ projets livrés, dashboard client lancé. Nouvelle ère, même exigence créative.',
    color: '#6b9fd4',
    stat: '50+ projets',
  },
]

// Individual step — reveals only when it enters the viewport
function TimelineStep({ item, index }: { item: typeof TIMELINE[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })
  const isLeft = index % 2 === 0
  const isLast = index === TIMELINE.length - 1

  return (
    <div ref={ref} className="relative flex items-stretch" style={{ minHeight: '160px' }}>

      {/* ── DESKTOP layout ── */}

      {/* Left half */}
      <div className="hidden lg:flex flex-1 justify-end items-center pr-10 py-6">
        {isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', maxWidth: '340px' }}
          >
            <StepCard item={item} index={index} />
          </motion.div>
        ) : (
          <div /> /* empty slot */
        )}
      </div>

      {/* Center spine */}
      <div className="hidden lg:flex flex-col items-center flex-shrink-0" style={{ width: '80px' }}>
        {/* Line above */}
        <motion.div
          className="flex-1 w-px"
          style={{ background: index === 0 ? 'transparent' : `linear-gradient(180deg, ${TIMELINE[index - 1].color}, ${item.color})` }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {/* Dot */}
        <motion.div
          className="flex-shrink-0 relative z-10 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15, type: 'spring', stiffness: 280, damping: 18 }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--bg)',
              border: `2px solid ${item.color}`,
              boxShadow: `0 0 20px ${item.color}44`,
            }}
          >
            <span
              className="font-display font-black"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: item.color }}
            >
              {item.year.slice(2)}
            </span>
          </div>
          {isLast && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `1px solid ${item.color}` }}
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </motion.div>

        {/* Line below */}
        <motion.div
          className="flex-1 w-px"
          style={{ background: isLast ? 'transparent' : `linear-gradient(180deg, ${item.color}, ${TIMELINE[index + 1].color})` }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
        />
      </div>

      {/* Right half */}
      <div className="hidden lg:flex flex-1 justify-start items-center pl-10 py-6">
        {!isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', maxWidth: '340px' }}
          >
            <StepCard item={item} index={index} />
          </motion.div>
        ) : (
          <div /> /* empty slot */
        )}
      </div>

      {/* ── MOBILE layout ── */}
      <div className="lg:hidden flex gap-5 pb-8 w-full">
        <div className="flex flex-col items-center flex-shrink-0">
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg)', border: `2px solid ${item.color}`, boxShadow: `0 0 12px ${item.color}33` }}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.4, type: 'spring' }}
          >
            <span className="font-display font-black" style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: item.color }}>
              {item.year.slice(2)}
            </span>
          </motion.div>
          {!isLast && (
            <motion.div
              className="w-px flex-1 mt-1"
              style={{ background: `linear-gradient(180deg, ${item.color}, ${TIMELINE[index + 1]?.color ?? item.color})`, minHeight: '60px' }}
              initial={{ scaleY: 0, originY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 pb-2"
        >
          <StepCard item={item} index={index} />
        </motion.div>
      </div>
    </div>
  )
}

function StepCard({ item, index }: { item: typeof TIMELINE[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden w-full"
      style={{
        background: 'var(--card-bg)',
        border: `1px solid ${hovered ? item.color : 'var(--card-border)'}`,
        transition: 'border-color 0.25s, box-shadow 0.25s',
        boxShadow: hovered ? `0 0 30px ${item.color}22, 0 16px 40px rgba(0,0,0,0.08)` : 'none',
      }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      {/* Accent bar */}
      <motion.div
        className="absolute top-0 left-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
        animate={{ width: hovered ? '100%' : '35%' }}
        transition={{ duration: 0.35 }}
      />

      {/* Watermark year */}
      <div
        className="absolute -bottom-2 -right-1 select-none pointer-events-none font-black leading-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '5.5rem',
          color: item.color,
          opacity: hovered ? 0.12 : 0.06,
          transition: 'opacity 0.3s',
        }}
      >
        {item.year}
      </div>

      <div className="relative p-6">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-black uppercase tracking-[0.2em] px-2 py-0.5"
            style={{
              color: item.color,
              background: `${item.color}18`,
              border: `1px solid ${item.color}33`,
              clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
            }}
          >
            {item.year}
          </span>
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color: hovered ? item.color : 'var(--text-subtle)', transition: 'color 0.25s' }}
          >
            {item.stat}
          </span>
        </div>

        <h4
          className="font-display text-xl mb-2 transition-colors duration-200"
          style={{ fontFamily: 'var(--font-display)', color: hovered ? item.color : 'var(--text)' }}
        >
          {item.label}
        </h4>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  )
}

export function AboutSection() {
  const t = useTranslations('about')

  const VALUES = [
    { icon: Zap, title: t('value_reactivity_title'), description: t('value_reactivity_desc') },
    { icon: Shield, title: t('value_reliability_title'), description: t('value_reliability_desc') },
    { icon: TrendingUp, title: t('value_performance_title'), description: t('value_performance_desc') },
  ]

  const checklist: string[] = t.raw('checklist') as string[]

  return (
    <section id="about" className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Intro grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-glow)' }}>
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

        {/* Timeline */}
        <div>
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
              <span className="badge">Notre histoire</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
              <span>2019</span>
              <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, var(--primary), var(--accent-light))' }} />
              <span style={{ color: 'var(--primary)' }}>2024</span>
            </div>
          </motion.div>

          {/* Steps — each one reveals independently on scroll */}
          <div className="relative">
            {TIMELINE.map((item, i) => (
              <TimelineStep key={item.year} item={item} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
