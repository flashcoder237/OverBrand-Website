'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect } from 'react'
import { COLOR_PRESETS } from '@/lib/utils'

function ColorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedHue = localStorage.getItem('ob-hue')
    if (savedHue) {
      document.documentElement.style.setProperty('--hue', savedHue)
    }
  }, [])

  return <>{children}</>
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    // Light is the default: the editorial design is paper-first, and the dark
    // variant is an opt-in. `enableSystem` is off deliberately — with it on, a
    // visitor whose OS is in dark mode would land on the dark theme regardless
    // of `defaultTheme`. The toggle still works and the choice is persisted.
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ColorProvider>{children}</ColorProvider>
    </NextThemesProvider>
  )
}

export function applyColor(hue: number) {
  document.documentElement.style.setProperty('--hue', String(hue))
  localStorage.setItem('ob-hue', String(hue))
}
