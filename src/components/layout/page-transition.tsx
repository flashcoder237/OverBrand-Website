'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

// Diagonal wipe — signature OverBrand
const variants = {
  initial: {
    clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
    opacity: 1,
  },
  animate: {
    clipPath: 'polygon(0 0, 105% 0, 105% 100%, 0 100%)',
    opacity: 1,
    transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    clipPath: 'polygon(105% 0, 105% 0, 105% 100%, 105% 100%)',
    opacity: 1,
    transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
  },
}

const overlayVariants = {
  initial: { scaleX: 0, originX: 0 },
  animate: {
    scaleX: [0, 1, 1, 0],
    originX: [0, 0, 1, 1],
    transition: {
      duration: 0.85,
      ease: [0.76, 0, 0.24, 1],
      times: [0, 0.4, 0.6, 1],
    },
  },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      {/* Wipe overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname + '-overlay'}
          className="fixed inset-0 z-[9997] pointer-events-none"
          style={{ background: 'var(--primary)' }}
          initial={{ scaleX: 0, originX: '0%' }}
          animate={{ scaleX: 0 }}
          exit={{ scaleX: 0 }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.42, ease: [0.33, 1, 0.68, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
