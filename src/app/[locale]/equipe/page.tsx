import { createClient } from '@/lib/supabase/server'
import { gqlClient } from '@/lib/graphql/client'
import {
  GET_TEAM_MEMBERS,
  type GetTeamMembersRes,
  type TeamMember,
  unwrapEdges,
} from '@/lib/graphql/queries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { Globe, ArrowUpRight } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'

/** First letter of the first two words — stands in until real portraits exist. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/** Portrait, or a typographic placeholder when no photo has been supplied. */
function Portrait({ member, className }: { member: TeamMember; className?: string }) {
  if (member.photo_url) {
    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('${member.photo_url}')`,
          backgroundSize: 'cover',
          backgroundPosition: member.photo_position ?? 'center',
          filter: 'grayscale(1)',
        }}
      />
    )
  }
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center font-display select-none ${className ?? ''}`}
      style={{ background: 'var(--paper-dark)', color: 'var(--text-subtle)', fontSize: 'clamp(3rem, 8vw, 7rem)' }}
      aria-hidden
    >
      {initials(member.name)}
    </div>
  )
}

function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.368-1.852 3.6 0 4.266 2.371 4.266 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.779 13.019H3.555V9h3.561v11.452z" />
    </svg>
  )
}
function TwitterGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.658l-5.214-6.817-5.966 6.817H1.678l7.73-8.835L1.254 2.25h6.826l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'teamPage' })
  return pageMetadata({
    locale,
    path: '/equipe',
    title: t('meta_title'),
    description: t('meta_description'),
  })
}

// Fallback list used when Supabase team_members is empty.
//
// These are the real co-founders. Two things are deliberately left empty:
//
//  - `photo_url` is null. The previous entries used Unsplash stock portraits of
//    strangers under real names; putting a photo of someone else next to a named
//    person misrepresents them. The layout falls back to their initials until
//    real photographs are supplied.
//  - Social URLs are null because only the *platforms* were supplied, not the
//    addresses. Each `TODO` below lists which profiles to fill in. A `'#'`
//    placeholder would render a visible but dead link, which is worse.
//
// Note: `role` values are reproduced exactly as given. Two of them ("Directrice
// Marketing", "Experte en gestion d'événements") carry feminine agreement that
// looks like it survived from the template these were pasted out of — confirm
// with the people concerned rather than assuming.
const FALLBACK: TeamMember[] = [
  {
    id: 'cedric-tefoye',
    name: 'Cédric TEFOYE',
    role: 'Fondateur & CEO',
    bio: null,
    photo_url: null,
    photo_position: null,
    tag: 'Co-fondateur',
    linkedin_url: null,
    twitter_url: null,
    website_url: null,
    display_order: 1,
  },
  {
    id: 'brice-banfack',
    name: 'Banfack Temena Brice Kisito',
    role: 'Vice-président',
    bio: "Vice-président de Cœurs Braves et ingénieur senior Azure Cloud. Architecture cloud sécurisée pour les environnements réglementés — identité, réseaux et gouvernance.",
    photo_url: null,
    photo_position: null,
    tag: 'Co-fondateur',
    linkedin_url: null, // TODO: LinkedIn
    twitter_url: null,
    website_url: null,
    display_order: 2,
  },
  {
    id: 'yvan-kana',
    name: 'Yvan KANA',
    role: 'Directeur Technique',
    bio: "Ingénieur logiciel passionné par la création de solutions innovantes.",
    photo_url: null,
    photo_position: null,
    tag: 'Co-fondateur',
    linkedin_url: null, // TODO: LinkedIn
    twitter_url: null,  // TODO: Twitter/X
    website_url: null,  // TODO: GitHub — no dedicated column, rendered as "site"
    display_order: 3,
  },
  {
    id: 'franck-djoya',
    name: 'Franck DJOYA',
    role: 'Directrice Marketing',
    bio: "Spécialiste en marketing digital avec plus de 8 ans d'expérience.",
    photo_url: null,
    photo_position: null,
    tag: 'Co-fondateur',
    linkedin_url: null, // TODO: LinkedIn
    twitter_url: null,  // TODO: Twitter/X
    website_url: null,
    display_order: 4,
  },
  {
    id: 'yannick-noussi',
    name: 'Yannick NOUSSI',
    role: 'Responsable des Opérations',
    bio: "Experte en gestion d'événements et en expérience client.",
    photo_url: null,
    photo_position: null,
    tag: 'Co-fondateur',
    linkedin_url: null, // TODO: LinkedIn
    twitter_url: null,  // TODO: Twitter/X
    website_url: null,
    display_order: 5,
  },
]

