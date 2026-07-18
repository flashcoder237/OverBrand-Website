'use client'

import { useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'

// Extracted from the Insights page: the form needs an event handler, which a
// Server Component cannot pass down.
export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <form
      className="md:col-span-5 flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (!email) return
        setDone(true)
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="adresse@email.com"
        aria-label="Adresse e-mail"
        className="bg-transparent border-b-2 pb-4 text-xl outline-none"
        style={{ borderColor: 'rgba(244,244,240,0.3)', color: 'var(--paper)' }}
      />
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(244,244,240,0.4)' }}>
          {done ? 'Inscription enregistrée' : 'Une édition par semaine'}
        </span>
        <button
          type="submit"
          disabled={done}
          className="font-display text-xl uppercase tracking-wider flex items-center gap-2 disabled:opacity-60"
        >
          {done ? (<>Merci <Check size={20} /></>) : (<>S&apos;abonner <ArrowUpRight size={20} /></>)}
        </button>
      </div>
    </form>
  )
}
