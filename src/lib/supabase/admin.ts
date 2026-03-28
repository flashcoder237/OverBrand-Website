import { createClient } from './server'
import { redirect } from 'next/navigation'

export type Profile = {
  id: string
  role: 'client' | 'admin'
  created_at: string
}

/** Retourne le profil de l'utilisateur connecté, ou null */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data ?? null
}

/** Redirige vers /dashboard si l'utilisateur n'est pas admin */
export async function requireAdmin() {
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }
  return profile
}
