'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Consultation gratuite',
    description: 'On écoute vos besoins, vos objectifs et votre budget pour définir la stratégie idéale.',
  },
  {
    number: '02',
    title: 'Proposition & Devis',
    description: 'Vous recevez un devis détaillé avec le périmètre, les délais et le prix transparent.',
  },
  {
    number: '03',
    title: 'Conception & Design',
    description: 'Notre équipe crée les maquettes et le design sur mesure pour votre validation.',
  },
  {
    number: '04',
    title: 'Développement',
    description: 'Développement de la solution avec des points d\'avancement réguliers en toute transparence.',
  },
  {
    number: '05',
    title: 'Tests & Validation',
    description: 'Tests rigoureux, corrections et validation finale avant la mise en production.',
  },
  {
    number: '06',
    title: 'Livraison & Support',
    description: 'Mise en ligne, formation et support continu pour assurer votre succès.',
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="section" style={{ background: 'var(--bg-secondary)' }}>
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
            <span className="badge">Comment ça marche</span>
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
            PROCESSUS <span style={{ color: 'var(--primary)' }}>CLAIR</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            6 étapes pour transformer votre idée en réalité digitale, en toute transparence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="card p-7 relative overflow-hidden group"
            >
              {/* Number bg */}
              <div
                className="absolute top-4 right-4 text-6xl font-black opacity-5 group-hover:opacity-10 transition-opacity select-none"
                style={{ color: 'var(--primary)' }}
              >
                {step.number}
              </div>

              {/* Step badge */}
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-black mb-4"
                style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}
              >
                {step.number}
              </div>

              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text)' }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
