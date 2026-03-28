import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/admin'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const profile = await getProfile()
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <DashboardSidebar user={user} isAdmin={isAdmin} />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  )
}
