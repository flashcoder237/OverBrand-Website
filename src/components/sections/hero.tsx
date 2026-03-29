'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  AnimatePresence,
} from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'

const MARQUEE_ITEMS = [
  'BRANDING', 'DESIGN', 'IDENTITÉ VISUELLE', 'SITES WEB', 'SEO', 'MOTION', 'PUBLICITÉ', 'APPLICATIONS',
  'BRANDING', 'DESIGN', 'IDENTITÉ VISUELLE', 'SITES WEB', 'SEO', 'MOTION', 'PUBLICITÉ', 'APPLICATIONS',
]

function LogoParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{ background: 'var(--accent-light)', top: '50%', left: '50%' }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: 0.8 + delay * 0.3, ease: 'easeOut', delay }}
    />
  )
}

export function HeroSection() {
  const t = useTranslations('hero')
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const particleIdRef = useRef(0)

  // ── Scroll parallax ──
  const { scrollY } = useScroll()
  const titleY = useTransform(scrollY, [0, 600], [0, -90])
  const titleOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const subtitleY = useTransform(scrollY, [0, 600], [0, -50])
  const logoY = useTransform(scrollY, [0, 600], [0, 60])
  const sectionScale = useTransform(scrollY, [0, 600], [1, 0.97])
  const noiseOpacity = useTransform(scrollY, [0, 400], [0.04, 0])

  // ── Mouse parallax ──
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 55, damping: 18 })
  const springY = useSpring(mouseY, { stiffness: 55, damping: 18 })

  const logoRotateX = useTransform(springY, [-400, 400], [14, -14])
  const logoRotateY = useTransform(springX, [-400, 400], [-14, 14])
  const ring1X = useTransform(springX, [-400, 400], [-10, 10])
  const ring1Y = useTransform(springY, [-400, 400], [-10, 10])
  const ring2X = useTransform(springX, [-400, 400], [6, -6])
  const ring2Y = useTransform(springY, [-400, 400], [6, -6])
  const bgSlabX = useTransform(springX, [-400, 400], [-6, 6])

  const spawnParticles = useCallback(() => {
    const count = 12
    const newParticles = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const dist = 60 + Math.random() * 80
      return {
        id: particleIdRef.current++,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        delay: i * 0.04,
      }
    })
    setParticles(p => [...p, ...newParticles])
    setTimeout(() => setParticles(p => p.filter(pt => !newParticles.find(n => n.id === pt.id))), 1400)
  }, [])

  useEffect(() => {
    setMounted(true)
    const el = containerRef.current
    if (!el) return
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left - rect.width / 2)
      mouseY.set(e.clientY - rect.top - rect.height / 2)
    }
    el.addEventListener('mousemove', handleMove)
    return () => el.removeEventListener('mousemove', handleMove)
  }, [mouseX, mouseY])

  const heroLogoSrc = '/logo-bg.png'

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ background: 'var(--bg)', cursor: 'none', scale: sectionScale }}
    >
      {/* Animated noise grain */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: noiseOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Blue diagonal slab — parallaxe horizontal */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block"
        style={{
          background: 'linear-gradient(160deg, var(--primary-dark) 0%, var(--primary) 60%, var(--accent) 100%)',
          clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)',
          x: bgSlabX,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Scanline animated overlay on the slab */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block pointer-events-none overflow-hidden"
        style={{ clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      >
        <motion.div
          className="absolute inset-x-0 h-[2px] opacity-[0.07]"
          style={{ background: 'white' }}
          animate={{ y: ['-100%', '100vh'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center pt-20">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[70vh] items-center">

            {/* LEFT — parallaxe on scroll */}
            <motion.div
              className="py-16 lg:py-0 lg:pr-16"
              style={{ y: titleY, opacity: titleOpacity }}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>
                  {t('badge')}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-[0.9] tracking-wide mb-8 select-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(5rem, 12vw, 10rem)',
                  color: 'var(--text)',
                }}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                >
                  {t('line1')}
                </motion.span>
                <motion.span
                  className="block"
                  style={{ WebkitTextStroke: '2px var(--primary)', color: 'transparent' }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                >
                  {t('line2')}
                </motion.span>
                <motion.span
                  className="block"
                  style={{ color: 'var(--primary)' }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                >
                  {t('line3')}
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="text-base leading-relaxed mb-10 max-w-md"
                style={{ color: 'var(--text-muted)', fontWeight: 400 }}
              >
                {t('description')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="flex flex-wrap items-center gap-4"
              >
                <a href="#contact" data-cursor-label={t('cursor_label_start')} data-magnetic data-magnetic-strength="0.4">
                  <button className="btn-primary text-xs px-8 py-4 flex items-center gap-2.5">
                    {t('cta_primary')}
                    <ArrowRight size={16} />
                  </button>
                </a>
                <a
                  href="#projects"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group"
                  style={{ color: 'var(--text-muted)' }}
                  data-cursor-label={t('cursor_label_projects')}
                >
                  {t('cta_secondary')}
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center gap-8 mt-16 pt-8"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                {[
                  { value: '50+', label: t('stat_projects') },
                  { value: '5+', label: t('stat_years') },
                  { value: '7', label: t('stat_services') },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                  >
                    <span
                      className="font-display leading-none"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--primary)' }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-xs mt-1 uppercase tracking-widest" style={{ color: 'var(--text-subtle)', letterSpacing: '0.12em' }}>
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT: Logo — parallaxe inversé */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:flex items-center justify-center relative h-[520px]"
              style={{ perspective: '900px', y: logoY }}
            >
              {/* Rings */}
              <motion.div
                className="absolute w-[440px] h-[440px] rounded-full pointer-events-none"
                style={{ border: '1px dashed rgba(255,255,255,0.15)', x: ring1X, y: ring1Y }}
                animate={{ rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute w-[320px] h-[320px] rounded-full pointer-events-none"
                style={{ border: '1px solid rgba(255,255,255,0.07)', x: ring2X, y: ring2Y }}
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner glow */}
              <motion.div
                className="absolute w-[200px] h-[200px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(58,111,216,0.4) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Particles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {particles.map(p => (
                  <LogoParticle key={p.id} x={p.x} y={p.y} delay={p.delay} />
                ))}
              </div>

              {/* Logo */}
              <motion.div
                className="relative w-56 h-56 cursor-none z-10"
                data-cursor-label="OverBrand"
                style={{ marginTop: '-60px', rotateX: logoRotateX, rotateY: logoRotateY, transformStyle: 'preserve-3d' }}
                onHoverStart={() => { setIsLogoHovered(true); spawnParticles() }}
                onHoverEnd={() => setIsLogoHovered(false)}
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              >
                {/* ∞ drawing */}
                <motion.svg
                  viewBox="0 0 220 110"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ overflow: 'visible' }}
                >
                  <motion.path
                    d="M110,55 C110,28 90,10 65,10 C40,10 20,28 20,55 C20,82 40,100 65,100 C90,100 110,82 110,55 C110,28 130,10 155,10 C180,10 200,28 200,55 C200,82 180,100 155,100 C130,100 110,82 110,55 Z"
                    fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="14" strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 1 }}
                    animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
                    transition={{ pathLength: { duration: 1.6, delay: 0.2, ease: 'easeInOut' }, opacity: { duration: 0.5, delay: 1.9 } }}
                  />
                  <motion.circle r="5" fill="white" filter="url(#glow2)"
                    initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.6, delay: 0.2 }}
                  >
                    <animateMotion dur="1.6s" begin="0.2s" fill="freeze"
                      path="M110,55 C110,28 90,10 65,10 C40,10 20,28 20,55 C20,82 40,100 65,100 C90,100 110,82 110,55 C110,28 130,10 155,10 C180,10 200,28 200,55 C200,82 180,100 155,100 C130,100 110,82 110,55 Z" />
                  </motion.circle>
                  <defs>
                    <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                </motion.svg>

                {/* Logo image */}
                <motion.div
                  className="w-full h-full relative"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={heroLogoSrc} alt="OverBrand" fill className="object-contain select-none" draggable={false} priority />
                </motion.div>

                {/* Hover glow */}
                <AnimatePresence>
                  {isLogoHovered && (
                    <motion.div
                      key="hring"
                      className="absolute inset-0 rounded-full pointer-events-none"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1.18 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.4 }}
                      style={{ boxShadow: '0 0 70px 24px rgba(58,111,216,0.5), 0 0 140px 48px rgba(40,85,160,0.25)' }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Orbiting dots */}
              <motion.div className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
                style={{ background: 'var(--accent-light)', top: '50%', left: '50%', marginTop: -5, marginLeft: -5 }}
                animate={{ x: [0, 195, 0, -195, 0], y: [-195, 0, 195, 0, -195] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{ background: 'rgba(255,255,255,0.5)', top: '50%', left: '50%', marginTop: -3, marginLeft: -3 }}
                animate={{ x: [0, -160, 0, 160, 0], y: [160, 0, -160, 0, 160] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
              />

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute top-12 right-6 pointer-events-none"
              >
                <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-4 py-2.5 rounded" style={{ background: 'var(--primary)', border: '1px solid var(--accent)' }}
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-white">{t('badge_premium')}</span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute bottom-16 left-2 pointer-events-none"
              >
                <motion.div animate={{ y: [6, -6, 6] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="px-4 py-2.5 rounded" style={{ background: 'var(--primary)', border: '1px solid var(--accent)' }}
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-white">{t('badge_custom')}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative z-10 py-3 overflow-hidden" style={{ background: 'var(--primary)', borderTop: '1px solid var(--primary-dark)' }}>
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
    </motion.section>
  )
}
