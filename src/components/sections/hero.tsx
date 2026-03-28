'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

const MARQUEE_ITEMS = [
  'BRANDING', 'DESIGN', 'IDENTITÉ VISUELLE', 'SITES WEB', 'SEO', 'MOTION', 'PUBLICITÉ', 'APPLICATIONS',
  'BRANDING', 'DESIGN', 'IDENTITÉ VISUELLE', 'SITES WEB', 'SEO', 'MOTION', 'PUBLICITÉ', 'APPLICATIONS',
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ── Background noise texture ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* ── Big diagonal blue slab behind right column ── */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block"
        style={{
          background: 'linear-gradient(160deg, var(--primary-dark) 0%, var(--primary) 60%, var(--accent) 100%)',
          clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* ── Blue slab dot pattern ── */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center pt-20">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[70vh] items-center">

            {/* LEFT: Typography heavy */}
            <div className="py-16 lg:py-0 lg:pr-16">

              {/* Tag line */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: 'var(--primary)' }}
                >
                  Agence Digitale Créative
                </span>
              </motion.div>

              {/* Huge display headline */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display leading-[0.92] tracking-wide mb-8 select-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(5rem, 12vw, 10rem)',
                  color: 'var(--text)',
                }}
              >
                <span className="block">VOTRE</span>
                <span
                  className="block"
                  style={{
                    WebkitTextStroke: '2px var(--primary)',
                    color: 'transparent',
                  }}
                >
                  VISION
                </span>
                <span className="block" style={{ color: 'var(--primary)' }}>RÉALISÉE.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-base leading-relaxed mb-10 max-w-md"
                style={{ color: 'var(--text-muted)', fontWeight: 400 }}
              >
                Sites web, branding, applications, SEO — OverBrand transforme votre
                présence digitale en avantage concurrentiel durable.
              </motion.p>

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center gap-4"
              >
                <a href="#contact">
                  <button className="btn-primary text-xs px-8 py-4 flex items-center gap-2.5">
                    Démarrer un projet
                    <ArrowRight size={16} />
                  </button>
                </a>
                <a href="#projects" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group" style={{ color: 'var(--text-muted)' }}>
                  Voir nos projets
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="flex items-center gap-8 mt-16 pt-8"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                {[
                  { value: '50+', label: 'Projets livrés' },
                  { value: '5+', label: "Ans d'exp." },
                  { value: '7', label: 'Services' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span
                      className="font-display leading-none"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--primary)' }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-xs mt-1 uppercase tracking-widest" style={{ color: 'var(--text-subtle)', letterSpacing: '0.12em' }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: Logo + visual element on blue slab */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center relative"
            >
              {/* Rotating ring */}
              <div
                className="absolute w-[380px] h-[380px] rounded-full animate-rotate-slow"
                style={{
                  border: '1px dashed rgba(255,255,255,0.15)',
                }}
              />
              <div
                className="absolute w-[280px] h-[280px] rounded-full"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />

              {/* Logo container */}
              <div className="relative w-52 h-52 drop-shadow-2xl">
                <Image
                  src="/logo.png"
                  alt="OverBrand"
                  fill
                  className="object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  priority
                />
              </div>

              {/* Floating label top-right */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 right-8 glass px-4 py-2.5"
                style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white">Design Premium</span>
              </motion.div>

              {/* Floating label bottom-left */}
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-16 left-4 glass px-4 py-2.5"
                style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white">100% Sur Mesure</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Marquee strip ── */}
      <div
        className="relative z-10 py-3 overflow-hidden"
        style={{ background: 'var(--primary)', borderTop: '1px solid var(--primary-dark)' }}
      >
        <div className="marquee-strip">
          <div className="inline-flex animate-marquee">
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={i} className="inline-flex items-center mx-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">{item}</span>
                <span className="ml-6 text-white/30">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
