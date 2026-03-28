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
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <ColorProvider>{children}</ColorProvider>
    </NextThemesProvider>
  )
}

export function applyColor(hue: number) {
  document.documentElement.style.setProperty('--hue', String(hue))
  localStorage.setItem('ob-hue', String(hue))
}
