'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
          style={{
            background: `linear-gradient(135deg, var(--primary) 0%, hsl(calc(var(--hue) + 50), 82%, 50%) 100%)`,
          }}
        >
          {/* Background patterns */}
          <div className="absolute inset-0 dot-bg opacity-20" />
          <div
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[60px] opacity-30"
            style={{ background: 'white' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-[80px] opacity-20"
            style={{ background: 'white' }}
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 bg-white/20 text-white">
              <MessageCircle size={14} />
              Consultation gratuite
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-4">
              Prêt à transformer<br />votre présence digitale?
            </h2>

            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Obtenez un devis gratuit en 24h. Sans engagement, sans frais cachés.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <button className="flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-2xl hover:-translate-y-1" style={{ color: 'var(--primary)' }}>
                  Demander un devis
                  <ArrowRight size={18} />
                </button>
              </Link>
              <a href="mailto:contact@overbrand.com">
                <button className="flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-full transition-all hover:bg-white/10 hover:-translate-y-1">
                  Nous contacter
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
