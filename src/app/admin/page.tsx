import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { FileText, FolderOpen, Users, Clock } from 'lucide-react'

export default async function AdminPage() {
  await requireAdmin()
  const supabase = await createClient()

  const [
    { count: totalQuotes },
    { count: pendingQuotes },
    { count: totalProjects },
    { count: activeProjects },
    { count: totalUsers },
  ] = await Promise.all([
    supabase.from('quotes').select('*', { count: 'exact', head: true }),
    supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const { data: recentQuotes } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentProjects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Devis total', value: totalQuotes ?? 0, icon: FileText, color: 'var(--primary)' },
    { label: 'Devis en attente', value: pendingQuotes ?? 0, icon: Clock, color: '#f59e0b' },
    { label: 'Projets actifs', value: activeProjects ?? 0, icon: FolderOpen, color: '#22c55e' },
    { label: 'Utilisateurs', value: totalUsers ?? 0, icon: Users, color: '#a855f7' },
  ]

  const statusLabel: Record<string, { label: string; color: string }> = {
    pending:     { label: 'En attente', color: '#f59e0b' },
    reviewed:    { label: 'Examiné',    color: 'var(--primary)' },
    accepted:    { label: 'Accepté',    color: '#22c55e' },
    rejected:    { label: 'Refusé',     color: '#ef4444' },
    not_started: { label: 'Non commencé', color: '#6b7280' },
    in_progress: { label: 'En cours',   color: 'var(--primary)' },
    review:      { label: 'En révision', color: '#f59e0b' },
    completed:   { label: 'Terminé',    color: '#22c55e' },
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1
          className="leading-none mb-1"
          style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--text)' }}
        >
          VUE D&apos;ENSEMBLE
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Tableau de bord administrateur OverBrand
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-3xl font-black mb-0.5" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              {s.value}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent quotes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--text)' }}>
              Derniers devis
            </h2>
            <a href="/admin/devis" className="text-xs font-bold uppercase tracking-widest hover:opacity-70" style={{ color: 'var(--primary)' }}>
              Tout voir →
            </a>
          </div>
          <div className="space-y-3">
            {recentQuotes?.map((q) => {
              const s = statusLabel[q.status]
              return (
                <div key={q.id} className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                      {q.description?.slice(0, 45) || 'Sans description'}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                      {new Date(q.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 flex-shrink-0" style={{ color: s?.color, background: `${s?.color}18`, clipPath: 'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)' }}>
                    {s?.label}
                  </span>
                </div>
              )
            })}
            {!recentQuotes?.length && (
              <p className="text-sm text-center py-4" style={{ color: 'var(--text-subtle)' }}>Aucun devis</p>
            )}
          </div>
        </div>

        {/* Recent projects */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--text)' }}>
              Derniers projets
            </h2>
            <a href="/admin/projets" className="text-xs font-bold uppercase tracking-widest hover:opacity-70" style={{ color: 'var(--primary)' }}>
              Tout voir →
            </a>
          </div>
          <div className="space-y-3">
            {recentProjects?.map((p) => {
              const s = statusLabel[p.status]
              return (
                <div key={p.id} className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{p.title}</div>
                    <div className="w-full h-1 mt-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                      <div className="h-1 rounded-full" style={{ width: `${p.progress}%`, background: 'var(--primary)' }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 flex-shrink-0" style={{ color: s?.color, background: `${s?.color}18`, clipPath: 'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)' }}>
                    {s?.label}
                  </span>
                </div>
              )
            })}
            {!recentProjects?.length && (
              <p className="text-sm text-center py-4" style={{ color: 'var(--text-subtle)' }}>Aucun projet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
