'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: '', email: '', company: '', phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
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
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
        <div className="card p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <CheckCircle size={32} style={{ color: '#22c55e' }} />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text)' }}>Inscription réussie!</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Un email de confirmation a été envoyé à <strong>{form.email}</strong>.
            Vérifiez votre boîte mail pour activer votre compte.
          </p>
          <Link href="/auth/login">
            <button className="btn-primary w-full py-3 rounded-xl">Aller à la connexion</button>
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
        <Link href="/" className="flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} />
          Retour au site
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

          <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text)' }}>Créer un compte</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            Accédez à votre espace client et suivez vos projets en temps réel.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nom complet *</label>
                <input type="text" className="input" placeholder="Jean Dupont" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Entreprise</label>
                <input type="text" className="input" placeholder="Mon Entreprise" value={form.company} onChange={(e) => update('company', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email *</label>
              <input type="email" className="input" placeholder="vous@exemple.com" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Téléphone</label>
              <input type="tel" className="input" placeholder="+33 6 00 00 00 00" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Mot de passe *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="input pr-10" placeholder="8 caractères minimum" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70" style={{ color: 'var(--text-subtle)' }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 rounded-xl mt-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Déjà un compte?{' '}
            <Link href="/auth/login" className="font-semibold hover:opacity-70" style={{ color: 'var(--primary)' }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
