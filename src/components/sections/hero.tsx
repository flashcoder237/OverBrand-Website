'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'framer-motion'
import { ArrowRight, ArrowUpRight, ArrowDown } from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

const HeroInfinity3D = lazy(() => import('./hero-infinity-3d'))

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function useScramble(finalText: string, startDelay = 0) {
  const [displayText, setDisplayText] = useState(finalText)

  useEffect(() => {
    const FRAME_MS = 45
    const TOTAL_FRAMES = 28
    let frame = 0
    let intervalId: ReturnType<typeof setInterval>

    setDisplayText(
      finalText
        .split('')
        .map(c => (c === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
        .join('')
    )

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        frame++
        const nonSpaceCount = finalText.replace(/ /g, '').length
        setDisplayText(
          finalText
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' '
              const charIndex = finalText.slice(0, i + 1).replace(/ /g, '').length - 1
              const resolveAt = Math.floor((charIndex / Math.max(nonSpaceCount - 1, 1)) * TOTAL_FRAMES)
              if (frame > resolveAt) return char
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            })
            .join('')
        )
        if (frame >= TOTAL_FRAMES + 4) {
          clearInterval(intervalId)
          setDisplayText(finalText)
        }
      }, FRAME_MS)
    }, startDelay * 1000)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [finalText, startDelay])

  return displayText
}

const MARQUEE_ITEMS = [
  'BRANDING', 'DESIGN', 'IDENTITÉ VISUELLE', 'SITES WEB', 'SEO', 'MOTION', 'PUBLICITÉ', 'APPLICATIONS',
  'BRANDING', 'DESIGN', 'IDENTITÉ VISUELLE', 'SITES WEB', 'SEO', 'MOTION', 'PUBLICITÉ', 'APPLICATIONS',
]

