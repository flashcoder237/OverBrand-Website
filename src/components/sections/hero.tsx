'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'

const MARQUEE_ITEMS = [
  'BRANDING', 'DESIGN', 'IDENTITÉ VISUELLE', 'SITES WEB', 'SEO', 'MOTION', 'PUBLICITÉ', 'APPLICATIONS',
  'BRANDING', 'DESIGN', 'IDENTITÉ VISUELLE', 'SITES WEB', 'SEO', 'MOTION', 'PUBLICITÉ', 'APPLICATIONS',
]

// Custom cursor component — lives at root level, tracks globally
function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX = useMotionValue(-100)
  const trailY = useMotionValue(-100)

  const springConfig = { stiffness: 500, damping: 40 }
  const trailConfig = { stiffness: 120, damping: 22 }

  const smoothX = useSpring(cursorX, springConfig)
  const smoothY = useSpring(cursorY, springConfig)
  const trailSmoothX = useSpring(trailX, trailConfig)
  const trailSmoothY = useSpring(trailY, trailConfig)

  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
    }

    const down = () => setIsClicking(true)
    const up = () => setIsClicking(false)

    const enterLink = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const el = target.closest('a, button, [data-cursor]') as HTMLElement | null
      if (el) {
        setIsHovering(true)
        setLabel(el.dataset.cursorLabel ?? null)
      }
    }
    const leaveLink = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('a, button, [data-cursor]')) {
        setIsHovering(false)
        setLabel(null)
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    window.addEventListener('mouseover', enterLink)
    window.addEventListener('mouseout', leaveLink)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('mouseover', enterLink)
      window.removeEventListener('mouseout', leaveLink)
    }
  }, [cursorX, cursorY, trailX, trailY])

  return (
    <>
      {/* Trailing blob */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: trailSmoothX,
          y: trailSmoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 56 : isClicking ? 20 : 36,
            height: isHovering ? 56 : isClicking ? 20 : 36,
            opacity: isHovering ? 0.18 : 0.12,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            borderRadius: '50%',
            background: 'var(--primary)',
          }}
        />
      </motion.div>

      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isClicking ? 6 : 10,
            height: isClicking ? 6 : 10,
            scale: isHovering ? 0 : 1,
          }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          style={{
            borderRadius: '50%',
            background: 'var(--primary)',
          }}
        />

        {/* Hover ring */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              key="ring"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="absolute top-1/2 left-1/2"
              style={{
                width: 44,
                height: 44,
                translateX: '-50%',
                translateY: '-50%',
                borderRadius: '50%',
                border: '1.5px solid var(--primary)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Cursor label */}
        <AnimatePresence>
          {label && (
            <motion.div
              key="label"
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.85 }}
              transition={{ duration: 0.18 }}
              className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1 text-xs font-bold uppercase tracking-widest"
              style={{
                background: 'var(--primary)',
                color: 'white',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              }}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

// Particle that bursts from logo on hover
function LogoParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{
        background: 'var(--accent-light)',
        top: '50%',
        left: '50%',
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: 0.8 + delay * 0.3, ease: 'easeOut', delay }}
    />
  )
}

