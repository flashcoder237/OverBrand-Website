'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function HeroSection() {
  const t = useTranslations('hero')

  return (
    <section
      className="relative w-full flex flex-col justify-end overflow-hidden pt-28 md:pt-36 pb-12 md:pb-20 px-6 lg:px-12 lg:pl-28"
      style={{ minHeight: 'calc(100dvh - 80px)', background: 'var(--bg)' }}
    >
      {/* Background photo treatment */}
      <div className="absolute top-0 right-0 w-full md:w-3/4 h-[70vh] z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            filter: 'grayscale(1) contrast(1.3)',
            opacity: 0.15,
            mixBlendMode: 'multiply',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, var(--bg), transparent 70%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, var(--bg), transparent 60%)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8 flex flex-col">
          <p
            className="reveal text-sm md:text-base font-semibold uppercase mb-6 flex items-center gap-4"
            style={{ color: 'var(--accent-warm)', letterSpacing: '0.22em' }}
          >
            <span className="w-12 h-[1px]" style={{ background: 'var(--accent-warm)' }} />
            {t('badge')}
          </p>

          <h1
            className="font-display uppercase tracking-tight m-0 flex flex-col"
            style={{
              fontSize: 'clamp(4rem, 12vw, 11rem)',
              lineHeight: 0.85,
              color: 'var(--text)',
            }}
          >
            <span className="overflow-hidden block">
              <span
                className="reveal inline-block px-4 pb-2"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                {t('line1')}
              </span>
            </span>
            <span className="overflow-hidden block">
              <span className="reveal inline-block" style={{ color: 'var(--primary)' }}>
                {t('line2')}
              </span>
            </span>
            <span className="overflow-hidden block">
              <span className="reveal inline-block text-outline">{t('line3')}</span>
            </span>
          </h1>
        </div>

        <div
          className="lg:col-span-4 flex flex-col gap-8 lg:pl-12 h-full justify-end py-6 reveal"
          style={{ borderLeft: '1px solid var(--line)' }}
        >
          <p
            className="text-lg lg:text-xl font-light leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300"
              style={{ background: 'var(--primary)', color: 'var(--paper)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-warm)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--primary)')}
            >
              {t('cta_primary')}
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/projets"
              className="btn-ghost justify-center"
            >
              {t('cta_secondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
