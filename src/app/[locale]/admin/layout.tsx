import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { AdminSidebar } from '@/components/admin/sidebar'

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

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <AdminSidebar user={user!} />
      {/* Main */}
      <main className="flex-1 md:ml-60 p-8">
        {children}
      </main>
    </div>
  )
}
