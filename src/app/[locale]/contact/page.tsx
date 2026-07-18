import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from './contact-form'
import { MapPin, Clock, Phone, Mail, Calendar } from 'lucide-react'
import { pageMetadata, ORG } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import { Fragment } from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contactPage' })
  return pageMetadata({
    locale,
    path: '/contact',
    title: t('meta_title'),
    description: t('meta_description'),
  })
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contactPage' })
  const whyItems = t.raw('why_items') as string[]

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <Navbar isLoggedIn={!!user} />
      <main className="lg:pl-16">
        {/* Hero */}
        <section className="px-6 lg:px-12 pt-32 md:pt-40 pb-16" style={{ background: 'var(--bg)' }}>
          <div className="max-w-7xl">
            <div className="flex items-center gap-4 mb-8 reveal">
              <span className="w-3 h-3" style={{ background: 'var(--accent-warm)' }} />
              <span className="text-xs font-bold uppercase px-3 py-1" style={{ border: '1px solid var(--line)', letterSpacing: '0.22em', color: 'var(--text-muted)' }}>
                {t('eyebrow')}
              </span>
            </div>
            <h1 className="font-display uppercase tracking-tight leading-[0.85]" style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}>
              <span className="reveal block">{t('title_1')}</span>
              <span className="reveal block text-outline">{t('title_2')}</span>
              <span className="reveal block">
                {t('title_3')}<span style={{ color: 'var(--accent-warm)' }}>.</span>
              </span>
            </h1>
            <p className="reveal mt-10 text-xl md:text-2xl max-w-3xl font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('lead_before')}<strong>{t('lead_strong')}</strong>{t('lead_after')}
            </p>
          </div>
        </section>

        {/* Split form + meta */}
        <section className="flex flex-col xl:flex-row" style={{ borderTop: '1px solid var(--line)' }}>
          {/* Form */}
          <div className="w-full xl:w-[55%] p-6 md:p-12 xl:p-16" style={{ borderRight: '1px solid var(--line)' }}>
            <ContactForm />
          </div>

          {/* Meta column */}
          <div className="w-full xl:w-[45%] flex flex-col">
            <div className="p-6 md:p-12 xl:p-16 reveal" style={{ borderBottom: '1px solid var(--line)' }}>
              <h3 className="font-display text-2xl md:text-3xl uppercase mb-8 text-outline">
                {t('why_title')}
              </h3>
              <ul className="space-y-5 text-lg font-light" style={{ color: 'var(--text-muted)' }}>
                {whyItems.map((item, i) => (
                  <li key={item} className="flex items-start gap-4">
                    <span
                      className="font-display text-2xl"
                      style={{ color: 'var(--accent-warm)', opacity: 0.5 }}
                    >
                      ({String(i + 1).padStart(2, '0')})
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 md:p-12 xl:p-16 reveal" style={{ background: 'var(--ink)', color: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
              <h3 className="font-display text-xl md:text-2xl uppercase mb-8" style={{ color: 'rgba(244,244,240,0.5)' }}>
                {t('shortcuts_title')}
              </h3>
              <div className="flex flex-col gap-4">
                <a
                  href="mailto:contact@overbrand.net"
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-[color:var(--paper)] hover:text-[color:var(--ink)]"
                  style={{ border: '1px solid rgba(244,244,240,0.2)' }}
                >
                  <Mail size={20} />
                  <span className="font-bold">contact@overbrand.net</span>
                </a>
                <a
                  href={ORG.whatsapp}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-[#25D366]"
                  style={{ border: '1px solid rgba(244,244,240,0.2)' }}
                >
                  <Phone size={20} />
                  <span className="font-bold">{ORG.phoneDisplay}</span>
                  <span className="ml-auto text-xs uppercase tracking-wider font-bold">WhatsApp</span>
                </a>
                {ORG.phones.filter((p) => !p.whatsapp).map((p) => (
                  <a
                    key={p.e164}
                    href={`tel:${p.e164}`}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-[color:var(--paper)] hover:text-[color:var(--ink)]"
                    style={{ border: '1px solid rgba(244,244,240,0.2)' }}
                  >
                    <Phone size={20} />
                    <span className="font-bold">{p.display}</span>
                    <span className="ml-auto text-xs uppercase tracking-wider font-bold">{p.region}</span>
                  </a>
                ))}
                <a
                  href="https://cal.com/overbrand"
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-4 p-4 transition-colors"
                  style={{ background: 'var(--primary)', color: 'var(--paper)', border: '1px solid var(--primary)' }}
                >
                  <Calendar size={20} />
                  <span className="font-bold">{t('book_call')}</span>
                  <span className="ml-auto text-xs uppercase tracking-wider font-bold">Calendly</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Timezone ticker */}
        <section className="py-4 overflow-hidden" style={{ background: 'var(--accent-warm)', color: 'var(--paper)' }}>
          <div className="animate-marquee font-display whitespace-nowrap flex items-center gap-8 px-4" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1 }}>
            {/* Repeated twice so the marquee loops without a visible seam. */}
            {[0, 1].map((pass) => (
              <Fragment key={pass}>
                <span>{t('ticker_days')}</span>
                <span style={{ opacity: 0.3 }}>/</span>
                <span>{t('ticker_hours')}</span>
                <span style={{ opacity: 0.3 }}>/</span>
                <span>{t('ticker_zone')}</span>
                <span style={{ opacity: 0.3 }}>/</span>
              </Fragment>
            ))}
          </div>
        </section>

        {/* Offices */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-display uppercase mb-12 reveal" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', borderLeft: '4px solid var(--accent-warm)', paddingLeft: '1.5rem' }}>
              {t('offices_title')}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ border: '1px solid var(--line)' }}>
              {[
                {
                  name: 'DOUALA',
                  address: t('office_douala_address'),
                  hours: t('office_douala_hours'),
                  hq: true,
                  image: 'https://images.unsplash.com/photo-1541888042456-7876fedf3b3b?q=80&w=1200&auto=format&fit=crop',
                },
                {
                  name: 'YAOUNDÉ',
                  address: t('office_yaounde_address'),
                  hours: t('office_yaounde_hours'),
                  image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
                },
              ].map((o, i) => (
                <div
                  key={o.name}
                  className="p-8 md:p-12 group reveal"
                  style={{ borderRight: i === 0 ? '1px solid var(--line)' : undefined }}
                >
                  <h3 className="font-display uppercase leading-[0.8] mb-8 text-outline" style={{ fontSize: 'clamp(4rem, 12vw, 7rem)' }}>
                    {o.name}
                  </h3>
                  <div className="relative h-64 mb-6 overflow-hidden">
                    <div
                      className="absolute inset-0 transition-all duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url('${o.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'grayscale(1)',
                      }}
                    />
                    <div className="absolute inset-0" style={{ background: 'var(--ink)', opacity: 0.15 }} />
                    {o.hq && (
                      <div
                        className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold px-3 py-1"
                        style={{ background: 'var(--paper)' }}
                      >
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-warm)' }} />
                        HQ
                      </div>
                    )}
                  </div>
                  <div className="space-y-3" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="mt-1 shrink-0" style={{ color: 'var(--text-subtle)' }} />
                      <p>{o.address}<br />{t('country')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="mt-1 shrink-0" style={{ color: 'var(--text-subtle)' }} />
                      <p>{o.hours}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Signal metrics */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--surface)' }}>
          <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0" style={{ border: '1px solid var(--line)' }}>
            {[
              { n: '4h', label: t('metric_response_time'), color: 'var(--accent-warm)' },
              { n: '100%', label: t('metric_response_rate') },
              { n: '✓', label: t('metric_free_consult'), color: 'var(--primary)' },
              { n: '✓', label: t('metric_detailed_quote') },
            ].map((s, i) => (
              <div
                key={i}
                className="p-8 text-center reveal"
                style={{
                  borderRight: i < 3 ? '1px solid var(--line)' : undefined,
                  background: 'var(--card-bg)',
                }}
              >
                <span
                  className="font-display block"
                  style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', color: s.color ?? 'var(--text)', lineHeight: 1 }}
                >
                  {s.n}
                </span>
                <span className="text-xs uppercase tracking-widest mt-3 block" style={{ color: 'var(--text-subtle)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
