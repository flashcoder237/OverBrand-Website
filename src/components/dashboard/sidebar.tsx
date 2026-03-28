'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, FolderOpen,
  LogOut, Menu, X, User, ChevronRight, Shield,
} from 'lucide-react'
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { useLocale } from 'next-intl'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function DashboardSidebar({ user, isAdmin }: { user: SupabaseUser; isAdmin?: boolean }) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const logoSrc = resolvedTheme === 'dark' ? '/logo-bg.png' : '/logo.png'

  const NAV_ITEMS = [
    { label: 'Tableau de bord', href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { label: 'Demande de devis', href: `/${locale}/dashboard/devis`, icon: FileText },
    { label: 'Mes projets', href: `/${locale}/dashboard/projets`, icon: FolderOpen },
    { label: 'Mon profil', href: `/${locale}/dashboard/profil`, icon: User },
  ]

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}`)
    router.refresh()
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Client'
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src={logoSrc} alt="OverBrand" fill className="object-contain" />
          </div>
          <span className="font-black text-base" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>
            Over<span style={{ color: 'var(--primary)' }}>Brand</span>
          </span>
        </Link>
        <button className="md:hidden" onClick={() => setMobileOpen(false)} style={{ color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>
      </div>

      {/* User info */}
      <div className="px-4 py-4 mx-3 mt-3 rounded-xl" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            {initials}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{userName}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-subtle)' }}>{user.email}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
              style={{
                background: active ? 'var(--primary-glow)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-muted)',
              }}
            >
              <item.icon size={18} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
        {isAdmin && (
          <Link
            href={`/${locale}/admin`}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-100"
            style={{ color: '#f59e0b', background: '#f59e0b12' }}
          >
            <Shield size={18} />
            Panneau Admin
          </Link>
        )}
        <div className="flex items-center gap-2 px-3">
          <ThemeToggle />
          <span className="text-xs ml-1" style={{ color: 'var(--text-subtle)' }}>Thème</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
          style={{ color: 'var(--text-muted)', background: 'transparent' }}
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--card-bg)', borderRight: '1px solid var(--border)' }}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-full w-64"
        style={{ background: 'var(--card-bg)', borderRight: '1px solid var(--border)' }}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
