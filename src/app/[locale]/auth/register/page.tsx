'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations, useLocale } from 'next-intl'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const [form, setForm] = useState({ fullName: '', email: '', company: '', phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          company: form.company,
          phone: form.phone,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user && !data.session) {
      setSuccess(true)
    } else {
      router.push(`/${locale}/dashboard`)
      router.refresh()
    }
    setLoading(false)
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError('')
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback`,
      },
    })
    if (oauthError) {
      setError(oauthError.message)
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
        <div className="card p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <CheckCircle size={32} style={{ color: '#22c55e' }} />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text)' }}>{t('success_title')}</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {t('success_text')} <strong>{form.email}</strong>. {t('success_check')}
          </p>
          <Link href={`/${locale}/auth/login`}>
            <button className="btn-primary w-full py-3 rounded-xl">{t('go_to_login')}</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[100px] opacity-10 pointer-events-none" style={{ background: 'var(--primary)' }} />

      <div className="relative w-full max-w-md">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} />
          {t('back')}
        </Link>

        <div className="card p-8 md:p-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="text-xl font-bold">
              <span style={{ color: 'var(--text)' }}>Over</span>
              <span className="text-gradient">Brand</span>
            </span>
          </div>

          <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text)' }}>{t('register_title')}</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>{t('register_subtitle')}</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-opacity hover:opacity-80 disabled:opacity-50 mb-6"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? t('google_loading') : t('google_button')}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{t('or_continue_with')}</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('full_name')} *</label>
                <input type="text" className="input" placeholder={t('full_name_placeholder')} value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('company')}</label>
                <input type="text" className="input" placeholder={t('company_placeholder')} value={form.company} onChange={(e) => update('company', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('email')} *</label>
              <input type="email" className="input" placeholder={t('email_placeholder')} value={form.email} onChange={(e) => update('email', e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('phone')}</label>
              <input type="tel" className="input" placeholder={t('phone_placeholder')} value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('password')} *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="input pr-10" placeholder={t('password_min')} value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70" style={{ color: 'var(--text-subtle)' }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 rounded-xl mt-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? t('register_loading') : t('register_button')}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            {t('have_account')}{' '}
            <Link href={`/${locale}/auth/login`} className="font-semibold hover:opacity-70" style={{ color: 'var(--primary)' }}>
              {t('sign_in')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
