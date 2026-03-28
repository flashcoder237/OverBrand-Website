import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin'
import Link from 'next/link'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  not_started: { label: 'Non commencé', color: '#6b7280' },
  in_progress: { label: 'En cours',     color: '#3a6fd8' },
  review:      { label: 'En révision',  color: '#f59e0b' },
  completed:   { label: 'Terminé',      color: '#22c55e' },
}

export default async function AdminProjetsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireAdmin()
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--text)', lineHeight: 1 }}>
          PROJETS
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {projects?.length ?? 0} projet{(projects?.length ?? 0) > 1 ? 's' : ''} au total
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects?.map((p) => {
          const s = STATUS_LABELS[p.status]
          return (
            <Link key={p.id} href={`/${locale}/admin/projets/${p.id}`}>
              <div className="card p-5 group cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{p.title}</h3>
                  <span className="text-xs font-bold px-2 py-0.5 flex-shrink-0" style={{ color: s?.color, background: `${s?.color}18`, clipPath: 'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)' }}>
                    {s?.label}
                  </span>
                </div>

                {p.description && (
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                )}

                {/* Progress */}
                <div className="mb-1">
                  <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-subtle)' }}>
                    <span>Progression</span>
                    <span className="font-bold" style={{ color: 'var(--primary)' }}>{p.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${p.progress}%`, background: 'var(--primary)' }} />
                  </div>
                </div>

                {p.deadline && (
                  <div className="text-xs mt-3" style={{ color: 'var(--text-subtle)' }}>
                    Échéance : {new Date(p.deadline).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            </Link>
          )
        })}

        {!projects?.length && (
          <div className="col-span-3 text-center py-16" style={{ color: 'var(--text-subtle)' }}>
            Aucun projet créé
          </div>
        )}
      </div>
    </div>
  )
}
