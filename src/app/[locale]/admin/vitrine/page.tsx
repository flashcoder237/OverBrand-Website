'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, GripVertical, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'

type ShowcaseProject = {
  id: string
  title: string
  category: string
  description: string | null
  gradient: string
  accent: string
  size: string
  display_order: number
  visible: boolean
}

const SIZE_OPTIONS = [
  { value: 'large', label: 'Large (2 colonnes)' },
  { value: 'medium', label: 'Medium' },
  { value: 'small', label: 'Small' },
]

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #0d2240 0%, #2855a0 50%, #3a6fd8 100%)',
  'linear-gradient(135deg, #1a3a6b 0%, #6b9fd4 100%)',
  'linear-gradient(160deg, #2855a0 0%, #0d2240 100%)',
  'linear-gradient(135deg, #3a6fd8 0%, #1a3a6b 100%)',
  'linear-gradient(135deg, #6b9fd4 0%, #0d2240 100%)',
  'linear-gradient(135deg, #0d2240 0%, #6b9fd4 100%)',
]

export default function AdminVitrineePage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<ShowcaseProject[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    gradient: GRADIENT_PRESETS[0],
    accent: '#3a6fd8',
    size: 'medium',
  })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from('showcase_projects')
      .select('*')
      .order('display_order', { ascending: true })
    setProjects(data ?? [])
    setLoading(false)
  }

  async function toggleVisible(project: ShowcaseProject) {
    setSaving(project.id)
    await supabase.from('showcase_projects').update({ visible: !project.visible }).eq('id', project.id)
    setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, visible: !p.visible } : p))
    setSaving(null)
  }

  async function deleteProject(id: string) {
    await supabase.from('showcase_projects').delete().eq('id', id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const nextOrder = projects.length + 1
    const { data } = await supabase.from('showcase_projects').insert({
      ...form,
      display_order: nextOrder,
      visible: true,
    }).select().single()
    if (data) setProjects((prev) => [...prev, data])
    setForm({ title: '', category: '', description: '', gradient: GRADIENT_PRESETS[0], accent: '#3a6fd8', size: 'medium' })
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--text)', lineHeight: 1 }}>
            VITRINE
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Projets affichés sur la page d&apos;accueil
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-xs rounded-xl"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card p-6 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Titre *</label>
            <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Catégorie *</label>
            <input className="input" required placeholder="Branding, Site Web…" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
            <textarea className="input resize-none h-16" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Taille</label>
            <select className="input" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
              {SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Couleur accent</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0" style={{ background: 'none' }} />
              <input className="input flex-1" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Gradient de fond</label>
            <div className="flex gap-2 flex-wrap">
              {GRADIENT_PRESETS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm({ ...form, gradient: g })}
                  className="w-10 h-10 rounded-lg transition-transform hover:scale-110"
                  style={{
                    background: g,
                    outline: form.gradient === g ? '2px solid var(--primary)' : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-5 py-2 text-xs rounded-xl">Annuler</button>
            <button type="submit" className="btn-primary px-5 py-2 text-xs rounded-xl">Ajouter le projet</button>
          </div>
        </form>
      )}

      {/* Projects list */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card p-4 flex items-center gap-4"
            style={{ opacity: project.visible ? 1 : 0.5 }}
          >
            {/* Preview */}
            <div
              className="w-16 h-12 rounded-lg flex-shrink-0"
              style={{ background: project.gradient }}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{project.title}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-xs px-2 py-0.5 font-medium"
                  style={{
                    background: `${project.accent}20`,
                    color: project.accent,
                    clipPath: 'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)',
                  }}
                >
                  {project.category}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{project.size}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisible(project)}
                disabled={saving === project.id}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:opacity-80"
                style={{ background: 'var(--surface)', color: project.visible ? 'var(--primary)' : 'var(--text-subtle)' }}
                title={project.visible ? 'Masquer' : 'Afficher'}
              >
                {saving === project.id ? <Loader2 size={14} className="animate-spin" /> : project.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:opacity-80"
                style={{ background: '#ef444418', color: '#ef4444' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {!projects.length && (
          <div className="text-center py-16" style={{ color: 'var(--text-subtle)' }}>
            Aucun projet vitrine — cliquez sur Ajouter.
          </div>
        )}
      </div>
    </div>
  )
}
