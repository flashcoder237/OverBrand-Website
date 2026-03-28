'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Plus, Loader2, CheckCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Non commencé' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'review',      label: 'En révision' },
  { value: 'completed',   label: 'Terminé' },
]

type Project = {
  id: string
  title: string
  description: string | null
  status: string
  progress: number
  start_date: string | null
  deadline: string | null
}

type Update = {
  id: string
  title: string
  description: string | null
  created_at: string
}

export default function AdminProjetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const locale = useLocale()
  const router = useRouter()
  const supabase = createClient()

  const [project, setProject] = useState<Project | null>(null)
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '' })
  const [addingUpdate, setAddingUpdate] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: proj }, { data: upds }] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).single(),
        supabase.from('project_updates').select('*').eq('project_id', id).order('created_at', { ascending: false }),
      ])
      setProject(proj)
      setUpdates(upds ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSave() {
    if (!project) return
    setSaving(true)
    await supabase.from('projects').update({
      title: project.title,
      description: project.description,
      status: project.status,
      progress: project.progress,
      start_date: project.start_date || null,
      deadline: project.deadline || null,
    }).eq('id', id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleAddUpdate() {
    if (!newUpdate.title.trim()) return
    setAddingUpdate(true)
    const { data: upd } = await supabase.from('project_updates').insert({
      project_id: id,
      title: newUpdate.title,
      description: newUpdate.description || null,
    }).select().single()
    if (upd) setUpdates((prev) => [upd, ...prev])
    setNewUpdate({ title: '', description: '' })
    setAddingUpdate(false)
  }

  async function handleDeleteUpdate(updateId: string) {
    await supabase.from('project_updates').delete().eq('id', updateId)
    setUpdates((prev) => prev.filter((u) => u.id !== updateId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
        Projet introuvable.{' '}
        <Link href={`/${locale}/admin/projets`} style={{ color: 'var(--primary)' }}>Retour</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href={`/${locale}/admin/projets`}
        className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={14} />
        Retour aux projets
      </Link>

      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--text)', lineHeight: 1 }}>
          ÉDITER LE PROJET
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
            Informations
          </h2>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Titre</label>
            <input
              type="text"
              className="input"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
            <textarea
              className="input resize-none h-24"
              value={project.description ?? ''}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Statut</label>
            <select
              className="input"
              value={project.status}
              onChange={(e) => setProject({ ...project, status: e.target.value })}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Progression — {project.progress}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={project.progress}
              onChange={(e) => setProject({ ...project, progress: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
            <div className="w-full h-1.5 rounded-full mt-2" style={{ background: 'var(--border)' }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${project.progress}%`, background: 'var(--primary)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Date de début</label>
              <input
                type="date"
                className="input"
                value={project.start_date ?? ''}
                onChange={(e) => setProject({ ...project, start_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Échéance</label>
              <input
                type="date"
                className="input"
                value={project.deadline ?? ''}
                onChange={(e) => setProject({ ...project, deadline: e.target.value })}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 rounded-xl mt-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saved ? (
              <>
                <CheckCircle size={14} />
                Enregistré
              </>
            ) : saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

        {/* Mises à jour */}
        <div className="card p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
            Ajouter une mise à jour
          </h2>

          <div className="space-y-3 mb-4">
            <input
              type="text"
              className="input"
              placeholder="Titre de la mise à jour"
              value={newUpdate.title}
              onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
            />
            <textarea
              className="input resize-none h-20"
              placeholder="Description (optionnelle)"
              value={newUpdate.description}
              onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
            />
            <button
              onClick={handleAddUpdate}
              disabled={addingUpdate || !newUpdate.title.trim()}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 rounded-xl"
            >
              {addingUpdate ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Publier
            </button>
          </div>

          {/* Timeline */}
          <div className="space-y-3 mt-6">
            {updates.map((u) => (
              <div
                key={u.id}
                className="flex gap-3 p-3 rounded-xl group"
                style={{ background: 'var(--surface)' }}
              >
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--primary)' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{u.title}</div>
                  {u.description && (
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{u.description}</div>
                  )}
                  <div className="text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>
                    {new Date(u.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteUpdate(u.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {!updates.length && (
              <p className="text-xs text-center py-4" style={{ color: 'var(--text-subtle)' }}>
                Aucune mise à jour publiée
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
