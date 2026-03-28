import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin'

const STATUS_OPTIONS = ['pending', 'reviewed', 'accepted', 'rejected']
const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:  { label: 'En attente', color: '#f59e0b' },
  reviewed: { label: 'Examiné',   color: '#3a6fd8' },
  accepted: { label: 'Accepté',   color: '#22c55e' },
  rejected: { label: 'Refusé',    color: '#ef4444' },
}

export default async function AdminDevisPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--text)', lineHeight: 1 }}>
          DEVIS
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {quotes?.length ?? 0} demande{(quotes?.length ?? 0) > 1 ? 's' : ''} au total
        </p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              {['Date', 'Description', 'Services', 'Budget', 'Statut'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotes?.map((q, i) => {
              const s = STATUS_LABELS[q.status]
              return (
                <tr
                  key={q.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: i % 2 === 0 ? 'var(--card-bg)' : 'var(--bg-secondary)',
                  }}
                >
                  <td className="px-5 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-subtle)' }}>
                    {new Date(q.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-5 py-3 max-w-xs">
                    <span className="text-xs line-clamp-2" style={{ color: 'var(--text)' }}>
                      {q.description || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {q.services?.map((svc: string) => (
                        <span key={svc} className="text-xs px-2 py-0.5 font-medium" style={{ background: 'var(--surface)', color: 'var(--text-muted)', clipPath: 'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)' }}>
                          {svc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                    {q.budget || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2 py-1" style={{ color: s?.color, background: `${s?.color}18`, clipPath: 'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)' }}>
                      {s?.label}
                    </span>
                  </td>
                </tr>
              )
            })}
            {!quotes?.length && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-sm" style={{ color: 'var(--text-subtle)' }}>
                  Aucun devis reçu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
