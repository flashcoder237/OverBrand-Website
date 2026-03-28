import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, FileText, FolderOpen, Users, Shield, ImageIcon } from 'lucide-react'
import { AdminLogoutButton } from '@/components/admin/logout-button'


export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireAdmin(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const nav = [
    { label: "Vue d'ensemble", href: `/${locale}/admin`,               icon: LayoutDashboard },
    { label: 'Vitrine',        href: `/${locale}/admin/vitrine`,       icon: ImageIcon },
    { label: 'Devis',          href: `/${locale}/admin/devis`,         icon: FileText },
    { label: 'Projets',        href: `/${locale}/admin/projets`,       icon: FolderOpen },
    { label: 'Utilisateurs',   href: `/${locale}/admin/utilisateurs`,  icon: Users },
  ]

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full w-64 flex flex-col z-40"
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
      >
        {/* Logo + badge */}
        <div className="px-4 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image src="/logo-bg.png" alt="OverBrand" fill className="object-contain" />
          </div>
          <div>
            <span className="font-black text-sm" style={{ color: 'var(--text)' }}>
              Over<span style={{ color: 'var(--primary)' }}>Brand</span>
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield size={10} style={{ color: '#f59e0b' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b', fontSize: '0.6rem' }}>
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Admin info */}
        <div className="px-4 py-3 mx-3 mt-3 rounded-lg" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: '#f59e0b' }}
            >
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--text-subtle)' }}>Administrateur</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all hover:opacity-100 rounded-lg"
              style={{ color: 'var(--text-muted)' }}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid var(--border)' }}>
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            <LayoutDashboard size={16} />
            Espace client
          </Link>
          <AdminLogoutButton locale={locale} />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
