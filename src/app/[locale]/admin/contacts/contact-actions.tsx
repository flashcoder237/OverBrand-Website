'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, CheckCheck, Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function ContactActions({
  contactId,
  read,
  email,
  name,
}: {
  contactId: string
  read: boolean
  email: string
  name: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggleRead() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('contacts').update({ read: !read }).eq('id', contactId)
    router.refresh()
    setLoading(false)
  }

  async function deleteContact() {
    if (!confirm('Supprimer ce message ?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('contacts').delete().eq('id', contactId)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Reply */}
      <a
        href={`mailto:${email}?subject=Re: OverBrand - Votre message&body=Bonjour ${encodeURIComponent(name)},%0A%0A`}
        className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
        style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)' }}
        title="Répondre"
      >
        <Mail size={13} />
      </a>

      {/* Mark read/unread */}
      <button
        onClick={toggleRead}
        disabled={loading}
        className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
        style={{
          background: read ? 'var(--surface)' : 'rgba(34,197,94,0.1)',
          border: `1px solid ${read ? 'var(--border)' : '#22c55e'}`,
          color: read ? 'var(--text-subtle)' : '#22c55e',
        }}
        title={read ? 'Marquer non lu' : 'Marquer comme lu'}
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <CheckCheck size={13} />}
      </button>

      {/* Delete */}
      <button
        onClick={deleteContact}
        disabled={loading}
        className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
        style={{ background: '#ef444418', color: '#ef4444' }}
        title="Supprimer"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
