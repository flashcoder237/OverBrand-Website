'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'

function useCountUp(target: number, duration: number, triggered: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!triggered) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [triggered, target, duration])
  return count
}

function StatItem({
  value, suffix, label, index, triggered,
}: {
  value: number; suffix: string; label: string; index: number; triggered: boolean
}) {
  const count = useCountUp(value, 1600, triggered)

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center relative"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
    >
      {/* Animated top accent */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-12"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
        style={{ background: 'var(--primary)', transformOrigin: 'center' }}
      />

      {/* Number */}
      <span
        className="font-display leading-none block tabular-nums"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(4.5rem, 9vw, 8.5rem)',
          color: 'var(--primary)',
          letterSpacing: '-0.02em',
        }}
      >
        {count}{suffix}
      </span>

      {/* Label */}
      <span
        className="text-xs font-bold uppercase tracking-[0.2em] mt-3 block"
        style={{ color: 'var(--text-muted)', letterSpacing: '0.16em' }}
      >
        {label}
      </span>
    </motion.div>
  )
}

export function StatsSection() {
  const t = useTranslations('stats')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const stats = [
    { value: 50,  suffix: '+', label: t('projects_label') },
    { value: 40,  suffix: '+', label: t('clients_label') },
    { value: 5,   suffix: '+', label: t('years_label') },
    { value: 7,   suffix: '',  label: t('services_label') },
  ]

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center gap-3 pt-10"
      >
        <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
        <span className="badge">{t('eyebrow')}</span>
        <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
      </motion.div>

      {/* Stats row — separated by vertical dividers */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4"
        style={{
          borderTop: '1px solid var(--border)',
          marginTop: '2rem',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="relative"
            style={{
              borderRight: i < stats.length - 1 ? '1px solid var(--border)' : undefined,
              borderBottom: i < 2 ? '1px solid var(--border)' : undefined,
            }}
          >
            <StatItem
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              index={i}
              triggered={inView}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
