import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
// Above-the-fold — loaded immediately
import { HeroSection } from '@/components/sections/hero'
import { ServicesSection } from '@/components/sections/services'
import { ProjectsSection } from '@/components/sections/projects'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { gqlClient } from '@/lib/graphql/client'
import {
  GET_SHOWCASE_PROJECTS,
  type GetShowcaseProjectsRes,
  unwrapEdges,
} from '@/lib/graphql/queries'

// Below-the-fold — lazy loaded (reduces initial JS bundle)
const StatsSection        = dynamic(() => import('@/components/sections/stats').then(m => ({ default: m.StatsSection })))
const ProcessSection      = dynamic(() => import('@/components/sections/process').then(m => ({ default: m.ProcessSection })))
const TestimonialsSection = dynamic(() => import('@/components/sections/testimonials').then(m => ({ default: m.TestimonialsSection })))

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://overbrand.net'

// Minimal skeleton used while a section's JS chunk loads
function SectionSkeleton() {
  return (
    <div
      className="section"
      style={{ background: 'var(--bg)', minHeight: '200px' }}
      aria-hidden
    />
  )
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ── Fetch showcase projects via GraphQL (fallback → REST) ───────────────
  let showcaseProjects = null

  try {
    const data = await gqlClient.request<GetShowcaseProjectsRes>(GET_SHOWCASE_PROJECTS)
    showcaseProjects = unwrapEdges(data.showcase_projectsCollection?.edges)
  } catch {
    // fallback to REST
  }

  if (!showcaseProjects) {
    try {
      const { data } = await supabase
        .from('showcase_projects')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true })
        .limit(5)
      showcaseProjects = data
    } catch {
      showcaseProjects = []
    }
  }

  // ── FAQPage structured data ─────────────────────────────────────────────
  const tFaq = await getTranslations({ locale, namespace: 'faq' })
  const rawFaqItems = tFaq.raw('items')
  const faqItems: { q: string; a: string }[] = Array.isArray(rawFaqItems) ? rawFaqItems : []

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/${locale}/#faq`,
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  // ── Services structured data ────────────────────────────────────────────
  const tServices = await getTranslations({ locale, namespace: 'services' })
  const rawServiceItems = tServices.raw('items')
  const serviceItems: { title: string; description: string }[] = Array.isArray(rawServiceItems)
    ? rawServiceItems
    : Object.values(rawServiceItems ?? {})

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/${locale}/#services`,
    name: locale === 'fr' ? 'Nos Services' : 'Our Services',
    itemListElement: serviceItems.map((svc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: svc.title,
        description: svc.description,
        provider: { '@id': `${SITE_URL}/#organization` },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <Navbar isLoggedIn={!!user} />
      <main>
        {/* ── Above the fold — immediate ── */}
        <HeroSection />

        {/* ── Below the fold — lazy loaded ── */}
        <Suspense fallback={<SectionSkeleton />}>
          <StatsSection />
        </Suspense>
        <ServicesSection />
        <ProjectsSection projects={showcaseProjects ?? []} />
        <Suspense fallback={<SectionSkeleton />}>
          <ProcessSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <TestimonialsSection />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
