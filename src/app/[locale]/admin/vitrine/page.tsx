'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Eye, EyeOff, Loader2, Upload, ImageIcon, X } from 'lucide-react'
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
  long_description: string | null
}

const POSITION_OPTIONS = [
  ['top left',    'top center',    'top right'],
  ['center left', 'center',        'center right'],
  ['bottom left', 'bottom center', 'bottom right'],
]

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
  tags: '',
}

export default function AdminVitrineePage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<ShowcaseProject[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Additional images state
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([])
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([])
  const additionalInputRef = useRef<HTMLInputElement>(null)

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const [editPosition, setEditPosition] = useState<string>('center')
  const editFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('showcase_projects')
      .select('*')
      .order('display_order', { ascending: true })
    setProjects(data ?? [])
    setLoading(false)
  }

  function handleFileChange(file: File | null, setFile: (f: File | null) => void, setPreview: (p: string | null) => void) {
    if (!file) { setFile(null); setPreview(null); return }
    setFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleAdditionalFiles(files: FileList | null) {
    if (!files) return
    const newFiles = Array.from(files)
    setAdditionalFiles((prev) => [...prev, ...newFiles])
    newFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => setAdditionalPreviews((prev) => [...prev, e.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  function removeAdditional(index: number) {
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index))
    setAdditionalPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const filename = `showcase/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('media').upload(filename, file, { contentType: file.type, upsert: false })
    if (error) { console.error('Upload error:', error); return null }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filename)
    return publicUrl
  }

  async function deleteOldImage(imageUrl: string | null) {
    if (!imageUrl) return
    try {
      const url = new URL(imageUrl)
      const pathParts = url.pathname.split('/object/public/media/')
      if (pathParts[1]) {
        await supabase.storage.from('media').remove([pathParts[1]])
      }
    } catch {}
  }

  async function toggleVisible(project: ShowcaseProject) {
    setSaving(project.id)
    await supabase.from('showcase_projects').update({ visible: !project.visible }).eq('id', project.id)
    setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, visible: !p.visible } : p))
    setSaving(null)
  }

  async function deleteProject(id: string) {
    const project = projects.find(p => p.id === id)
    await deleteOldImage(project?.image_url ?? null)
    await supabase.from('showcase_projects').delete().eq('id', id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setUploading(true)
    let image_url: string | null = null
    if (imageFile) {
      image_url = await uploadImage(imageFile)
    }
    const uploadedAdditional: string[] = []
    for (const file of additionalFiles) {
      const url = await uploadImage(file)
      if (url) uploadedAdditional.push(url)
    }
    setUploading(false)

    const tagsArray = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    const nextOrder = projects.length + 1

    const { data } = await supabase.from('showcase_projects').insert({
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
      tags: tagsArray,
      image_url,
      image_urls: uploadedAdditional,
      display_order: nextOrder,
      visible: true,
    }).select().single()
    if (data) setProjects((prev) => [...prev, data])
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
    setAdditionalFiles([])
    setAdditionalPreviews([])
    setShowForm(false)
  }

  async function startEdit(project: ShowcaseProject) {
    setEditingId(project.id)
    setEditImagePreview(project.image_url ?? null)
    setEditImageFile(null)
    setEditPosition(project.image_position ?? 'center')
  }

  async function handleEditSave(project: ShowcaseProject, position?: string) {
    setSaving(project.id)
    let image_url = project.image_url
    if (editImageFile) {
      await deleteOldImage(project.image_url)
      image_url = await uploadImage(editImageFile)
    }
    await supabase.from('showcase_projects').update({ image_url, image_position: position ?? project.image_position ?? 'center' }).eq('id', project.id)
    const pos = position ?? project.image_position ?? 'center'
    setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, image_url: image_url ?? null, image_position: pos } : p))
    setEditingId(null)
    setEditImageFile(null)
    setEditImagePreview(null)
    setSaving(null)
  }

  async function removeImage(project: ShowcaseProject) {
    setSaving(project.id)
    await deleteOldImage(project.image_url)
    await supabase.from('showcase_projects').update({ image_url: null }).eq('id', project.id)
    setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, image_url: null } : p))
    setSaving(null)
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
            Projets affich&eacute;s sur la page d&apos;accueil
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-xs"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 p-6 grid grid-cols-2 gap-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Titre *</label>
            <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Cat&eacute;gorie *</label>
            <input className="input" required placeholder="Branding, Site Web…" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description courte</label>
            <textarea className="input resize-none h-16" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description longue</label>
            <textarea className="input resize-none h-32" value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Client</label>
            <input className="input" placeholder="Nom du client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Ann&eacute;e</label>
            <input className="input" placeholder="2024" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>URL du projet</label>
            <input className="input" placeholder="https://..." value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Tags <span style={{ color: 'var(--text-subtle)' }}>(s&eacute;par&eacute;s par des virgules)</span>
            </label>
            <input className="input" placeholder="Branding, UI/UX, Motion" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
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
              <input type="color" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} className="w-10 h-10 cursor-pointer border-0" style={{ background: 'none' }} />
              <input className="input flex-1" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} />
            </div>
          </div>

          {/* Main image upload */}
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Image principale <span style={{ color: 'var(--text-subtle)' }}>(optionnel — remplace le gradient)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null, setImageFile, setImagePreview)}
            />
            {imagePreview ? (
              <div className="relative w-full h-40">
                <Image src={imagePreview} alt="Apercu" fill className="object-cover" style={{ border: '1px solid var(--border)' }} />
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
                className="w-full h-32 flex flex-col items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{ border: '2px dashed var(--border)', background: 'var(--surface)', color: 'var(--text-subtle)' }}
              >
                <Upload size={20} />
                <span className="text-xs">Cliquez pour uploader une image</span>
                <span className="text-xs" style={{ color: 'var(--text-subtle)', fontSize: '0.65rem' }}>JPG, PNG, WebP — max 5MB</span>
              </button>
            )}
          </div>

          {/* Image position */}
          {imagePreview && (
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Position du cadrage</label>
              <div className="flex items-center gap-4">
                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(3, 28px)' }}>
                  {POSITION_OPTIONS.flat().map((pos) => (
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
            </div>
          )}

          {/* Additional images */}
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Images suppl&eacute;mentaires <span style={{ color: 'var(--text-subtle)' }}>(galerie sur la page detail)</span>
            </label>
            <input
              ref={additionalInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleAdditionalFiles(e.target.files)}
            />
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
              className="w-full h-16 flex flex-col items-center justify-center gap-1 transition-all hover:opacity-80"
              style={{ border: '2px dashed var(--border)', background: 'var(--surface)', color: 'var(--text-subtle)' }}
            >
              <Upload size={16} />
              <span className="text-xs">Ajouter des images (s&eacute;lection multiple possible)</span>
            </button>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Gradient de fond (affich&eacute; si pas d&apos;image)</label>
            <div className="flex gap-2 flex-wrap">
              {GRADIENT_PRESETS.map((g) => (
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
          </div>
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-5 py-2 text-xs">Annuler</button>
            <button type="submit" disabled={uploading} className="btn-primary px-5 py-2 text-xs flex items-center gap-2">
              {uploading && <Loader2 size={12} className="animate-spin" />}
              Ajouter le projet
            </button>
          </div>
        </form>
      )}

      {/* Projects list */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 flex items-center gap-4"
            style={{ opacity: project.visible ? 1 : 0.5, background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
          >
            {/* Preview thumbnail */}
            <div className="w-20 h-14 flex-shrink-0 relative overflow-hidden" style={{ background: project.gradient }}>
              {project.image_url && (
                <Image src={project.image_url} alt={project.title} fill className="object-cover" style={{ objectPosition: project.image_position ?? 'center' }} />
              )}
              {!project.image_url && (
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '8px 8px' }}
                />
              )}
            </div>

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
                {project.image_url
                  ? <span className="text-xs flex items-center gap-1" style={{ color: '#22c55e' }}><ImageIcon size={10} /> Image</span>
                  : <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>Gradient</span>
                }
                {project.client && (
                  <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{project.client}</span>
                )}
                {project.year && (
                  <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{project.year}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Edit image inline */}
              {editingId === project.id ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null, setEditImageFile, setEditImagePreview)}
                  />
                  {editImagePreview && (
                    <div className="relative w-14 h-10">
                      <Image src={editImagePreview} alt="preview" fill className="object-cover" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 font-bold uppercase tracking-widest"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  >
                    <Upload size={12} /> Choisir
                  </button>
                  {/* Position picker inline */}
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3, 18px)' }}>
                    {POSITION_OPTIONS.flat().map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setEditPosition(pos)}
                        className="w-[18px] h-[18px] transition-all"
                        style={{
                          background: editPosition === pos ? 'var(--primary)' : 'var(--surface)',
                          border: `1px solid ${editPosition === pos ? 'var(--primary)' : 'var(--border)'}`,
                        }}
                        title={pos}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleEditSave(project, editPosition)}
                    disabled={saving === project.id}
                    className="text-xs px-3 py-1.5 font-bold uppercase tracking-widest"
                    style={{ background: 'var(--primary)', color: 'white' }}
                  >
                    {saving === project.id ? <Loader2 size={12} className="animate-spin" /> : 'OK'}
                  </button>
                  <button
                    onClick={() => { setEditingId(null); setEditImageFile(null); setEditImagePreview(null) }}
                    className="text-xs px-2 py-1.5"
                    style={{ color: 'var(--text-subtle)' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(project)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 font-bold uppercase tracking-widest transition-all hover:opacity-80"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  title="Changer l'image"
                >
                  <ImageIcon size={12} /> Image
                </button>
              )}

              {/* Remove image if has one */}
              {project.image_url && editingId !== project.id && (
                <button
                  onClick={() => removeImage(project)}
                  disabled={saving === project.id}
                  className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: '#ef444418', color: '#ef4444' }}
                  title="Supprimer l'image"
                >
                  <X size={13} />
                </button>
              )}

              <button
                onClick={() => toggleVisible(project)}
                disabled={saving === project.id}
                className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: 'var(--surface)', color: project.visible ? 'var(--primary)' : 'var(--text-subtle)' }}
                title={project.visible ? 'Masquer' : 'Afficher'}
              >
                {saving === project.id ? <Loader2 size={14} className="animate-spin" /> : project.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: '#ef444418', color: '#ef4444' }}
                title="Supprimer le projet"
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
