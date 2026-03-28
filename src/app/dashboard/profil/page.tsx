'use client'

import { useState, useEffect } from 'react'
import { Loader2, Save, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilPage() {
  const [form, setForm] = useState({ full_name: '', company: '', phone: '' })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email ?? '')
        setForm({
          full_name: user.user_metadata?.full_name ?? '',
          company: user.user_metadata?.company ?? '',
          phone: user.user_metadata?.phone ?? '',
        })
      }
      setFetching(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.updateUser({ data: form })
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black mb-2" style={{ color: 'var(--text)' }}>Mon profil</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Gérez vos informations personnelles.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nom complet</label>
            <input type="text" className="input" value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Entreprise</label>
            <input type="text" className="input" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
          <input type="email" className="input opacity-60" value={email} disabled />
          <p className="text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>L&apos;email ne peut pas être modifié.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Téléphone</label>
          <input type="tel" className="input" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+00 00 00 00 00" />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold">
            {loading ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {loading ? 'Sauvegarde...' : saved ? 'Sauvegardé!' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  )
}
