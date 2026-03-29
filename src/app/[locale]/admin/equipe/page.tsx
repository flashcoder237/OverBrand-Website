'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Eye, EyeOff, Loader2, Upload, X, GripVertical, Pencil, Check } from 'lucide-react'
import Image from 'next/image'

type TeamMember = {
  id: string
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  photo_position: string | null
  tag: string | null
  linkedin_url: string | null
  twitter_url: string | null
  website_url: string | null
  display_order: number
  visible: boolean
}

const EMPTY_FORM = {
  name: '',
  role: '',
  bio: '',
  tag: '',
  linkedin_url: '',
  twitter_url: '',
  website_url: '',
}

const POSITION_OPTIONS = [
  ['top left',    'top center',    'top right'],
  ['center left', 'center',        'center right'],
  ['bottom left', 'bottom center', 'bottom right'],
]

export default function AdminEquipePage() {
  const supabase = createClient()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [photoPosition, setPhotoPosition] = useState<string>('center top')
  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const [editPhotoPosition, setEditPhotoPosition] = useState<string>('center top')
  const editFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
    setMembers(data ?? [])
    setLoading(false)
  }

  function handleFileChange(
    file: File | null,
    setFile: (f: File | null) => void,
    setPreview: (p: string | null) => void
  ) {
    if (!file) { setFile(null); setPreview(null); return }
    setFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function uploadPhoto(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const filename = `team/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage
      .from('media')
      .upload(filename, file, { contentType: file.type, upsert: false })
    if (error) { console.error('Upload error:', error); return null }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filename)
    return publicUrl
  }

  async function deleteOldPhoto(photoUrl: string | null) {
    if (!photoUrl) return
    try {
      const url = new URL(photoUrl)
      const pathParts = url.pathname.split('/object/public/media/')
      if (pathParts[1]) await supabase.storage.from('media').remove([pathParts[1]])
    } catch {}
  }

  async function toggleVisible(member: TeamMember) {
    setSaving(member.id)
    await supabase
      .from('team_members')
      .update({ visible: !member.visible })
      .eq('id', member.id)
    setMembers((prev) =>
      prev.map((m) => m.id === member.id ? { ...m, visible: !m.visible } : m)
    )
    setSaving(null)
  }

  async function deleteMember(id: string) {
    const member = members.find((m) => m.id === id)
    await deleteOldPhoto(member?.photo_url ?? null)
    await supabase.from('team_members').delete().eq('id', id)
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setUploading(true)
    let photo_url: string | null = null
    if (imageFile) photo_url = await uploadPhoto(imageFile)
    setUploading(false)
    const nextOrder = members.length + 1
    const { data } = await supabase
      .from('team_members')
      .insert({ ...form, photo_url, photo_position: photoPosition, display_order: nextOrder, visible: true })
      .select()
      .single()
    if (data) setMembers((prev) => [...prev, data])
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
    setPhotoPosition('center top')
    setShowForm(false)
  }

  function startEdit(member: TeamMember) {
    setEditingId(member.id)
    setEditForm({
      name: member.name,
      role: member.role,
      bio: member.bio ?? '',
      tag: member.tag ?? '',
      linkedin_url: member.linkedin_url ?? '',
      twitter_url: member.twitter_url ?? '',
      website_url: member.website_url ?? '',
    })
    setEditImagePreview(member.photo_url ?? null)
    setEditImageFile(null)
    setEditPhotoPosition(member.photo_position ?? 'center top')
  }

  async function handleEditSave(member: TeamMember) {
    setSaving(member.id)
    let photo_url = member.photo_url
    if (editImageFile) {
      await deleteOldPhoto(member.photo_url)
      photo_url = await uploadPhoto(editImageFile)
    }
    const { data } = await supabase
      .from('team_members')
      .update({ ...editForm, photo_url, photo_position: editPhotoPosition })
      .eq('id', member.id)
      .select()
      .single()
    if (data) setMembers((prev) => prev.map((m) => m.id === member.id ? data : m))
    setEditingId(null)
    setEditImageFile(null)
    setEditImagePreview(null)
    setSaving(null)
  }

  async function moveOrder(member: TeamMember, dir: -1 | 1) {
    const idx = members.findIndex((m) => m.id === member.id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= members.length) return
    const swapMember = members[swapIdx]
    const newOrder = member.display_order
    const swapOrder = swapMember.display_order
    await Promise.all([
      supabase.from('team_members').update({ display_order: swapOrder }).eq('id', member.id),
      supabase.from('team_members').update({ display_order: newOrder }).eq('id', swapMember.id),
    ])
    const newMembers = [...members]
    newMembers[idx] = { ...member, display_order: swapOrder }
    newMembers[swapIdx] = { ...swapMember, display_order: newOrder }
    newMembers.sort((a, b) => a.display_order - b.display_order)
    setMembers(newMembers)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--text)', lineHeight: 1 }}>
            ÉQUIPE
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Membres affichés sur la page /team
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null) }}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-xs"
        >
          <Plus size={14} />
          Ajouter un membre
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mb-6 p-6 grid grid-cols-2 gap-4"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
        >
          <div className="col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--primary)' }}>
              Nouveau membre
            </p>
          </div>

          {/* Photo */}
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Photo <span style={{ color: 'var(--text-subtle)' }}>(optionnel)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null, setImageFile, setImagePreview)}
            />
            {imagePreview ? (
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={imagePreview} alt="Aperçu" fill className="object-cover" style={{ objectPosition: photoPosition }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs" style={{ color: 'var(--text-subtle)' }}>Cadrage</label>
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3, 22px)' }}>
                    {POSITION_OPTIONS.flat().map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setPhotoPosition(pos)}
                        className="w-[22px] h-[22px] transition-all"
                        style={{
                          background: photoPosition === pos ? 'var(--primary)' : 'var(--surface)',
                          border: `1px solid ${photoPosition === pos ? 'var(--primary)' : 'var(--border)'}`,
                        }}
                        title={pos}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null) }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-bold uppercase tracking-widest"
                  style={{ background: '#ef444418', color: '#ef4444' }}
                >
                  <X size={12} /> Supprimer
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-20 w-full flex flex-col items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{ border: '2px dashed var(--border)', background: 'var(--surface)', color: 'var(--text-subtle)' }}
              >
                <Upload size={18} />
                <span className="text-xs">Uploader une photo</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nom *</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Rôle *</label>
            <input className="input" required placeholder="Creative Director, Lead Dev…" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Tag / Badge</label>
            <input className="input" placeholder="Fondateur, Tech, Design…" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Bio</label>
            <textarea className="input resize-none h-20" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>LinkedIn URL</label>
            <input className="input" placeholder="https://linkedin.com/in/…" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>X / Twitter URL</label>
            <input className="input" placeholder="https://x.com/…" value={form.twitter_url} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Site web URL</label>
            <input className="input" placeholder="https://…" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
          </div>

          <div className="col-span-2 flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-5 py-2 text-xs">Annuler</button>
            <button type="submit" disabled={uploading} className="btn-primary px-5 py-2 text-xs flex items-center gap-2">
              {uploading && <Loader2 size={12} className="animate-spin" />}
              Ajouter le membre
            </button>
          </div>
        </form>
      )}

      {/* Members list */}
      <div className="space-y-2">
        {members.map((member, idx) => (
          <div
            key={member.id}
            style={{
              background: 'var(--card-bg)',
              border: editingId === member.id ? '1px solid var(--primary)' : '1px solid var(--card-border)',
              opacity: member.visible ? 1 : 0.55,
            }}
          >
            {editingId === member.id ? (
              /* ── EDIT MODE ── */
              <div className="p-5 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>
                    Modifier — {member.name}
                  </p>
                </div>

                {/* Photo edit */}
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Photo</label>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null, setEditImageFile, setEditImagePreview)}
                  />
                  <div className="flex items-start gap-4">
                    {editImagePreview ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={editImagePreview} alt="Aperçu" fill className="object-cover" style={{ objectPosition: editPhotoPosition }} />
                      </div>
                    ) : (
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--accent))', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}
                      >
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    {editImagePreview && (
                      <div className="flex flex-col gap-1">
                        <label className="text-xs" style={{ color: 'var(--text-subtle)' }}>Cadrage</label>
                        <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3, 20px)' }}>
                          {POSITION_OPTIONS.flat().map((pos) => (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => setEditPhotoPosition(pos)}
                              className="w-5 h-5 transition-all"
                              style={{
                                background: editPhotoPosition === pos ? 'var(--primary)' : 'var(--surface)',
                                border: `1px solid ${editPhotoPosition === pos ? 'var(--primary)' : 'var(--border)'}`,
                              }}
                              title={pos}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-bold uppercase tracking-widest"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                    >
                      <Upload size={12} /> Changer
                    </button>
                    {editImagePreview && (
                      <button
                        type="button"
                        onClick={() => { setEditImageFile(null); setEditImagePreview(null) }}
                        className="flex items-center gap-1 text-xs px-2 py-1.5"
                        style={{ color: '#ef4444' }}
                      >
                        <X size={12} /> Retirer
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nom *</label>
                  <input className="input" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Rôle *</label>
                  <input className="input" required value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Tag / Badge</label>
                  <input className="input" value={editForm.tag} onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Bio</label>
                  <textarea className="input resize-none h-20" value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>LinkedIn URL</label>
                  <input className="input" placeholder="https://linkedin.com/in/…" value={editForm.linkedin_url} onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>X / Twitter URL</label>
                  <input className="input" placeholder="https://x.com/…" value={editForm.twitter_url} onChange={(e) => setEditForm({ ...editForm, twitter_url: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Site web URL</label>
                  <input className="input" placeholder="https://…" value={editForm.website_url} onChange={(e) => setEditForm({ ...editForm, website_url: e.target.value })} />
                </div>
                <div className="col-span-2 flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); setEditImageFile(null); setEditImagePreview(null) }}
                    className="btn-outline px-4 py-2 text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditSave(member)}
                    disabled={saving === member.id}
                    className="btn-primary px-4 py-2 text-xs flex items-center gap-2"
                  >
                    {saving === member.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    Enregistrer
                  </button>
                </div>
              </div>
            ) : (
              /* ── READ MODE ── */
              <div className="p-4 flex items-center gap-4">
                {/* Order controls */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => moveOrder(member, -1)}
                    disabled={idx === 0}
                    className="w-6 h-5 flex items-center justify-center text-xs disabled:opacity-20 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--text-subtle)', background: 'var(--surface)' }}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveOrder(member, 1)}
                    disabled={idx === members.length - 1}
                    className="w-6 h-5 flex items-center justify-center text-xs disabled:opacity-20 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--text-subtle)', background: 'var(--surface)' }}
                  >
                    ▼
                  </button>
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden relative">
                  {member.photo_url ? (
                    <Image src={member.photo_url} alt={member.name} fill className="object-cover" style={{ objectPosition: member.photo_position ?? 'center top' }} />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-bold"
                      style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--accent))', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}
                    >
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{member.name}</span>
                    {member.tag && (
                      <span
                        className="text-xs px-2 py-0.5 font-bold uppercase tracking-widest"
                        style={{
                          background: 'var(--primary-glow)',
                          color: 'var(--primary)',
                          clipPath: 'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)',
                        }}
                      >
                        {member.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--primary)' }}>{member.role}</div>
                  {member.bio && (
                    <div className="text-xs mt-1 truncate max-w-sm" style={{ color: 'var(--text-subtle)' }}>{member.bio}</div>
                  )}
                </div>

                {/* Social indicators */}
                <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                  {member.linkedin_url && <span className="text-xs px-2 py-0.5" style={{ background: 'var(--surface)', color: 'var(--text-subtle)', border: '1px solid var(--border)' }}>LN</span>}
                  {member.twitter_url && <span className="text-xs px-2 py-0.5" style={{ background: 'var(--surface)', color: 'var(--text-subtle)', border: '1px solid var(--border)' }}>X</span>}
                  {member.website_url && <span className="text-xs px-2 py-0.5" style={{ background: 'var(--surface)', color: 'var(--text-subtle)', border: '1px solid var(--border)' }}>WEB</span>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(member)}
                    className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                    title="Modifier"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => toggleVisible(member)}
                    disabled={saving === member.id}
                    className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
                    style={{ background: 'var(--surface)', color: member.visible ? 'var(--primary)' : 'var(--text-subtle)' }}
                    title={member.visible ? 'Masquer' : 'Afficher'}
                  >
                    {saving === member.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : member.visible ? <Eye size={13} /> : <EyeOff size={13} />
                    }
                  </button>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
                    style={{ background: '#ef444418', color: '#ef4444' }}
                    title="Supprimer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {!members.length && (
          <div className="text-center py-16" style={{ color: 'var(--text-subtle)' }}>
            Aucun membre — cliquez sur &laquo; Ajouter un membre &raquo;.
          </div>
        )}
      </div>
    </div>
  )
}
