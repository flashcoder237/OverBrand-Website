'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Eye, EyeOff, Loader2, Upload, ImageIcon, X, Play, Pencil, ChevronLeft } from 'lucide-react'
import Image from 'next/image'

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
  image_url: string | null
  image_position: string | null
  image_urls: string[] | null
  tags: string[] | null
  client: string | null
  year: string | null
  link_url: string | null
  video_url: string | null
  long_description: string | null
}

const POSITION_OPTIONS = [
  ['top left', 'top center', 'top right'],
  ['center left', 'center', 'center right'],
  ['bottom left', 'bottom center', 'bottom right'],
]

const SIZE_OPTIONS = [
  { value: 'large',  label: 'Large (2 colonnes)' },
  { value: 'medium', label: 'Medium' },
  { value: 'small',  label: 'Small' },
]

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #0d2240 0%, #2855a0 50%, #3a6fd8 100%)',
  'linear-gradient(135deg, #1a3a6b 0%, #6b9fd4 100%)',
  'linear-gradient(160deg, #2855a0 0%, #0d2240 100%)',
  'linear-gradient(135deg, #3a6fd8 0%, #1a3a6b 100%)',
  'linear-gradient(135deg, #6b9fd4 0%, #0d2240 100%)',
  'linear-gradient(135deg, #0d2240 0%, #6b9fd4 100%)',
]

const EMPTY_FORM = {
  title: '',
  category: '',
  description: '',
  gradient: GRADIENT_PRESETS[0],
  accent: '#3a6fd8',
  size: 'medium',
  image_position: 'center',
  long_description: '',
  client: '',
  year: '',
  link_url: '',
  video_url: '',
  tags: '',
}

type FormData = typeof EMPTY_FORM

