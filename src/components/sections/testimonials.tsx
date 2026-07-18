'use client'

import { Quote } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Aidesigner: horizontal snap-scroll row of 3 testimonial cards on paper bg.
// Third card inverts to blue with a dark drop-shadow.
export function TestimonialsSection() {
  const t = useTranslations('testimonials')
  const items = (t.raw('items') ?? []) as Array<{
    name: string
    role: string
    text: string
  }>

  const portraits = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
  ]

  return (
    <section
      id="testimonials"
      className="section px-6 lg:px-12 lg:pl-28 overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal">
          <div>
            <p
              className="text-xs font-bold uppercase mb-3"
              style={{ color: 'var(--accent-warm)', letterSpacing: '0.3em' }}
            >
              {t('eyebrow')}
            </p>
            <h2
              className="font-display uppercase tracking-tight leading-[0.9]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              {t('title_1')} <span style={{ color: 'var(--primary)' }}>{t('title_2')}.</span>
            </h2>
          </div>
          <p
            className="mt-4 md:mt-0 md:max-w-sm text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('subtitle')}
          </p>
        </div>

        <div
          className="flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory pb-10 scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((item, i) => {
            const isAccent = i === 2
            return (
              <div
                key={i}
                className="reveal snap-center shrink-0 w-[85vw] md:w-[50vw] lg:w-[420px] p-8 md:p-10 relative flex flex-col justify-between"
                style={{
                  background: isAccent ? 'var(--primary)' : 'var(--card-bg)',
                  border: '1px solid var(--line)',
                  boxShadow: isAccent ? '10px 10px 0 var(--ink)' : undefined,
                  color: isAccent ? 'var(--paper)' : 'var(--text)',
                }}
              >
                <Quote
                  size={44}
                  fill="currentColor"
                  className="absolute top-6 right-6 opacity-20"
                  style={{ color: isAccent ? 'var(--paper)' : 'var(--accent-warm)' }}
                />
                <p
                  className="italic text-lg leading-relaxed mb-10"
                  style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
                >
                  "{item.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden shrink-0"
                    style={{
                      backgroundImage: `url('${portraits[i % portraits.length]}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div>
                    <h5
                      className="font-display text-lg uppercase leading-none"
                      style={{ color: isAccent ? 'var(--accent-warm)' : 'var(--text)' }}
                    >
                      {item.name}
                    </h5>
                    <span
                      className="text-xs"
                      style={{ color: isAccent ? 'rgba(244,244,240,0.65)' : 'var(--text-subtle)' }}
                    >
                      {item.role}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
