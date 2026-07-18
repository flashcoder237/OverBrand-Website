import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { NewsletterForm } from './newsletter-form'
import { pageMetadata } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'insightsPage' })
  return pageMetadata({
    locale,
    path: '/insights',
    title: t('meta_title'),
    description: t('meta_description'),
  })
}

type Article = {
  title: string
  category: string
  author: string
  readTime: string
  excerpt?: string
  image?: string
  featured?: boolean
  dark?: boolean
  accent?: boolean
}

const FEATURED: Article = {
  title: 'Pourquoi le design system est mort. Vive le design system.',
  category: 'Dossier',
  author: 'Cédric Tefoye',
  readTime: '12 min',
  image: 'https://images.unsplash.com/photo-1541888049103-128f773ff17c?q=80&w=2000&auto=format&fit=crop',
}

const EDITOR_PICKS: Article[] = [
  {
    title: "L'état du web au Cameroun en 2025",
    category: 'Édito',
    author: 'Équipe OverBrand',
    readTime: '25 min',
    excerpt: "Entre infrastructures en mutation et une génération de créatifs qui repousse les limites techniques.",
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
    featured: true,
  },
  {
    title: 'Comment on a migré 50 sites vers Next.js 15',
    category: 'Dev',
    author: 'Éric Mbappe',
    readTime: '15 min',
    excerpt: "Retours d'expérience et architecture d'une refonte massive.",
  },
  {
    title: 'Interview : Marie Nguyen de BioShop',
    category: 'Interview',
    author: 'Aïcha Traoré',
    readTime: '20 min',
    excerpt: "Comment aligner éthique et conversion e-commerce en 2025.",
    dark: true,
  },
]

