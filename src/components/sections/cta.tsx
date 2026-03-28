'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

export function CTASection() {
  const t = useTranslations('cta')
  const locale = useLocale()

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
              {t('badge')}
            </span>

            <h2
              className="font-display leading-none text-white mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              }}
            >
              {t('title_1')}<br />{t('title_2')}
            </h2>

            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/${locale}/auth/register`}>
                <button data-magnetic data-magnetic-strength="0.3" className="flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-2xl hover:-translate-y-1" style={{ color: 'var(--primary)' }}>
                  {t('button_primary')}
                  <ArrowRight size={18} />
                </button>
              </Link>
              <a href="mailto:contact@overbrand.com">
                <button data-magnetic data-magnetic-strength="0.25" className="flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-full transition-all hover:bg-white/10 hover:-translate-y-1">
                  {t('button_secondary')}
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
