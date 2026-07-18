import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { SERVICE_SLUGS, getServices, getService } from '@/lib/services-data'
import { pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { serviceSchema } from '@/lib/schema'
import { routing } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'

export function generateStaticParams() {
  return SERVICE_SLUGS.flatMap((slug) =>
    routing.locales.map((locale) => ({ locale, slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const service = getService(slug, locale)
  if (!service) {
    const t = await getTranslations({ locale, namespace: 'serviceDetail' })
    return { title: t('not_found'), robots: { index: false, follow: false } }
  }

  return pageMetadata({
    locale,
    path: `/services/${service.slug}`,
    // Localised intent: most searches for these services in the market are
    // phrased with the city, so it belongs in the title.
    title: `${service.title} — Douala & Yaoundé`,
    description: `${service.tagline} ${service.description}`.slice(0, 300),
    image: service.image,
  })
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const service = getService(slug, locale)
  if (!service) notFound()

  const t = await getTranslations({ locale, namespace: 'serviceDetail' })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Related services (next 3 after current)
  const related = getServices(locale).filter((s) => s.slug !== slug).slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(locale, service)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema(locale, [
              { name: t('breadcrumb_home'), path: '' },
              { name: t('breadcrumb_services'), path: '/services' },
              { name: service.title, path: `/services/${service.slug}` },
            ]),
          ),
        }}
      />
      <Navbar isLoggedIn={!!user} />
      <main className="lg:pl-16">
        {/* Hero */}
        <section className="px-6 lg:px-12 pt-32 md:pt-40 pb-16" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <nav className="text-xs uppercase tracking-widest mb-10 flex items-center gap-2" style={{ color: 'var(--text-subtle)' }}>
              <Link href="/">{t('breadcrumb_home')}</Link>
              <span>/</span>
              <Link href="/services">{t('breadcrumb_services')}</Link>
              <span>/</span>
              <span style={{ color: 'var(--text)' }}>{service.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 reveal">
                <p className="text-xs font-bold uppercase mb-6" style={{ color: 'var(--accent-warm)', letterSpacing: '0.28em' }}>
                  {String(service.index).padStart(2, '0')} — {t('eyebrow_expertise')}
                </p>
                <h1
                  className="font-display uppercase tracking-tight leading-[0.85]"
                  style={{ fontSize: 'clamp(3rem, 10vw, 10rem)', color: 'var(--text)' }}
                >
                  {service.title.split(' ').slice(0, 2).join(' ')}
                  <br />
                  <span className="text-outline">
                    {service.title.split(' ').slice(2).join(' ') || '.'}
                  </span>
                </h1>
                <p className="mt-10 text-lg md:text-xl font-light max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {service.description}
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ background: 'var(--primary)', color: 'var(--paper)' }}
                  >
                    {t('cta_quote')}
                    <ArrowRight size={14} />
                  </Link>
                  <Link href="/projets" className="btn-ghost justify-center">
                    {t('cta_work')}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6 lg:pl-10 reveal" style={{ borderLeft: '1px solid var(--line)' }}>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>{t('aside_duration')}</p>
                  <p className="font-display text-2xl">{service.duration}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>{t('aside_from')}</p>
                  <p className="font-display text-2xl" style={{ color: 'var(--accent-warm)' }}>
                    {service.startingPrice}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>{t('aside_tech')}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.stack.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 font-mono"
                        style={{ border: '1px solid var(--line)', color: 'var(--text-muted)' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>{t('aside_deliverables')}</p>
                  <p className="font-display text-2xl">
                    {t('aside_items', { count: service.deliverables.length })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Approach pull-quote */}
        <section
          className="px-6 lg:px-12 py-20"
          style={{ borderTop: '1px solid var(--line)', background: 'var(--surface)' }}
        >
          <div className="max-w-5xl mx-auto text-center reveal">
            <h2 className="font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}>
              {t('pull_1')} <br />
              <span style={{ color: 'var(--primary)' }}>{t('pull_2')}</span>.
            </h2>
          </div>
        </section>

        {/* Deliverables */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-display uppercase mb-12 reveal" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              {t('deliverables_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 grid-hairlines">
              {service.deliverables.map((d, i) => {
                const isDark = i % 3 === 1
                const isAccent = i === 3
                return (
                  <div
                    key={d}
                    className="p-8 reveal"
                    style={{
                      background: isAccent ? 'var(--primary)' : isDark ? 'var(--ink)' : 'var(--paper)',
                      color: isAccent || isDark ? 'var(--paper)' : 'var(--text)',
                    }}
                  >
                    <span
                      className="font-display text-4xl block mb-4"
                      style={{ color: isAccent || isDark ? 'rgba(244,244,240,0.5)' : 'var(--accent-warm)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl uppercase leading-tight">{d}</h3>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing tiers */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--surface)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-display uppercase mb-12 reveal" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              {t('pricing_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: '1px solid var(--line)' }}>
              {[
                { name: 'LAUNCH', price: service.startingPrice, desc: t('tier_launch_desc') },
                { name: 'SIGNATURE', price: '3 500€', desc: t('tier_signature_desc'), feat: true },
                { name: 'ENTERPRISE', price: t('tier_enterprise_price'), desc: t('tier_enterprise_desc') },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className="p-8 md:p-10 reveal flex flex-col"
                  style={{
                    background: tier.feat ? 'var(--primary)' : 'var(--card-bg)',
                    color: tier.feat ? 'var(--paper)' : 'var(--text)',
                    borderRight: '1px solid var(--line)',
                  }}
                >
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ opacity: 0.7 }}>
                    {tier.name}
                  </p>
                  <h3 className="font-display text-4xl md:text-5xl mb-4">{tier.price}</h3>
                  <p className="text-sm mb-8 flex-1">{tier.desc}</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-widest pb-1 self-start"
                    style={{
                      color: tier.feat ? 'var(--accent-warm)' : 'var(--primary)',
                      borderBottom: `1px solid ${tier.feat ? 'var(--accent-warm)' : 'var(--primary)'}`,
                    }}
                  >
                    {t('tier_choose')} <ArrowUpRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related services */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-display uppercase mb-12 reveal" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              {t('related_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}` as never}
                  className="reveal p-8 transition-colors group"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--line)' }}
                >
                  <span className="font-display text-3xl block mb-4" style={{ color: 'var(--accent-warm)' }}>
                    {String(s.index).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl uppercase mb-3">{s.title}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    {s.tagline}
                  </p>
                  <span className="text-xs uppercase font-semibold tracking-widest" style={{ color: 'var(--primary)' }}>
                    {t('related_link')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 lg:px-12 py-24 text-center" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <h2
            className="font-display uppercase leading-[0.9] mb-8 text-outline-paper mx-auto"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
          >
            {t('bottom_title')}
          </h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(244,244,240,0.7)' }}>
            {t.rich('bottom_lead', {
              // Not lowercased: German capitalises nouns, so folding the title
              // would misspell it.
              name: service.title,
              service: (chunks) => (
                <strong style={{ color: 'var(--accent-warm)' }}>{chunks}</strong>
              ),
            })}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ background: 'var(--accent-warm)', color: 'var(--paper)' }}
          >
            {t('bottom_button')}
            <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
