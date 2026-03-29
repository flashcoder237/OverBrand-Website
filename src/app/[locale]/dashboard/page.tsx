import { createClient } from '@/lib/supabase/server'
import { FileText, FolderOpen, Clock, CheckCircle, ArrowRight, Plus } from 'lucide-react'
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

  const STATUS: Record<string, { bg: string; color: string; label: string }> = {
    pending:     { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', label: 'En attente' },
    reviewed:    { bg: 'rgba(40,85,160,0.12)',  color: 'var(--primary)', label: 'Examiné' },
    accepted:    { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e', label: 'Accepté' },
    rejected:    { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', label: 'Refusé' },
    not_started: { bg: 'var(--surface)',         color: 'var(--text-subtle)', label: 'Non commencé' },
    in_progress: { bg: 'rgba(40,85,160,0.12)',  color: 'var(--primary)', label: 'En cours' },
    review:      { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', label: 'En révision' },
    completed:   { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e', label: 'Terminé' },
  }

  const STATS = [
    { label: 'Devis soumis',     value: quotes?.length ?? 0,                                                   icon: FileText,    color: 'var(--primary)' },
    { label: 'Projets actifs',   value: projects?.filter((p) => p.status === 'in_progress').length ?? 0,       icon: Clock,       color: '#f59e0b' },
    { label: 'Terminés',         value: projects?.filter((p) => p.status === 'completed').length ?? 0,         icon: CheckCircle, color: '#22c55e' },
    { label: 'Total projets',    value: projects?.length ?? 0,                                                  icon: FolderOpen,  color: 'var(--accent)' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between pt-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--primary)', letterSpacing: '0.18em' }}>
            Espace client
          </p>
          <h1 className="font-display leading-none" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text)' }}>
            Bonjour, {userName}
          </h1>
        </div>
        <Link href={`/${locale}/dashboard/devis`}>
          <button className="btn-primary text-xs px-5 py-3 flex items-center gap-2 whitespace-nowrap">
            <Plus size={14} />
            Nouveau devis
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden p-5"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
          >
            {/* Accent corner */}
            <div className="absolute top-0 right-0 w-10 h-10 opacity-15"
              style={{ background: stat.color, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
            />
            <div className="w-8 h-8 flex items-center justify-center mb-4" style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}33` }}>
              <stat.icon size={15} style={{ color: stat.color }} />
            </div>
            <div className="font-display text-3xl leading-none mb-1" style={{ fontFamily: 'var(--font-display)', color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Devis */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className="w-1 h-4" style={{ background: 'var(--primary)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text)', letterSpacing: '0.12em' }}>
                Devis récents
              </span>
            </div>
            <Link href={`/${locale}/dashboard/devis`} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-60" style={{ color: 'var(--primary)', fontSize: '0.65rem' }}>
              Voir tout <ArrowRight size={11} />
            </Link>
          </div>

          <div className="p-4 space-y-2">
            {quotes && quotes.length > 0 ? quotes.map((quote) => {
              const s = STATUS[quote.status] ?? STATUS.pending
              return (
                <div key={quote.id} className="flex items-center gap-3 p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>
                      {quote.description?.slice(0, 45) || 'Devis sans description'}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                      {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0"
                    style={{ background: s.bg, color: s.color, fontSize: '0.6rem', letterSpacing: '0.1em' }}
                  >
                    {s.label}
                  </span>
                </div>
              )
            }) : (
              <div className="text-center py-10">
                <FileText size={28} className="mx-auto mb-3" style={{ color: 'var(--border)' }} />
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Aucun devis soumis</p>
                <Link href={`/${locale}/dashboard/devis`}>
                  <button className="btn-primary text-xs px-5 py-2.5">Demander un devis</button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Projets */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className="w-1 h-4" style={{ background: 'var(--accent)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text)', letterSpacing: '0.12em' }}>
                Mes projets
              </span>
            </div>
            <Link href={`/${locale}/dashboard/projets`} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-60" style={{ color: 'var(--primary)', fontSize: '0.65rem' }}>
              Voir tout <ArrowRight size={11} />
            </Link>
          </div>

          <div className="p-4 space-y-2">
            {projects && projects.length > 0 ? projects.map((project) => {
              const s = STATUS[project.status] ?? STATUS.not_started
              const progress = project.progress ?? 0
              return (
                <Link key={project.id} href={`/${locale}/dashboard/projets/${project.id}`}>
                  <div className="p-3 transition-all hover:opacity-80" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{project.title}</div>
                      <span
                        className="text-xs px-2 py-0.5 font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0"
                        style={{ background: s.bg, color: s.color, fontSize: '0.6rem', letterSpacing: '0.1em' }}
                      >
                        {s.label}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1" style={{ background: 'var(--border)' }}>
                      <div
                        className="h-1 transition-all"
                        style={{ width: `${progress}%`, background: `linear-gradient(90deg, var(--primary), var(--accent))` }}
                      />
                    </div>
                    <div className="text-xs mt-1.5 font-medium tabular-nums" style={{ color: 'var(--text-subtle)' }}>
                      {progress}%
                    </div>
                  </div>
                </Link>
              )
            }) : (
              <div className="text-center py-10">
                <FolderOpen size={28} className="mx-auto mb-3" style={{ color: 'var(--border)' }} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Aucun projet en cours</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="relative overflow-hidden p-6 flex flex-col sm:flex-row items-center justify-between gap-5"
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' }}
      >
        <div className="absolute inset-0 dot-bg opacity-15 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10 pointer-events-none"
          style={{ background: 'white', clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
        />
        <div className="relative">
          <h3 className="font-display text-2xl text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Nouveau projet en tête ?
          </h3>
          <p className="text-xs text-white/70">
            Soumettez une demande et recevez une réponse sous 24h.
          </p>
        </div>
        <Link href={`/${locale}/dashboard/devis`} className="relative">
          <button className="whitespace-nowrap text-xs font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 transition-all hover:-translate-y-0.5"
            style={{ background: 'white', color: 'var(--primary)', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
            Demander un devis <ArrowRight size={14} />
          </button>
        </Link>
      </div>

    </div>
  )
}
