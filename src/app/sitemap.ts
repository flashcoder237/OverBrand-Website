import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://overbrand.net'
const LOCALES = ['fr', 'en'] as const

type ProjectRow = { id: string; updated_at?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects: ProjectRow[] = []

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase
      .from('showcase_projects')
      .select('id, updated_at')
      .eq('visible', true)
    projects = data ?? []
  } catch {
    // silently skip — sitemap still valid without project entries
  }

  const staticRoutes = [
    { path: '',                          priority: 1.0,  freq: 'weekly'  as const },
    { path: '/team',                     priority: 0.8,  freq: 'monthly' as const },
    { path: '/legal/mentions-legales',   priority: 0.3,  freq: 'yearly'  as const },
    { path: '/legal/cgv',                priority: 0.3,  freq: 'yearly'  as const },
    { path: '/legal/confidentialite',    priority: 0.3,  freq: 'yearly'  as const },
  ]

  const entries: MetadataRoute.Sitemap = []

  // Static routes — one entry per locale with hreflang alternates
  for (const locale of LOCALES) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${SITE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.freq,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map(l => [l, `${SITE_URL}/${l}${route.path}`])
          ),
        },
      })
    }
  }

  // Dynamic project pages
  for (const locale of LOCALES) {
    for (const project of projects) {
      entries.push({
        url: `${SITE_URL}/${locale}/projets/${project.id}`,
        lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map(l => [l, `${SITE_URL}/${l}/projets/${project.id}`])
          ),
        },
      })
    }
  }

  return entries
}