export function HeroSection() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const particleIdRef = useRef(0)

  // Mouse parallax — relative to the whole section
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 55, damping: 18 })
  const springY = useSpring(mouseY, { stiffness: 55, damping: 18 })

  const logoRotateX = useTransform(springY, [-400, 400], [14, -14])
  const logoRotateY = useTransform(springX, [-400, 400], [-14, 14])
  const ring1X = useTransform(springX, [-400, 400], [-8, 8])
  const ring1Y = useTransform(springY, [-400, 400], [-8, 8])
  const ring2X = useTransform(springX, [-400, 400], [5, -5])
  const ring2Y = useTransform(springY, [-400, 400], [5, -5])

  const spawnParticles = useCallback(() => {
    const count = 10
    const newParticles = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const dist = 60 + Math.random() * 60
      return {
        id: particleIdRef.current++,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        delay: i * 0.04,
      }
    })
    setParticles(p => [...p, ...newParticles])
    setTimeout(() => setParticles(p => p.filter(pt => !newParticles.find(n => n.id === pt.id))), 1200)
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

  const logoSrc = mounted && resolvedTheme === 'dark' ? '/logo-bg.png' : '/logo.png'
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <>
      <CustomCursor />

      <section
        ref={containerRef}
        className="relative min-h-screen flex flex-col justify-between overflow-hidden"
        style={{ background: 'var(--bg)', cursor: 'none' }}
      >
        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Blue diagonal slab */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block"
          style={{
            background: 'linear-gradient(160deg, var(--primary-dark) 0%, var(--primary) 60%, var(--accent) 100%)',
            clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)',
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

        {/* Main content */}
        <div className="relative z-10 flex-1 flex items-center pt-20">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[70vh] items-center">

              {/* LEFT */}
              <div className="py-16 lg:py-0 lg:pr-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>
                    Agence Digitale Créative
                  </span>
                </motion.div>

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
                  <span className="block" style={{ WebkitTextStroke: '2px var(--primary)', color: 'transparent' }}>
                    VISION
                  </span>
                  <span className="block" style={{ color: 'var(--primary)' }}>RÉALISÉE.</span>
                </motion.h1>

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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <a href="#contact" data-cursor-label="Commencer">
                    <button className="btn-primary text-xs px-8 py-4 flex items-center gap-2.5">
                      Démarrer un projet
                      <ArrowRight size={16} />
                    </button>
                  </a>
                  <a href="#projects" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group" style={{ color: 'var(--text-muted)' }} data-cursor-label="Projets">
                    Voir nos projets
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </motion.div>

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

              {/* RIGHT: Logo showcase */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden lg:flex items-center justify-center relative h-[520px]"
                style={{ perspective: '900px' }}
              >
                {/* Outer ring — mouse-parallax */}
                <motion.div
                  className="absolute w-[440px] h-[440px] rounded-full pointer-events-none"
                  style={{
                    border: '1px dashed rgba(255,255,255,0.15)',
                    x: ring1X,
                    y: ring1Y,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                />

                {/* Mid ring — counter */}
                <motion.div
                  className="absolute w-[320px] h-[320px] rounded-full pointer-events-none"
                  style={{
                    border: '1px solid rgba(255,255,255,0.07)',
                    x: ring2X,
                    y: ring2Y,
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                />

                {/* Inner glow — breathes */}
                <motion.div
                  className="absolute w-[200px] h-[200px] rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(58,111,216,0.4) 0%, transparent 70%)' }}
                  animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Particles from logo hover */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {particles.map(p => (
                    <LogoParticle key={p.id} x={p.x} y={p.y} delay={p.delay} />
                  ))}
                </div>

                {/* LOGO — the star of the show */}
                <motion.div
                  className="relative w-56 h-56 cursor-none z-10"
                  data-cursor-label="OverBrand"
                  style={{
                    rotateX: logoRotateX,
                    rotateY: logoRotateY,
                    transformStyle: 'preserve-3d',
                  }}
                  onHoverStart={() => { setIsLogoHovered(true); spawnParticles() }}
                  onHoverEnd={() => setIsLogoHovered(false)}
                  whileHover={{ scale: 1.07 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                >
                  {/* Entrance animation */}
                  <motion.div
                    className="w-full h-full relative"
                    initial={{ scale: 0.4, opacity: 0, rotateY: -45 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Logo image */}
                    <Image
                      src={logoSrc}
                      alt="OverBrand"
                      fill
                      className="object-contain select-none"
                      style={{ filter: isDark ? 'brightness(0) invert(1)' : 'none', userSelect: 'none' }}
                      draggable={false}
                      priority
                    />

                    {/* Shimmer — masqué par la forme exacte du logo via mask-image */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        maskImage: `url(${logoSrc})`,
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskImage: `url(${logoSrc})`,
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.95) 50%, transparent 80%)',
                        backgroundSize: '300% 100%',
                      }}
                      animate={{ backgroundPosition: ['-300% 0%', '300% 0%'] }}
                      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                    />
                  </motion.div>

                  {/* Hover glow ring */}
                  <AnimatePresence>
                    {isLogoHovered && (
                      <motion.div
                        key="hring"
                        className="absolute inset-0 rounded-full pointer-events-none"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1.15 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.35 }}
                        style={{
                          boxShadow: '0 0 60px 20px rgba(58,111,216,0.45), 0 0 120px 40px rgba(40,85,160,0.25)',
                        }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Orbiting dot */}
                <motion.div
                  className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
                  style={{ background: 'var(--accent-light)', top: '50%', left: '50%', marginTop: -5, marginLeft: -5 }}
                  animate={{
                    x: [0, 195, 0, -195, 0],
                    y: [-195, 0, 195, 0, -195],
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                />
                {/* Second orbiting dot — smaller, opposite phase */}
                <motion.div
                  className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                  style={{ background: 'rgba(255,255,255,0.5)', top: '50%', left: '50%', marginTop: -3, marginLeft: -3 }}
                  animate={{
                    x: [0, -160, 0, 160, 0],
                    y: [160, 0, -160, 0, 160],
                  }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
                />

                {/* Floating badge — Design Premium */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute top-12 right-6 pointer-events-none"
                >
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="glass px-4 py-2.5"
                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Design Premium</span>
                  </motion.div>
                </motion.div>

                {/* Floating badge — Sur Mesure */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="absolute bottom-16 left-2 pointer-events-none"
                >
                  <motion.div
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="glass px-4 py-2.5"
                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-white">100% Sur Mesure</span>
                  </motion.div>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
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
    </>
  )
}
