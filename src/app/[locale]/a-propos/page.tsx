import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'aboutPage' })
  return pageMetadata({
    locale,
    path: '/a-propos',
    title: t('meta_title'),
    description: t('meta_description'),
  })
}

type TimelineEntry = { year: string; title: string; desc: string }
type ValueEntry = { n: string; title: string; desc: string }

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'aboutPage' })
  const TIMELINE = t.raw('timeline') as TimelineEntry[]
  const VALUES = t.raw('values') as ValueEntry[]
  const howItems = t.raw('how_items') as string[]
  const refuseItems = t.raw('refuse_items') as string[]

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <Navbar isLoggedIn={!!user} />
      <main className="lg:pl-16">
        {/* Hero */}
        <section className="px-6 lg:px-12 pt-32 md:pt-40 pb-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 reveal">
              <p className="text-xs font-bold uppercase mb-6" style={{ color: 'var(--accent-warm)', letterSpacing: '0.28em' }}>
                {t('eyebrow')}
              </p>
              <h1
                className="font-display uppercase tracking-tight leading-[0.85]"
                style={{ fontSize: 'clamp(3rem, 9vw, 9rem)', color: 'var(--text)' }}
              >
                {t('title_1')} <br />
                <span className="text-outline">{t('title_2')}</span>
                <br />
                {t('title_3')} <span style={{ color: 'var(--accent-warm)' }}>{t('title_highlight')}</span>.
              </h1>
            </div>

            <div
              className="lg:col-span-4 lg:pl-10 reveal"
              style={{ borderLeft: '1px solid var(--line)' }}
            >
              <div
                className="relative aspect-square overflow-hidden"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop')",
                  backgroundSize: 'cover',
                  filter: 'grayscale(0.8) contrast(1.1)',
                }}
              >
                <div className="absolute inset-0" style={{ background: 'var(--primary)', opacity: 0.15, mixBlendMode: 'multiply' }} />
                <div
                  className="absolute bottom-4 left-4 text-xs font-bold uppercase"
                  style={{ color: 'var(--paper)', letterSpacing: '0.3em' }}
                >
                  {t('studio_label')}<br />
                  4°05'N 9°46'E
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section
          className="px-6 lg:px-12 py-24 md:py-32 text-center"
          style={{ borderTop: '1px solid var(--line)', background: 'var(--surface)' }}
        >
          <div className="max-w-4xl mx-auto reveal">
            <p
              className="text-2xl md:text-4xl lg:text-5xl leading-tight mb-8"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
            >
              &laquo;&nbsp;{t('manifesto')}&nbsp;&raquo;
            </p>
            <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
              {t('manifesto_author')}
            </p>
          </div>
        </section>

        {/* Numbers */}
        <section
          className="px-6 lg:px-12 py-20"
          style={{ background: 'var(--primary)', color: 'var(--paper)' }}
        >
          <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: '50+', label: t('stat_projects') },
              { n: '40+', label: t('stat_clients') },
              { n: '5+', label: t('stat_years') },
              { n: '12', label: t('stat_experts'), accent: true },
            ].map((s) => (
              <div key={s.label} className="reveal text-center">
                <span
                  className="font-display tracking-tighter block"
                  style={{
                    fontSize: 'clamp(3rem, 7vw, 7rem)',
                    lineHeight: 0.9,
                    color: s.accent ? 'var(--accent-warm)' : 'var(--paper)',
                  }}
                >
                  {s.n}
                </span>
                <span className="text-xs uppercase tracking-widest block mt-3" style={{ opacity: 0.75 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="px-6 lg:px-12 py-24" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-display uppercase mb-16 reveal" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              {t('history_title_1')} <span style={{ color: 'var(--primary)' }}>{t('history_title_2')}</span>.
            </h2>
            <div className="space-y-0" style={{ borderTop: '1px solid var(--line)' }}>
              {TIMELINE.map((t) => (
                <div
                  key={t.year}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 reveal"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <div className="md:col-span-3">
                    <span className="font-display text-6xl md:text-7xl" style={{ color: 'var(--accent-warm)' }}>
                      {t.year}
                    </span>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl md:text-3xl uppercase mb-2">{t.title}</h3>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {t.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-6 lg:px-12 py-24" style={{ background: 'var(--surface)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-display uppercase mb-16 reveal" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              {t('values_title_1')} <span className="text-outline">{t('values_title_2')}</span>.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div
                  key={v.n}
                  className="p-10 reveal"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--line)' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-display text-3xl" style={{ color: 'var(--accent-warm)' }}>
                      {v.n}
                    </span>
                    <h3 className="font-display text-2xl uppercase">{v.title}</h3>
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Culture split */}
        <section className="px-6 lg:px-12 py-24" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: '1px solid var(--line)' }}>
            <div className="p-10 reveal" style={{ borderRight: '1px solid var(--line)' }}>
              <h3 className="font-display text-2xl uppercase mb-6" style={{ color: 'var(--primary)' }}>
                {t('how_title')}
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                {howItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-10 reveal">
              <h3 className="font-display text-2xl uppercase mb-6" style={{ color: 'var(--accent-warm)' }}>
                {t('refuse_title')}
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                {refuseItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Team teaser */}
        <section className="px-6 lg:px-12 py-24" style={{ background: 'var(--surface)' }}>
          <div className="max-w-screen-2xl mx-auto text-center reveal">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-subtle)' }}>
              {t('team_eyebrow')}
            </p>
            <h2 className="font-display uppercase leading-[0.9] mb-8" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}>
              {t('team_title_1')}{' '}
              <span style={{ color: 'var(--primary)' }}>{t('team_title_highlight')}</span> <br />
              {t('team_title_2')}
            </h2>
            <Link
              href="/equipe"
              className="inline-flex items-center gap-2 text-sm uppercase font-semibold tracking-widest pb-1"
              style={{ color: 'var(--accent-warm)', borderBottom: '1px solid var(--accent-warm)' }}
            >
              {t('team_link')} <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 lg:px-12 py-24 text-center" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <h2 className="font-display uppercase leading-[0.9] mb-10" style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}>
            {t('cta_title_1')}<span style={{ color: 'var(--accent-warm)' }}>{t('cta_title_2')}</span>.
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ background: 'var(--paper)', color: 'var(--ink)' }}
          >
            {t('cta_button')}
            <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