function formFromProject(p: ShowcaseProject): FormData {
  return {
    title: p.title,
    category: p.category,
    description: p.description ?? '',
    gradient: p.gradient,
    accent: p.accent,
    size: p.size,
    image_position: p.image_position ?? 'center',
    long_description: p.long_description ?? '',
    client: p.client ?? '',
    year: p.year ?? '',
    link_url: p.link_url ?? '',
    video_url: p.video_url ?? '',
    tags: p.tags?.join(', ') ?? '',
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
        {label}{hint && <span className="ml-1 font-normal" style={{ color: 'var(--text-subtle)' }}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminVitrineePage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<ShowcaseProject[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // mode: 'list' | 'add' | 'edit'
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [editTarget, setEditTarget] = useState<ShowcaseProject | null>(null)
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM })

  // Image state (shared between add/edit)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([])
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const additionalInputRef = useRef<HTMLInputElement>(null)

  // Inline visibility toggle saving
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('showcase_projects')
      .select('*')
      .order('display_order', { ascending: true })
    setProjects(data ?? [])
    setLoading(false)
  }

  function openAdd() {
    setForm({ ...EMPTY_FORM })
    setImageFile(null)
    setImagePreview(null)
    setAdditionalFiles([])
    setAdditionalPreviews([])
    setEditTarget(null)
    setError(null)
    setMode('add')
  }

  function openEdit(project: ShowcaseProject) {
    setForm(formFromProject(project))
    setImageFile(null)
    setImagePreview(project.image_url ?? null)
    setAdditionalFiles([])
    setAdditionalPreviews(project.image_urls ?? [])
    setEditTarget(project)
    setError(null)
    setMode('edit')
  }

  function closeForm() {
    setMode('list')
    setEditTarget(null)
    setError(null)
  }

  function handleFileChange(file: File | null) {
    if (!file) { setImageFile(null); setImagePreview(null); return }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleAdditionalFiles(files: FileList | null) {
    if (!files) return
    const newFiles = Array.from(files)
    setAdditionalFiles(prev => [...prev, ...newFiles])
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => setAdditionalPreviews(prev => [...prev, e.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  function removeAdditional(index: number) {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index))
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const filename = `showcase/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('media').upload(filename, file, { contentType: file.type, upsert: false })
    if (error) { console.error('Upload error:', error); return null }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filename)
    return publicUrl
  }

  async function deleteOldImage(url: string | null) {
    if (!url) return
    try {
      const pathParts = new URL(url).pathname.split('/object/public/media/')
      if (pathParts[1]) await supabase.storage.from('media').remove([pathParts[1]])
    } catch {}
  }

  function buildPayload(existingImageUrl?: string | null, existingImageUrls?: string[] | null) {
    const tagsArray = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    return {
      title: form.title,
      category: form.category,
      description: form.description || null,
      gradient: form.gradient,
      accent: form.accent,
      size: form.size,
      image_position: form.image_position,
      long_description: form.long_description || null,
      client: form.client || null,
      year: form.year || null,
      link_url: form.link_url || null,
      video_url: form.video_url || null,
      tags: tagsArray,
      image_url: existingImageUrl ?? null,
      image_urls: existingImageUrls ?? [],
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      // Upload new main image if changed
      let finalImageUrl = editTarget?.image_url ?? null
      if (imageFile) {
        if (editTarget?.image_url) await deleteOldImage(editTarget.image_url)
        finalImageUrl = await uploadImage(imageFile)
      } else if (mode === 'add') {
        finalImageUrl = null
      }

      // Upload new additional images (existing ones kept by URL in additionalPreviews for edit)
      const existingUrls = mode === 'edit'
        ? additionalPreviews.filter(p => p.startsWith('http'))
        : []
      const newAdditional: string[] = []
      for (const file of additionalFiles) {
        const url = await uploadImage(file)
        if (url) newAdditional.push(url)
      }
      const finalImageUrls = [...existingUrls, ...newAdditional]

      const payload = buildPayload(finalImageUrl, finalImageUrls)

      if (mode === 'add') {
        const { data, error: insertError } = await supabase
          .from('showcase_projects')
          .insert({ ...payload, display_order: projects.length + 1, visible: true })
          .select()
          .single()

        if (insertError) {
          // Retry without video_url in case column doesn't exist yet
          if (insertError.message?.includes('video_url')) {
            const { video_url, ...payloadWithoutVideo } = payload
            const { data: data2, error: err2 } = await supabase
              .from('showcase_projects')
              .insert({ ...payloadWithoutVideo, display_order: projects.length + 1, visible: true })
              .select()
              .single()
            if (err2) throw new Error(err2.message)
            if (data2) setProjects(prev => [...prev, data2])
          } else {
            throw new Error(insertError.message)
          }
        } else {
          if (data) setProjects(prev => [...prev, data])
        }
      } else if (mode === 'edit' && editTarget) {
        const { error: updateError } = await supabase
          .from('showcase_projects')
          .update(payload)
          .eq('id', editTarget.id)

        if (updateError) {
          if (updateError.message?.includes('video_url')) {
            const { video_url, ...payloadWithoutVideo } = payload
            const { error: err2 } = await supabase
              .from('showcase_projects')
              .update(payloadWithoutVideo)
              .eq('id', editTarget.id)
            if (err2) throw new Error(err2.message)
          } else {
            throw new Error(updateError.message)
          }
        }
        setProjects(prev => prev.map(p => p.id === editTarget.id
          ? { ...p, ...payload }
          : p
        ))
      }

      closeForm()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  async function toggleVisible(project: ShowcaseProject) {
    setTogglingId(project.id)
    await supabase.from('showcase_projects').update({ visible: !project.visible }).eq('id', project.id)
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, visible: !p.visible } : p))
    setTogglingId(null)
  }

  async function deleteProject(id: string) {
    if (!confirm('Supprimer ce projet ?')) return
    const project = projects.find(p => p.id === id)
    await deleteOldImage(project?.image_url ?? null)
    await supabase.from('showcase_projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  // ── Form (add or edit) ────────────────────────────────────────────────────
  if (mode === 'add' || mode === 'edit') {
    const isEdit = mode === 'edit'
    return (
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={closeForm}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronLeft size={14} /> Retour
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--text)', lineHeight: 1 }}>
            {isEdit ? 'MODIFIER' : 'AJOUTER'} UN PROJET
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4 p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--text-subtle)' }}>
                Informations principales
              </p>
            </div>

            <Field label="Titre *">
              <input className="input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Catégorie *">
              <input className="input" required placeholder="Branding, Site Web…" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </Field>
            <div className="col-span-2">
              <Field label="Description courte">
                <textarea className="input resize-none h-16" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Description longue" hint="(page détail)">
                <textarea className="input resize-none h-28" value={form.long_description} onChange={e => setForm({ ...form, long_description: e.target.value })} />
              </Field>
            </div>
            <Field label="Client">
              <input className="input" placeholder="Nom du client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
            </Field>
            <Field label="Année">
              <input className="input" placeholder="2024" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            </Field>
            <Field label="URL du projet" hint="(lien externe)">
              <input className="input" placeholder="https://..." value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} />
            </Field>
            <Field label="Vidéo" hint="(YouTube, Vimeo ou .mp4)">
              <input className="input" placeholder="https://youtube.com/watch?v=..." value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} />
            </Field>
            <div className="col-span-2">
              <Field label="Tags" hint="(séparés par des virgules)">
                <input className="input" placeholder="Branding, UI/UX, Motion" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              </Field>
            </div>
            <Field label="Taille">
              <select className="input" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}>
                {SIZE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Couleur accent">
              <div className="flex items-center gap-2">
                <input type="color" value={form.accent} onChange={e => setForm({ ...form, accent: e.target.value })} className="w-10 h-10 cursor-pointer border-0" style={{ background: 'none' }} />
                <input className="input flex-1 font-mono text-xs" value={form.accent} onChange={e => setForm({ ...form, accent: e.target.value })} />
              </div>
            </Field>
          </div>

          {/* Images */}
          <div className="p-6 space-y-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-subtle)' }}>
              Visuels
            </p>

            {/* Main image */}
            <Field label="Image principale" hint="(remplace le gradient)">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e.target.files?.[0] ?? null)} />
              {imagePreview ? (
                <div className="relative w-full h-44">
                  <Image src={imagePreview} alt="Aperçu" fill className="object-cover" style={{ border: '1px solid var(--border)' }} />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center"
                    style={{ background: '#ef444490', color: 'white' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-28 flex flex-col items-center justify-center gap-2 transition-all hover:opacity-80"
                  style={{ border: '2px dashed var(--border)', background: 'var(--surface)', color: 'var(--text-subtle)' }}
                >
                  <Upload size={18} />
                  <span className="text-xs">Cliquez pour uploader une image</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-subtle)' }}>JPG, PNG, WebP</span>
                </button>
              )}
            </Field>

            {/* Position picker */}
            {imagePreview && (
              <Field label="Cadrage">
                <div className="flex items-center gap-4">
                  <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(3, 28px)' }}>
                    {POSITION_OPTIONS.flat().map(pos => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setForm({ ...form, image_position: pos })}
                        className="w-7 h-7 transition-all"
                        style={{
                          background: form.image_position === pos ? 'var(--primary)' : 'var(--surface)',
                          border: `1px solid ${form.image_position === pos ? 'var(--primary)' : 'var(--border)'}`,
                        }}
                        title={pos}
                      />
                    ))}
                  </div>
                  <div className="relative flex-1 h-20 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <Image src={imagePreview} alt="preview" fill className="object-cover" style={{ objectPosition: form.image_position }} />
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{form.image_position}</span>
                </div>
              </Field>
            )}

            {/* Additional images */}
            <Field label="Images supplémentaires" hint="(galerie page détail)">
              <input ref={additionalInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleAdditionalFiles(e.target.files)} />
              {additionalPreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {additionalPreviews.map((src, i) => (
                    <div key={i} className="relative w-20 h-14">
                      <Image src={src} alt={`extra-${i}`} fill className="object-cover" style={{ border: '1px solid var(--border)' }} />
                      <button
                        type="button"
                        onClick={() => removeAdditional(i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center"
                        style={{ background: '#ef444490', color: 'white' }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => additionalInputRef.current?.click()}
                className="w-full h-14 flex items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{ border: '2px dashed var(--border)', background: 'var(--surface)', color: 'var(--text-subtle)' }}
              >
                <Upload size={14} />
                <span className="text-xs">Ajouter des images (sélection multiple possible)</span>
              </button>
            </Field>

            {/* Gradient */}
            <Field label="Gradient de fond" hint="(affiché si pas d'image)">
              <div className="flex gap-2 flex-wrap">
                {GRADIENT_PRESETS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gradient: g })}
                    className="w-10 h-10 transition-transform hover:scale-110"
                    style={{
                      background: g,
                      outline: form.gradient === g ? '2px solid var(--primary)' : '2px solid transparent',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </Field>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 text-xs" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
              {error.includes('video_url')
                ? '⚠ La colonne "video_url" n\'existe pas encore dans la base. Le projet a été enregistré sans la vidéo. Ajoutez la colonne dans Supabase pour activer cette fonctionnalité.'
                : `Erreur : ${error}`}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 justify-end pb-10">
            <button type="button" onClick={closeForm} className="btn-outline px-6 py-2.5 text-xs">
              Annuler
            </button>
            <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5 text-xs flex items-center gap-2">
              {saving && <Loader2 size={12} className="animate-spin" />}
              {isEdit ? 'Enregistrer les modifications' : 'Ajouter le projet'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // ── List ──────────────────────────────────────────────────────────────────
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
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-xs">
          <Plus size={14} /> Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {projects.map(project => (
          <div
            key={project.id}
            className="p-4 flex items-center gap-4"
            style={{ opacity: project.visible ? 1 : 0.55, background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
          >
            {/* Thumbnail */}
            <div className="w-20 h-14 flex-shrink-0 relative overflow-hidden" style={{ background: project.gradient }}>
              {project.image_url && (
                <Image src={project.image_url} alt={project.title} fill className="object-cover" style={{ objectPosition: project.image_position ?? 'center' }} />
              )}
              {!project.image_url && (
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '8px 8px' }}
                />
              )}
              {project.video_url && (
                <div className="absolute bottom-1 right-1 flex items-center justify-center w-5 h-5"
                  style={{ background: 'rgba(0,0,0,0.6)', borderRadius: '50%' }}>
                  <Play size={8} fill="white" style={{ color: 'white' }} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{project.title}</div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
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
                {project.image_url
                  ? <span className="text-xs flex items-center gap-1" style={{ color: '#22c55e' }}><ImageIcon size={9} /> Image</span>
                  : <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>Gradient</span>
                }
                {project.video_url && (
                  <span className="text-xs flex items-center gap-1" style={{ color: '#a78bfa' }}>
                    <Play size={9} fill="currentColor" /> Vidéo
                  </span>
                )}
                {project.client && <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{project.client}</span>}
                {project.year && <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{project.year}</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Edit full */}
              <button
                onClick={() => openEdit(project)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-bold uppercase tracking-widest transition-all hover:opacity-80"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                title="Modifier le projet"
              >
                <Pencil size={12} /> Éditer
              </button>

              {/* Toggle visible */}
              <button
                onClick={() => toggleVisible(project)}
                disabled={togglingId === project.id}
                className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: 'var(--surface)', color: project.visible ? 'var(--primary)' : 'var(--text-subtle)', border: '1px solid var(--border)' }}
                title={project.visible ? 'Masquer' : 'Afficher'}
              >
                {togglingId === project.id
                  ? <Loader2 size={13} className="animate-spin" />
                  : project.visible ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteProject(project.id)}
                className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444430' }}
                title="Supprimer"
              >
                <Trash2 size={13} />
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