async function getTeam(): Promise<TeamMember[]> {
  // Prefer GraphQL → Supabase REST fallback → hardcoded fallback.
  try {
    const data = await gqlClient.request<GetTeamMembersRes>(GET_TEAM_MEMBERS)
    const members = unwrapEdges(data.team_membersCollection?.edges)
    if (members.length) return members
  } catch {
    /* fallthrough */
  }

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true })
    if (data?.length) return data as TeamMember[]
  } catch {
    /* fallthrough */
  }

  return FALLBACK
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'teamPage' })
  const members = await getTeam()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Co-founders all get the full-width editorial treatment; anyone added later
  // through Supabase falls into the grid below.
  const leadership = members.filter((m) => m.tag === 'Co-fondateur')
  const rest = members.filter((m) => m.tag !== 'Co-fondateur')

  return (
    <>
      <Navbar isLoggedIn={!!user} />
      <main className="lg:pl-16">
        {/* Hero */}
        <section className="px-6 lg:px-12 pt-32 md:pt-40 pb-16" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <p className="text-xs font-bold uppercase mb-6 reveal" style={{ color: 'var(--accent-warm)', letterSpacing: '0.28em' }}>
              {t('eyebrow', { count: members.length })}
            </p>
            <h1
              className="font-display uppercase tracking-tight leading-[0.85] reveal"
              style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}
            >
              {t('title_1')} <br />
              <span className="text-outline">{t('title_2')}</span> <br />
              <span style={{ color: 'var(--primary)' }}>OverBrand</span>.
            </h1>
            <p className="mt-10 text-xl max-w-3xl reveal" style={{ color: 'var(--text-muted)' }}>
              {t('lead')}
            </p>
          </div>
        </section>

        {/* Headcount strip */}
        <section className="px-6 lg:px-12 py-10" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: String(members.length), label: t('stat_founders') },
              { n: '2019', label: t('stat_founded') },
              { n: '2', label: t('stat_offices') },
              { n: '3', label: t('stat_languages') },
            ].map((c) => (
              <div key={c.label} className="reveal">
                <span className="font-display block" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>
                  {c.n}
                </span>
                <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership rows */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto space-y-20">
            {leadership.map((m, i) => (
              <div
                key={m.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center reveal ${
                  i % 2 === 1 ? 'lg:[&>*:first-child]:order-last' : ''
                }`}
              >
                <div className="lg:col-span-5 aspect-[4/5] relative overflow-hidden">
                  <Portrait member={m} />
                </div>
                <div className="lg:col-span-7">
                  <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--accent-warm)' }}>
                    {m.tag ?? t('default_role')}
                  </p>
                  <h2
                    className="font-display uppercase leading-[0.9] mb-2"
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                  >
                    {m.name}
                  </h2>
                  <p className="text-lg mb-6" style={{ color: 'var(--text-muted)' }}>
                    {m.role}
                  </p>
                  {m.bio && (
                    <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                      {m.bio}
                    </p>
                  )}
                  <div className="flex gap-3">
                    {m.linkedin_url && (
                      <a
                        href={m.linkedin_url}
                        target="_blank" rel="noreferrer"
                        className="w-10 h-10 flex items-center justify-center"
                        style={{ border: '1px solid var(--line)' }}
                        aria-label="LinkedIn"
                      >
                        <LinkedInGlyph />
                      </a>
                    )}
                    {m.twitter_url && (
                      <a
                        href={m.twitter_url}
                        target="_blank" rel="noreferrer"
                        className="w-10 h-10 flex items-center justify-center"
                        style={{ border: '1px solid var(--line)' }}
                        aria-label="Twitter"
                      >
                        <TwitterGlyph />
                      </a>
                    )}
                    {m.website_url && (
                      <a
                        href={m.website_url}
                        target="_blank" rel="noreferrer"
                        className="w-10 h-10 flex items-center justify-center"
                        style={{ border: '1px solid var(--line)' }}
                        aria-label="Website"
                      >
                        <Globe size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team grid — only rendered once non-founder members exist in Supabase,
            otherwise this section would be an empty heading. */}
        {rest.length > 0 && (
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--surface)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-display uppercase mb-12 reveal" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              L'équipe <span style={{ color: 'var(--primary)' }}>complète</span>.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {rest.map((m) => (
                <div key={m.id} className="reveal group">
                  <div
                    className="aspect-[3/4] relative overflow-hidden mb-4"
                    style={{ background: 'var(--paper-dark)' }}
                  >
                    <Portrait member={m} className="transition-all duration-500 group-hover:scale-105" />
                    <div
                      className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      style={{ background: 'var(--accent-warm)', mixBlendMode: 'multiply' }}
                    />
                  </div>
                  <h3 className="font-display text-lg uppercase leading-none">{m.name}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>
                    {m.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Hiring CTA */}
        <section
          className="px-6 lg:px-12 py-20 text-center"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          <h2
            className="font-display uppercase leading-[0.9] text-outline-paper mx-auto mb-10"
            style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}
          >
            {t('hiring_title')}
          </h2>
          <p className="mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(244,244,240,0.7)' }}>
            {t('hiring_lead')}
          </p>
          <Link
            href="/carrieres"
            className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ background: 'var(--accent-warm)', color: 'var(--paper)' }}
          >
            {t('hiring_button')} <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
