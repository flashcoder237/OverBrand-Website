'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sophie Mbeki',
    role: 'CEO, TechStart',
    text: 'OverBrand a transformé notre présence en ligne. Notre site génère maintenant 3x plus de leads qu\'avant. L\'équipe est réactive, professionnelle et créative.',
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'Jean-Paul Kofi',
    role: 'Directeur Commercial, InnoGroup',
    text: 'Application mobile livrée dans les délais, exactement comme nous l\'avions imaginé. Le suivi en temps réel du projet est un vrai plus. Je recommande à 100%.',
    rating: 5,
    avatar: 'JK',
  },
  {
    name: 'Marie Nguyen',
    role: 'Fondatrice, BioShop',
    text: 'Logo, site web et stratégie SEO — tout en un seul endroit. Résultats visibles dès le premier mois avec une hausse de 40% du trafic organique.',
    rating: 5,
    avatar: 'MN',
  },
]

export function TestimonialsSection() {
  return (
    <section className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
            <span className="badge">Témoignages</span>
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
          </div>
          <h2
            className="font-display leading-none mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              color: 'var(--text)',
            }}
          >
            ILS NOUS <span style={{ color: 'var(--primary)' }}>FONT CONFIANCE</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-7 relative"
            >
              <Quote
                size={32}
                className="absolute top-6 right-6 opacity-10"
                style={{ color: 'var(--primary)' }}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" style={{ color: '#f59e0b' }} />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'var(--primary)' }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
