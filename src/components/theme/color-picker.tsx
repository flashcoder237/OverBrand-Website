'use client'

import { useState, useRef, useEffect } from 'react'
import { Palette } from 'lucide-react'
import { COLOR_PRESETS } from '@/lib/utils'
import { applyColor } from './theme-provider'

export function ColorPicker() {
  const [open, setOpen] = useState(false)
  const [activeHue, setActiveHue] = useState(245)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('ob-hue')
    if (saved) setActiveHue(Number(saved))
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(hue: number) {
    setActiveHue(hue)
    applyColor(hue)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        aria-label="Changer les couleurs"
      >
        <Palette size={18} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 p-3 rounded-2xl shadow-2xl z-50 min-w-[180px]"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs mb-2 px-1" style={{ color: 'var(--text-muted)' }}>Couleur principale</p>
          <div className="flex flex-col gap-1">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hue}
                onClick={() => handleSelect(preset.hue)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all text-sm hover:opacity-80"
                style={{
                  background: activeHue === preset.hue ? 'var(--surface)' : 'transparent',
                  color: 'var(--text)',
                }}
              >
                <span
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ background: `hsl(${preset.hue}, 82%, 60%)` }}
                />
                {preset.label}
                {activeHue === preset.hue && (
                  <span className="ml-auto text-xs" style={{ color: `hsl(${preset.hue}, 82%, 60%)` }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
