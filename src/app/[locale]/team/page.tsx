import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { gqlClient } from '@/lib/graphql/client'
import {
  GET_TEAM_MEMBERS,
  type GetTeamMembersRes,
  unwrapEdges,
} from '@/lib/graphql/queries'
import { TeamGrid, TeamHero, TeamJoinCTA } from './team-client'
import { createClient } from '@/lib/supabase/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://overbrand.net'

// ── generateMetadata ──────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const isFr = locale === 'fr'
  const title = isFr
    ? "L'Équipe OverBrand — Agence Digitale"
    : 'The OverBrand Team — Digital Agency'
  const description = isFr
    ? "Rencontrez les experts créatifs et techniques d'OverBrand : développeurs, designers et stratèges derrière vos projets digitaux."
    : 'Meet the creative and technical experts at OverBrand: developers, designers and strategists behind your digital projects.'
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/team`,
      languages: {
        fr: `${SITE_URL}/fr/team`,
        en: `${SITE_URL}/en/team`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/team`,
      siteName: 'OverBrand',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // ── Fetch team members via GraphQL (fallback → REST) ──────────────────
  let members = []

  try {
    const data = await gqlClient.request<GetTeamMembersRes>(GET_TEAM_MEMBERS)
    members = unwrapEdges(data.team_membersCollection?.edges)
  } catch {
    const supabase = await createClient()
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true })
    members = data ?? []
  }

  // ── Structured data ───────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'OverBrand',
        item: `${SITE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'fr' ? 'Équipe' : 'Team',
        item: `${SITE_URL}/${locale}/team`,
      },
    ],
  }

  const teamSchema = members.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: locale === 'fr' ? "L'équipe OverBrand" : 'The OverBrand Team',
        itemListElement: members.map((member, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Person',
            name: member.name,
            jobTitle: member.role,
            description: member.bio ?? undefined,
            image: member.photo_url ?? undefined,
            url: member.linkedin_url ?? undefined,
            worksFor: { '@id': `${SITE_URL}/#organization` },
          },
        })),
      }
    : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {teamSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
        />
      )}

      <Navbar />
      <main style={{ background: 'var(--bg)', color: 'var(--text)' }}>

        <TeamHero locale={locale} />

        {/* Team grid */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TeamGrid members={members} locale={locale} />
          </div>
        </section>

        {/* Stats strip */}
        <section
          className="py-16"
          style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                { value: '100%', label: locale === 'fr' ? 'Sur mesure' : 'Custom-built' },
                { value: '5+',   label: locale === 'fr' ? "Ans d'expérience" : 'Years of experience' },
                { value: '50+',  label: locale === 'fr' ? 'Projets livrés' : 'Projects delivered' },
              ].map((stat, i) => (
                <div key={i}>
                  <span
                    className="block font-display leading-none mb-2"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'var(--primary)' }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TeamJoinCTA locale={locale} />
      </main>
      <Footer />
    </>
  )
}
