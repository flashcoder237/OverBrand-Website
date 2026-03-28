'use client'

import { motion } from 'framer-motion'

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={{
        background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface-2) 50%, var(--surface) 75%)',
        backgroundSize: '200% 100%',
        ...style,
      }}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export function ProjectCardSkeleton() {
  return (
    <div
      className="flex-shrink-0"
      style={{ width: '420px', border: '1px solid var(--card-border)', background: 'var(--card-bg)' }}
    >
      <Skeleton style={{ height: '260px' }} />
      <div className="p-6 space-y-3">
        <Skeleton style={{ height: '16px', width: '60%', borderRadius: '2px' }} />
        <Skeleton style={{ height: '12px', borderRadius: '2px' }} />
        <Skeleton style={{ height: '12px', width: '80%', borderRadius: '2px' }} />
      </div>
    </div>
  )
}
