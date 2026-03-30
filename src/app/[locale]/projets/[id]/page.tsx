import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, ArrowUpRight, Tag, Calendar, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectGallery } from './project-gallery'
import { gqlClient } from '@/lib/graphql/client'
import {
  GET_PROJECT_BY_ID,
  type GetProjectByIdRes,
  type ShowcaseProject,
  unwrapEdges,
} from '@/lib/graphql/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://overbrand.net'

// ── Data fetcher (GraphQL → REST fallback) ────────────────────────────────────

async function fetchProject(id: string): Promise<ShowcaseProject | null> {
  try {
    const data = await gqlClient.request<GetProjectByIdRes>(GET_PROJECT_BY_ID, { id })
    return unwrapEdges(data.showcase_projectsCollection?.edges)[0] ?? null
  } catch {
    const supabase = await createClient()
    const { data } = await supabase
      .from('showcase_projects')
      .select('*')
      .eq('id', id)
      .eq('visible', true)
      .single<ShowcaseProject>()
    return data ?? null
  }
}

// ── generateStaticParams ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    // Direct Supabase client — no cookies/request context needed at build time
    const { createClient: createSupabase } = await import('@supabase/supabase-js')
    const sb = createSupabase(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await sb
      .from('showcase_projects')
      .select('id')
      .eq('visible', true)

    const locales = ['fr', 'en']
    return (data ?? []).flatMap(p =>
      locales.map(locale => ({ locale, id: p.id }))
    )
  } catch {
    return []
  }
}

// ── generateMetadata ──────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const project = await fetchProject(id)

  if (!project) {
    return {
      title: 'Projet introuvable',
      robots: { index: false, follow: false },
    }
  }

  const title = `${project.title} — OverBrand`
  const description = project.description ?? `Projet ${project.category} réalisé par OverBrand.`
  const ogImage = project.image_url
    ? project.image_url
    : `${SITE_URL}/api/og?title=${encodeURIComponent(project.title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/projets/${id}`,
      languages: {
        fr: `${SITE_URL}/fr/projets/${id}`,
        en: `${SITE_URL}/en/projets/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/${locale}/projets/${id}`,
      siteName: 'OverBrand',
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProjetDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const project = await fetchProject(id)
  if (!project) notFound()

  const allImages = [
    ...(project.image_url ? [project.image_url] : []),
    ...(project.image_urls ?? []),
  ].filter(Boolean) as string[]

  // ── Structured data ─────────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'OverBrand',
        item: `${SITE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'fr' ? 'Projets' : 'Projects',
        item: `${SITE_URL}/${locale}#projects`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `${SITE_URL}/${locale}/projets/${id}`,
      },
    ],
  }

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description ?? undefined,
    creator: {
      '@id': `${SITE_URL}/#organization`,
    },
    ...(project.client ? { author: { '@type': 'Organization', name: project.client } } : {}),
    ...(project.year ? { dateCreated: project.year } : {}),
    ...(allImages[0] ? { image: allImages[0] } : {}),
    keywords: project.tags?.join(', ') ?? undefined,
    url: `${SITE_URL}/${locale}/projets/${id}`,
    genre: project.category,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <Navbar />
      <main style={{ background: 'var(--bg)', color: 'var(--text)' }}>

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ minHeight: '60vh' }}>
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: allImages[0] ? 'var(--bg)' : project.gradient,
            }}
          />
          {allImages[0] && (
            <div className="absolute inset-0">
              <Image
                src={allImages[0]}
                alt={project.title}
                fill
                className="object-cover"
                style={{ objectPosition: project.image_position ?? 'center' }}
                priority
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,13,26,0.55) 0%, rgba(5,13,26,0.85) 100%)' }} />
            </div>
          )}

          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              opacity: allImages[0] ? 0.1 : 0.25,
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
            {/* Back */}
            <Link
              href={`/${locale}#projects`}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-10 transition-opacity hover:opacity-60"
              style={{ color: allImages[0] ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}
            >
              <ArrowLeft size={14} /> {locale === 'fr' ? 'Retour aux projets' : 'Back to projects'}
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ background: project.accent }} />
              <span
                className="text-xs font-bold uppercase tracking-[0.2em] px-3 py-1"
                style={{
                  background: `${project.accent}25`,
                  color: project.accent,
                  clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)',
                  border: `1px solid ${project.accent}50`,
                }}
              >
                {project.category}
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                color: allImages[0] ? 'white' : 'var(--text)',
                letterSpacing: '0.02em',
              }}
            >
              {project.title}
            </h1>

            {project.description && (
              <p
                className="max-w-2xl text-base leading-relaxed"
                style={{ color: allImages[0] ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }}
              >
                {project.description}
              </p>
            )}
          </div>
        </section>

        {/* Meta strip */}
        {(project.client || project.year || (project.tags && project.tags.length > 0)) && (
          <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap gap-8">
              {project.client && (
                <div className="flex items-center gap-2">
                  <User size={14} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-subtle)', fontSize: '0.6rem' }}>Client</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{project.client}</div>
                  </div>
                </div>
              )}
              {project.year && (
                <div className="flex items-center gap-2">
                  <Calendar size={14} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-subtle)', fontSize: '0.6rem' }}>{locale === 'fr' ? 'Année' : 'Year'}</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{project.year}</div>
                  </div>
                </div>
              )}
              {project.tags && project.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag size={14} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)', fontSize: '0.6rem' }}>Tags</div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 font-bold uppercase"
                          style={{
                            background: 'var(--surface)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border)',
                            clipPath: 'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)',
                            fontSize: '0.6rem',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {project.link_url && (
                <a
                  href={project.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2.5 transition-all hover:opacity-80"
                  style={{ background: 'var(--primary)', color: 'white', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}
                >
                  {locale === 'fr' ? 'Voir le projet' : 'View project'} <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* Long description */}
              {project.long_description && (
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-5" style={{ background: 'var(--primary)' }} />
                    <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-subtle)' }}>
                      {locale === 'fr' ? 'À propos du projet' : 'About the project'}
                    </span>
                  </div>
                  <div
                    className="text-base leading-relaxed whitespace-pre-wrap"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {project.long_description}
                  </div>
                </div>
              )}

              {/* CTA sidebar */}
              <div className={project.long_description ? '' : 'lg:col-span-3'}>
                <div
                  className="p-6 relative overflow-hidden"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-10"
                    style={{ background: project.accent, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                  />
                  <h3
                    className="font-display text-3xl mb-2"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
                  >
                    {locale === 'fr' ? 'UN PROJET SIMILAIRE ?' : 'SIMILAR PROJECT?'}
                  </h3>
                  <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                    {locale === 'fr'
                      ? 'Discutons de votre projet et voyons comment nous pouvons vous aider.'
                      : 'Let\'s discuss your project and see how we can help you.'}
                  </p>
                  <Link href={`/${locale}#contact`}>
                    <button className="btn-primary text-xs px-6 py-3 w-full flex items-center justify-center gap-2">
                      {locale === 'fr' ? 'Demander un devis' : 'Request a quote'} <ArrowUpRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {allImages.length > 0 && (
          <section className="pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-5" style={{ background: 'var(--primary)' }} />
                <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-subtle)' }}>
                  {allImages.length > 1 ? (locale === 'fr' ? 'Galerie' : 'Gallery') : (locale === 'fr' ? 'Visuel' : 'Visual')}
                </span>
              </div>
              <ProjectGallery images={allImages} title={project.title} position={project.image_position ?? 'center'} />
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  )
}
