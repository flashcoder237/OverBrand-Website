'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const PROJECTS = [
  {
    id: 1,
    title: 'Identité Marque Luxe',
    category: 'Branding',
    description: 'Refonte complète de l\'identité visuelle pour une maison de mode parisienne.',
    gradient: 'linear-gradient(135deg, #0d2240 0%, #2855a0 50%, #3a6fd8 100%)',
    accent: '#3a6fd8',
    size: 'large',
  },
  {
    id: 2,
    title: 'Plateforme E-Commerce',
    category: 'Site Web',
    description: 'Boutique en ligne avec tunnel de vente optimisé.',
    gradient: 'linear-gradient(135deg, #1a3a6b 0%, #6b9fd4 100%)',
    accent: '#6b9fd4',
    size: 'small',
  },
  {
    id: 3,
    title: 'App Mobile Fintech',
    category: 'Application',
    description: 'Interface utilisateur pour une startup de paiement mobile.',
    gradient: 'linear-gradient(160deg, #2855a0 0%, #0d2240 100%)',
    accent: '#2855a0',
    size: 'small',
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
    description: 'Série de vidéos animées pour lancement de produit.',
    gradient: 'linear-gradient(135deg, #6b9fd4 0%, #2855a0 60%, #0d2240 100%)',
    accent: '#6b9fd4',
    size: 'medium',
  },
]

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative overflow-hidden cursor-pointer"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
      }}
    >
      {/* Gradient visual */}
      <div
        className="relative overflow-hidden"
        style={{
          height: project.size === 'large' ? '280px' : project.size === 'medium' ? '200px' : '160px',
          background: project.gradient,
        }}
      >
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        {/* Decorative geometric */}
        <div
          className="absolute bottom-0 right-0 w-32 h-32 opacity-10"
          style={{
            background: 'white',
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
          }}
        />
        <div
          className="absolute top-4 left-4 w-16 h-16 rounded-full opacity-10"
          style={{ border: '2px solid white' }}
        />

        {/* Category pill */}
        <div className="absolute top-4 left-4">
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              backdropFilter: 'blur(8px)',
              clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
            }}
          >
            {project.category}
          </span>
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          style={{ background: 'rgba(13, 34, 64, 0.5)', backdropFilter: 'blur(4px)' }}
        >
          <Link href="/dashboard/projets">
            <button
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-3 text-white transition-transform hover:scale-105"
              style={{
                background: 'var(--primary)',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              }}
            >
              Voir le projet <ArrowUpRight size={14} />
            </button>
          </Link>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5">
        <h3
          className="font-bold text-base mb-1 group-hover:text-primary transition-colors duration-300"
          style={{ color: 'var(--text)' }}
        >
          {project.title}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {project.description}
        </p>
      </div>
    </motion.div>
  )
}

export function ProjectsSection() {
  return (
    <section id="projects" className="section" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
            <span className="badge">Notre travail</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              className="font-display leading-none tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                color: 'var(--text)',
              }}
            >
              PROJETS<br />
              <span
                style={{
                  WebkitTextStroke: '2px var(--primary)',
                  color: 'transparent',
                }}
              >
                RÉCENTS
              </span>
            </h2>
            <div className="flex flex-col items-start lg:items-end gap-3 pb-2">
              <p className="text-sm leading-relaxed max-w-xs lg:text-right" style={{ color: 'var(--text-muted)' }}>
                Quelques-unes de nos réalisations récentes — chaque projet est unique.
              </p>
              <Link href="/dashboard/projets">
                <button className="btn-outline text-xs px-6 py-3 flex items-center gap-2">
                  Voir tous les projets <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large card spanning 2 cols */}
          <div className="lg:col-span-2">
            <ProjectCard project={PROJECTS[0]} index={0} />
          </div>

          {/* Small card */}
          <div>
            <ProjectCard project={PROJECTS[1]} index={1} />
          </div>

          {/* Small card */}
          <div>
            <ProjectCard project={PROJECTS[2]} index={2} />
          </div>

          {/* Medium card */}
          <div>
            <ProjectCard project={PROJECTS[3]} index={3} />
          </div>

          {/* Medium card */}
          <div>
            <ProjectCard project={PROJECTS[4]} index={4} />
          </div>
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 py-8"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--primary)' }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Prêt à lancer votre prochain projet ?
            </span>
          </div>
          <a href="#contact">
            <button className="btn-primary text-xs px-8 py-3.5 flex items-center gap-2">
              Démarrer maintenant <ArrowRight size={14} />
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
