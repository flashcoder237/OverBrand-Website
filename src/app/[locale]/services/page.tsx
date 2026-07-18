import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { getServices } from '@/lib/services-data'
import { pageMetadata } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'servicesPage' })
  return pageMetadata({
    locale,
    path: '/services',
    title: t('meta_title'),
    description: t('meta_description'),
  })
}

type Pack = { name: string; desc: string; price: string }

export default async function ServicesHubPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'servicesPage' })
  const services = getServices(locale)
  const packs = t.raw('packs') as Pack[]

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <Navbar isLoggedIn={!!user} />
      <main className="lg:pl-16">
        {/* Hero */}
        <section className="px-6 lg:px-12 pt-32 md:pt-40 pb-16 md:pb-24" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <div className="reveal flex items-center gap-4 mb-8">
              <span className="w-3 h-3" style={{ background: 'var(--accent-warm)' }} />
              <span
                className="text-xs font-bold uppercase px-3 py-1"
                style={{ border: '1px solid var(--line)', letterSpacing: '0.22em', color: 'var(--text-muted)' }}
              >
                {t('eyebrow')}
              </span>
            </div>
            <h1
              className="font-display uppercase tracking-tight leading-[0.85]"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 11rem)', color: 'var(--text)' }}
            >
              <span className="reveal block">{t('title_1')}</span>
              <span className="reveal block text-outline">{t('title_2')}</span>
              <span className="reveal block">
                {t('title_3')}<span style={{ color: 'var(--accent-warm)' }}>.</span>
              </span>
            </h1>
            <p
              className="reveal mt-10 text-xl md:text-2xl font-light max-w-3xl leading-relaxed"
              style={{ color: 'var(--text-muted)', borderLeft: '2px solid var(--accent-warm)', paddingLeft: '1.5rem' }}
            >
              {t('lead')}
            </p>

            {/* Table of contents */}
            <div className="mt-14 flex flex-wrap gap-3 reveal">
              {services.map((s) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="px-4 py-2 text-xs uppercase font-semibold tracking-widest transition-colors"
                  style={{
                    border: '1px solid var(--line)',
                    color: 'var(--text-muted)',
                    borderRadius: 9999,
                  }}
                >
                  {String(s.index).padStart(2, '0')} — {s.title.split(' ')[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy strip */}
        <section
          className="px-6 lg:px-12 py-20"
          style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--surface)' }}
        >
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <h2
              className="md:col-span-7 font-display uppercase leading-[0.9] reveal"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--text)' }}
            >
              {t('philosophy_title_1')} <br />
              {t('philosophy_title_2')}{' '}
              <span style={{ color: 'var(--primary)' }}>{t('philosophy_highlight')}</span>.
            </h2>
            <p
              className="md:col-span-5 text-base md:text-lg leading-relaxed reveal"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('philosophy_body')}
            </p>
          </div>
        </section>

        {/* Seven service rows */}
        {services.map((s, i) => {
          const reverse = i % 2 === 1
          return (
            <section
              key={s.slug}
              id={s.slug}
              className="px-6 lg:px-12 py-20 md:py-28"
              style={{
                borderBottom: '1px solid var(--line)',
                background: i % 2 === 0 ? 'var(--bg)' : 'var(--surface)',
              }}
            >
              <div
                className={`max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start ${
                  reverse ? 'lg:[&>*:first-child]:order-last' : ''
                }`}
              >
                <div className="lg:col-span-6 reveal">
                  <div className="flex items-start gap-6 mb-8">
                    <span className="font-display text-5xl md:text-7xl" style={{ color: 'var(--accent-warm)', opacity: 0.7 }}>
                      {String(s.index).padStart(2, '0')}
                    </span>
                    <div>
                      <h3
                        className="font-display uppercase leading-none tracking-tight"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)', color: 'var(--text)' }}
                      >
                        {s.title}
                      </h3>
                      <p className="mt-3 text-lg md:text-xl" style={{ color: 'var(--text-muted)' }}>
                        {s.tagline}
                      </p>
                    </div>
                  </div>
                  <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                    {s.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {s.deliverables.slice(0, 4).map((d) => (
                      <li key={d} className="flex items-start gap-3 text-sm md:text-base" style={{ color: 'var(--text-muted)' }}>
                        <span className="w-1 h-1 rounded-full mt-2.5 shrink-0" style={{ background: 'var(--accent-warm)' }} />
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-4 items-center mb-8">
                    <span className="text-xs uppercase font-semibold tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                      {t('stack_label')}
                    </span>
                    {s.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 font-mono"
                        style={{ border: '1px solid var(--line)', color: 'var(--text-muted)' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm mb-8">
                    <span>
                      <strong className="font-display uppercase text-lg" style={{ color: 'var(--text)' }}>
                        {s.startingPrice}
                      </strong>
                      <span className="ml-2" style={{ color: 'var(--text-subtle)' }}>
                        {s.duration}
                      </span>
                    </span>
                  </div>

                  <Link
                    href={`/services/${s.slug}` as never}
                    className="inline-flex items-center gap-2 text-sm uppercase font-semibold tracking-widest pb-1"
                    style={{ color: 'var(--primary)', borderBottom: '1px solid var(--primary)' }}
                  >
                    {t('detail_link')} <ArrowUpRight size={14} />
                  </Link>
                </div>

                <div className="lg:col-span-6 relative h-[50vh] md:h-[70vh] overflow-hidden reveal">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url('${s.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: s.accent === 'ink' ? 'grayscale(1)' : undefined,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        s.accent === 'blue'
                          ? 'var(--primary)'
                          : s.accent === 'orange'
                          ? 'var(--accent-warm)'
                          : 'var(--ink)',
                      opacity: 0.25,
                      mixBlendMode: 'multiply',
                    }}
                  />
                  <div
                    className="absolute top-6 left-6 font-display text-xs uppercase px-3 py-1"
                    style={{ background: 'var(--paper)', color: 'var(--ink)', letterSpacing: '0.2em' }}
                  >
                    {t('expertise_badge')} {String(s.index).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </section>
          )
        })}

        {/* Combinations strip */}
        <section className="px-6 lg:px-12 py-24" style={{ background: 'var(--surface)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2
              className="font-display uppercase leading-[0.9] mb-16 reveal"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
            >
              {t('packs_title_1')}{' '}
              <span style={{ color: 'var(--primary)' }}>{t('packs_title_2')}</span>.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packs.map((pack) => (
                <div
                  key={pack.name}
                  className="p-8 reveal group transition-colors"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--line)' }}
                >
                  <h3 className="font-display text-2xl md:text-3xl uppercase mb-3">{pack.name}</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                    {pack.desc}
                  </p>
                  <p className="font-display text-xl mb-4" style={{ color: 'var(--accent-warm)' }}>
                    {pack.price}
                  </p>
                  <Link
                    href="/contact"
                    className="text-xs uppercase font-semibold tracking-widest"
                    style={{ color: 'var(--primary)' }}
                  >
                    {t('pack_link')}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section
          className="px-6 lg:px-12 py-24 text-center"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          <div className="max-w-4xl mx-auto">
            <h2
              className="font-display uppercase leading-[0.9] mb-10"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              {t('cta_title_1')} <br />
              {t('cta_title_2')}{' '}
              <span style={{ color: 'var(--accent-warm)' }}>{t('cta_highlight')}</span>.
            </h2>
            <Link
              href="/contact"
              className="btn-ink inline-flex text-base"
              style={{ background: 'var(--accent-warm)', borderColor: 'var(--accent-warm)' }}
            >
              {t('cta_button')}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
