import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'

type Position = { role: string; location: string; type: string; salary: string }
type Card = { n: string; title: string; desc: string }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'careersPage' })
  return pageMetadata({
    locale,
    path: '/carrieres',
    title: t('meta_title'),
    description: t('meta_description'),
  })
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'careersPage' })
  const POSITIONS = t.raw('positions') as Position[]
  const BENEFITS = t.raw('benefits') as Card[]
  const PROCESS = t.raw('process') as Card[]
  const seekItems = t.raw('seek_items') as string[]
  const avoidItems = t.raw('avoid_items') as string[]

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
          <div className="max-w-screen-2xl mx-auto">
            <p className="text-xs font-bold uppercase mb-6 reveal" style={{ color: 'var(--accent-warm)', letterSpacing: '0.28em' }}>
              {t('eyebrow')}
            </p>
            <h1
              className="font-display uppercase tracking-tight leading-[0.85] reveal"
              style={{ fontSize: 'clamp(3rem, 9vw, 9rem)' }}
            >
              {t('title_1')} <br />
              <span className="text-outline">{t('title_2')}</span> <br />
              {t('title_3')} <span style={{ color: 'var(--primary)' }}>{t('title_highlight')}</span>.
            </h1>
            <p className="mt-10 text-xl max-w-3xl reveal" style={{ color: 'var(--text-muted)' }}>
              {t('lead')}
            </p>
          </div>
        </section>

        {/* Benefits strip */}
        <section
          className="px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-0"
          style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}
        >
          {BENEFITS.map((b, i) => (
            <div
              key={b.n}
              className="p-6 md:p-8 reveal"
              style={{ borderRight: i < 3 ? '1px solid var(--line)' : undefined }}
            >
              <span className="font-display text-3xl block mb-3" style={{ color: 'var(--accent-warm)' }}>
                {b.n}
              </span>
              <h3 className="font-display text-xl uppercase mb-3 leading-tight">{b.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{b.desc}</p>
            </div>
          ))}
        </section>

        {/* Open positions */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-display uppercase mb-12 reveal" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              {t('positions_title_1')} <span style={{ color: 'var(--primary)' }}>{t('positions_title_2')}</span>.
            </h2>
            <div style={{ borderTop: '1px solid var(--line)' }}>
              {POSITIONS.map((p, i) => (
                <div
                  key={i}
                  className="group grid grid-cols-12 gap-4 md:gap-6 py-6 md:py-8 items-center reveal cursor-pointer row-invert"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <h3 className="col-span-12 md:col-span-5 font-display text-2xl md:text-3xl uppercase">
                    {p.role}
                  </h3>
                  <span className="col-span-6 md:col-span-2 text-sm uppercase tracking-widest">
                    {p.location}
                  </span>
                  <span className="col-span-6 md:col-span-2 text-sm uppercase tracking-widest">
                    {p.type}
                  </span>
                  <span className="col-span-10 md:col-span-2 text-sm font-semibold">
                    {p.salary}
                  </span>
                  <ArrowUpRight
                    size={24}
                    strokeWidth={1.5}
                    className="col-span-2 md:col-span-1 ml-auto transition-transform group-hover:rotate-45"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hiring process */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--surface)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-display uppercase mb-4 reveal" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              {t('process_title_1')} <span style={{ color: 'var(--accent-warm)' }}>{t('process_title_2')}</span>.
            </h2>
            <p className="mb-12 reveal" style={{ color: 'var(--text-muted)' }}>
              {t('process_lead')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0" style={{ border: '1px solid var(--line)' }}>
              {PROCESS.map((s, i) => (
                <div
                  key={s.n}
                  className="p-8 reveal"
                  style={{
                    borderRight: i < 3 ? '1px solid var(--line)' : undefined,
                    background: 'var(--card-bg)',
                  }}
                >
                  <span className="font-display text-4xl block mb-4" style={{ color: 'var(--primary)' }}>
                    {s.n}
                  </span>
                  <h3 className="font-display text-xl uppercase mb-2">{s.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we look for */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: '1px solid var(--line)' }}>
            <div className="p-10 reveal" style={{ borderRight: '1px solid var(--line)' }}>
              <h3 className="font-display text-2xl uppercase mb-6" style={{ color: 'var(--primary)' }}>
                {t('seek_title')}
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                {seekItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-10 reveal">
              <h3 className="font-display text-2xl uppercase mb-6" style={{ color: 'var(--accent-warm)' }}>
                {t('avoid_title')}
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                {avoidItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 lg:px-12 py-24 text-center" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(244,244,240,0.5)' }}>
            {t('cta_eyebrow')}
          </p>
          <h2 className="font-display uppercase leading-[0.9] mb-10" style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}>
            {t('cta_title_1')} <br />
            <span style={{ color: 'var(--accent-warm)' }}>{t('cta_title_2')}</span>.
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ background: 'var(--accent-warm)', color: 'var(--paper)' }}
          >
            {t('cta_button')} <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
