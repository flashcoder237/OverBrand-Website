'use client'

import { motion } from 'framer-motion'
import { CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react'

const VALUES = [
  {
    icon: Zap,
    title: 'Réactivité',
    description: 'Des délais respectés, une communication transparente à chaque étape.',
  },
  {
    icon: Shield,
    title: 'Fiabilité',
    description: 'Solutions robustes, sécurisées et maintenables sur le long terme.',
  },
  {
    icon: TrendingUp,
    title: 'Performance',
    description: 'Des résultats mesurables et un retour sur investissement optimal.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
              <span className="badge">Qui sommes-nous</span>
            </div>
            <h2
              className="font-display leading-none mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                color: 'var(--text)',
              }}
            >
              L&apos;AGENCE QUI<br />
              <span style={{ color: 'var(--primary)' }}>FAIT LA DIFFÉRENCE</span>
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              OverBrand est une agence digitale créative spécialisée dans la transformation numérique
              des entreprises. Nous combinons créativité, technologie et stratégie pour propulser
              votre marque vers de nouveaux sommets.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
              Notre équipe passionnée accompagne les startups, PME et grandes entreprises dans
              la création de leur identité digitale et le développement de solutions sur mesure.
            </p>

            {/* Checklist */}
            <ul className="space-y-3">
              {[
                'Équipe expérimentée et passionnée',
                'Solutions sur mesure et adaptées',
                'Accompagnement de A à Z',
                'Suivi en temps réel de vos projets',
                'Support technique disponible',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            {/* Big card */}
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, var(--primary) 0%, hsl(calc(var(--hue) + 40), 82%, 55%) 100%)`,
              }}
            >
              <div className="absolute inset-0 dot-bg opacity-20" />
              <div className="relative">
                <div className="text-6xl font-black text-white mb-2">5+</div>
                <div className="text-white/80 text-lg font-medium">années d&apos;expérience</div>
                <div className="text-white/60 text-sm mt-1">dans le digital</div>
              </div>
            </div>

            {/* Value cards */}
            <div className="grid grid-cols-1 gap-4">
              {VALUES.map((val, i) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card p-5 flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--primary-glow)' }}
                  >
                    <val.icon size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>{val.title}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{val.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
