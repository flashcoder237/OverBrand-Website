'use client'

import { useTranslations } from 'next-intl'

// Aidesigner's "metrics strip" — blue band with 4 big numbers,
// preceded by a marquee ticker and framed by a thick ink border.
export function StatsSection() {
  const t = useTranslations('stats')

  const items = [
    { value: t('projects_value'), label: t('projects_label'), accent: true },
    { value: t('clients_value'),  label: t('clients_label') },
    { value: t('years_value'),    label: t('years_label'), outline: true },
    { value: t('services_value'), label: t('services_label') },
  ]

  return (
    <section
      className="relative overflow-hidden lg:ml-16"
      style={{
        background: 'var(--primary)',
        color: 'var(--paper)',
        borderTop: '12px solid var(--ink)',
        borderBottom: '12px solid var(--ink)',
      }}
    >
      {/* Marquee ticker */}
      <div
        className="py-4 whitespace-nowrap overflow-hidden flex items-center"
        style={{
          background: 'var(--ink)',
          color: 'var(--paper)',
          borderBottom: '1px solid var(--line-light)',
        }}
      >
        <div
          className="animate-marquee font-display text-3xl md:text-5xl uppercase tracking-wider opacity-50 text-outline-paper"
        >
          OVERBRAND — AGENCE DIGITALE CRÉATIVE — DOUALA &amp; YAOUNDÉ — EXPERTISE PREMIUM — OVERBRAND — AGENCE DIGITALE CRÉATIVE — DOUALA &amp; YAOUNDÉ — EXPERTISE PREMIUM —
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0" style={{ borderColor: 'rgba(244,244,240,0.2)' }}>
        {items.map((item, i) => (
          <div
            key={i}
            className="reveal p-8 lg:p-14 flex flex-col items-center text-center"
            style={{ borderColor: 'rgba(244,244,240,0.2)' }}
          >
            <span
              className="font-display tracking-tighter"
              style={{
                fontSize: 'clamp(3.5rem, 7vw, 7rem)',
                lineHeight: 1,
                color: item.accent
                  ? 'var(--accent-warm)'
                  : item.outline
                  ? 'transparent'
                  : 'var(--paper)',
                WebkitTextStroke: item.outline ? '1.5px var(--paper)' : undefined,
              }}
            >
              {item.value}
            </span>
            <span
              className="text-xs lg:text-sm uppercase tracking-widest mt-3"
              style={{ color: 'rgba(244,244,240,0.75)' }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