export function HeroSection() {
  const t = useTranslations('hero')
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Scroll parallax
  const { scrollY } = useScroll()
  const titleY = useTransform(scrollY, [0, 600], [0, -60])
  const titleOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const noiseOpacity = useTransform(scrollY, [0, 400], [0.05, 0])
  const infinityY = useTransform(scrollY, [0, 600], [0, 40])
  const sectionScale = useTransform(scrollY, [0, 600], [1, 0.97])

  // Mouse parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 18 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18 })
  const textX = useTransform(springX, [-400, 400], [-4, 4])
  const textY = useTransform(springY, [-400, 400], [-2, 2])

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

  const line1 = useScramble(t('line1'), 0.4)
  const line2 = useScramble(t('line2'), 0.55)
  const line3 = useScramble(t('line3'), 0.7)

  return (
    <motion.section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ background: 'var(--bg)', scale: sectionScale }}
    >
      {/* ── Grain overlay ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          opacity: noiseOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── Top corner tags ── */}
      <div className="absolute top-24 left-4 sm:left-6 lg:left-8 z-10 pointer-events-none hidden sm:flex items-center gap-2">
        <div className="w-4 h-px" style={{ background: 'var(--primary)' }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: 'var(--text-muted)' }}>
          {t('badge')}
        </span>
      </div>
      <div className="absolute top-24 right-4 sm:right-6 lg:right-8 z-10 pointer-events-none hidden sm:flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: 'var(--text-muted)' }}>
          YAOUNDÉ · PARIS
        </span>
        <div className="w-4 h-px" style={{ background: 'var(--primary)' }} />
      </div>

      {/* ── Side rail — vertical rotated ── */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 hidden xl:block z-10 pointer-events-none">
        <div className="rotate-writing side-rail flex items-center gap-4">
          <span>DEPUIS 2019</span>
          <span style={{ color: 'var(--primary)' }}>●</span>
          <span>OVERBRAND STUDIO</span>
        </div>
      </div>

      {/* ── Main content: split grid ── */}
      <div className="relative z-10 flex-1 flex items-center pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center min-h-[70vh]">

            {/* LEFT — Text column */}
            <motion.div
              className="py-12 lg:py-0 order-2 lg:order-1"
              style={{ y: titleY, opacity: titleOpacity, x: textX, translateY: textY }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-[0.82] tracking-tight select-none mb-8"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(4rem, 11vw, 9.5rem)',
                  color: 'var(--text)',
                }}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                >
                  {line1}
                </motion.span>
                <motion.span
                  className="block text-outline-primary pl-[0.4em]"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                >
                  {line2}
                </motion.span>
                <motion.span
                  className="block"
                  style={{ color: 'var(--primary)' }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                >
                  {line3}
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="text-sm sm:text-base leading-relaxed mb-8 max-w-md"
                style={{ color: 'var(--text-muted)' }}
              >
                {t('description')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="flex flex-wrap items-center gap-4 mb-10"
              >
                <a
                  href="#contact"
                  data-cursor-label={t('cursor_label_start')}
                  data-magnetic
                  data-magnetic-strength="0.4"
                >
                  <button className="btn-primary text-xs px-8 py-4 flex items-center gap-2.5">
                    {t('cta_primary')}
                    <ArrowRight size={16} />
                  </button>
                </a>
                <a
                  href="#projects"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group accent-underline"
                  style={{ color: 'var(--text-muted)' }}
                  data-cursor-label={t('cursor_label_projects')}
                >
                  {t('cta_secondary')}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </motion.div>

              {/* Inline stats row — tight, beneath CTAs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="flex items-center gap-8 pt-6"
                style={{ borderTop: '1px solid var(--line)' }}
              >
                {[
                  { value: '50+', label: t('stat_projects') },
                  { value: '5+', label: t('stat_years') },
                  { value: '7', label: t('stat_services') },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <span
                      className="font-display leading-none display-xl"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--primary)' }}
                    >
                      {s.value}
                    </span>
                    <span
                      className="text-[10px] mt-1 font-bold uppercase tracking-[0.22em]"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — 3D Infinity column */}
            <motion.div
              className="relative order-1 lg:order-2 h-[44vh] min-h-[320px] lg:h-[calc(100vh-180px)] lg:min-h-[520px] lg:max-h-[720px]"
              style={{ y: infinityY }}
            >
              {/* Decorative rings — static */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
                aria-hidden
              >
                <motion.div
                  className="w-[480px] h-[480px] rounded-full border"
                  style={{ borderColor: 'var(--line)', borderStyle: 'dashed' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 44, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
                aria-hidden
              >
                <motion.div
                  className="w-[300px] h-[300px] rounded-full border"
                  style={{ borderColor: 'var(--line)' }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* 3D infinity canvas — fills this column only */}
              {mounted && (
                <Suspense fallback={null}>
                  <HeroInfinity3D />
                </Suspense>
              )}

              {/* Floating mini-badges around the 3D */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute top-4 right-4 pointer-events-none hidden md:block"
              >
                <div
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] clip-sharp-sm"
                  style={{ background: 'var(--primary)', color: 'white' }}
                >
                  {t('badge_premium')}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.15 }}
                className="absolute bottom-4 left-4 pointer-events-none hidden md:block"
              >
                <div
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] clip-sharp-sm"
                  style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border-strong)' }}
                >
                  {t('badge_custom')}
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Scroll cue + eyebrow strip ── */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-5 gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: 'var(--text-subtle)' }}>
              {t('badge')}
            </span>
            <motion.a
              href="#services"
              className="hidden md:flex flex-col items-center gap-1.5"
              style={{ color: 'var(--text-subtle)' }}
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">SCROLL</span>
              <ArrowDown size={12} />
            </motion.a>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: 'var(--text-subtle)' }}>
              EST. 2019
            </span>
          </div>
        </div>
      </div>

      {/* ── Marquee strip ── */}
      <div
        className="relative z-10 py-3 overflow-hidden"
        style={{ background: 'var(--accent-warm)', borderTop: '1px solid rgba(0,0,0,0.15)' }}
      >
        <div className="marquee-strip">
          <div className="inline-flex animate-marquee">
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={i} className="inline-flex items-center mx-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/95">{item}</span>
                <span className="ml-6 text-white/30">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
