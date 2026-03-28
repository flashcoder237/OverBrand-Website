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
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [triggered, target, duration])

  return count
}

function StatCard({
  value,
  suffix,
  label,
  index,
  triggered,
}: {
  value: number
  suffix: string
  label: string
  index: number
  triggered: boolean
}) {
  const count = useCountUp(value, 1400, triggered)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex flex-col items-center text-center p-8 group"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--card-bg)',
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, var(--primary-glow) 0%, transparent 70%)',
        }}
      />

      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 h-0.5"
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
        style={{ background: 'var(--primary)' }}
      />

      <div className="relative">
        <span
          className="font-display leading-none block"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            color: 'var(--primary)',
          }}
        >
          {count}{suffix}
        </span>
        <span
          className="text-xs font-bold uppercase tracking-[0.2em] mt-3 block"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.15em' }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  )
}

export function StatsSection() {
  const t = useTranslations('stats')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const stats = [
    { value: 50, suffix: '+', label: t('projects_label') },
    { value: 40, suffix: '+', label: t('clients_label') },
    { value: 5, suffix: '+', label: t('years_label') },
    { value: 7, suffix: '', label: t('services_label') },
  ]

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
          <span className="badge">{t('eyebrow')}</span>
          <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'var(--border)' }}>
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              index={i}
              triggered={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
