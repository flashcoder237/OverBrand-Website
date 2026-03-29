import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, ArrowUpRight, Tag, Calendar, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectGallery } from './project-gallery'

type ShowcaseProject = {
  id: string
  title: string
  category: string
  description: string | null
  long_description: string | null
  gradient: string
  accent: string
  image_url: string | null
  image_position: string | null
  image_urls: string[] | null
  tags: string[] | null
  client: string | null
  year: string | null
  link_url: string | null
  visible: boolean
}

export default async function ProjetDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('showcase_projects')
    .select('*')
    .eq('id', id)
    .eq('visible', true)
    .single<ShowcaseProject>()

  if (!project) notFound()

  const allImages = [
    ...(project.image_url ? [project.image_url] : []),
    ...(project.image_urls ?? []),
  ].filter(Boolean)

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', color: 'var(--text)' }}>

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ minHeight: '60vh' }}>
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: allImages[0]
                ? 'var(--bg)'
                : project.gradient,
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
              <ArrowLeft size={14} /> Retour aux projets
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
                    <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-subtle)', fontSize: '0.6rem' }}>Ann&eacute;e</div>
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
                  Voir le projet <ArrowUpRight size={14} />
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
                    <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-subtle)' }}>A propos du projet</span>
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
                    UN PROJET SIMILAIRE ?
                  </h3>
                  <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                    Discutons de votre projet et voyons comment nous pouvons vous aider.
                  </p>
                  <Link href={`/${locale}#contact`}>
                    <button
                      className="btn-primary text-xs px-6 py-3 w-full flex items-center justify-center gap-2"
                    >
                      Demander un devis <ArrowUpRight size={14} />
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
                  {allImages.length > 1 ? 'Galerie' : 'Visuel'}
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
