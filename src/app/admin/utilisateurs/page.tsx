import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { Shield, User } from 'lucide-react'

export default async function AdminUtilisateursPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Récupère les métadonnées des users via auth.users (accessible côté serveur)
  const userIds = profiles?.map((p) => p.id) ?? []

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--text)', lineHeight: 1 }}>
          UTILISATEURS
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {profiles?.length ?? 0} compte{(profiles?.length ?? 0) > 1 ? 's' : ''} enregistré{(profiles?.length ?? 0) > 1 ? 's' : ''}
        </p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              {['Utilisateur', 'Rôle', 'Inscrit le', 'ID'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles?.map((profile, i) => (
              <tr
                key={profile.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: i % 2 === 0 ? 'var(--card-bg)' : 'var(--bg-secondary)',
                }}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: 'var(--primary)' }}
                    >
                      <User size={14} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text)' }}>{profile.id.slice(0, 8)}…</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className="text-xs font-bold px-2 py-1 flex items-center gap-1 w-fit"
                    style={{
                      color: profile.role === 'admin' ? '#f59e0b' : 'var(--primary)',
                      background: profile.role === 'admin' ? '#f59e0b18' : 'var(--primary-glow)',
                      clipPath: 'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)',
                    }}
                  >
                    {profile.role === 'admin' && <Shield size={10} />}
                    {profile.role === 'admin' ? 'Admin' : 'Client'}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-subtle)' }}>
                  {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-5 py-3">
                  <code className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--surface)', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {profile.id}
                  </code>
                </td>
              </tr>
            ))}
            {!profiles?.length && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-sm" style={{ color: 'var(--text-subtle)' }}>
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Hint pour promouvoir admin */}
      <div
        className="mt-6 p-5 rounded-xl text-xs"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
      >
        <div className="flex items-center gap-2 mb-2 font-bold" style={{ color: 'var(--text)' }}>
          <Shield size={14} style={{ color: '#f59e0b' }} />
          Promouvoir un utilisateur en admin
        </div>
        <p className="mb-2">Dans le SQL Editor de Supabase, exécutez :</p>
        <code
          className="block p-3 rounded-lg text-xs"
          style={{ background: 'var(--bg)', color: 'var(--primary)', fontFamily: 'monospace' }}
        >
          {`INSERT INTO profiles (id, role) VALUES ('UUID-ICI', 'admin')\nON CONFLICT (id) DO UPDATE SET role = 'admin';`}
        </code>
      </div>
    </div>
  )
}