const ARTICLES: Article[] = [
  { title: 'Le SEO technique en 2025 : checklist complète', category: 'Tech', author: 'Aïcha Traoré', readTime: '18 min', excerpt: 'Core Web Vitals, API rendering, structure sémantique.' },
  { title: 'Motion design : 5 principes pour ne pas lasser', category: 'Design', author: 'Fatou Diallo', readTime: '10 min', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' },
  { title: 'Devis agence : pourquoi on publie nos prix', category: 'Business', author: 'Cédric Tefoye', readTime: '8 min', excerpt: "Fini le « sur devis ». Comment la transparence tarifaire est devenue notre meilleur filtre client.", dark: true },
  { title: 'Le design system de BioShop en 47 tokens', category: 'Design', author: 'Sandrine Biya', readTime: '12 min', excerpt: "Des tokens Figma à l'implémentation React." },
  { title: 'Next.js 16 : ce qu\'il faut retenir', category: 'Tech', author: 'Éric Mbappe', readTime: '6 min', excerpt: "Analyse du dernier patch et implications." },
  { title: 'Brand strategy pour une startup en Afrique', category: 'Stratégie', author: 'Cédric Tefoye', readTime: '14 min', excerpt: 'Éviter les clichés visuels. Construire une identité globale avec un ancrage local.', accent: true },
  { title: 'Accessibilité : WCAG 2.2 en pratique', category: 'Dev', author: 'Patrice Nkomo', readTime: '15 min', excerpt: 'Tests automatisés et navigation clavier.' },
  { title: 'Photographie produit : home studio à 500€', category: 'Tuto', author: 'Fatou Diallo', readTime: '9 min', image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop' },
  { title: 'Pricing SaaS : les erreurs qu\'on a faites', category: 'Business', author: 'Marlyse Ngono', readTime: '11 min', excerpt: 'Psychologie des prix et architecture des plans B2B.' },
]

const CAT_COLOR: Record<string, string> = {
  Tech: 'var(--primary)',
  Dev: 'var(--ink)',
  Design: 'var(--accent-warm)',
  Business: '#10B981',
  Stratégie: '#8B5CF6',
  Tuto: '#F59E0B',
  Édito: 'var(--primary)',
  Interview: 'var(--accent-warm)',
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'insightsPage' })
  const filters = t.raw('filters') as string[]

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <Navbar isLoggedIn={!!user} />
      <main className="lg:pl-16">
        {/* Hero */}
        <section className="px-6 lg:px-12 pt-32 md:pt-40 pb-16" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
          <div className="max-w-6xl">
            <p className="text-xs font-bold uppercase mb-6 reveal flex items-center gap-3" style={{ color: 'var(--accent-warm)', letterSpacing: '0.22em' }}>
              <span className="w-10 h-[1px]" style={{ background: 'var(--ink)' }} />
              {t('eyebrow')}
            </p>
            <h1
              className="font-display uppercase tracking-tight leading-[0.85] reveal"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 10rem)' }}
            >
              {t('title_1')} <br />
              <span className="text-outline">{t('title_2')}</span> <br />
              {t('title_3')}<span style={{ color: 'var(--accent-warm)' }}>.</span>
            </h1>
            <p className="mt-10 text-xl max-w-2xl reveal" style={{ color: 'var(--text-muted)', borderLeft: '2px solid var(--ink)', paddingLeft: '1.5rem' }}>
              {t('lead')}
            </p>
          </div>
        </section>

        {/* Featured article */}
        <Link
          href="/insights"
          className="block relative h-[70vh] overflow-hidden group"
          style={{ borderBottom: '1px solid var(--line)' }}
        >
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${FEATURED.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--ink), transparent 60%)' }} />
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row justify-between items-end gap-6" style={{ color: 'var(--paper)' }}>
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-3 mb-6 text-xs uppercase tracking-widest font-bold">
                <span className="px-3 py-1 rounded-full" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
                  {FEATURED.category}
                </span>
                <span>{FEATURED.author}</span>
                <span>·</span>
                <span>{FEATURED.readTime}</span>
                <span>·</span>
                <span>15 mars 2025</span>
              </div>
              <h2 className="font-display uppercase leading-[0.9]" style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}>
                {FEATURED.title}
              </h2>
            </div>
            <span
              className="inline-flex items-center gap-2 px-6 py-4 text-sm uppercase font-semibold tracking-widest shrink-0"
              style={{ background: 'var(--accent-warm)', color: 'var(--paper)' }}
            >
              Lire l'essai <ArrowUpRight size={14} />
            </span>
          </div>
        </Link>

        {/* Filter pills */}
        <div
          className="px-6 lg:px-12 py-4 flex gap-2 overflow-x-auto sticky top-16 z-30"
          style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--line)', backdropFilter: 'blur(20px)' }}
        >
          {filters.map((f, i) => (
            <button
              key={f}
              className="shrink-0 px-5 py-1.5 text-sm font-semibold uppercase tracking-wider rounded-full"
              style={{
                background: i === 0 ? 'var(--ink)' : 'transparent',
                color: i === 0 ? 'var(--paper)' : 'var(--text)',
                border: '1px solid var(--line)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Editor's picks */}
        <section className="grid grid-cols-1 lg:grid-cols-12" style={{ borderBottom: '1px solid var(--line)' }}>
          <article className="lg:col-span-8 lg:border-r border-b lg:border-b-0 p-8 md:p-12 flex flex-col justify-between" style={{ borderColor: 'var(--line)' }}>
            <div>
              <span className="tag-pill mb-6" style={{ background: 'var(--primary)', color: 'var(--paper)', borderColor: 'var(--primary)' }}>
                {EDITOR_PICKS[0].category}
              </span>
              <h3 className="font-display text-3xl md:text-5xl uppercase mt-6 mb-4 leading-[0.95]">
                {EDITOR_PICKS[0].title}
              </h3>
              <p className="text-lg max-w-xl" style={{ color: 'var(--text-muted)', borderLeft: '2px solid var(--accent-warm)', paddingLeft: '1rem' }}>
                {EDITOR_PICKS[0].excerpt}
              </p>
            </div>
            <div
              className="w-full h-64 mt-8 overflow-hidden"
              style={{
                backgroundImage: `url('${EDITOR_PICKS[0].image}')`,
                backgroundSize: 'cover',
                filter: 'grayscale(1)',
              }}
            />
          </article>

          <div className="lg:col-span-4 flex flex-col">
            <article
              className="flex-1 p-8 border-b"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--line)' }}
            >
              <span className="tag-pill mb-6" style={{ color: 'var(--text)', borderColor: 'var(--ink)' }}>
                {EDITOR_PICKS[1].category}
              </span>
              <h3 className="font-display text-2xl md:text-3xl uppercase leading-tight mt-5">
                {EDITOR_PICKS[1].title}
              </h3>
              <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>{EDITOR_PICKS[1].excerpt}</p>
            </article>
            <article
              className="flex-1 p-8 group transition-colors"
              style={{ background: EDITOR_PICKS[2].dark ? 'var(--ink)' : 'var(--card-bg)', color: EDITOR_PICKS[2].dark ? 'var(--paper)' : 'var(--text)' }}
            >
              <span className="tag-pill mb-6" style={{ color: 'var(--accent-warm)', borderColor: 'var(--accent-warm)' }}>
                {EDITOR_PICKS[2].category}
              </span>
              <h3 className="font-display text-2xl md:text-3xl uppercase leading-tight mt-5">
                {EDITOR_PICKS[2].title}
              </h3>
              <p className="mt-4 text-sm opacity-80">{EDITOR_PICKS[2].excerpt}</p>
            </article>
          </div>
        </section>

        {/* Articles grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[1px]" style={{ background: 'var(--line)', borderBottom: '1px solid var(--line)' }}>
          {ARTICLES.map((a, i) => (
            <article
              key={i}
              className="p-6 md:p-8 flex flex-col group cursor-pointer"
              style={{
                background: a.dark ? 'var(--ink)' : a.accent ? 'var(--paper-dark)' : 'var(--paper)',
                color: a.dark ? 'var(--paper)' : 'var(--text)',
                minHeight: a.image ? '420px' : undefined,
              }}
            >
              {a.image && (
                <div
                  className="h-48 mb-6 -m-6 md:-m-8 mb-6"
                  style={{
                    backgroundImage: `url('${a.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              )}
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: CAT_COLOR[a.category] ?? 'var(--primary)' }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{a.category}</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl uppercase leading-tight mb-3 group-hover:underline underline-offset-4">
                  {a.title}
                </h3>
                {a.excerpt && (
                  <p className="text-sm leading-relaxed" style={{ opacity: 0.75 }}>{a.excerpt}</p>
                )}
              </div>
              <div className="mt-6 pt-4 flex justify-between text-xs uppercase tracking-widest opacity-60" style={{ borderTop: '1px solid currentColor' }}>
                <span>{a.author}</span>
                <span>{a.readTime}</span>
              </div>
            </article>
          ))}
        </section>

        {/* Newsletter */}
        <section className="px-6 lg:px-12 py-20" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(244,244,240,0.6)' }}>
                {t('newsletter_eyebrow')}
              </p>
              <h2 className="font-display uppercase leading-[0.9]" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                {t('newsletter_title_1')}{' '}
                <span style={{ color: 'var(--primary)' }}>{t('newsletter_highlight')}</span>{' '}
                {t('newsletter_title_2')}
              </h2>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
