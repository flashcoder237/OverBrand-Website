'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

type ShowcaseProject = {
  id: string | number
  title: string
  category: string
  description: string | null
  gradient: string
  accent: string
  size: string
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
  },
  {
    id: 2,
    title: 'Plateforme E-Commerce',
    category: 'Site Web',
    description: 'Boutique en ligne avec tunnel de vente optimisé et +180% de conversion.',
    gradient: 'linear-gradient(135deg, #1a3a6b 0%, #6b9fd4 100%)',
    accent: '#6b9fd4',
    size: 'medium',
  },
  {
    id: 3,
    title: 'App Mobile Fintech',
    category: 'Application',
    description: 'Interface utilisateur pour une startup de paiement mobile primée.',
    gradient: 'linear-gradient(160deg, #2855a0 0%, #0d2240 100%)',
    accent: '#2855a0',
    size: 'medium',
  },
  {
    id: 4,
    title: 'Campagne SEO & Ads',
    category: 'Marketing',
    description: 'Stratégie 360° qui a triplé le trafic organique en 3 mois.',
    gradient: 'linear-gradient(135deg, #3a6fd8 0%, #1a3a6b 100%)',
    accent: '#3a6fd8',
    size: 'medium',
  },
  {
    id: 5,
    title: 'Motion Design Brand',
    category: 'Contenu',
    description: 'Série de vidéos animées pour lancement de produit viral.',
    gradient: 'linear-gradient(135deg, #6b9fd4 0%, #2855a0 60%, #0d2240 100%)',
    accent: '#6b9fd4',
    size: 'medium',
  },
]

// Card width + gap in px used for the translate calculation
const CARD_W = 420
const CARD_GAP = 20

function ProjectCard({ project, index }: { project: ShowcaseProject; index: number }) {
  const t = useTranslations('projects')
  const locale = useLocale()
  const [hovered, setHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const lightX = useSpring(mouseX, { stiffness: 120, damping: 18 })
  const lightY = useSpring(mouseY, { stiffness: 120, damping: 18 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-shrink-0 group overflow-hidden"
      style={{
        width: `${CARD_W}px`,
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      data-cursor="drag"
      data-cursor-label={t('view_project')}
    >
      {/* Light shader */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        animate={{
          background: hovered
            ? `radial-gradient(300px circle at ${lightX.get()}px ${lightY.get()}px, rgba(255,255,255,0.07), transparent 70%)`
            : 'none',
          opacity: hovered ? 1 : 0,
        }}
        transition={{ opacity: { duration: 0.3 } }}
      />

      {/* Gradient image area */}
      <div
        className="relative overflow-hidden"
        style={{ height: '260px', background: project.gradient }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        <div className="absolute bottom-0 right-0 w-40 h-40 opacity-10"
          style={{ background: 'white', clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)' }} />
        <motion.div className="absolute top-6 left-6 w-20 h-20 rounded-full opacity-10"
          style={{ border: '2px solid white' }}
          animate={{ scale: hovered ? 1.15 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Index watermark */}
        <div className="absolute bottom-2 right-4 select-none pointer-events-none"
          style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', lineHeight: 1, color: 'rgba(255,255,255,0.07)', fontWeight: 900 }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Category pill */}
        <div className="absolute top-4 left-4 z-20">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 text-white"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
          >
            {project.category}
          </span>
        </div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 z-10 flex items-end p-6"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ background: 'linear-gradient(to top, rgba(13,34,64,0.88) 0%, transparent 60%)' }}
        >
          <Link href={`/${locale}/dashboard/projets`}>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-3 text-white"
              style={{ background: 'var(--primary)', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
            >
              {t('view_project')} <ArrowUpRight size={14} />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Text area */}
      <div className="p-6">
        <motion.h3
          className="font-bold text-base mb-2"
          animate={{ color: hovered ? 'var(--primary)' : 'var(--text)' }}
          transition={{ duration: 0.2 }}
        >
          {project.title}
        </motion.h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {project.description}
        </p>
        <motion.div
          className="mt-4 h-[2px]"
          animate={{ width: hovered ? '100%' : '0%' }}
          transition={{ duration: 0.4 }}
          style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }}
        />
      </div>
    </motion.div>
  )
}

// End-of-track CTA card
function CTACard() {
  const t = useTranslations('projects')
  return (
    <div
      className="flex-shrink-0 flex flex-col items-center justify-center"
      style={{
        width: `${CARD_W * 0.65}px`,
        minHeight: '100%',
        border: '1px dashed var(--border)',
        background: 'var(--surface)',
      }}
    >
      <div className="text-center p-8">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)' }}
        >
          <ArrowRight size={20} style={{ color: 'var(--primary)' }} />
        </div>
        <p className="text-sm font-semibold mb-5" style={{ color: 'var(--text-muted)' }}>
          {t('cta_text')}
        </p>
        <a href="#contact">
          <button className="btn-primary text-xs px-6 py-3" data-magnetic>
            {t('cta_button')}
          </button>
        </a>
      </div>
    </div>
  )
}

export function ProjectsSection({ projects: dbProjects }: { projects: ShowcaseProject[] }) {
  const t = useTranslations('projects')
  const locale = useLocale()
  const projects = dbProjects.length > 0 ? dbProjects.slice(0, 5) : FALLBACK_PROJECTS

  // Total items = projects + 1 CTA card
  const totalCards = projects.length + 1
  const totalTrackWidth = totalCards * (CARD_W + CARD_GAP)

  // The sticky container — give it enough scroll height
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Translate the track from 0 to -(totalWidth - viewport)
  // We use a percentage of total track width so it works at any viewport
  const xTranslate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(totalTrackWidth - (typeof window !== 'undefined' ? window.innerWidth - 64 : 1200))]
  )

  // Scroll height = enough room to scroll all cards (each card needs ~600px of scroll)
  const scrollHeight = projects.length * 600 + 400

  return (
    <section id="projects" ref={sectionRef} style={{ background: 'var(--bg)', height: `${scrollHeight}px` }}>

      {/* Sticky wrapper — holds header + track */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>

        {/* Header */}
        <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
                <span className="badge">{t('eyebrow')}</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <h2
                  className="font-display leading-none tracking-wide"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 6rem)', color: 'var(--text)' }}
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
          </div>
        </div>

        {/* Horizontal track — desktop only */}
        <div className="hidden lg:flex flex-1 items-center overflow-hidden px-8">
          <motion.div
            className="flex gap-5 items-stretch h-[calc(100vh-260px)]"
            style={{ x: xTranslate }}
          >
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
            <CTACard />
          </motion.div>
        </div>

        {/* Mobile — standard drag scroll */}
        <div
          className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-8 flex-1 items-center scrollbar-none"
          style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {projects.map((project, i) => (
            <div key={project.id} className="snap-center flex-shrink-0" style={{ width: '85vw', maxWidth: '380px' }}>
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
