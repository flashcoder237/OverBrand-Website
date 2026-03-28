'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AdminLogoutButton({ locale = 'fr' }: { locale?: string }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}`)
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all hover:opacity-80 w-full text-left"
      style={{ color: 'var(--text-muted)' }}
    >
      <LogOut size={16} />
      Déconnexion
    </button>
  )
}
