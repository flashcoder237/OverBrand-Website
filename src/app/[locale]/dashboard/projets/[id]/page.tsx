import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  not_started: { label: 'Non commencé', bg: 'bg-gray-400/10', text: 'text-gray-400' },
  in_progress: { label: 'En cours', bg: 'bg-blue-400/10', text: 'text-blue-400' },
  review: { label: 'En révision', bg: 'bg-amber-400/10', text: 'text-amber-400' },
  completed: { label: 'Terminé', bg: 'bg-green-400/10', text: 'text-green-400' },
}

export default async function ProjetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: project }, { data: updates }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).eq('user_id', user!.id).single(),
    supabase.from('project_updates').select('*').eq('project_id', id).order('created_at', { ascending: false }),
  ])

  if (!project) notFound()

  const s = STATUS_MAP[project.status] ?? STATUS_MAP.not_started

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/dashboard/projets" className="flex items-center gap-2 text-sm mb-6 hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={16} /> Tous les projets
      </Link>

      {/* Header */}
      <div className="card p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text)' }}>{project.title}</h1>
            {project.description && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
            )}
          </div>
          <span className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-semibold whitespace-nowrap ${s.bg} ${s.text}`}>
            {s.label}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Progression globale</span>
            <span className="text-2xl font-black text-gradient">{project.progress ?? 0}%</span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ background: 'var(--border)' }}>
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${project.progress ?? 0}%`, background: 'linear-gradient(90deg, var(--primary), hsl(calc(var(--hue) + 40), 82%, 60%))' }}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.start_date && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
              <Clock size={16} style={{ color: 'var(--primary)' }} />
              <div>
                <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>Date de début</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {new Date(project.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          )}
          {project.deadline && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
              <Calendar size={16} style={{ color: 'var(--primary)' }} />
              <div>
                <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>Date de livraison</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {new Date(project.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Updates timeline */}
      <div className="card p-6 md:p-8">
        <h2 className="font-bold text-base mb-6" style={{ color: 'var(--text)' }}>
          Historique des mises à jour
        </h2>

        {updates && updates.length > 0 ? (
          <div className="space-y-0">
            {updates.map((update, i) => (
              <div key={update.id} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                    style={{ background: i === 0 ? 'var(--primary)' : 'var(--surface)', border: `2px solid ${i === 0 ? 'var(--primary)' : 'var(--border)'}` }}
                  >
                    <CheckCircle2 size={14} style={{ color: i === 0 ? 'white' : 'var(--text-muted)' }} />
                  </div>
                  {i < updates.length - 1 && (
                    <div className="w-0.5 flex-1 my-1" style={{ background: 'var(--border)' }} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{update.title}</h3>
                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-subtle)' }}>
                      {new Date(update.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{update.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock size={32} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Aucune mise à jour pour l&apos;instant. Les mises à jour apparaîtront ici au fur et à mesure de l&apos;avancement.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
