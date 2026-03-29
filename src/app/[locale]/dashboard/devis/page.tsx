'use client'

import { useState } from 'react'
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLocale } from 'next-intl'
import { SERVICES } from '@/lib/utils'

const BUDGETS = [
  '< 500 000 FCFA',
  '500 000 – 1 000 000 FCFA',
  '1 000 000 – 3 000 000 FCFA',
  '3 000 000 – 5 000 000 FCFA',
  '> 5 000 000 FCFA',
  'À définir ensemble',
]

export default function DevisPage() {
  const locale = useLocale()
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [form, setForm] = useState({ description: '', budget: '', deadline: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedServices.length === 0) {
      setError('Veuillez sélectionner au moins un service.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Non connecté.'); setLoading(false); return }

    const { error: dbError } = await supabase.from('quotes').insert({
      user_id: user.id,
      services: selectedServices,
      description: form.description,
      budget: form.budget,
      deadline: form.deadline || null,
      status: 'pending',
    })

    if (dbError) {
      console.error('[devis] insert error:', dbError)
      setError(`Erreur: ${dbError.message}`)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(34,197,94,0.1)' }}>
          <CheckCircle size={40} style={{ color: '#22c55e' }} />
        </div>
        <h2 className="text-2xl font-black mb-3" style={{ color: 'var(--text)' }}>Devis soumis avec succès!</h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
          Nous avons bien reçu votre demande. Notre équipe vous contactera dans les <strong>24 heures</strong> pour discuter de votre projet.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href={`/${locale}/dashboard`}>
            <button className="btn-outline px-6 py-3 rounded-xl text-sm">Tableau de bord</button>
          </Link>
          <button onClick={() => { setSuccess(false); setSelectedServices([]); setForm({ description: '', budget: '', deadline: '' }) }} className="btn-primary px-6 py-3 rounded-xl text-sm">
            Nouveau devis
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 text-sm mb-4 hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Retour
        </Link>
        <h1 className="text-2xl md:text-3xl font-black mb-2" style={{ color: 'var(--text)' }}>Demande de devis</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Décrivez votre projet et nous vous préparerons un devis personnalisé sous 24h.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Services */}
        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black" style={{ background: 'var(--primary)', color: 'white' }}>1</div>
            <div>
              <h2 className="font-bold" style={{ color: 'var(--text)' }}>Choisissez vos services</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sélectionnez un ou plusieurs services</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICES.map((service) => {
              const selected = selectedServices.includes(service.id)
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className="flex items-start gap-3 p-4 rounded-xl text-left transition-all"
                  style={{
                    background: selected ? 'var(--primary-glow)' : 'var(--surface)',
                    border: `1.5px solid ${selected ? 'var(--primary)' : 'transparent'}`,
                  }}
                >
                  <span className="text-xl">{service.icon}</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: selected ? 'var(--primary)' : 'var(--text)' }}>
                      {service.title}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {service.description.slice(0, 50)}...
                    </div>
                  </div>
                  {selected && (
                    <CheckCircle size={18} className="ml-auto flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Description */}
        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black" style={{ background: 'var(--primary)', color: 'white' }}>2</div>
            <div>
              <h2 className="font-bold" style={{ color: 'var(--text)' }}>Décrivez votre projet</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Plus de détails = un devis plus précis</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Description du projet *
              </label>
              <textarea
                className="input resize-none"
                rows={5}
                placeholder="Décrivez votre projet, vos objectifs, votre cible, vos préférences de design..."
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Budget estimé</label>
                <select
                  className="input"
                  value={form.budget}
                  onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Sélectionner un budget</option>
                  {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Date limite souhaitée</label>
                <input
                  type="date"
                  className="input"
                  value={form.deadline}
                  onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2 rounded-xl text-base font-bold"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Envoi en cours...' : 'Soumettre ma demande de devis'}
        </button>
      </form>
    </div>
  )
}
