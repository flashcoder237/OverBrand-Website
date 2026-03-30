import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/sections/hero'
import { ServicesSection } from '@/components/sections/services'
import { ProjectsSection } from '@/components/sections/projects'
import { StatsSection } from '@/components/sections/stats'
import { AboutSection } from '@/components/sections/about'
import { ProcessSection } from '@/components/sections/process'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { FAQSection } from '@/components/sections/faq'
import { CTASection } from '@/components/sections/cta'
import { ContactSection } from '@/components/sections/contact'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { gqlClient } from '@/lib/graphql/client'
import {
  GET_SHOWCASE_PROJECTS,
  type GetShowcaseProjectsRes,
  unwrapEdges,
} from '@/lib/graphql/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://overbrand.net'

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
    // GraphQL unavailable — fall back to Supabase REST
    const { data } = await supabase
      .from('showcase_projects')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true })
      .limit(5)
    showcaseProjects = data
  }

  // ── FAQPage structured data ─────────────────────────────────────────────
  const tFaq = await getTranslations({ locale, namespace: 'faq' })
  const faqItems = tFaq.raw('items') as { q: string; a: string }[]

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
  const serviceItems = tServices.raw('items') as { title: string; description: string }[]

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
        <HeroSection />
        <ServicesSection />
        <ProjectsSection projects={showcaseProjects ?? []} />
        <StatsSection />
        <AboutSection />
        <ProcessSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
