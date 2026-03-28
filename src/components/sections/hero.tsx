'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Gradient blobs */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 animate-pulse-glow"
        style={{ background: 'var(--primary)' }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 animate-pulse-glow"
        style={{ background: `hsl(calc(var(--hue) + 40), 82%, 60%)`, animationDelay: '1.5s' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex mb-8"
        >
          <span className="badge">
            <Sparkles size={12} />
            Agence Digitale Créative
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-6"
        >
          <span style={{ color: 'var(--text)' }}>Votre vision,</span>
          <br />
          <span className="text-gradient">notre expertise</span>
          <span style={{ color: 'var(--text)' }}>.</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          Sites web, applications, branding, SEO, publicité — OverBrand transforme votre
          présence digitale en avantage concurrentiel.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#contact">
            <button className="btn-primary text-base px-8 py-4 flex items-center gap-2">
              Démarrer un projet
              <ArrowRight size={18} />
            </button>
          </a>
          <a href="#services">
            <button
              className="flex items-center gap-2.5 text-base font-semibold px-8 py-4 rounded-full transition-all hover:opacity-70"
              style={{ color: 'var(--text)', border: '1.5px solid var(--border)' }}
            >
              <Play size={16} fill="currentColor" />
              Nos services
            </button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: '50+', label: 'Projets livrés' },
            { value: '100%', label: 'Clients satisfaits' },
            { value: '7', label: 'Services offerts' },
            { value: '24/7', label: 'Support client' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-gradient mb-1">{stat.value}</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>Défiler</span>
        <div
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: '1.5px solid var(--border)' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1.5 rounded-full"
            style={{ background: 'var(--primary)' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
