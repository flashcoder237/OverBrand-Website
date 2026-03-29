import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { Mail, Phone, Building2, MessageSquare, Clock } from 'lucide-react'
import { ContactActions } from './contact-actions'

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  budget: string | null
  read: boolean
  created_at: string
}

export default async function AdminContactsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  const list: Contact[] = (contacts ?? []).map((c) => ({ ...c, read: c.read ?? false }))
  const unread = list.filter((c) => !c.read).length

  return (
    <div className="max-w-5xl mx-auto">

      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--text)', lineHeight: 1 }}>
            CONTACTS
          </h1>
          <p className="text-sm mt-1 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            {list.length} message{list.length > 1 ? 's' : ''} au total
            {unread > 0 && (
              <span
                className="px-2 py-0.5 text-xs font-bold uppercase"
                style={{ background: 'rgba(40,85,160,0.15)', color: 'var(--primary)', letterSpacing: '0.08em' }}
              >
                {unread} non lu{unread > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--text-subtle)' }}>
          <MessageSquare size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun message reçu pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((c) => (
            <div
              key={c.id}
              className="p-5 relative"
              style={{
                background: 'var(--card-bg)',
                border: `1px solid ${!c.read ? 'var(--primary)' : 'var(--card-border)'}`,
                opacity: c.read ? 0.8 : 1,
              }}
            >
              {/* Unread left bar */}
              {!c.read && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: 'var(--primary)' }} />
              )}

              <div className="flex items-start gap-4">

                {/* Avatar */}
                <div
                  className="w-10 h-10 flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{
                    background: c.read
                      ? 'linear-gradient(135deg, var(--border), var(--text-subtle))'
                      : 'linear-gradient(135deg, var(--primary), var(--accent))',
                    clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                  }}
                >
                  {c.name.slice(0, 2).toUpperCase()}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{c.name}</span>
                    {c.company && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-subtle)' }}>
                        <Building2 size={10} /> {c.company}
                      </span>
                    )}
                    {c.budget && (
                      <span
                        className="text-xs px-2 py-0.5 font-bold"
                        style={{ background: 'rgba(40,85,160,0.12)', color: 'var(--primary)', clipPath: 'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)', fontSize: '0.6rem', letterSpacing: '0.1em' }}
                      >
                        {c.budget}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: 'var(--text-subtle)' }}>
                      <Clock size={10} />
                      {new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3 text-xs">
                    <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:underline" style={{ color: 'var(--primary)' }}>
                      <Mail size={11} /> {c.email}
                    </a>
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:underline" style={{ color: 'var(--text-muted)' }}>
                        <Phone size={11} /> {c.phone}
                      </a>
                    )}
                  </div>

                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap p-3"
                    style={{ background: 'var(--surface)', borderLeft: '2px solid var(--border)', color: 'var(--text-muted)' }}
                  >
                    {c.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <ContactActions contactId={c.id} read={c.read} email={c.email} name={c.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
