import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata({
    locale,
    path: '/processus',
    title: 'Processus — Une méthode claire, mesurable',
    description:
      "Les 6 étapes OverBrand pour transformer une idée en produit digital, en toute transparence : cadrage, design, développement, tests, mise en ligne, suivi.",
  })
}

const LONG_FORM: Record<number, string> = {
  0: "On ne démarre jamais dans le noir. D'abord, on écoute. Un premier échange de 30 à 60 minutes pour comprendre votre contexte, vos objectifs, vos contraintes. On sonde le budget sans tabou, on teste la faisabilité technique, on identifie les risques. À la fin, vous repartez avec un brief écrit et une estimation préliminaire — que vous poursuiviez avec nous ou non.",
  1: "Un document clair qui sert de contrat moral. Scope détaillé, phasage, jalons, tarification transparente, planning. Pas de surprises cachées, pas de frais surprises à mi-parcours. Vous savez exactement ce que vous achetez, quand, et pour combien.",
  2: "On designe avec vous, pas pour vous. Atelier de cadrage visuel, moodboard validé ensemble, wireframes co-construits. Maquettes HD livrées dans Figma avec accès en lecture pour votre équipe. Prototype interactif cliquable. Deux cycles de révisions inclus — on discute les désaccords avec des arguments, pas par politesse.",
  3: "Du code robuste, documenté, maintenable. Stack choisi pour tenir 3 à 5 ans, pas 6 mois. Déploiements continus sur des environnements de preview. Code review interne systématique. Tests automatisés sur les parcours critiques. Vous avez accès aux previews en temps réel et à nos commits.",
  4: "On ne livre pas ce qu'on n'utiliserait pas. QA rigoureuse sur 5 navigateurs, audit des performances (Core Web Vitals), audit SEO complet, audit d'accessibilité WCAG 2.2, tests de charge si pertinent. Vous recevez un rapport écrit avant toute mise en production.",
  5: "On reste à vos côtés après la livraison. Mise en production, formation équipes (2h par session de formation), documentation vidéo personnalisée, 30 jours de support inclus. Forfait de maintenance mensuel optionnel dès 49€/mois.",
}

export default async function ProcessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'process' })
  const steps = (t.raw('steps') ?? []) as Array<{ title: string; description: string }>

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <Navbar isLoggedIn={!!user} />
      <main className="lg:pl-16">
        {/* Hero */}
        <section className="px-6 lg:px-12 pt-32 md:pt-40 pb-16" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <p className="text-xs font-bold uppercase mb-6 reveal" style={{ color: 'var(--accent-warm)', letterSpacing: '0.28em' }}>
              Processus — 6 étapes
            </p>
            <h1
              className="font-display uppercase tracking-tight leading-[0.85] reveal"
              style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}
            >
              Une méthode <br />
              <span className="text-outline">claire,</span> <br />
              <span style={{ color: 'var(--primary)' }}>mesurable</span>.
            </h1>
            <p className="mt-10 text-xl max-w-3xl reveal" style={{ color: 'var(--text-muted)' }}>
              Chaque étape a ses livrables, ses dates, son prix. Pas de black-box, pas de surprises de dernière minute. Voici comment on travaille.
            </p>
          </div>
        </section>

        {/* Manifesto strip */}
        <section
          className="px-6 lg:px-12 py-16 text-center"
          style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--surface)' }}
        >
          <h2
            className="font-display uppercase leading-[0.95] max-w-5xl mx-auto reveal"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 4rem)' }}
          >
            Pas de black-box. Pas de surprises. <br />
            <span style={{ color: 'var(--accent-warm)' }}>Chaque étape a ses livrables, ses dates, son prix.</span>
          </h2>
        </section>

        {/* Six chapters */}
        {steps.map((step, i) => {
          const reverse = i % 2 === 1
          return (
            <section
              key={i}
              className="px-6 lg:px-12 py-20 md:py-28"
              style={{
                borderBottom: '1px solid var(--line)',
                background: i % 2 === 0 ? 'var(--bg)' : 'var(--surface)',
              }}
            >
              <div
                className={`max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 ${
                  reverse ? 'lg:[&>*:first-child]:order-last' : ''
                }`}
              >
                <div className="lg:col-span-5 reveal">
                  <span
                    className="font-display block leading-none mb-4"
                    style={{ fontSize: 'clamp(5rem, 14vw, 14rem)', color: 'var(--accent-warm)', opacity: 0.85 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display uppercase leading-tight mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
                    Livrable : document écrit · Durée : variable selon scope
                  </p>
                </div>
                <div className="lg:col-span-7 reveal">
                  <p
                    className="font-serif-it italic leading-tight mb-8"
                    style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', color: 'var(--primary)' }}
                  >
                    {step.description}
                  </p>
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {LONG_FORM[i] ?? ''}
                  </p>
                </div>
              </div>
            </section>
          )
        })}

        {/* Pricing tiers teaser */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-display uppercase mb-12 reveal" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              Et combien ça <span style={{ color: 'var(--primary)' }}>coûte</span> ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: '1px solid var(--line)' }}>
              {[
                { name: 'STARTER', price: '800€', desc: '2–4 semaines · site vitrine 5 pages' },
                { name: 'SIGNATURE', price: '3 500€', desc: '5–10 semaines · sur mesure, CMS, SEO', feat: true },
                { name: 'ENTERPRISE', price: 'Sur devis', desc: '10+ semaines · apps, intégrations' },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className="p-10 reveal flex flex-col"
                  style={{
                    background: tier.feat ? 'var(--primary)' : 'var(--card-bg)',
                    color: tier.feat ? 'var(--paper)' : 'var(--text)',
                    borderRight: '1px solid var(--line)',
                  }}
                >
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ opacity: 0.7 }}>
                    {tier.name}
                  </p>
                  <h3 className="font-display text-4xl md:text-5xl mb-4">{tier.price}</h3>
                  <p className="text-sm mb-6 flex-1">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-12 py-24 text-center" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <h2 className="font-display uppercase leading-[0.9] mb-10" style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}>
            Prêt à démarrer <br />
            la <span style={{ color: 'var(--accent-warm)' }}>consultation gratuite</span> ?
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ background: 'var(--accent-warm)', color: 'var(--paper)' }}
          >
            Réserver un call <ArrowRight size={14} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
