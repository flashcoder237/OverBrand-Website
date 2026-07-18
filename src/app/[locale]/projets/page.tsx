import { createClient } from '@/lib/supabase/server'
import { gqlClient } from '@/lib/graphql/client'
import {
  GET_SHOWCASE_PROJECTS,
  type GetShowcaseProjectsRes,
  type ShowcaseProject,
  unwrapEdges,
} from '@/lib/graphql/queries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { CASE_SLUGS, PRODUCT_CASE_SLUGS, getCaseStudies } from '@/lib/projects-data'
import { pageMetadata, breadcrumbSchema, SITE_URL } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projectsHub' })
  return pageMetadata({
    locale,
    path: '/projets',
    title: t('meta_title'),
    description: t('meta_description'),
    eyebrow: 'Projets',
    ogBackground: '/projets/buynsellem-01.jpg',
  })
}

// The curated case studies always lead the hub — client projects first, then
// OverBrand's own solutions. Supabase-managed showcase projects come after.
function curatedFor(locale: string): ShowcaseProject[] {
  return getCaseStudies(locale).map(
    (c) =>
      ({
        id: c.slug,
        title: c.title,
        category: c.category,
        year: c.year,
        client: c.client,
        image_url: c.cover,
        image_position: 'top',
      }) as ShowcaseProject,
  )
}

async function getAllProjects(): Promise<ShowcaseProject[]> {
  try {
    const data = await gqlClient.request<GetShowcaseProjectsRes>(GET_SHOWCASE_PROJECTS)
    const rows = unwrapEdges(data.showcase_projectsCollection?.edges)
    if (rows.length) return rows
  } catch {
    /* ignore */
  }

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('showcase_projects')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true })
    if (data?.length) return data as ShowcaseProject[]
  } catch {
    /* ignore */
  }

  return []
}

