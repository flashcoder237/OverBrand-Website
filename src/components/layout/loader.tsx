'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function useScramble(finalText: string, startDelay = 0) {
  const [displayText, setDisplayText] = useState(finalText)

  useEffect(() => {
    // Immediately scramble on client mount
    setDisplayText(
      finalText.split('').map(c =>
        c === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      ).join('')
    )

    let intervalId: ReturnType<typeof setInterval>
    const timeoutId = setTimeout(() => {
      let frame = 0
      const FRAME_MS = 45
      const TOTAL_FRAMES = 28
      intervalId = setInterval(() => {
        frame++
        const resolved = Math.floor((frame / TOTAL_FRAMES) * finalText.length)
        setDisplayText(
          finalText.split('').map((c, idx) => {
            if (c === ' ') return ' '
            if (idx < resolved) return c
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          }).join('')
        )
        if (frame >= TOTAL_FRAMES) {
          clearInterval(intervalId)
          setDisplayText(finalText)
        }
      }, FRAME_MS)
    }, startDelay * 1000)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [finalText, startDelay])

  return displayText
}

export function Loader() {
  const [phase, setPhase] = useState<'counting' | 'reveal' | 'done'>('counting')
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)
  const [scrambleActive, setScrambleActive] = useState(false)

  const scrambledName = useScramble('OVERBRAND', scrambleActive ? 0.1 : 9999)

  useEffect(() => {
    // Skip loader on subsequent navigations (only first visit)
    if (sessionStorage.getItem('ob-loaded')) {
      setVisible(false)
      return
    }
    sessionStorage.setItem('ob-loaded', '1')
    setScrambleActive(true)

    // Count 0 → 100 in ~1.6s
    let frame = 0
    const total = 60
    const interval = setInterval(() => {
      frame++
      const eased = Math.round((1 - Math.pow(1 - frame / total, 3)) * 100)
      setCount(eased)
      if (frame >= total) {
        clearInterval(interval)
        setPhase('reveal')
        setTimeout(() => setVisible(false), 900)
      }
    }, 26)

    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'var(--bg)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Top bar reveal */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'var(--primary)', transformOrigin: 'left' }}
            animate={{ scaleX: count / 100 }}
            transition={{ duration: 0 }}
          />

          {/* Logo */}
          <motion.div
            className="relative w-24 h-24 mb-8"
            animate={phase === 'reveal' ? { scale: [1, 1.15, 0.9], opacity: [1, 1, 0] } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image src="/logo-bg.png" alt="OverBrand" fill className="object-contain" priority />
          </motion.div>

          {/* Brand name — scramble effect */}
          <motion.div
            className="overflow-hidden mb-6"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span
              className="font-display tracking-widest text-4xl select-none"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
            >
              {scrambledName.slice(0, 4)}
              <span style={{ color: 'var(--primary)' }}>{scrambledName.slice(4)}</span>
            </span>
          </motion.div>

          {/* Counter */}
          <motion.div
            className="text-xs font-bold uppercase tracking-[0.3em] tabular-nums"
            style={{ color: 'var(--text-subtle)' }}
            animate={phase === 'reveal' ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {String(count).padStart(3, '0')} %
          </motion.div>

          {/* Curtain reveal — two panels slide away */}
          <AnimatePresence>
            {phase === 'reveal' && (
              <>
                <motion.div
                  key="curtain-left"
                  className="absolute inset-0"
                  style={{ background: 'var(--primary)', transformOrigin: 'left', right: '50%' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1, 1] }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.7, times: [0, 0.4, 1], ease: [0.76, 0, 0.24, 1] }}
                />
                <motion.div
                  key="curtain-right"
                  className="absolute inset-0"
                  style={{ background: 'var(--primary)', transformOrigin: 'right', left: '50%' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1, 1] }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.7, times: [0, 0.4, 1], ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
