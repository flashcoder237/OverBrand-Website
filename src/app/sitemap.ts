import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { SITE_URL, LOCALES } from '@/lib/seo'
import { SERVICE_SLUGS } from '@/lib/services-data'
import { CASE_SLUGS } from '@/lib/projects-data'

type ProjectRow = { id: string; updated_at?: string }

type Route = {
  path: string
  priority: number
  freq: MetadataRoute.Sitemap[number]['changeFrequency']
  lastModified?: Date
}

/** One entry per locale, each carrying the full hreflang cluster. */
function localized(routes: Route[]): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  for (const locale of LOCALES) {
    for (const route of routes) {
      const languages: Record<string, string> = Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}${route.path}`]),
      )
      languages['x-default'] = `${SITE_URL}/fr${route.path}`

      entries.push({
        url: `${SITE_URL}/${locale}${route.path}`,
        lastModified: route.lastModified ?? new Date(),
        changeFrequency: route.freq,
        priority: route.priority,
        alternates: { languages },
      })
    }
  }
  return entries
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: Route[] = [
    { path: '', priority: 1.0, freq: 'weekly' },

    // Commercial pages carry the highest priority after the home page.
    { path: '/services', priority: 0.9, freq: 'monthly' },
    { path: '/projets', priority: 0.9, freq: 'weekly' },
    { path: '/contact', priority: 0.8, freq: 'monthly' },

    { path: '/a-propos', priority: 0.7, freq: 'monthly' },
    { path: '/equipe', priority: 0.7, freq: 'monthly' },
    { path: '/processus', priority: 0.7, freq: 'monthly' },
    { path: '/insights', priority: 0.7, freq: 'weekly' },
    { path: '/carrieres', priority: 0.6, freq: 'weekly' },

    { path: '/legal/mentions-legales', priority: 0.3, freq: 'yearly' },
    { path: '/legal/cgv', priority: 0.3, freq: 'yearly' },
    { path: '/legal/confidentialite', priority: 0.3, freq: 'yearly' },

    // One landing page per service — the main organic entry points.
    ...SERVICE_SLUGS.map((slug): Route => ({
      path: `/services/${slug}`,
      priority: 0.8,
      freq: 'monthly',
    })),

    // Curated case studies.
    ...CASE_SLUGS.map((slug): Route => ({
      path: `/projets/${slug}`,
      priority: 0.8,
      freq: 'monthly',
    })),
  ]

  // Supabase-managed showcase projects, when reachable at build time.
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase
      .from('showcase_projects')
      .select('id, updated_at')
      .eq('visible', true)

    const curated = new Set(CASE_SLUGS)
    for (const p of (data ?? []) as ProjectRow[]) {
      if (curated.has(p.id)) continue
      routes.push({
        path: `/projets/${p.id}`,
        priority: 0.7,
        freq: 'monthly',
        lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      })
    }
  } catch {
    // Sitemap stays valid without the dynamic entries.
  }

  return localized(routes)
}
