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

export default async function HomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: showcaseProjects } = await supabase
    .from('showcase_projects')
    .select('*')
    .eq('visible', true)
    .order('display_order', { ascending: true })
    .limit(5)

  return (
    <>
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
