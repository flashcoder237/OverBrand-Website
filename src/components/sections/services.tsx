'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SERVICES } from '@/lib/utils'

export function ServicesSection() {
  return (
    <section id="services" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">Ce qu&apos;on fait</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4" style={{ color: 'var(--text)' }}>
            Tous vos besoins{' '}
            <span className="text-gradient">digitaux</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            De la conception à la mise en ligne, on prend en charge chaque aspect de votre transformation digitale.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <div className="card p-6 h-full group cursor-pointer">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                  style={{ background: 'var(--surface)' }}
                >
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text)' }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {service.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }}>
                  En savoir plus <ArrowUpRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