export default async function ProjectsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projectsHub' })
  const CURATED = curatedFor(locale)
  const filters = t.raw('filters') as string[]
  const live = await getAllProjects()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Curated case studies first, then anything added through the admin.
  const items = [...CURATED, ...live.filter((p) => !CURATED.some((c) => c.id === p.id))]
  const [featured, ...rest] = items

  // Lets engines enumerate the portfolio without parsing the grid markup.
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('collection_name'),
    url: `${SITE_URL}/${locale}/projets`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: CASE_SLUGS.length,
      itemListElement: getCaseStudies(locale).map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.title,
        url: `${SITE_URL}/${locale}/projets/${c.slug}`,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema(locale, [
              { name: t('breadcrumb_home'), path: '' },
              { name: t('breadcrumb_projects'), path: '/projets' },
            ]),
          ),
        }}
      />
      <Navbar isLoggedIn={!!user} />
      <main className="lg:pl-16">
        {/* Hero */}
        <section className="px-6 lg:px-12 pt-32 md:pt-40 pb-16" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <p className="text-xs font-bold uppercase mb-6 reveal flex items-center gap-3" style={{ color: 'var(--text-subtle)', letterSpacing: '0.22em' }}>
              <span className="w-4 h-4 rounded-full animate-pulse" style={{ background: 'var(--primary)' }} />
              {t('eyebrow')}
            </p>
            <h1
              className="font-display uppercase tracking-tight leading-[0.85] reveal"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 10rem)' }}
            >
              {t('title_1')} <br />
              <span className="text-outline">{t('title_2')}</span> <br />
              {t('title_3')}<span style={{ color: 'var(--accent-warm)' }}>.</span>
            </h1>
            <p
              className="mt-10 text-xl max-w-2xl reveal"
              style={{ color: 'var(--text-muted)', borderLeft: '2px solid var(--accent-warm)', paddingLeft: '1.5rem' }}
            >
              {t('lead')}
            </p>
          </div>
        </section>

        {/* Filter bar (static pills for now) */}
        <div
          className="px-6 lg:px-12 py-4 flex items-center gap-3 overflow-x-auto sticky top-16 md:top-20 z-30 backdrop-blur-md"
          style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--line)' }}
        >
          <div className="flex gap-2">
            {filters.map((f, i) => (
              <button
                key={f}
                className="shrink-0 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors"
                style={{
                  background: i === 0 ? 'var(--ink)' : 'transparent',
                  color: i === 0 ? 'var(--paper)' : 'var(--text)',
                  border: '1px solid var(--line)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="ml-auto hidden md:block text-xs uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
            <strong>{items.length}</strong> {t('count_label')}
          </div>
        </div>

        {/* Featured */}
        {featured && (
          <Link
            href={`/${locale}/projets/${featured.id}` as never}
            className="block relative h-[70vh] min-h-[500px] overflow-hidden group"
            style={{ background: 'var(--ink)', borderBottom: '1px solid var(--line)' }}
          >
            <div
              className="absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-105"
              style={{
                backgroundImage: `url('${featured.image_url ?? CURATED[0].image_url}')`,
                backgroundSize: 'cover',
                backgroundPosition: featured.image_position ?? 'center',
                opacity: 0.75,
              }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--ink), transparent 60%)' }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ background: 'var(--primary)', mixBlendMode: 'multiply' }} />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8" style={{ color: 'var(--paper)' }}>
              <div>
                <div className="flex gap-2 mb-4">
                  <span className="tag-pill" style={{ color: 'var(--paper)', borderColor: 'rgba(244,244,240,0.3)' }}>{t('featured_badge')}</span>
                  {featured.category && (
                    <span className="tag-pill" style={{ color: 'var(--paper)', borderColor: 'rgba(244,244,240,0.3)' }}>{featured.category}</span>
                  )}
                </div>
                <h2 className="font-display uppercase leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
                  {featured.title}<span style={{ color: 'var(--accent-warm)' }}>.</span>
                </h2>
              </div>
              <div
                className="inline-flex items-center gap-3 px-8 py-4 text-sm uppercase font-semibold tracking-[0.18em]"
                style={{ background: 'var(--accent-warm)', color: 'var(--paper)' }}
              >
                {t('read_case')} <ArrowUpRight size={16} />
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px]" style={{ background: 'var(--line)', borderBottom: '1px solid var(--line)' }}>
          {rest.slice(0, 12).map((p, i) => {
            const span =
              i === 0 || i === 4 || i === 8
                ? 'md:col-span-2 lg:col-span-2'
                : 'md:col-span-1'
            return (
              <Link
                key={p.id}
                href={`/${locale}/projets/${p.id}` as never}
                className={`relative flex flex-col h-[420px] md:h-[500px] overflow-hidden group ${span}`}
                style={{ background: 'var(--paper)' }}
              >
                <div className="flex-1 relative overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${p.image_url ?? CURATED[0].image_url}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: p.image_position ?? 'center',
                    }}
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center" style={{ background: 'var(--primary)', opacity: 0.0 }}>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-2xl font-display uppercase" style={{ color: 'var(--paper)' }}>
                      {t('explore')}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-start" style={{ borderTop: '1px solid var(--line)' }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>
                      {PRODUCT_CASE_SLUGS.has(p.id)
                        ? `${p.year ?? ''} — ${t('solution_label')}`
                        : `${p.year ?? ''} — ${p.client ?? ''}`}
                    </p>
                    <h3 className="font-display text-xl md:text-2xl uppercase leading-none">{p.title}</h3>
                  </div>
                  <ArrowUpRight size={22} className="shrink-0 transition-transform group-hover:rotate-45" style={{ color: 'var(--text-muted)' }} />
                </div>
              </Link>
            )
          })}
        </section>

        {/* Metrics ribbon */}
        <section className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: '1px solid var(--line)' }}>
          {[
            { n: String(CASE_SLUGS.length), label: t('metric_platforms'), color: 'var(--primary)' },
            { n: String(PRODUCT_CASE_SLUGS.size), label: t('metric_solutions'), color: 'var(--accent-warm)' },
            { n: '100+', label: t('metric_cities') },
            { n: '3', label: t('metric_languages') },
          ].map((s, i) => (
            <div
              key={i}
              className="p-8 md:p-12 text-center reveal"
              style={{ borderRight: i < 3 ? '1px solid var(--line)' : undefined }}
            >
              <span
                className="font-display block tracking-tighter"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: s.color || 'var(--text)' }}
              >
                {s.n}
              </span>
              <span className="text-xs uppercase tracking-widest mt-3 block" style={{ color: 'var(--text-subtle)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </section>

        {/* Live links strip */}
        <section
          className="px-6 lg:px-12 py-10 flex flex-wrap justify-center gap-8 md:gap-16"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}
        >
          {getCaseStudies(locale).map((c) => (
            <a
              key={c.slug}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-xl md:text-2xl uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2"
              style={{ color: 'var(--text)' }}
            >
              {c.urlLabel} <ArrowUpRight size={16} />
            </a>
          ))}
        </section>

        {/* Next project CTA */}
        <section className="px-6 lg:px-12 py-20 text-center relative overflow-hidden" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <h2 className="font-display uppercase leading-[0.9] mb-8" style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}>
            {t('cta_title_1')} <br />
            <span style={{ color: 'var(--accent-warm)' }}>{t('cta_title_2')}</span>
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ background: 'var(--accent-warm)', color: 'var(--paper)' }}
          >
            {t('cta_button')} <ArrowRight size={14} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
