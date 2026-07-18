'use client'

import { useTranslations } from 'next-intl'

// Aidesigner: 3x2 rigid grid on ink-dark bg, cells invert to blue on hover.
export function ProcessSection() {
  const t = useTranslations('process')

  const steps = (t.raw('steps') ?? []) as Array<{ title: string; description: string }>

  return (
    <section
      id="process"
      className="relative section px-6 lg:px-12 lg:pl-28"
      style={{ background: 'var(--ink)', color: 'var(--paper)' }}
    >
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(244,244,240,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,240,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-screen-2xl mx-auto">
        <div className="text-center flex flex-col items-center mb-16 md:mb-20 reveal">
          <span
            className="text-sm uppercase mb-4"
            style={{ color: 'var(--accent-warm)', letterSpacing: '0.3em' }}
          >
            {t('eyebrow')}
          </span>
          <h2
            className="font-display uppercase tracking-tight leading-[0.9]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            {t('title_1')} <span className="text-outline-paper">{t('title_2')}</span>.
          </h2>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ border: '1px solid rgba(244,244,240,0.2)' }}
        >
          {steps.map((step, i) => {
            const isLastRow = i >= steps.length - 3
            const isLastCol = (i + 1) % 3 === 0
            return (
              <div
                key={i}
                className="group p-8 lg:p-12 transition-colors duration-500 reveal"
                style={{
                  background: '#111',
                  borderBottom: !isLastRow ? '1px solid rgba(244,244,240,0.15)' : undefined,
                  borderRight: !isLastCol ? '1px solid rgba(244,244,240,0.15)' : undefined,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
              >
                <span
                  className="font-display text-5xl block mb-6"
                  style={{ color: 'rgba(255, 77, 0, 0.45)' }}
                >
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <h4 className="font-display text-2xl md:text-3xl uppercase mb-3 leading-tight">
                  {step.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,244,240,0.7)' }}>
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
