'use client'

import { useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'

type ShowcaseProject = {
  id: string | number
  title: string
  category: string
  description: string | null
  gradient: string
  accent: string
  size: string
  image_url: string | null
  image_position: string | null
}

const FALLBACK_PROJECTS: ShowcaseProject[] = [
  {
    id: 1,
    title: 'Identité Marque Luxe',
    category: 'Branding',
    description: "Refonte complète de l'identité visuelle pour une maison de mode parisienne.",
    gradient: 'linear-gradient(135deg, #0d2240 0%, #2855a0 50%, #3a6fd8 100%)',
    accent: '#3a6fd8',
    size: 'large',
    image_url: null,
    image_position: null,
  },
  {
    id: 2,
    title: 'Plateforme E-Commerce',
    category: 'Site Web',
    description: 'Boutique en ligne avec tunnel de vente optimisé et +180% de conversion.',
    gradient: 'linear-gradient(135deg, #1a3a6b 0%, #6b9fd4 100%)',
    accent: '#6b9fd4',
    size: 'medium',
    image_url: null,
    image_position: null,
  },
  {
    id: 3,
    title: 'App Mobile Fintech',
    category: 'Application',
    description: 'Interface utilisateur pour une startup de paiement mobile primée.',
    gradient: 'linear-gradient(160deg, #2855a0 0%, #0d2240 100%)',
    accent: '#2855a0',
    size: 'medium',
    image_url: null,
    image_position: null,
  },
  {
    id: 4,
    title: 'Campagne SEO & Ads',
    category: 'Marketing',
    description: 'Stratégie 360° qui a triplé le trafic organique en 3 mois.',
    gradient: 'linear-gradient(135deg, #3a6fd8 0%, #1a3a6b 100%)',
    accent: '#3a6fd8',
    size: 'medium',
    image_url: null,
    image_position: null,
  },
  {
    id: 5,
    title: 'Motion Design Brand',
    category: 'Contenu',
    description: 'Série de vidéos animées pour lancement de produit viral.',
    gradient: 'linear-gradient(135deg, #6b9fd4 0%, #2855a0 60%, #0d2240 100%)',
    accent: '#6b9fd4',
    size: 'medium',
    image_url: null,
    image_position: null,
  },
]

function ProjectPreview({ project }: { project: ShowcaseProject }) {
  return (
    <motion.div
      className="overflow-hidden shadow-2xl pointer-events-none"
      style={{
        width: 300,
        height: 190,
        background: project.gradient,
        position: 'relative',
        clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
      }}
      initial={{ opacity: 0, scale: 0.88, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 14 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {project.image_url && (
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          className="object-cover"
          sizes="300px"
          style={{ objectPosition: project.image_position ?? 'center' }}
        />
      )}
      {/* Dot overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          opacity: 0.15,
        }}
      />
      {/* Category label */}
      <div
        className="absolute bottom-0 inset-x-0 p-4"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-white/80">
          {project.category}
        </span>
      </div>
    </motion.div>
  )
}

export function ProjectsSection({ projects: dbProjects }: { projects: ShowcaseProject[] }) {
  const t = useTranslations('projects')
  const locale = useLocale()
  const projects = dbProjects.length > 0 ? dbProjects.slice(0, 5) : FALLBACK_PROJECTS

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const cursorX = useMotionValue(-500)
  const cursorY = useMotionValue(-500)
  const springX = useSpring(cursorX, { stiffness: 200, damping: 28 })
  const springY = useSpring(cursorY, { stiffness: 200, damping: 28 })

  const handleMouseMove = (e: React.MouseEvent) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }

  return (
    <section
      id="projects"
      className="section"
      style={{ background: 'var(--bg)' }}
      onMouseMove={handleMouseMove}
    >
      {/* Floating cursor preview — fixed to viewport */}
      <motion.div
        className="fixed top-0 left-0 z-40 pointer-events-none"
        style={{ x: springX, y: springY }}
      >
        <div style={{ transform: 'translate(-50%, calc(-100% - 20px))' }}>
          <AnimatePresence mode="wait">
            {hoveredIndex !== null && (
              <ProjectPreview key={hoveredIndex} project={projects[hoveredIndex]} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 lg:mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
            <span className="badge">{t('eyebrow')}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="font-display leading-none tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                color: 'var(--text)',
              }}
            >
              {t('title_1')}<br />
              <span style={{ WebkitTextStroke: '2px var(--primary)', color: 'transparent' }}>
                {t('title_2')}
              </span>
            </h2>
            <div className="flex items-center gap-4 pb-2">
              <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
                {t('subtitle')}
              </p>
              <a href="#contact">
                <button className="btn-outline text-xs px-6 py-3 flex items-center gap-2 whitespace-nowrap" data-magnetic>
                  {t('view_all')} <ArrowRight size={14} />
                </button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Desktop: editorial cursor-follow text list */}
        <div className="hidden lg:block" style={{ borderTop: '1px solid var(--border)' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="relative"
              style={{ borderBottom: '1px solid var(--border)' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              {/* Accent underline on hover */}
              <motion.div
                className="absolute bottom-0 left-0 h-[1px] pointer-events-none z-10"
                animate={{ width: hoveredIndex === i ? '100%' : '0%' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }}
              />

              <Link href={`/${locale}/projets/${project.id}`}>
                <motion.div
                  className="flex items-center gap-6 xl:gap-10 py-5 xl:py-7"
                  animate={{
                    opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.3 : 1,
                    x: hoveredIndex === i ? 14 : 0,
                  }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  onHoverStart={() => setHoveredIndex(i)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  {/* Number */}
                  <span
                    className="flex-shrink-0 font-display leading-none"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      color: hoveredIndex === i ? 'var(--primary)' : 'var(--text-subtle)',
                      width: '2.5rem',
                      textAlign: 'right',
                      transition: 'color 0.25s',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Category */}
                  <span
                    className="hidden xl:block flex-shrink-0 text-xs font-bold uppercase tracking-widest"
                    style={{ color: 'var(--text-subtle)', width: '6.5rem' }}
                  >
                    {project.category}
                  </span>

                  {/* Title — the editorial centerpiece */}
                  <h3
                    className="flex-1 font-display leading-none tracking-wide"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 4.5vw, 4rem)',
                      color: hoveredIndex === i ? 'var(--primary)' : 'var(--text)',
                      transition: 'color 0.25s',
                    }}
                  >
                    {project.title}
                  </h3>

                  {/* Description — appears on hover at far right */}
                  <p
                    className="hidden 2xl:block text-xs max-w-[180px] text-right flex-shrink-0 leading-relaxed"
                    style={{
                      color: 'var(--text-muted)',
                      opacity: hoveredIndex === i ? 1 : 0,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    {project.description ?? ''}
                  </p>

                  {/* Arrow */}
                  <motion.div
                    animate={{ opacity: hoveredIndex === i ? 1 : 0, x: hoveredIndex === i ? 0 : 14 }}
                    transition={{ duration: 0.22 }}
                    style={{ color: 'var(--primary)', flexShrink: 0 }}
                  >
                    <ArrowUpRight size={26} />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile: snap-scroll cards */}
        <div
          className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 scrollbar-none"
          style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="snap-center flex-shrink-0"
              style={{ width: '78vw', maxWidth: '340px' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link href={`/${locale}/projets/${project.id}`}>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '4/3', background: project.gradient }}
                >
                  {project.image_url && (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="340px"
                      style={{ objectPosition: project.image_position ?? 'center' }}
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
                      backgroundSize: '18px 18px',
                      opacity: 0.12,
                    }}
                  />
                  <div
                    className="absolute bottom-0 inset-x-0 p-4"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72), transparent)' }}
                  >
                    <p className="text-xs text-white/60 uppercase tracking-widest mb-1">{project.category}</p>
                    <h3
                      className="font-display text-white"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}
                    >
                      {project.title}
                    </h3>
                  </div>
                  <div
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                    }}
                  >
                    <ArrowUpRight size={14} className="text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>{t('cta_text')}</p>
          <a href="#contact">
            <button className="btn-primary text-xs px-6 py-3 flex items-center gap-2">
              {t('cta_button')} <ArrowUpRight size={14} />
            </button>
          </a>
        </motion.div>

      </div>
    </section>
  )
}
