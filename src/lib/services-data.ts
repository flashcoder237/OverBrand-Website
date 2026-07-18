// Shared service catalog — consumed by /services hub + /services/[slug] templates.
//
// Copy is trilingual (FR / EN / DE) via `Localized`. Structural fields — slug,
// index, stack, image, accent — are language-neutral and stay single. Prices are
// localized because the wording around the figure differs ("À partir de" /
// "From" / "Ab"), not the amount.

import { pick, type Localized, type Resolved } from '@/lib/i18n-content'

export type LocalizedService = {
  slug: string
  index: number
  title: Localized<string>
  tagline: Localized<string>
  description: Localized<string>
  deliverables: Localized<string[]>
  stack: string[]
  startingPrice: Localized<string>
  duration: Localized<string>
  image: string
  accent: 'blue' | 'orange' | 'ink'
}

/** A service with its copy already resolved to one locale. */
export type Service = Resolved<LocalizedService>

export const LOCALIZED_SERVICES: LocalizedService[] = [
  {
    slug: 'creation-sites-web',
    index: 1,
    title: {
      fr: 'Création de Sites Web',
      en: 'Website Design & Build',
      de: 'Websites gestalten & umsetzen',
    },
    tagline: {
      fr: 'Vitrines haut de gamme, e-commerce, portfolios.',
      en: 'High-end company sites, e-commerce, portfolios.',
      de: 'Hochwertige Unternehmensseiten, E-Commerce, Portfolios.',
    },
    description: {
      fr: "On ne livre pas un site. On livre un levier commercial — pensé pour convertir, optimisé pour le SEO, maintenable par vos équipes.",
      en: "We don't hand over a website. We hand over a commercial lever — built to convert, optimised for search, and maintainable by your own team.",
      de: "Wir liefern keine Website. Wir liefern einen Vertriebshebel — auf Conversion ausgelegt, für Suchmaschinen optimiert und von Ihrem Team pflegbar.",
    },
    deliverables: {
      fr: [
        'Stratégie & cadrage (positionnement, arborescence)',
        'Design UI/UX sur mesure (wireframes, maquettes, design system)',
        'Développement Next.js / Webflow / Shopify',
        'SEO technique embarqué (Core Web Vitals, schema.org)',
        'Formation équipe + documentation vidéo',
        'Maintenance évolutive (infogérance, support, mises à jour)',
      ],
      en: [
        'Strategy & scoping (positioning, site structure)',
        'Bespoke UI/UX design (wireframes, mockups, design system)',
        'Next.js / Webflow / Shopify development',
        'Technical SEO built in (Core Web Vitals, schema.org)',
        'Team training + video documentation',
        'Ongoing maintenance (managed hosting, support, updates)',
      ],
      de: [
        'Strategie & Rahmen (Positionierung, Seitenstruktur)',
        'Maßgeschneidertes UI/UX-Design (Wireframes, Mockups, Design-System)',
        'Entwicklung mit Next.js / Webflow / Shopify',
        'Technisches SEO von Anfang an (Core Web Vitals, schema.org)',
        'Team-Schulung + Video-Dokumentation',
        'Laufende Wartung (Managed Hosting, Support, Updates)',
      ],
    },
    stack: ['Next.js', 'React', 'Tailwind', 'Webflow', 'Shopify', 'Sanity', 'Vercel'],
    startingPrice: { fr: 'À partir de 800€', en: 'From €800', de: 'Ab 800 €' },
    duration: { fr: '2 à 6 semaines', en: '2 to 6 weeks', de: '2 bis 6 Wochen' },
    image:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1600&auto=format&fit=crop',
    accent: 'blue',
  },
  {
    slug: 'logiciels-applications',
    index: 2,
    title: {
      fr: 'Logiciels & Applications',
      en: 'Software & Applications',
      de: 'Software & Anwendungen',
    },
    tagline: {
      fr: 'Web et mobiles sur mesure.',
      en: 'Custom web and mobile.',
      de: 'Maßgeschneidert für Web und Mobile.',
    },
    description: {
      fr: "Des apps web et mobiles conçues pour scaler. Architecture moderne, API bien pensées, expérience utilisateur qui convertit.",
      en: "Web and mobile apps built to scale. Modern architecture, well-designed APIs, and a user experience that converts.",
      de: "Web- und Mobile-Apps, die mitwachsen. Moderne Architektur, durchdachte APIs und eine Nutzererfahrung, die konvertiert.",
    },
    deliverables: {
      fr: [
        'Audit produit + roadmap technique',
        'Design system & prototypage interactif',
        'Développement React Native / Next.js',
        'API REST / GraphQL + intégrations',
        'Tests automatisés & CI/CD',
        'Déploiement + monitoring',
      ],
      en: [
        'Product audit + technical roadmap',
        'Design system & interactive prototyping',
        'React Native / Next.js development',
        'REST / GraphQL APIs + integrations',
        'Automated tests & CI/CD',
        'Deployment + monitoring',
      ],
      de: [
        'Produkt-Audit + technische Roadmap',
        'Design-System & interaktives Prototyping',
        'Entwicklung mit React Native / Next.js',
        'REST- / GraphQL-APIs + Integrationen',
        'Automatisierte Tests & CI/CD',
        'Deployment + Monitoring',
      ],
    },
    stack: ['React Native', 'Node.js', 'Supabase', 'Prisma', 'GraphQL', 'Expo', 'Vercel'],
    startingPrice: { fr: 'À partir de 3 500€', en: 'From €3,500', de: 'Ab 3.500 €' },
    duration: { fr: '4 à 14 semaines', en: '4 to 14 weeks', de: '4 bis 14 Wochen' },
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    accent: 'orange',
  },
  {
    slug: 'hebergement-gestion',
    index: 3,
    title: {
      fr: 'Hébergement & Gestion',
      en: 'Hosting & Management',
      de: 'Hosting & Betreuung',
    },
    tagline: {
      fr: 'Infogérance, sécurité, CDN.',
      en: 'Managed hosting, security, CDN.',
      de: 'Managed Hosting, Sicherheit, CDN.',
    },
    description: {
      fr: "Votre site, tout le temps disponible. Monitoring 24/7, backups automatiques, mises à jour de sécurité, support technique humain.",
      en: "Your site, up around the clock. 24/7 monitoring, automatic backups, security updates, and technical support from an actual person.",
      de: "Ihre Website, jederzeit erreichbar. Monitoring rund um die Uhr, automatische Backups, Sicherheitsupdates und technischer Support von echten Menschen.",
    },
    deliverables: {
      fr: [
        'Hébergement haute performance (Vercel / OVH)',
        'CDN Cloudflare + certificats SSL',
        'Backups quotidiens',
        'Monitoring uptime + alerting',
        'Support technique sous 24h',
        'Rapports mensuels',
      ],
      en: [
        'High-performance hosting (Vercel / OVH)',
        'Cloudflare CDN + SSL certificates',
        'Daily backups',
        'Uptime monitoring + alerting',
        'Technical support within 24h',
        'Monthly reports',
      ],
      de: [
        'Hochleistungs-Hosting (Vercel / OVH)',
        'Cloudflare-CDN + SSL-Zertifikate',
        'Tägliche Backups',
        'Uptime-Monitoring + Alerting',
        'Technischer Support innerhalb von 24 Stunden',
        'Monatliche Reports',
      ],
    },
    stack: ['Vercel', 'Cloudflare', 'OVH', 'Datadog', 'Supabase'],
    startingPrice: {
      fr: 'À partir de 49€/mois',
      en: 'From €49/month',
      de: 'Ab 49 €/Monat',
    },
    duration: {
      fr: "Contrat à l'année",
      en: 'Annual contract',
      de: 'Jahresvertrag',
    },
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop',
    accent: 'blue',
  },
  {
    slug: 'publicite-en-ligne',
    index: 4,
    title: {
      fr: 'Publicité en Ligne',
      en: 'Online Advertising',
      de: 'Online-Werbung',
    },
    tagline: {
      fr: 'Google Ads & Meta Ads.',
      en: 'Google Ads & Meta Ads.',
      de: 'Google Ads & Meta Ads.',
    },
    description: {
      fr: "Des campagnes qui génèrent du ROI mesurable. Ciblage précis, création publicitaire A/B testée, reporting transparent.",
      en: "Campaigns that produce measurable ROI. Precise targeting, A/B tested creative, transparent reporting.",
      de: "Kampagnen mit messbarem ROI. Präzises Targeting, A/B-getestete Werbemittel, transparentes Reporting.",
    },
    deliverables: {
      fr: [
        'Audit & stratégie média',
        'Création publicitaire (visuels + copy)',
        'Tracking GA4 + tag plan',
        'Lancement + optimisation quotidienne',
        'Tableau de bord Looker Studio',
        'Rapports hebdomadaires',
      ],
      en: [
        'Media audit & strategy',
        'Ad creative (visuals + copy)',
        'GA4 tracking + tagging plan',
        'Launch + daily optimisation',
        'Looker Studio dashboard',
        'Weekly reports',
      ],
      de: [
        'Media-Audit & Strategie',
        'Werbemittel (Visuals + Texte)',
        'GA4-Tracking + Tagging-Konzept',
        'Launch + tägliche Optimierung',
        'Looker-Studio-Dashboard',
        'Wöchentliche Reports',
      ],
    },
    stack: ['Google Ads', 'Meta Ads', 'GA4', 'Looker Studio', 'Tag Manager'],
    startingPrice: {
      fr: 'À partir de 600€/mois + média',
      en: 'From €600/month + media spend',
      de: 'Ab 600 €/Monat + Mediabudget',
    },
    duration: {
      fr: 'Engagement 3 mois min.',
      en: '3-month minimum commitment',
      de: 'Mindestlaufzeit 3 Monate',
    },
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1600&auto=format&fit=crop',
    accent: 'orange',
  },
  {
    slug: 'visibilite-google',
    index: 5,
    title: {
      fr: 'Visibilité Google (SEO)',
      en: 'Google Visibility (SEO)',
      de: 'Google-Sichtbarkeit (SEO)',
    },
    tagline: {
      fr: 'Stratégie SEO complète.',
      en: 'End-to-end SEO strategy.',
      de: 'Umfassende SEO-Strategie.',
    },
    description: {
      fr: "Remonter dans Google, durablement. Audit technique, contenus optimisés, netlinking éditorial — aucune méthode grise.",
      en: "Climb in Google, and stay there. Technical audit, optimised content, editorial link building — no grey-hat shortcuts.",
      de: "Nachhaltig bei Google aufsteigen. Technisches Audit, optimierte Inhalte, redaktioneller Linkaufbau — keine Grauzonen-Methoden.",
    },
    deliverables: {
      fr: [
        'Audit SEO complet (technique, contenu, autorité)',
        'Recherche de mots-clés + stratégie de contenu',
        'Optimisation on-page & structured data',
        'Rédaction SEO (articles, pages cornerstone)',
        'Netlinking éditorial',
        'Rapports mensuels + ajustements',
      ],
      en: [
        'Full SEO audit (technical, content, authority)',
        'Keyword research + content strategy',
        'On-page optimisation & structured data',
        'SEO copywriting (articles, cornerstone pages)',
        'Editorial link building',
        'Monthly reports + adjustments',
      ],
      de: [
        'Vollständiges SEO-Audit (Technik, Inhalt, Autorität)',
        'Keyword-Recherche + Content-Strategie',
        'On-Page-Optimierung & strukturierte Daten',
        'SEO-Texte (Artikel, Cornerstone-Seiten)',
        'Redaktioneller Linkaufbau',
        'Monatliche Reports + Anpassungen',
      ],
    },
    stack: ['Ahrefs', 'Search Console', 'Screaming Frog', 'Semrush'],
    startingPrice: {
      fr: 'À partir de 900€/mois',
      en: 'From €900/month',
      de: 'Ab 900 €/Monat',
    },
    duration: {
      fr: 'Engagement 6 mois min.',
      en: '6-month minimum commitment',
      de: 'Mindestlaufzeit 6 Monate',
    },
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    accent: 'ink',
  },
  {
    slug: 'logo-identite-marque',
    index: 6,
    title: {
      fr: 'Logo & Identité de Marque',
      en: 'Logo & Brand Identity',
      de: 'Logo & Markenidentität',
    },
    tagline: {
      fr: 'Identités visuelles mémorables.',
      en: 'Visual identities that stick.',
      de: 'Visuelle Identitäten, die im Kopf bleiben.',
    },
    description: {
      fr: "Une identité qui traverse les supports. Stratégie de marque, logo, charte graphique complète, guidelines pour vos équipes.",
      en: "An identity that holds up across every medium. Brand strategy, logo, a complete visual system, and guidelines your team can follow.",
      de: "Eine Identität, die über alle Medien hinweg trägt. Markenstrategie, Logo, vollständiges Gestaltungssystem und Richtlinien für Ihr Team.",
    },
    deliverables: {
      fr: [
        'Atelier de positionnement de marque',
        'Création de logo (3 pistes)',
        'Charte graphique complète (PDF + Figma)',
        'Système typographique et chromatique',
        'Templates de communication (social, print)',
        'Brand book livré',
      ],
      en: [
        'Brand positioning workshop',
        'Logo design (3 directions)',
        'Complete visual guidelines (PDF + Figma)',
        'Typographic and colour system',
        'Communication templates (social, print)',
        'Brand book delivered',
      ],
      de: [
        'Workshop zur Markenpositionierung',
        'Logo-Entwurf (3 Richtungen)',
        'Vollständiges Corporate Design (PDF + Figma)',
        'Typografie- und Farbsystem',
        'Kommunikationsvorlagen (Social, Print)',
        'Brand Book inklusive',
      ],
    },
    stack: ['Figma', 'Illustrator', 'After Effects'],
    startingPrice: { fr: 'À partir de 1 200€', en: 'From €1,200', de: 'Ab 1.200 €' },
    duration: { fr: '3 à 5 semaines', en: '3 to 5 weeks', de: '3 bis 5 Wochen' },
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b8?q=80&w=1600&auto=format&fit=crop',
    accent: 'orange',
  },
  {
    slug: 'creation-contenus',
    index: 7,
    title: {
      fr: 'Création de Contenus',
      en: 'Content Production',
      de: 'Content-Produktion',
    },
    tagline: {
      fr: 'Motion, graphisme, visuels.',
      en: 'Motion, graphics, visuals.',
      de: 'Motion, Grafik, Visuals.',
    },
    description: {
      fr: "Des contenus visuels qui portent votre marque. Photo produit, motion design, social media, direction artistique cohérente.",
      en: "Visual content that carries your brand. Product photography, motion design, social media, and a consistent art direction throughout.",
      de: "Visuelle Inhalte, die Ihre Marke tragen. Produktfotografie, Motion Design, Social Media und eine durchgängige Art Direction.",
    },
    deliverables: {
      fr: [
        'Direction artistique + moodboard',
        'Shooting photo (studio ou extérieur)',
        'Motion design social (reels, TikTok)',
        'Illustrations & infographies',
        'Post-production + étalonnage',
        'Livraison multi-formats',
      ],
      en: [
        'Art direction + moodboard',
        'Photo shoot (studio or on location)',
        'Social motion design (reels, TikTok)',
        'Illustrations & infographics',
        'Post-production + colour grading',
        'Delivery in every format needed',
      ],
      de: [
        'Art Direction + Moodboard',
        'Fotoshooting (Studio oder vor Ort)',
        'Social Motion Design (Reels, TikTok)',
        'Illustrationen & Infografiken',
        'Postproduktion + Color Grading',
        'Auslieferung in allen benötigten Formaten',
      ],
    },
    stack: ['Premiere', 'After Effects', 'Lightroom', 'Figma'],
    startingPrice: {
      fr: 'Forfait sur mesure',
      en: 'Custom package',
      de: 'Individuelles Paket',
    },
    duration: {
      fr: 'Variable selon volume',
      en: 'Depends on volume',
      de: 'Je nach Umfang',
    },
    image:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop',
    accent: 'blue',
  },
]

function resolve(s: LocalizedService, locale: string): Service {
  return {
    ...s,
    title: pick(s.title, locale),
    tagline: pick(s.tagline, locale),
    description: pick(s.description, locale),
    deliverables: pick(s.deliverables, locale),
    startingPrice: pick(s.startingPrice, locale),
    duration: pick(s.duration, locale),
  }
}

/** The catalogue with every copy field resolved to `locale`. */
export function getServices(locale: string): Service[] {
  return LOCALIZED_SERVICES.map((s) => resolve(s, locale))
}

export function getService(slug: string, locale: string): Service | undefined {
  const found = LOCALIZED_SERVICES.find((s) => s.slug === slug)
  return found && resolve(found, locale)
}

/** Slugs only — for `generateStaticParams` and the sitemap, which need no copy. */
export const SERVICE_SLUGS = LOCALIZED_SERVICES.map((s) => s.slug)
