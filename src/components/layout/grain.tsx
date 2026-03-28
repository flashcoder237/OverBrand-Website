'use client'

import { motion } from 'framer-motion'

// Animated film grain overlay — global
export function Grain() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9980] select-none"
      style={{ mixBlendMode: 'overlay' }}
      animate={{ opacity: [0.025, 0.045, 0.025] }}
      transition={{ duration: 0.12, repeat: Infinity, repeatType: 'mirror' }}
    >
      <svg className="w-full h-full opacity-100" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </motion.div>
  )
}
