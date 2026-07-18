'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { ShowcaseProject } from '@/lib/graphql/queries'
import { getClientCases } from '@/lib/projects-data'

type Props = { projects?: ShowcaseProject[] | null }

export function ProjectsSection({ projects }: Props) {
  const t = useTranslations('projects')
  const locale = useLocale()

  // Aidesigner masonry: 1 big (7/12) + 2 smaller stacked (5/12 with top offset).
  // Defaults to the three lead client projects — EventEz and TKAMS are
  // OverBrand's own solutions and belong to the products section, not "projets
  // récents". Supabase projects override them when the admin curates a selection.
  const DEFAULTS = getClientCases(locale)
    .slice(0, 3)
    .map((c) => ({
      title: c.title,
      category: c.category,
      year: c.year,
      image: c.cover,
      href: `/projets/${c.slug}`,
    }))

  const liveProjects = (projects ?? []).slice(0, 3)
  const items = liveProjects.length
    ? liveProjects.map((p) => ({
        title: p.title,
        category: p.category,
        year: p.year ?? '',
        image: p.image_url ?? DEFAULTS[0].image,
        href: `/${locale}/projets/${p.id}`,
      }))
    : DEFAULTS

  // Pad to 3 so layout remains stable.
  while (items.length < 3) items.push(DEFAULTS[items.length])

  const [featured, second, third] = items

  return (
    <section
      id="projects"
      className="section px-6 lg:px-12 lg:pl-28"
      style={{ background: 'var(--surface)' }}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 reveal">
          <h2
            className="font-display uppercase tracking-tight leading-[0.9]"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', color: 'var(--text)' }}
          >
            {t('title_1')} <br />
            <span className="text-outline">{t('title_2')}.</span>
          </h2>
          <Link
            href="/projets"
            className="mt-6 md:mt-0 text-sm uppercase tracking-[0.2em] font-semibold pb-1 transition-colors"
            style={{
              color: 'var(--primary)',
              borderBottom: '1px solid var(--primary)',
            }}
          >
            {t('view_all')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
          <Link
            href={featured.href as never}
            className="md:col-span-7 flex flex-col gap-4 reveal group"
          >
            <div
              className="w-full h-[50vh] md:h-[70vh] overflow-hidden relative"
              style={{ background: 'var(--paper-dark)' }}
            >
              <div
                className="absolute inset-0 transition-transform duration-[800ms] group-hover:scale-105"
                style={{
                  backgroundImage: `url('${featured.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'var(--primary)', mixBlendMode: 'multiply' }}
              />
            </div>
            <div
              className="grid grid-cols-2 pt-4 gap-4"
              style={{ borderTop: '1px solid var(--line)' }}
            >
              <div>
                <h4 className="font-display text-2xl md:text-3xl uppercase">{featured.title}</h4>
                <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>{featured.category}</p>
              </div>
              <div className="text-right">
                <span
                  className="inline-block px-3 py-1 text-xs uppercase rounded-full"
                  style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                >
                  {featured.year}
                </span>
              </div>
            </div>
          </Link>

          <div className="md:col-span-5 flex flex-col gap-14 md:mt-20">
            {[second, third].map((item, i) => (
              <Link
                key={i}
                href={item.href as never}
                className="flex flex-col gap-4 reveal group"
              >
                <div
                  className="w-full h-[40vh] overflow-hidden relative"
                  style={{ background: 'var(--paper-dark)' }}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-[800ms] group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${item.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: i === 1 ? 'grayscale(0.6)' : undefined,
                    }}
                  />
                  {i === 1 && (
                    <div
                      className="absolute inset-0"
                      style={{ background: 'var(--accent-warm)', opacity: 0.18, mixBlendMode: 'multiply' }}
                    />
                  )}
                </div>
                <div
                  className="grid grid-cols-2 pt-4 gap-4"
                  style={{ borderTop: '1px solid var(--line)' }}
                >
                  <div>
                    <h4 className="font-display text-2xl uppercase">{item.title}</h4>
                    <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>{item.category}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-block px-3 py-1 text-xs uppercase rounded-full"
                      style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                    >
                      {item.year}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
