import { createClient } from '@/lib/supabase/server'
import { FileText, FolderOpen, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: quotes }, { data: projects }] = await Promise.all([
    supabase.from('quotes').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(3),
    supabase.from('projects').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(3),
  ])

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client'

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-400/10', text: 'text-amber-400', label: 'En attente' },
    reviewed: { bg: 'bg-blue-400/10', text: 'text-blue-400', label: 'Examiné' },
    accepted: { bg: 'bg-green-400/10', text: 'text-green-400', label: 'Accepté' },
    rejected: { bg: 'bg-red-400/10', text: 'text-red-400', label: 'Refusé' },
    not_started: { bg: 'bg-gray-400/10', text: 'text-gray-400', label: 'Non commencé' },
    in_progress: { bg: 'bg-blue-400/10', text: 'text-blue-400', label: 'En cours' },
    review: { bg: 'bg-amber-400/10', text: 'text-amber-400', label: 'En révision' },
    completed: { bg: 'bg-green-400/10', text: 'text-green-400', label: 'Terminé' },
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black mb-1" style={{ color: 'var(--text)' }}>
          Bonjour, {userName} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Bienvenue dans votre espace client OverBrand.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Devis soumis', value: quotes?.length ?? 0, icon: FileText, color: 'var(--primary)' },
          { label: 'Projets actifs', value: projects?.filter((p) => p.status === 'in_progress').length ?? 0, icon: Clock, color: '#f59e0b' },
          { label: 'Projets terminés', value: projects?.filter((p) => p.status === 'completed').length ?? 0, icon: CheckCircle, color: '#22c55e' },
          { label: 'Total projets', value: projects?.length ?? 0, icon: FolderOpen, color: '#a855f7' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-2xl font-black mb-0.5" style={{ color: 'var(--text)' }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent quotes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>Mes devis récents</h2>
            <Link href={`/${locale}/dashboard/devis`} className="text-xs flex items-center gap-1 hover:opacity-70" style={{ color: 'var(--primary)' }}>
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>

          {quotes && quotes.length > 0 ? (
            <div className="space-y-3">
              {quotes.map((quote) => {
                const s = statusColors[quote.status] ?? statusColors.pending
                return (
                  <div key={quote.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                        {quote.description?.slice(0, 40) || 'Devis sans description'}...
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                        {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.bg} ${s.text} whitespace-nowrap`}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Aucun devis soumis</p>
              <Link href={`/${locale}/dashboard/devis`}>
                <button className="btn-primary text-sm px-5 py-2.5 rounded-xl">Demander un devis</button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent projects */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>Mes projets</h2>
            <Link href={`/${locale}/dashboard/projets`} className="text-xs flex items-center gap-1 hover:opacity-70" style={{ color: 'var(--primary)' }}>
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>

          {projects && projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map((project) => {
                const s = statusColors[project.status] ?? statusColors.not_started
                return (
                  <Link key={project.id} href={`/${locale}/dashboard/projets/${project.id}`}>
                    <div className="p-4 rounded-xl transition-all hover:opacity-80 cursor-pointer" style={{ background: 'var(--surface)' }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{project.title}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text} whitespace-nowrap`}>
                          {s.label}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ width: `${project.progress ?? 0}%`, background: 'var(--primary)' }}
                        />
                      </div>
                      <div className="text-xs mt-1.5" style={{ color: 'var(--text-subtle)' }}>
                        {project.progress ?? 0}% complété
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderOpen size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Aucun projet en cours</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick action CTA */}
      <div
        className="mt-6 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)' }}
      >
        <div>
          <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>Nouveau projet en tête?</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Soumettez une demande de devis et recevez une réponse sous 24h.</p>
        </div>
        <Link href={`/${locale}/dashboard/devis`}>
          <button className="btn-primary text-sm px-6 py-3 rounded-xl whitespace-nowrap">Demander un devis</button>
        </Link>
      </div>
    </div>
  )
}
