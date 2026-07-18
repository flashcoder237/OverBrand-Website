'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const STORAGE_KEY = 'ob-locale-chosen'

/** Native names — a language picker should read in its own language. */
const LANGUAGES: Record<string, { native: string; english: string }> = {
  fr: { native: 'Français', english: 'French' },
  en: { native: 'English', english: 'English' },
  de: { native: 'Deutsch', english: 'German' },
}

/** Copy is duplicated per locale: the dialog appears before a choice is made. */
const COPY: Record<string, { eyebrow: string; title: string; lead: string; keep: string }> = {
  fr: {
    eyebrow: 'Bienvenue',
    title: 'Choisissez votre langue',
    lead: 'Vous pourrez en changer à tout moment depuis le menu.',
    keep: 'Continuer en français',
  },
  en: {
    eyebrow: 'Welcome',
    title: 'Choose your language',
    lead: 'You can change it at any time from the menu.',
    keep: 'Continue in English',
  },
  de: {
    eyebrow: 'Willkommen',
    title: 'Wählen Sie Ihre Sprache',
    lead: 'Sie können sie jederzeit über das Menü ändern.',
    keep: 'Auf Deutsch fortfahren',
  },
}

/**
 * One-time language chooser, shown on the first visit only.
 *
 * Rendered on the client after mount rather than server-side: the decision
 * depends on localStorage, and gating the markup on the server would either
 * flash the dialog for returning visitors or require an extra cookie round-trip.
 */
export function LanguagePicker() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true)
    } catch {
      // Private mode / storage disabled — never block the page over it.
    }
  }, [])

  // Lock background scroll while the dialog is up.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  function remember() {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  function choose(next: string) {
    remember()
    setOpen(false)
    // next-intl writes the NEXT_LOCALE cookie, so later visits skip the prefix
    // negotiation entirely.
    if (next !== locale) router.replace(pathname, { locale: next })
  }

  if (!open) return null

  const copy = COPY[locale] ?? COPY.fr

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-picker-title"
      className="fixed inset-0 z-[9998] flex items-center justify-center p-6"
      style={{ background: 'rgba(10,10,10,0.72)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-lg p-8 md:p-12"
        style={{ background: 'var(--bg)', border: '1px solid var(--line-strong)' }}
      >
        <p
          className="text-xs font-bold uppercase mb-4 flex items-center gap-3"
          style={{ color: 'var(--accent-warm)', letterSpacing: '0.28em' }}
        >
          <span className="w-8 h-px" style={{ background: 'var(--accent-warm)' }} />
          {copy.eyebrow}
        </p>

        <h2
          id="lang-picker-title"
          className="font-display uppercase leading-[0.9] tracking-tight mb-4"
          style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)' }}
        >
          {copy.title}
        </h2>

        <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
          {copy.lead}
        </p>

        <div className="flex flex-col" style={{ borderTop: '1px solid var(--line)' }}>
          {routing.locales.map((l) => {
            const lang = LANGUAGES[l] ?? { native: l.toUpperCase(), english: l }
            const active = l === locale
            return (
              <button
                key={l}
                type="button"
                onClick={() => choose(l)}
                lang={l}
                className="group flex items-center justify-between gap-4 py-4 text-left transition-colors"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <span className="flex items-baseline gap-3">
                  <span
                    className="font-mono text-xs"
                    style={{ color: active ? 'var(--accent-warm)' : 'var(--text-subtle)' }}
                  >
                    {l.toUpperCase()}
                  </span>
                  <span className="font-display text-2xl uppercase tracking-tight">
                    {lang.native}
                  </span>
                </span>
                <span
                  className="text-xl transition-transform group-hover:translate-x-1"
                  style={{ color: 'var(--accent-warm)' }}
                  aria-hidden
                >
                  →
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => choose(locale)}
          className="mt-6 text-xs uppercase tracking-widest underline underline-offset-4"
          style={{ color: 'var(--text-subtle)' }}
        >
          {copy.keep}
        </button>
      </div>
    </div>
  )
}
