'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

type CursorMode = 'default' | 'hover' | 'click' | 'text' | 'drag'

export function MagneticCursor() {
  const cursorX = useMotionValue(-200)
  const cursorY = useMotionValue(-200)
  const trailX = useMotionValue(-200)
  const trailY = useMotionValue(-200)

  const smoothX = useSpring(cursorX, { stiffness: 600, damping: 40 })
  const smoothY = useSpring(cursorY, { stiffness: 600, damping: 40 })
  const trailSmoothX = useSpring(trailX, { stiffness: 100, damping: 20 })
  const trailSmoothY = useSpring(trailY, { stiffness: 100, damping: 20 })

  const [mode, setMode] = useState<CursorMode>('default')
  const [label, setLabel] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const rafRef = useRef<number>(0)

  // Magnetic attraction
  const applyMagnetic = useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest('[data-magnetic]') as HTMLElement | null
    if (target) {
      const rect = target.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const strength = parseFloat(target.dataset.magneticStrength ?? '0.35')
      cursorX.set(cx + dx * (1 + strength))
      cursorY.set(cy + dy * (1 + strength))
    } else {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    trailX.set(e.clientX)
    trailY.set(e.clientY)
  }, [cursorX, cursorY, trailX, trailY])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => applyMagnetic(e))
    }

    const onDown = () => setMode('click')
    const onUp = () => setMode('default')
    const onDocLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false)
    }
    const onDocEnter = () => setVisible(true)

    const onOver = (e: MouseEvent) => {
      setVisible(true)
      const el = (e.target as HTMLElement).closest(
        'a, button, [data-cursor], input, textarea, [data-magnetic]'
      ) as HTMLElement | null

      if (!el) {
        setMode('default')
        setLabel(null)
        return
      }

      const tag = el.tagName.toLowerCase()
      const cursorType = el.dataset.cursor

      if (cursorType === 'text' || tag === 'input' || tag === 'textarea') {
        setMode('text')
      } else if (cursorType === 'drag') {
        setMode('drag')
      } else {
        setMode('hover')
      }
      setLabel(el.dataset.cursorLabel ?? null)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseenter', onDocEnter)
    document.addEventListener('mouseleave', onDocLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onDocEnter)
      document.removeEventListener('mouseleave', onDocLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafRef.current)
    }
  }, [applyMagnetic])

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  if (isTouch) return null

  return (
    <>
      {/* Trail blob */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9990]"
        style={{
          x: trailSmoothX,
          y: trailSmoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width: mode === 'hover' ? 64 : mode === 'click' ? 16 : 40,
            height: mode === 'hover' ? 64 : mode === 'click' ? 16 : 40,
            opacity: mode === 'hover' ? 0.22 : 0.1,
            borderRadius: mode === 'text' ? '2px' : '50%',
          }}
          transition={{ type: 'spring', stiffness: 250, damping: 22 }}
          style={{ background: 'var(--primary)' }}
        />
      </motion.div>

      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Core dot */}
        <motion.div
          animate={{
            width: mode === 'text' ? 2 : mode === 'click' ? 5 : 10,
            height: mode === 'text' ? 22 : mode === 'click' ? 5 : 10,
            borderRadius: mode === 'text' ? '2px' : '50%',
            opacity: mode === 'hover' ? 0 : 1,
          }}
          transition={{ type: 'spring', stiffness: 700, damping: 32 }}
          style={{ background: 'var(--primary)' }}
        />

        {/* Hover ring */}
        <AnimatePresence>
          {mode === 'hover' && (
            <motion.div
              key="ring"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className="absolute top-1/2 left-1/2"
              style={{
                width: 48,
                height: 48,
                translateX: '-50%',
                translateY: '-50%',
                borderRadius: '50%',
                border: '1.5px solid var(--primary)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Drag mode — crosshair */}
        <AnimatePresence>
          {mode === 'drag' && (
            <motion.div
              key="drag"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-1/2 left-1/2"
              style={{
                translateX: '-50%',
                translateY: '-50%',
                width: 52,
                height: 52,
                borderRadius: '50%',
                border: '1.5px dashed var(--primary)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Label chip */}
        <AnimatePresence>
          {label && (
            <motion.div
              key="label"
              initial={{ opacity: 0, x: -4, scale: 0.88 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -4, scale: 0.88 }}
              transition={{ duration: 0.16 }}
              className="absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1 text-xs font-black uppercase tracking-widest text-white"
              style={{
                background: 'var(--primary)',
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

// Wrapper that adds magnetic effect to children
export function Magnetic({
  children,
  strength = 0.35,
  className,
  style,
}: {
  children: React.ReactNode
  strength?: number
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 18 })
  const springY = useSpring(y, { stiffness: 200, damping: 18 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      x.set((e.clientX - cx) * strength)
      y.set((e.clientY - cy) * strength)
    }

    const onLeave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [x, y, strength])

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
