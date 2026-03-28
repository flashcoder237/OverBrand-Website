'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, User, Mail, Phone, MessageSquare, Building } from 'lucide-react'
import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'

type FormState = 'idle' | 'sending' | 'success' | 'error'

type FieldName = 'name' | 'email' | 'phone' | 'company' | 'message' | 'budget'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  message: string
  budget: string
}

const BUDGETS = ['< 1 000€', '1 000 – 3 000€', '3 000 – 8 000€', '8 000 – 20 000€', '> 20 000€']

function FloatingInput({
  name,
  label,
  type = 'text',
  icon: Icon,
  value,
  onChange,
  error,
  required,
  multiline,
}: {
  name: FieldName
  label: string
  type?: string
  icon: React.ElementType
  value: string
  onChange: (v: string) => void
  error?: string
  required?: boolean
  multiline?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  const inputClass = `w-full bg-transparent outline-none text-sm pt-6 pb-2 px-4 transition-all`
  const style = { color: 'var(--text)', fontFamily: 'var(--font-sans)' }

  return (
    <div className="relative group">
      <div
        className="relative overflow-hidden transition-all duration-300"
        style={{
          background: 'var(--surface)',
          border: `1px solid ${error ? '#ef4444' : focused ? 'var(--primary)' : 'var(--border)'}`,
          boxShadow: focused ? `0 0 0 3px var(--primary-glow)` : 'none',
        }}
      >
        {/* Animated accent line at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px]"
          style={{ background: 'var(--primary)' }}
          animate={{ width: focused ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ marginTop: multiline ? '-24px' : '0' }}>
          <Icon size={15} style={{ color: focused ? 'var(--primary)' : 'var(--text-subtle)' }} className="transition-colors duration-200" />
        </div>

        {/* Floating label */}
        <motion.label
          className="absolute left-10 pointer-events-none font-medium select-none"
          animate={active ? { top: '6px', fontSize: '10px', color: 'var(--primary)' } : { top: multiline ? '14px' : '50%', translateY: active ? '0%' : '-50%', fontSize: '13px', color: 'var(--text-subtle)' }}
          transition={{ duration: 0.2 }}
          style={{ letterSpacing: '0.04em' }}
        >
          {label}{required && ' *'}
        </motion.label>

        {/* Input */}
        {multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={4}
            className={inputClass + ' resize-none pl-10'}
            style={style}
          />
        ) : (
          <input
            name={name}
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={inputClass + ' pl-10'}
            style={style}
          />
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs mt-1 ml-1"
            style={{ color: '#ef4444' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ContactSection() {
  const t = useTranslations('contact')
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', company: '', message: '', budget: '' })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [state, setState] = useState<FormState>('idle')

  const set = (field: FieldName) => (v: string) => setForm(f => ({ ...f, [field]: v }))

  function validate() {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = t('error_required')
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = t('error_email')
    if (!form.message.trim()) e.message = t('error_required')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setState('success')
        setForm({ name: '', email: '', phone: '', company: '', message: '', budget: '' })
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
            <span className="badge">{t('eyebrow')}</span>
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
          </div>
          <h2
            className="font-display leading-none mb-4"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 6rem)', color: 'var(--text)' }}
          >
            {t('title_1')} <span style={{ color: 'var(--primary)' }}>{t('title_2')}</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="card card-glass p-6">
              <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text)' }}>{t('info_title')}</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'contact@overbrand.fr' },
                  { icon: Phone, label: t('info_phone'), value: '+33 1 00 00 00 00' },
                  { icon: MessageSquare, label: t('info_response'), value: t('info_response_time') },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-glow)' }}>
                      <Icon size={16} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>{label}</div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget options visual */}
            <div className="card card-glass p-6">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-subtle)' }}>{t('budget_label')}</h4>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => set('budget')(form.budget === b ? '' : b)}
                    className="text-xs font-bold px-3 py-1.5 transition-all duration-200"
                    style={{
                      background: form.budget === b ? 'var(--primary)' : 'var(--surface-2)',
                      color: form.budget === b ? 'white' : 'var(--text-muted)',
                      border: `1px solid ${form.budget === b ? 'var(--primary)' : 'var(--border)'}`,
                      clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {state === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="card card-glass p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)' }}
                  >
                    <CheckCircle size={32} style={{ color: '#22c55e' }} />
                  </motion.div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>{t('success_title')}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('success_text')}</p>
                  <button
                    className="btn-primary mt-8 text-xs px-6 py-3"
                    onClick={() => setState('idle')}
                  >
                    {t('send_another')}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="card card-glass p-7 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FloatingInput name="name" label={t('field_name')} icon={User} value={form.name} onChange={set('name')} error={errors.name} required />
                    <FloatingInput name="email" label={t('field_email')} type="email" icon={Mail} value={form.email} onChange={set('email')} error={errors.email} required />
                    <FloatingInput name="phone" label={t('field_phone')} type="tel" icon={Phone} value={form.phone} onChange={set('phone')} />
                    <FloatingInput name="company" label={t('field_company')} icon={Building} value={form.company} onChange={set('company')} />
                  </div>
                  <FloatingInput name="message" label={t('field_message')} icon={MessageSquare} value={form.message} onChange={set('message')} error={errors.message} required multiline />

                  {state === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm p-3"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
                    >
                      <AlertCircle size={16} />
                      {t('error_send')}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={state === 'sending'}
                    className="btn-primary w-full text-xs py-4 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    data-magnetic
                  >
                    {state === 'sending' ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        {t('sending')}
                      </>
                    ) : (
                      <>
                        {t('submit')}
                        <Send size={14} />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
