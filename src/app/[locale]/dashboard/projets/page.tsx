import { createClient } from '@/lib/supabase/server'
import { FolderOpen, ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  not_started: { label: 'Non commencé', bg: 'bg-gray-400/10', text: 'text-gray-400', dot: 'bg-gray-400' },
  in_progress: { label: 'En cours', bg: 'bg-blue-400/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  review: { label: 'En révision', bg: 'bg-amber-400/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  completed: { label: 'Terminé', bg: 'bg-green-400/10', text: 'text-green-400', dot: 'bg-green-400' },
}

export default async function ProjetsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black mb-2" style={{ color: 'var(--text)' }}>Mes projets</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Suivez l&apos;avancement de tous vos projets en temps réel.</p>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project) => {
            const s = STATUS_MAP[project.status] ?? STATUS_MAP.not_started
            return (
              <Link key={project.id} href={`/dashboard/projets/${project.id}`}>
                <div className="card p-6 cursor-pointer h-full">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>{project.title}</h3>
                      {project.description && (
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                      )}
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Progression</span>
                      <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>{project.progress ?? 0}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'var(--border)' }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${project.progress ?? 0}%`, background: 'var(--primary)' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {project.deadline ? (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-subtle)' }}>
                        <Calendar size={12} />
                        Livraison: {new Date(project.deadline).toLocaleDateString('fr-FR')}
                      </div>
                    ) : (
                      <div />
                    )}
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                      Détails <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="card p-16 text-center">
          <FolderOpen size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>Aucun projet pour l&apos;instant</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Vos projets apparaîtront ici une fois qu&apos;un devis aura été accepté.
          </p>
          <Link href="/dashboard/devis">
            <button className="btn-primary px-6 py-3 rounded-xl text-sm">Demander un devis</button>
          </Link>
        </div>
      )}
    </div>
  )
}
