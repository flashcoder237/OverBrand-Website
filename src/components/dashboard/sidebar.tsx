'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, FolderOpen,
  LogOut, Menu, X, User, Shield, Home,
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
  const { resolvedTheme, mounted } = useTheme() as { resolvedTheme: string | undefined; mounted?: boolean }
  const logoSrc = resolvedTheme === 'dark' ? '/logo-bg.png' : '/logo.png'

  const NAV_ITEMS = [
    { label: 'Tableau de bord', href: `/${locale}/dashboard`,         icon: LayoutDashboard },
    { label: 'Demande de devis', href: `/${locale}/dashboard/devis`,   icon: FileText },
    { label: 'Mes projets',      href: `/${locale}/dashboard/projets`, icon: FolderOpen },
    { label: 'Mon profil',       href: `/${locale}/dashboard/profil`,  icon: User },
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
      <div className="px-5 h-16 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
          <div className="relative w-7 h-7 transition-transform group-hover:scale-105">
            <Image src={logoSrc} alt="OverBrand" fill className="object-contain" />
          </div>
          <span className="font-black text-sm tracking-tight" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>
            Over<span style={{ color: 'var(--primary)' }}>Brand</span>
          </span>
        </Link>
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(false)}
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* User card */}
      <div className="px-4 pt-5 pb-3">
        <div
          className="flex items-center gap-3 p-3 relative overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div
            className="w-9 h-9 flex items-center justify-center text-xs font-black text-white flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
            }}
          >
            {initials}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <div className="text-xs font-bold truncate" style={{ color: 'var(--text)' }}>{userName}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-subtle)', fontSize: '0.65rem' }}>{user.email}</div>
          </div>
          {/* Accent corner */}
          <div className="absolute top-0 right-0 w-6 h-6 opacity-20"
            style={{ background: 'var(--primary)', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
          />
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pb-2">
        <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-subtle)', fontSize: '0.6rem' }}>
          Navigation
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-widest transition-all group relative"
              style={{
                color: active ? 'var(--primary)' : 'var(--text-muted)',
                background: active ? 'var(--primary-glow)' : 'transparent',
                letterSpacing: '0.08em',
              }}
            >
              {/* Active indicator */}
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5"
                  style={{ background: 'var(--primary)' }}
                />
              )}
              <item.icon size={15} className="flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>

        {/* Back to site */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:opacity-80"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
        >
          <Home size={15} />
          Retour au site
        </Link>

        {/* Admin panel */}
        {isAdmin && (
          <Link
            href={`/${locale}/admin`}
            className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:opacity-80"
            style={{ color: 'var(--primary)', background: 'var(--primary-glow)', letterSpacing: '0.08em' }}
          >
            <Shield size={15} />
            Panneau Admin
          </Link>
        )}

        {/* Theme + logout row */}
        <div className="flex items-center justify-between px-3 pt-2">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-xs" style={{ color: 'var(--text-subtle)', fontSize: '0.65rem' }}>Thème</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-all hover:opacity-80"
            style={{ color: 'var(--text-subtle)', letterSpacing: '0.08em' }}
          >
            <LogOut size={13} />
            Quitter
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-60 z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--card-bg)', borderRight: '1px solid var(--border)' }}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-full w-60"
        style={{ background: 'var(--card-bg)', borderRight: '1px solid var(--border)' }}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
