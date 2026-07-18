'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, CheckCircle } from 'lucide-react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const BUDGETS = ['< 2 000€', '2 000 — 5 000€', '5 000 — 15 000€', '15 000 — 50 000€', '> 50 000€']

export function ContactForm() {
  const t = useTranslations('contactForm')
  const PROJECT_TYPES = t.raw('project_types') as string[]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [budget, setBudget] = useState('')
  const [projectTypes, setProjectTypes] = useState<string[]>([])
  const [deadline, setDeadline] = useState('')
  const [message, setMessage] = useState('')
  const [gdpr, setGdpr] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const toggleType = (type: string) => {
    setProjectTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gdpr) {
      setErrorMsg('Merci d\'accepter le traitement des données (RGPD).')
      setStatus('error')
      return
    }

    setStatus('sending')
    setErrorMsg('')

    const composedMessage = [
      projectTypes.length ? `Type de projet : ${projectTypes.join(', ')}` : '',
      deadline ? `Deadline souhaitée : ${deadline}` : '',
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          company: company || undefined,
          budget: budget || undefined,
          message: composedMessage,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erreur de réseau.')
      }
      setStatus('sent')
      setName(''); setEmail(''); setCompany(''); setPhone('')
      setBudget(''); setProjectTypes([]); setDeadline(''); setMessage(''); setGdpr(false)
    } catch (e: unknown) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Erreur inconnue.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-start gap-6 reveal">
        <CheckCircle size={48} style={{ color: 'var(--accent-warm)' }} />
        <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight">
          {t('sent_title_1')} <br />{t('sent_title_2')}
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {t('sent_body')}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-ghost"
        >
          {t('sent_again')}
        </button>
      </div>
    )
  }

  const field = {
    base: 'w-full bg-transparent pb-4 pt-4 text-xl outline-none transition-all',
    border: { borderBottom: '1px solid var(--line)' } as React.CSSProperties,
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10 max-w-2xl reveal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <label className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>
            {t('label_name')}
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('ph_name')}
            className={field.base}
            style={field.border}
          />
        </label>
        <label className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>
            {t('label_email')}
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('ph_email')}
            className={field.base}
            style={field.border}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <label className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>
            {t('label_company')}
          </span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t('ph_company')}
            className={field.base}
            style={field.border}
          />
        </label>
        <label className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>
            {t('label_phone')}
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('ph_phone')}
            className={field.base}
            style={field.border}
          />
        </label>
      </div>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-subtle)' }}>
          {t('label_budget')}
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
          {BUDGETS.map((b) => (
            <label key={b} className="flex items-center gap-3 text-sm cursor-pointer">
              <input
                type="radio"
                name="budget"
                checked={budget === b}
                onChange={() => setBudget(b)}
                required
                className="sr-only peer"
              />
              <span
                className="w-5 h-5 flex items-center justify-center transition-all peer-checked:bg-[color:var(--ink)] peer-checked:border-[color:var(--ink)]"
                style={{ border: '1px solid var(--ink)' }}
              >
                <span
                  className="w-2 h-2 opacity-0 peer-checked:opacity-100"
                  style={{ background: 'var(--paper)', display: budget === b ? 'block' : 'none' }}
                />
              </span>
              {b}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-subtle)' }}>
          {t('label_types')}
        </legend>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((t) => {
            const active = projectTypes.includes(t)
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleType(t)}
                className="px-4 py-2 text-sm font-medium transition-all"
                style={{
                  border: '1px solid var(--line)',
                  background: active ? 'var(--ink)' : 'transparent',
                  color: active ? 'var(--paper)' : 'var(--text)',
                }}
              >
                {t}
              </button>
            )
          })}
        </div>
      </fieldset>

      <label className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>
          {t('label_deadline')}
        </span>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={field.base}
          style={{ ...field.border, color: 'var(--text-muted)' }}
        />
      </label>

      <label className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>
          {t('label_message')}
        </span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('ph_message')}
          className={`${field.base} resize-none`}
          style={field.border}
        />
      </label>

      <label className="flex items-start gap-3 cursor-pointer text-sm" style={{ color: 'var(--text-muted)' }}>
        <input
          type="checkbox"
          checked={gdpr}
          onChange={(e) => setGdpr(e.target.checked)}
          required
          className="mt-1"
        />
        {t('gdpr')}
      </label>

      {status === 'error' && errorMsg && (
        <p className="text-sm" style={{ color: 'var(--accent-warm)' }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-6 font-display uppercase tracking-wide flex justify-center items-center gap-3 transition-all"
        style={{
          background: 'var(--ink)',
          color: 'var(--paper)',
          fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
        }}
        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'var(--accent-warm)')}
        onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'var(--ink)')}
      >
        {status === 'sending' ? t('sending') : t('submit')}
        <ArrowUpRight size={24} />
      </button>
    </form>
  )
}
