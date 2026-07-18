// Real OverBrand case studies — content sourced from the live products and their
// repositories (stacks, module counts, published platform figures).
//
// Two kinds live side by side (see `kind`): EventEz and TKAMS are solutions
// OverBrand edits itself; everything else was delivered for a client.
//
// NOTE — fields marked `// À CONFIRMER` are the only ones not derived from a
// verifiable source (project durations, phase windows, team credits). Review them
// before publishing. Client quotes are intentionally absent: the case-study
// template skips the pull-quote block when `quote` is undefined, rather than
// attributing invented words to a real client.

import { pick, type Localized } from '@/lib/i18n-content'

export type CasePhase = {
  label: string
  window: string
  icon: 'search' | 'box' | 'devices' | 'code'
}

export type CaseMetric = {
  value: string
  suffix?: string
  label: string
  note: string
  tone: 'orange' | 'paper' | 'blue' | 'outline'
}

/**
 * `produit` — une solution éditée par OverBrand (EventEz, TKAMS).
 * `client`  — un projet livré pour un tiers.
 */
export type CaseKind = 'produit' | 'client'

/** A case study as the templates consume it: one locale, plain strings. */
export type CaseStudy = {
  slug: string
  ref: string
  kind: CaseKind
  titleLead: string
  titleTrail: string
  title: string
  client: string
  year: string
  services: string[]
  duration: string
  url: string
  urlLabel: string
  category: string
  cover: string
  gallery: string[]
  mandate: string
  challenge: string
  phases: CasePhase[]
  metrics: CaseMetric[]
  palette: { name: string; hex: string }[]
  stack: { label: string; items: string[] }[]
  deliverables: string[]
  quote?: { text: string; author: string; role: string }
  outcomes: { title: string; body: string; tone: 'blue' | 'orange' }[]
  credits: { role: string; people: { name: string; lead?: boolean }[] }[]
}

/**
 * The authored shape. Every leaf that carries language is `Localized`, sitting
 * next to its siblings — no arrays kept in parallel across locales, which is
 * what silently desyncs when someone reorders a list.
 *
 * Language-neutral by design and therefore written once: slugs, refs, years,
 * URLs, image paths, hex codes, metric figures, tech names, people's names,
 * and the icon/tone enums.
 */
export type LocalizedCaseStudy = {
  slug: string
  ref: string
  kind: CaseKind
  /** Hero wordmark is split in two lines, second one outlined. */
  titleLead: Localized<string>
  titleTrail: Localized<string>
  title: string
  client: Localized<string>
  year: string
  services: Localized<string[]>
  duration: Localized<string>
  url: string
  urlLabel: string
  category: Localized<string>
  cover: string
  gallery: string[]
  mandate: Localized<string>
  challenge: Localized<string>
  phases: { label: Localized<string>; window: Localized<string>; icon: CasePhase['icon'] }[]
  metrics: {
    value: string
    suffix?: string
    label: Localized<string>
    note: Localized<string>
    tone: CaseMetric['tone']
  }[]
  palette: { name: Localized<string>; hex: string }[]
  stack: { label: Localized<string>; items: Localized<string[]> }[]
  deliverables: Localized<string[]>
  quote?: { text: Localized<string>; author: string; role: Localized<string> }
  outcomes: { title: Localized<string>; body: Localized<string>; tone: 'blue' | 'orange' }[]
  credits: { role: Localized<string>; people: { name: string; lead?: boolean }[] }[]
}

export const LOCALIZED_CASE_STUDIES: LocalizedCaseStudy[] = [
  {
    slug: 'buynsellem',
    ref: 'CS-01',
    kind: 'client',
    titleLead: { fr: "BUY'N'", en: "BUY'N'", de: "BUY'N'" },
    titleTrail: { fr: 'SELLEM.', en: 'SELLEM.', de: 'SELLEM.' },
    title: "Buy'N'Sellem",
    client: { fr: "Buy'N'Sellem", en: "Buy'N'Sellem", de: "Buy'N'Sellem" },
    year: '2025',
    services: {
      fr: ['Produit & UX', 'Web Next.js', 'App mobile', 'CMS headless'],
      en: ['Product & UX', 'Next.js web', 'Mobile app', 'Headless CMS'],
      de: ['Produkt & UX', 'Next.js-Web', 'Mobile App', 'Headless CMS'],
    },
    duration: { fr: '16 semaines', en: '16 weeks', de: '16 Wochen' }, // À CONFIRMER
    url: 'https://buynsellem.com',
    urlLabel: 'buynsellem.com',
    category: {
      fr: 'Marketplace · Web · Mobile',
      en: 'Marketplace · Web · Mobile',
      de: 'Marktplatz · Web · Mobile',
    },
    cover: '/projets/buynsellem-01.jpg',
    gallery: ['/projets/buynsellem-01.jpg', '/projets/buynsellem-02.jpg'],
    mandate: {
      fr: "Buy'N'Sellem voulait une marketplace de petites annonces pensée pour le Cameroun — pas une copie d'un modèle occidental. Recherche géolocalisée par ville, prix en XAF, négociation directe entre acheteur et vendeur, et une app mobile qui fonctionne sur des réseaux lents.",
      en: "Buy'N'Sellem wanted a classifieds marketplace designed for Cameroon — not a copy of a Western template. Location-based search by city, prices in XAF, direct buyer-to-seller negotiation, and a mobile app that works on slow networks.",
      de: "Buy'N'Sellem wollte einen Kleinanzeigen-Marktplatz, der für Kamerun gedacht ist — keine Kopie einer westlichen Vorlage. Ortsbezogene Suche nach Stadt, Preise in XAF, direkte Verhandlung zwischen Käufer und Verkäufer und eine mobile App, die auch in langsamen Netzen funktioniert.",
    },
    challenge: {
      fr: "Livrer simultanément un site web et une application mobile natives, partageant la même API, le même modèle de données et la même logique métier — sans dupliquer le code entre les deux plateformes.",
      en: 'Ship a website and a native mobile app at the same time, sharing one API, one data model and one set of business rules — without duplicating code across the two platforms.',
      de: 'Website und native Mobile-App gleichzeitig ausliefern — mit einer gemeinsamen API, einem Datenmodell und einer Geschäftslogik, ohne Code zwischen den beiden Plattformen zu duplizieren.',
    },
    phases: [
      {
        label: {
          fr: 'Cadrage & modèle de données',
          en: 'Scoping & data model',
          de: 'Rahmen & Datenmodell',
        },
        window: { fr: 'Semaines 1-3', en: 'Weeks 1-3', de: 'Wochen 1-3' },
        icon: 'search',
      }, // À CONFIRMER
      {
        label: {
          fr: 'Design system & maquettes',
          en: 'Design system & mockups',
          de: 'Design-System & Entwürfe',
        },
        window: { fr: 'Semaines 4-7', en: 'Weeks 4-7', de: 'Wochen 4-7' },
        icon: 'box',
      },
      {
        label: {
          fr: 'Web + mobile en parallèle',
          en: 'Web + mobile in parallel',
          de: 'Web und Mobile parallel',
        },
        window: { fr: 'Semaines 8-13', en: 'Weeks 8-13', de: 'Wochen 8-13' },
        icon: 'devices',
      },
      {
        label: {
          fr: 'Chat temps réel & mise en prod',
          en: 'Real-time chat & go-live',
          de: 'Echtzeit-Chat & Livegang',
        },
        window: { fr: 'Semaines 14-16', en: 'Weeks 14-16', de: 'Wochen 14-16' },
        icon: 'code',
      },
    ],
    metrics: [
      {
        value: '10K',
        suffix: '+',
        label: { fr: 'Utilisateurs actifs', en: 'Active users', de: 'Aktive Nutzer' },
        note: {
          fr: 'Chiffre publié par la plateforme.',
          en: 'Figure published by the platform.',
          de: 'Von der Plattform veröffentlichte Zahl.',
        },
        tone: 'orange',
      },
      {
        value: '50K',
        suffix: '+',
        label: { fr: 'Annonces publiées', en: 'Listings published', de: 'Veröffentlichte Anzeigen' },
        note: {
          fr: 'Catalogue vivant, modéré en continu.',
          en: 'A living catalogue, moderated continuously.',
          de: 'Ein lebendiger Katalog, laufend moderiert.',
        },
        tone: 'paper',
      },
      {
        value: '100',
        suffix: '+',
        label: { fr: 'Villes couvertes', en: 'Cities covered', de: 'Abgedeckte Städte' },
        note: {
          fr: 'Douala, Yaoundé, Dschang, Bafoussam…',
          en: 'Douala, Yaoundé, Dschang, Bafoussam…',
          de: 'Douala, Yaoundé, Dschang, Bafoussam…',
        },
        tone: 'blue',
      },
      {
        value: '2',
        label: { fr: 'Applications', en: 'Applications', de: 'Anwendungen' },
        note: {
          fr: 'Web et mobile sur un socle partagé.',
          en: 'Web and mobile on a shared foundation.',
          de: 'Web und Mobile auf gemeinsamer Basis.',
        },
        tone: 'outline',
      },
    ],
    palette: [
      { name: { fr: 'Bleu marque', en: 'Brand blue', de: 'Markenblau' }, hex: '#1B3FAF' },
      { name: { fr: 'Orange action', en: 'Action orange', de: 'Aktionsorange' }, hex: '#F5A020' },
      { name: { fr: 'Encre', en: 'Ink', de: 'Tinte' }, hex: '#111827' },
      { name: { fr: 'Surface', en: 'Surface', de: 'Fläche' }, hex: '#F8FAFC' },
      { name: { fr: 'Blanc', en: 'White', de: 'Weiß' }, hex: '#FFFFFF' },
    ],
    stack: [
      {
        label: { fr: 'Web', en: 'Web', de: 'Web' },
        items: {
          fr: ['Next.js 13 (App Router)', 'Tailwind CSS', 'DaisyUI', 'NextAuth.js'],
          en: ['Next.js 13 (App Router)', 'Tailwind CSS', 'DaisyUI', 'NextAuth.js'],
          de: ['Next.js 13 (App Router)', 'Tailwind CSS', 'DaisyUI', 'NextAuth.js'],
        },
      },
      {
        label: { fr: 'Mobile', en: 'Mobile', de: 'Mobile' },
        items: {
          fr: ['Ionic 7', 'React 18', 'Vite', 'Capacitor 5'],
          en: ['Ionic 7', 'React 18', 'Vite', 'Capacitor 5'],
          de: ['Ionic 7', 'React 18', 'Vite', 'Capacitor 5'],
        },
      },
      {
        label: {
          fr: 'Back-end & services',
          en: 'Back end & services',
          de: 'Backend & Dienste',
        },
        items: {
          fr: ['Directus (CMS headless)', 'Firebase Firestore', 'Firebase Auth', 'Google Maps API'],
          en: ['Directus (headless CMS)', 'Firebase Firestore', 'Firebase Auth', 'Google Maps API'],
          de: ['Directus (Headless CMS)', 'Firebase Firestore', 'Firebase Auth', 'Google Maps API'],
        },
      },
      {
        label: { fr: 'Architecture', en: 'Architecture', de: 'Architektur' },
        items: {
          fr: ['Monorepo pnpm', 'Libs partagées : api, types, hooks, functions', 'Atomic Design'],
          en: ['pnpm monorepo', 'Shared libs: api, types, hooks, functions', 'Atomic Design'],
          de: ['pnpm-Monorepo', 'Gemeinsame Libs: api, types, hooks, functions', 'Atomic Design'],
        },
      },
    ],
    deliverables: {
      fr: [
        'Marketplace web responsive (FR / EN)',
        'Application mobile iOS & Android (Capacitor)',
        'Messagerie temps réel acheteur ↔ vendeur',
        'Back-office de modération Directus',
        'Recherche géolocalisée multi-villes',
      ],
      en: [
        'Responsive web marketplace (FR / EN)',
        'iOS & Android mobile app (Capacitor)',
        'Real-time buyer ↔ seller messaging',
        'Directus moderation back office',
        'Location-based search across cities',
      ],
      de: [
        'Responsiver Web-Marktplatz (FR / EN)',
        'Mobile App für iOS & Android (Capacitor)',
        'Echtzeit-Nachrichten zwischen Käufer und Verkäufer',
        'Directus-Backoffice zur Moderation',
        'Ortsbezogene Suche über mehrere Städte',
      ],
    },
    outcomes: [
      {
        title: {
          fr: 'Un socle, deux plateformes',
          en: 'One foundation, two platforms',
          de: 'Eine Basis, zwei Plattformen',
        },
        body: {
          fr: "Les quatre librairies partagées du monorepo — client API, types, hooks et fonctions utilitaires — sont consommées à l'identique par le web et le mobile. Une évolution du modèle d'annonce se propage aux deux applications sans réécriture.",
          en: 'The monorepo\'s four shared libraries — API client, types, hooks and utility functions — are consumed identically by web and mobile. A change to the listing model propagates to both applications without a rewrite.',
          de: 'Die vier gemeinsamen Bibliotheken des Monorepos — API-Client, Typen, Hooks und Hilfsfunktionen — werden von Web und Mobile identisch genutzt. Eine Änderung am Anzeigenmodell wirkt sich ohne Neuschreiben auf beide Anwendungen aus.',
        },
        tone: 'blue',
      },
      {
        title: {
          fr: 'Le temps réel sans back-end lourd',
          en: 'Real time without a heavy back end',
          de: 'Echtzeit ohne schweres Backend',
        },
        body: {
          fr: "Plutôt que de maintenir un serveur de sockets, la messagerie s'appuie sur Firestore. Les conversations se synchronisent instantanément entre le web et le mobile, et l'infrastructure reste réduite à un CMS Directus et un projet Firebase.",
          en: 'Rather than maintaining a socket server, messaging runs on Firestore. Conversations sync instantly between web and mobile, and the infrastructure stays down to one Directus CMS and one Firebase project.',
          de: 'Statt einen Socket-Server zu betreiben, läuft das Messaging über Firestore. Unterhaltungen synchronisieren sich sofort zwischen Web und Mobile, und die Infrastruktur beschränkt sich auf ein Directus-CMS und ein Firebase-Projekt.',
        },
        tone: 'orange',
      },
    ],
    credits: [
      {
        role: { fr: 'Produit & Direction', en: 'Product & Direction', de: 'Produkt & Leitung' },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      },
      {
        role: { fr: 'Ingénierie', en: 'Engineering', de: 'Entwicklung' },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      }, // À CONFIRMER
    ],
  },

  {
    slug: 'coeurs-braves',
    ref: 'CS-02',
    kind: 'client',
    titleLead: { fr: 'CŒURS', en: 'CŒURS', de: 'CŒURS' },
    titleTrail: { fr: 'BRAVES.', en: 'BRAVES.', de: 'BRAVES.' },
    title: 'Cœurs Braves',
    client: { fr: 'Cœurs Braves', en: 'Cœurs Braves', de: 'Cœurs Braves' },
    year: '2026',
    services: {
      fr: ['Direction artistique', 'Astro', 'Trilingue', 'CMS Decap'],
      en: ['Art direction', 'Astro', 'Trilingual', 'Decap CMS'],
      de: ['Art Direction', 'Astro', 'Dreisprachig', 'Decap CMS'],
    },
    duration: { fr: '10 semaines', en: '10 weeks', de: '10 Wochen' }, // À CONFIRMER
    url: 'https://coeursbraves.vercel.app',
    urlLabel: 'coeursbraves.vercel.app',
    category: {
      fr: 'Association · Éditorial · Trilingue',
      en: 'Non-profit · Editorial · Trilingual',
      de: 'Verein · Editorial · Dreisprachig',
    },
    cover: '/projets/coeursbraves-01.jpg',
    gallery: ['/projets/coeursbraves-01.jpg', '/projets/coeursbraves-02.jpg'],
    mandate: {
      fr: "Cœurs Braves est une association internationale africaine présente au Cameroun, en République centrafricaine, en Allemagne et dans la diaspora. Elle mène cinq programmes de solidarité — Academy, Technology Center, Marmite, agriculture, insertion — et avait besoin d'un site qui donne à cet ensemble la cohérence d'une seule voix.",
      en: 'Cœurs Braves is an international African association active in Cameroon, the Central African Republic, Germany and the diaspora. It runs five solidarity programmes — Academy, Technology Center, Marmite, agriculture, employment — and needed a site that gave the whole a single voice.',
      de: 'Cœurs Braves ist ein internationaler afrikanischer Verein, aktiv in Kamerun, der Zentralafrikanischen Republik, Deutschland und der Diaspora. Er betreibt fünf Solidaritätsprogramme — Academy, Technology Center, Marmite, Landwirtschaft, Arbeitsintegration — und brauchte eine Website, die dem Ganzen eine einzige Stimme gibt.',
    },
    challenge: {
      fr: "Faire tenir une association multi-programmes et multi-pays dans un site trilingue sans base de données, éditable par une équipe non technique, et sans le moindre appel à un service tiers pour rester conforme au RGPD.",
      en: 'Fit a multi-programme, multi-country association into a trilingual site with no database, editable by a non-technical team, and without a single third-party request — so it stays GDPR-compliant.',
      de: 'Einen Verein mit mehreren Programmen und Ländern in einer dreisprachigen Website ohne Datenbank abbilden — pflegbar durch ein nicht-technisches Team und ohne jeden Drittanbieter-Aufruf, um DSGVO-konform zu bleiben.',
    },
    phases: [
      {
        label: {
          fr: 'Cadrage & architecture éditoriale',
          en: 'Scoping & editorial architecture',
          de: 'Rahmen & redaktionelle Struktur',
        },
        window: { fr: 'Semaines 1-2', en: 'Weeks 1-2', de: 'Wochen 1-2' },
        icon: 'search',
      }, // À CONFIRMER
      {
        label: {
          fr: 'Design system crème / terracotta',
          en: 'Cream / terracotta design system',
          de: 'Design-System Creme / Terracotta',
        },
        window: { fr: 'Semaines 3-5', en: 'Weeks 3-5', de: 'Wochen 3-5' },
        icon: 'box',
      },
      {
        label: {
          fr: 'Intégration Astro & collections',
          en: 'Astro build & content collections',
          de: 'Astro-Umsetzung & Content-Collections',
        },
        window: { fr: 'Semaines 6-8', en: 'Weeks 6-8', de: 'Wochen 6-8' },
        icon: 'devices',
      },
      {
        label: {
          fr: 'Traductions, CMS & mise en ligne',
          en: 'Translations, CMS & go-live',
          de: 'Übersetzungen, CMS & Livegang',
        },
        window: { fr: 'Semaines 9-10', en: 'Weeks 9-10', de: 'Wochen 9-10' },
        icon: 'code',
      },
    ],
    metrics: [
      {
        value: '3',
        label: { fr: 'Langues', en: 'Languages', de: 'Sprachen' },
        note: {
          fr: 'Français, allemand, anglais — arborescences complètes.',
          en: 'French, German, English — complete page trees.',
          de: 'Französisch, Deutsch, Englisch — vollständige Seitenbäume.',
        },
        tone: 'orange',
      },
      {
        value: '39',
        label: { fr: 'Pages statiques', en: 'Static pages', de: 'Statische Seiten' },
        note: {
          fr: '13 pages déclinées dans les trois langues.',
          en: '13 pages rendered in all three languages.',
          de: '13 Seiten in allen drei Sprachen.',
        },
        tone: 'paper',
      },
      {
        value: '0',
        label: { fr: 'Appel tiers', en: 'Third-party requests', de: 'Drittanbieter-Aufrufe' },
        note: {
          fr: 'Polices auto-hébergées, aucun Google Fonts.',
          en: 'Self-hosted fonts, no Google Fonts.',
          de: 'Selbst gehostete Schriften, kein Google Fonts.',
        },
        tone: 'blue',
      },
      {
        value: '5',
        label: { fr: 'Programmes', en: 'Programmes', de: 'Programme' },
        note: {
          fr: 'Academy, Technology Center, Marmite…',
          en: 'Academy, Technology Center, Marmite…',
          de: 'Academy, Technology Center, Marmite…',
        },
        tone: 'outline',
      },
    ],
    palette: [
      { name: { fr: 'Crème', en: 'Cream', de: 'Creme' }, hex: '#FDFCF8' },
      { name: { fr: 'Terracotta', en: 'Terracotta', de: 'Terracotta' }, hex: '#C1272D' },
      { name: { fr: 'Vert forêt', en: 'Forest green', de: 'Waldgrün' }, hex: '#0A311F' },
      { name: { fr: 'Émeraude', en: 'Emerald', de: 'Smaragd' }, hex: '#047857' },
      { name: { fr: 'Or', en: 'Gold', de: 'Gold' }, hex: '#D99B2B' },
    ],
    stack: [
      {
        label: { fr: 'Front-end', en: 'Front end', de: 'Frontend' },
        items: {
          fr: ['Astro 5', 'Tailwind CSS 4 (@theme)', 'TypeScript', 'Embla Carousel'],
          en: ['Astro 5', 'Tailwind CSS 4 (@theme)', 'TypeScript', 'Embla Carousel'],
          de: ['Astro 5', 'Tailwind CSS 4 (@theme)', 'TypeScript', 'Embla Carousel'],
        },
      },
      {
        label: { fr: 'Contenu', en: 'Content', de: 'Inhalte' },
        items: {
          fr: ['Decap CMS', 'Collections typées : journal, équipe, événements', 'i18n FR / DE / EN'],
          en: ['Decap CMS', 'Typed collections: journal, team, events', 'i18n FR / DE / EN'],
          de: ['Decap CMS', 'Typisierte Collections: Journal, Team, Events', 'i18n FR / DE / EN'],
        },
      },
      {
        label: { fr: 'Typographie', en: 'Typography', de: 'Typografie' },
        items: {
          fr: ['Outfit Variable', 'Plus Jakarta Sans Variable', 'Auto-hébergées (RGPD)'],
          en: ['Outfit Variable', 'Plus Jakarta Sans Variable', 'Self-hosted (GDPR)'],
          de: ['Outfit Variable', 'Plus Jakarta Sans Variable', 'Selbst gehostet (DSGVO)'],
        },
      },
      {
        label: { fr: 'Livraison', en: 'Delivery', de: 'Auslieferung' },
        items: {
          fr: ['Build statique', 'Sitemap automatique', 'Déploiement Vercel'],
          en: ['Static build', 'Automatic sitemap', 'Vercel deployment'],
          de: ['Statischer Build', 'Automatische Sitemap', 'Vercel-Deployment'],
        },
      },
    ],
    deliverables: {
      fr: [
        'Site trilingue complet (FR / DE / EN)',
        'Design system crème / terracotta / vert forêt',
        'Back-office Decap pour l’équipe Cœurs Braves',
        'Journal, agenda d’événements et pages équipe',
        'Pages don, adhésion et partenaires',
      ],
      en: [
        'Complete trilingual site (FR / DE / EN)',
        'Cream / terracotta / forest-green design system',
        'Decap back office for the Cœurs Braves team',
        'Journal, events calendar and team pages',
        'Donation, membership and partner pages',
      ],
      de: [
        'Vollständige dreisprachige Website (FR / DE / EN)',
        'Design-System in Creme, Terracotta und Waldgrün',
        'Decap-Backoffice für das Team von Cœurs Braves',
        'Journal, Veranstaltungskalender und Teamseiten',
        'Seiten für Spenden, Mitgliedschaft und Partner',
      ],
    },
    outcomes: [
      {
        title: {
          fr: 'Trois langues, trois vraies arborescences',
          en: 'Three languages, three real page trees',
          de: 'Drei Sprachen, drei echte Seitenbäume',
        },
        body: {
          fr: "Plutôt qu'un commutateur de langue posé sur un site français, chaque locale possède son propre arbre de pages et ses propres collections de contenu. Un article du journal peut exister en allemand sans attendre sa traduction française, et les URL restent lisibles dans chaque langue.",
          en: 'Rather than a language switcher bolted onto a French site, each locale has its own page tree and its own content collections. A journal article can exist in German without waiting for a French translation, and URLs stay readable in every language.',
          de: 'Statt eines Sprachumschalters auf einer französischen Website hat jede Sprache ihren eigenen Seitenbaum und eigene Content-Collections. Ein Journal-Artikel kann auf Deutsch existieren, ohne auf eine französische Übersetzung zu warten, und die URLs bleiben in jeder Sprache lesbar.',
        },
        tone: 'blue',
      },
      {
        title: {
          fr: 'Le blanc comme parti pris',
          en: 'White as a deliberate stance',
          de: 'Weiß als bewusste Haltung',
        },
        body: {
          fr: "La charte impose une dominante claire : le crème occupe la majorité des surfaces, et le terracotta, le vert forêt et l'or n'interviennent qu'en accents. Les sections sombres sont réservées au manifeste et à l'écosystème, ce qui leur donne le poids qu'un aplat permanent leur aurait retiré.",
          en: 'The brand guidelines call for a light dominant: cream holds most of the surface, while terracotta, forest green and gold appear only as accents. Dark sections are reserved for the manifesto and the ecosystem, which gives them the weight a permanent block of colour would have taken away.',
          de: 'Die Markenrichtlinie verlangt eine helle Dominante: Creme füllt den größten Teil der Fläche, Terracotta, Waldgrün und Gold treten nur als Akzente auf. Dunkle Abschnitte bleiben dem Manifest und dem Ökosystem vorbehalten — das gibt ihnen das Gewicht, das eine durchgehende Farbfläche ihnen genommen hätte.',
        },
        tone: 'orange',
      },
    ],
    credits: [
      {
        role: { fr: 'Direction artistique', en: 'Art direction', de: 'Art Direction' },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      },
      {
        role: { fr: 'Intégration', en: 'Build', de: 'Umsetzung' },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      }, // À CONFIRMER
    ],
  },

  {
    slug: 'inses',
    ref: 'CS-03',
    kind: 'client',
    titleLead: { fr: 'IN', en: 'IN', de: 'IN' },
    titleTrail: { fr: 'SES.', en: 'SES.', de: 'SES.' },
    title: 'INSES',
    client: {
      fr: "Institut Supérieur de l'Espoir",
      en: "Institut Supérieur de l'Espoir",
      de: "Institut Supérieur de l'Espoir",
    },
    year: '2026',
    services: {
      fr: ['Site institutionnel', 'CMS sur mesure', 'Supabase', 'Inscriptions en ligne'],
      en: ['Institutional site', 'Custom CMS', 'Supabase', 'Online enrolment'],
      de: ['Institutionelle Website', 'Individuelles CMS', 'Supabase', 'Online-Anmeldung'],
    },
    duration: { fr: '12 semaines', en: '12 weeks', de: '12 Wochen' }, // À CONFIRMER
    url: 'https://univ-inses.com',
    urlLabel: 'univ-inses.com',
    category: {
      fr: 'Éducation · Institutionnel · Back-office',
      en: 'Education · Institutional · Back office',
      de: 'Bildung · Institutionell · Backoffice',
    },
    cover: '/projets/inses-01.jpg',
    gallery: ['/projets/inses-01.jpg', '/projets/inses-02.jpg'],
    mandate: {
      fr: "L'Institut Supérieur de l'Espoir forme à Douala-Bonabéri les professionnels de santé de demain — sciences infirmières, sage-femme, laboratoire, kinésithérapie, diététique. L'institut voulait un site institutionnel qu'il puisse piloter lui-même, sans repasser par un prestataire pour changer une date de rentrée.",
      en: "The Institut Supérieur de l'Espoir trains tomorrow's healthcare professionals in Douala-Bonabéri — nursing, midwifery, laboratory science, physiotherapy, dietetics. The institute wanted an institutional site it could run itself, without going back to a supplier to change a term start date.",
      de: "Das Institut Supérieur de l'Espoir bildet in Douala-Bonabéri die Gesundheitsfachkräfte von morgen aus — Pflege, Hebammenwesen, Labortechnik, Physiotherapie, Diätetik. Das Institut wollte eine institutionelle Website, die es selbst steuern kann, ohne für ein geändertes Semesterdatum einen Dienstleister einzuschalten.",
    },
    challenge: {
      fr: "Livrer un site vitrine qui soit aussi un outil de gestion : catalogue de formations, actualités, galerie, demandes d'inscription — le tout administrable par l'équipe, bilingue, et extensible à un second centre de formation.",
      en: 'Deliver a public site that doubles as a management tool: course catalogue, news, gallery, enrolment requests — all administrable by the team, bilingual, and extensible to a second training centre.',
      de: 'Eine öffentliche Website liefern, die zugleich ein Verwaltungswerkzeug ist: Kurskatalog, Nachrichten, Galerie, Anmeldungen — vom Team pflegbar, zweisprachig und auf ein zweites Ausbildungszentrum erweiterbar.',
    },
    phases: [
      {
        label: {
          fr: 'Audit & modèle de contenu',
          en: 'Audit & content model',
          de: 'Audit & Content-Modell',
        },
        window: { fr: 'Semaines 1-2', en: 'Weeks 1-2', de: 'Wochen 1-2' },
        icon: 'search',
      }, // À CONFIRMER
      {
        label: { fr: 'Identité & maquettes', en: 'Identity & mockups', de: 'Identität & Entwürfe' },
        window: { fr: 'Semaines 3-5', en: 'Weeks 3-5', de: 'Wochen 3-5' },
        icon: 'box',
      },
      {
        label: {
          fr: 'Front Next.js & back-office',
          en: 'Next.js front end & back office',
          de: 'Next.js-Frontend & Backoffice',
        },
        window: { fr: 'Semaines 6-10', en: 'Weeks 6-10', de: 'Wochen 6-10' },
        icon: 'devices',
      },
      {
        label: {
          fr: 'Inscriptions, e-mails & mise en ligne',
          en: 'Enrolment, email & go-live',
          de: 'Anmeldungen, E-Mails & Livegang',
        },
        window: { fr: 'Semaines 11-12', en: 'Weeks 11-12', de: 'Wochen 11-12' },
        icon: 'code',
      },
    ],
    metrics: [
      {
        value: '2',
        label: { fr: 'Centres', en: 'Centres', de: 'Zentren' },
        note: {
          fr: 'INSES et CEPRES sur une même base.',
          en: 'INSES and CEPRES on one foundation.',
          de: 'INSES und CEPRES auf einer Basis.',
        },
        tone: 'orange',
      },
      {
        value: '6',
        label: { fr: 'Filières', en: 'Programmes', de: 'Studiengänge' },
        note: {
          fr: 'Catalogue de formations administrable.',
          en: 'A course catalogue the team administers.',
          de: 'Ein vom Team verwalteter Kurskatalog.',
        },
        tone: 'paper',
      },
      {
        value: '10',
        suffix: '+',
        label: { fr: 'Modules back-office', en: 'Back-office modules', de: 'Backoffice-Module' },
        note: {
          fr: 'Formations, actualités, galerie, partenaires…',
          en: 'Courses, news, gallery, partners…',
          de: 'Kurse, Nachrichten, Galerie, Partner…',
        },
        tone: 'blue',
      },
      {
        value: '2',
        label: { fr: 'Langues', en: 'Languages', de: 'Sprachen' },
        note: {
          fr: 'Français et anglais via next-intl.',
          en: 'French and English via next-intl.',
          de: 'Französisch und Englisch über next-intl.',
        },
        tone: 'outline',
      },
    ],
    palette: [
      { name: { fr: 'Bleu INSES', en: 'INSES blue', de: 'INSES-Blau' }, hex: '#0000FE' },
      { name: { fr: 'Bleu profond', en: 'Deep blue', de: 'Tiefblau' }, hex: '#0000B3' },
      { name: { fr: 'Cyan accent', en: 'Cyan accent', de: 'Cyan-Akzent' }, hex: '#02BAF4' },
      { name: { fr: 'Encre', en: 'Ink', de: 'Tinte' }, hex: '#1F2937' },
      { name: { fr: 'Blanc', en: 'White', de: 'Weiß' }, hex: '#FFFFFF' },
    ],
    stack: [
      {
        label: { fr: 'Front-end', en: 'Front end', de: 'Frontend' },
        items: {
          fr: ['Next.js 16', 'React 19', 'Tailwind CSS', 'Framer Motion', 'next-themes (clair / sombre)'],
          en: ['Next.js 16', 'React 19', 'Tailwind CSS', 'Framer Motion', 'next-themes (light / dark)'],
          de: ['Next.js 16', 'React 19', 'Tailwind CSS', 'Framer Motion', 'next-themes (hell / dunkel)'],
        },
      },
      {
        label: { fr: 'Back-end', en: 'Back end', de: 'Backend' },
        items: {
          fr: ['Supabase', 'PostgreSQL', 'Row Level Security', 'Supabase Auth', 'Supabase Storage'],
          en: ['Supabase', 'PostgreSQL', 'Row Level Security', 'Supabase Auth', 'Supabase Storage'],
          de: ['Supabase', 'PostgreSQL', 'Row Level Security', 'Supabase Auth', 'Supabase Storage'],
        },
      },
      {
        label: { fr: 'Services', en: 'Services', de: 'Dienste' },
        items: {
          fr: ['Brevo (e-mails transactionnels)', 'jsPDF (dossiers d’inscription)', 'next-intl FR / EN'],
          en: ['Brevo (transactional email)', 'jsPDF (enrolment files)', 'next-intl FR / EN'],
          de: ['Brevo (Transaktions-E-Mails)', 'jsPDF (Anmeldeunterlagen)', 'next-intl FR / EN'],
        },
      },
      {
        label: { fr: 'Qualité', en: 'Quality', de: 'Qualität' },
        items: {
          fr: ['Vitest', 'Testing Library', 'ESLint', 'Sitemap & données structurées'],
          en: ['Vitest', 'Testing Library', 'ESLint', 'Sitemap & structured data'],
          de: ['Vitest', 'Testing Library', 'ESLint', 'Sitemap & strukturierte Daten'],
        },
      },
    ],
    deliverables: {
      fr: [
        'Site institutionnel bilingue (FR / EN)',
        'Panel d’administration complet (CRUD)',
        'Catalogue de formations avec fiches détaillées',
        'Formulaire d’inscription en ligne + export PDF',
        'Galerie, actualités et espace partenaires',
        'Architecture multi-centres (INSES + CEPRES)',
      ],
      en: [
        'Bilingual institutional site (FR / EN)',
        'Complete administration panel (CRUD)',
        'Course catalogue with detailed pages',
        'Online enrolment form + PDF export',
        'Gallery, news and partner area',
        'Multi-centre architecture (INSES + CEPRES)',
      ],
      de: [
        'Zweisprachige institutionelle Website (FR / EN)',
        'Vollständiges Administrationspanel (CRUD)',
        'Kurskatalog mit ausführlichen Detailseiten',
        'Online-Anmeldeformular + PDF-Export',
        'Galerie, Nachrichten und Partnerbereich',
        'Mehr-Zentren-Architektur (INSES + CEPRES)',
      ],
    },
    outcomes: [
      {
        title: {
          fr: "L'institut reprend la main",
          en: 'The institute takes back control',
          de: 'Das Institut übernimmt selbst',
        },
        body: {
          fr: "Formations, actualités, statistiques, partenaires, galerie, mission et valeurs : tout passe par un back-office protégé plutôt que par des pages figées. L'équipe publie une nouvelle filière ou corrige une date sans intervention technique, dans les deux langues.",
          en: 'Courses, news, statistics, partners, gallery, mission and values all run through a protected back office rather than fixed pages. The team publishes a new programme or corrects a date without technical help, in both languages.',
          de: 'Kurse, Nachrichten, Statistiken, Partner, Galerie, Mission und Werte laufen über ein geschütztes Backoffice statt über starre Seiten. Das Team veröffentlicht einen neuen Studiengang oder korrigiert ein Datum ohne technische Hilfe — in beiden Sprachen.',
        },
        tone: 'blue',
      },
      {
        title: {
          fr: 'Un socle prévu pour deux écoles',
          en: 'A foundation built for two schools',
          de: 'Eine Basis für zwei Schulen',
        },
        body: {
          fr: "Le modèle de données porte la notion de centre dès le départ : chaque formation, statistique et partenaire est rattaché à INSES ou à CEPRES. Ouvrir le second centre a consisté à saisir son contenu, pas à dupliquer le site.",
          en: 'The data model carries the notion of a centre from the start: every course, statistic and partner belongs to either INSES or CEPRES. Opening the second centre meant entering its content, not duplicating the site.',
          de: 'Das Datenmodell kennt den Begriff des Zentrums von Anfang an: Jeder Kurs, jede Statistik und jeder Partner gehört entweder zu INSES oder zu CEPRES. Das zweite Zentrum zu eröffnen hieß, seine Inhalte einzupflegen — nicht die Website zu duplizieren.',
        },
        tone: 'orange',
      },
    ],
    credits: [
      {
        role: { fr: 'Produit & design', en: 'Product & design', de: 'Produkt & Design' },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      },
      {
        role: { fr: 'Ingénierie', en: 'Engineering', de: 'Entwicklung' },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      }, // À CONFIRMER
    ],
  },

  {
    slug: 'afridienst',
    ref: 'CS-04',
    kind: 'client',
    titleLead: { fr: 'AFRI', en: 'AFRI', de: 'AFRI' },
    titleTrail: { fr: 'DIENST.', en: 'DIENST.', de: 'DIENST.' },
    title: 'AfriDienst e.V.',
    client: { fr: 'AfriDienst e.V.', en: 'AfriDienst e.V.', de: 'AfriDienst e.V.' },
    year: '2026',
    services: {
      fr: ['Refonte éditoriale', 'Direction artistique', 'Astro', 'Trilingue'],
      en: ['Editorial rebuild', 'Art direction', 'Astro', 'Trilingual'],
      de: ['Redaktioneller Relaunch', 'Art Direction', 'Astro', 'Dreisprachig'],
    },
    duration: { fr: '8 semaines', en: '8 weeks', de: '8 Wochen' }, // À CONFIRMER
    url: 'https://afridienst.org',
    urlLabel: 'afridienst.org',
    category: {
      fr: 'ONG · Éditorial · Refonte',
      en: 'NGO · Editorial · Rebuild',
      de: 'NGO · Editorial · Relaunch',
    },
    cover: '/projets/afridienst-01.jpg',
    gallery: ['/projets/afridienst-01.jpg', '/projets/afridienst-02.jpg'],
    mandate: {
      fr: "AfriDienst e.V. est une organisation à but non lucratif qui agit auprès des populations vulnérables d'Afrique subsaharienne. Son site tournait sur WordPress + Elementor : lent, difficile à traduire, et visuellement très éloigné de la charte de l'association.",
      en: 'AfriDienst e.V. is a non-profit working with vulnerable communities in sub-Saharan Africa. Its site ran on WordPress + Elementor: slow, hard to translate, and visually a long way from the association\'s own brand guidelines.',
      de: 'AfriDienst e.V. ist eine gemeinnützige Organisation, die sich für gefährdete Bevölkerungsgruppen im subsaharischen Afrika einsetzt. Die Website lief auf WordPress + Elementor: langsam, schwer übersetzbar und optisch weit entfernt von den eigenen Markenrichtlinien des Vereins.',
    },
    challenge: {
      fr: "Reconstruire le site en préservant l'intégralité du contenu existant — actions, projets, événements, actualités — tout en le rendant trilingue (FR / DE / EN) et en imposant enfin le bleu nuit de la charte plutôt qu'un noir générique.",
      en: 'Rebuild the site while preserving all existing content — activities, projects, events, news — making it trilingual (FR / DE / EN) and finally applying the brand\'s midnight blue instead of a generic black.',
      de: 'Die Website neu aufbauen und dabei sämtliche vorhandenen Inhalte erhalten — Aktionen, Projekte, Veranstaltungen, Nachrichten —, sie dreisprachig machen (FR / DE / EN) und endlich das Mitternachtsblau der Marke statt eines generischen Schwarz durchsetzen.',
    },
    phases: [
      {
        label: {
          fr: 'Audit & extraction du contenu',
          en: 'Audit & content extraction',
          de: 'Audit & Inhaltsextraktion',
        },
        window: { fr: 'Semaines 1-2', en: 'Weeks 1-2', de: 'Wochen 1-2' },
        icon: 'search',
      }, // À CONFIRMER
      {
        label: {
          fr: 'Charte & direction artistique',
          en: 'Brand guidelines & art direction',
          de: 'Markenrichtlinie & Art Direction',
        },
        window: { fr: 'Semaines 3-4', en: 'Weeks 3-4', de: 'Wochen 3-4' },
        icon: 'box',
      },
      {
        label: { fr: 'Intégration Astro', en: 'Astro build', de: 'Astro-Umsetzung' },
        window: { fr: 'Semaines 5-7', en: 'Weeks 5-7', de: 'Wochen 5-7' },
        icon: 'devices',
      },
      {
        label: {
          fr: 'Traductions & mise en ligne',
          en: 'Translations & go-live',
          de: 'Übersetzungen & Livegang',
        },
        window: { fr: 'Semaine 8', en: 'Week 8', de: 'Woche 8' },
        icon: 'code',
      },
    ],
    metrics: [
      {
        value: '3',
        label: { fr: 'Langues', en: 'Languages', de: 'Sprachen' },
        note: {
          fr: 'Français, allemand, anglais — contenu complet.',
          en: 'French, German, English — full content.',
          de: 'Französisch, Deutsch, Englisch — vollständige Inhalte.',
        },
        tone: 'orange',
      },
      {
        value: '0',
        label: { fr: 'Plugin', en: 'Plugins', de: 'Plugins' },
        note: {
          fr: 'Sortie totale de la dépendance WordPress.',
          en: 'A complete exit from the WordPress dependency.',
          de: 'Vollständiger Ausstieg aus der WordPress-Abhängigkeit.',
        },
        tone: 'paper',
      },
      {
        value: '100',
        suffix: '%',
        label: { fr: 'Statique', en: 'Static', de: 'Statisch' },
        note: {
          fr: 'Pages pré-rendues, aucun serveur PHP.',
          en: 'Pre-rendered pages, no PHP server.',
          de: 'Vorgerenderte Seiten, kein PHP-Server.',
        },
        tone: 'blue',
      },
      {
        value: '5',
        label: { fr: 'Sections repensées', en: 'Sections rethought', de: 'Neu gedachte Bereiche' },
        note: {
          fr: 'Actions, projets, événements, actualités, contact.',
          en: 'Activities, projects, events, news, contact.',
          de: 'Aktionen, Projekte, Veranstaltungen, Nachrichten, Kontakt.',
        },
        tone: 'outline',
      },
    ],
    palette: [
      { name: { fr: 'Bleu marque', en: 'Brand blue', de: 'Markenblau' }, hex: '#02173F' },
      { name: { fr: 'Bleu profond', en: 'Deep blue', de: 'Tiefblau' }, hex: '#010C24' },
      { name: { fr: 'Bleu clair', en: 'Light blue', de: 'Hellblau' }, hex: '#3A5687' },
      { name: { fr: 'Or accent', en: 'Gold accent', de: 'Goldakzent' }, hex: '#D4A24C' },
      { name: { fr: 'Wash', en: 'Wash', de: 'Lasur' }, hex: '#E8EDF5' },
    ],
    stack: [
      {
        label: { fr: 'Front-end', en: 'Front end', de: 'Frontend' },
        items: {
          fr: ['Astro', 'TypeScript', 'CSS variables (charte)'],
          en: ['Astro', 'TypeScript', 'CSS variables (brand)'],
          de: ['Astro', 'TypeScript', 'CSS-Variablen (Marke)'],
        },
      },
      {
        label: { fr: 'Contenu', en: 'Content', de: 'Inhalte' },
        items: {
          fr: ['Collections Astro typées', 'i18n FR / DE / EN'],
          en: ['Typed Astro collections', 'i18n FR / DE / EN'],
          de: ['Typisierte Astro-Collections', 'i18n FR / DE / EN'],
        },
      },
      {
        label: { fr: 'Livraison', en: 'Delivery', de: 'Auslieferung' },
        items: {
          fr: ['Build statique', 'Déploiement continu GitHub Actions'],
          en: ['Static build', 'Continuous deployment via GitHub Actions'],
          de: ['Statischer Build', 'Continuous Deployment über GitHub Actions'],
        },
      },
      {
        label: { fr: 'Migration', en: 'Migration', de: 'Migration' },
        items: {
          fr: ['Extraction WordPress + Elementor', 'Reprise intégrale des médias'],
          en: ['WordPress + Elementor extraction', 'Full media migration'],
          de: ['Extraktion aus WordPress + Elementor', 'Vollständige Medienübernahme'],
        },
      },
    ],
    deliverables: {
      fr: [
        'Site trilingue complet (FR / DE / EN)',
        'Charte appliquée : bleu nuit #02173F + accent or',
        'Pages thématiques par domaine d’action',
        'Calendrier d’événements et fil d’actualités',
        'Brief de redesign documenté et versionné',
      ],
      en: [
        'Complete trilingual site (FR / DE / EN)',
        'Brand applied: midnight blue #02173F + gold accent',
        'Thematic pages per area of work',
        'Events calendar and news feed',
        'A documented, version-controlled redesign brief',
      ],
      de: [
        'Vollständige dreisprachige Website (FR / DE / EN)',
        'Markenrichtlinie umgesetzt: Mitternachtsblau #02173F + Goldakzent',
        'Themenseiten je Arbeitsbereich',
        'Veranstaltungskalender und Nachrichten-Feed',
        'Dokumentiertes, versioniertes Redesign-Briefing',
      ],
    },
    outcomes: [
      {
        title: {
          fr: 'Une identité enfin respectée',
          en: 'An identity finally respected',
          de: 'Eine endlich respektierte Identität',
        },
        body: {
          fr: "Le logo blanc de l'association avait été conçu pour le bleu nuit #02173F de la charte. Toutes les surfaces sombres du site utilisent désormais ce bleu plutôt qu'un noir neutre : le logo se détache correctement, et l'identité tient sur l'ensemble des pages.",
          en: "The association's white logo was designed for the brand's midnight blue #02173F. Every dark surface on the site now uses that blue rather than a neutral black: the logo reads correctly, and the identity holds across all pages.",
          de: 'Das weiße Logo des Vereins war für das Mitternachtsblau #02173F der Marke gestaltet. Alle dunklen Flächen der Website verwenden nun dieses Blau statt eines neutralen Schwarz: Das Logo hebt sich richtig ab, und die Identität trägt über alle Seiten.',
        },
        tone: 'blue',
      },
      {
        title: {
          fr: 'Sortir de WordPress',
          en: 'Leaving WordPress behind',
          de: 'WordPress hinter sich lassen',
        },
        body: {
          fr: "Le passage d'Elementor à Astro supprime la couche de plugins, la base de données et le serveur PHP. Le site est livré en pages statiques pré-rendues — plus rapide à charger, et plus rien à mettre à jour pour des raisons de sécurité.",
          en: 'Moving from Elementor to Astro removes the plugin layer, the database and the PHP server. The site ships as pre-rendered static pages — faster to load, with nothing left to patch for security.',
          de: 'Der Wechsel von Elementor zu Astro entfernt die Plugin-Schicht, die Datenbank und den PHP-Server. Die Website wird als vorgerenderte statische Seiten ausgeliefert — schneller im Laden und ohne verbleibende Sicherheitsupdates.',
        },
        tone: 'orange',
      },
    ],
    credits: [
      {
        role: { fr: 'Direction artistique', en: 'Art direction', de: 'Art Direction' },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      },
      {
        role: { fr: 'Intégration', en: 'Build', de: 'Umsetzung' },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      }, // À CONFIRMER
    ],
  },

  {
    slug: 'eventez',
    ref: 'CS-05',
    kind: 'produit',
    titleLead: { fr: 'EVENT', en: 'EVENT', de: 'EVENT' },
    titleTrail: { fr: 'EZ.', en: 'EZ.', de: 'EZ.' },
    title: 'EventEz',
    client: {
      fr: 'OverBrand — produit interne',
      en: 'OverBrand — in-house product',
      de: 'OverBrand — eigenes Produkt',
    },
    year: '2025',
    services: {
      fr: ['Plateforme SaaS', 'Django + Next.js', 'Paiements', 'Mobile'],
      en: ['SaaS platform', 'Django + Next.js', 'Payments', 'Mobile'],
      de: ['SaaS-Plattform', 'Django + Next.js', 'Zahlungen', 'Mobile'],
    },
    duration: { fr: '22 semaines', en: '22 weeks', de: '22 Wochen' }, // À CONFIRMER
    url: 'https://eventez.online',
    urlLabel: 'eventez.online',
    category: {
      fr: 'SaaS · Billetterie · Temps réel',
      en: 'SaaS · Ticketing · Real time',
      de: 'SaaS · Ticketing · Echtzeit',
    },
    cover: '/projets/eventez-01.jpg',
    gallery: ['/projets/eventez-01.jpg', '/projets/eventez-02.jpg'],
    mandate: {
      fr: "EventEz est une plateforme complète de gestion d'événements, pensée pour deux usages qui cohabitent rarement : la billetterie payante avec types de tickets et QR codes, et l'inscription libre via des formulaires dynamiques construits par l'organisateur.",
      en: 'EventEz is a complete event management platform, designed for two uses that rarely coexist: paid ticketing with ticket types and QR codes, and free registration through dynamic forms the organiser builds themselves.',
      de: 'EventEz ist eine vollständige Plattform für Eventmanagement, gedacht für zwei Anwendungsfälle, die selten zusammen auftreten: kostenpflichtiges Ticketing mit Ticketarten und QR-Codes sowie freie Anmeldung über dynamische Formulare, die der Veranstalter selbst erstellt.',
    },
    challenge: {
      fr: "Faire tenir dans un seul produit la vente de billets, la messagerie temps réel organisateur ↔ participant, la génération de documents officiels et le contrôle d'accès sur site — le tout en multi-devises et multi-pays.",
      en: 'Fit ticket sales, real-time organiser ↔ attendee messaging, official document generation and on-site access control into a single product — multi-currency and multi-country throughout.',
      de: 'Ticketverkauf, Echtzeit-Nachrichten zwischen Veranstalter und Teilnehmer, Erzeugung offizieller Dokumente und Zutrittskontrolle vor Ort in einem einzigen Produkt vereinen — durchgehend mehrwährungs- und mehrländerfähig.',
    },
    phases: [
      {
        label: {
          fr: 'Modèle événement & billetterie',
          en: 'Event & ticketing model',
          de: 'Event- und Ticketing-Modell',
        },
        window: { fr: 'Semaines 1-4', en: 'Weeks 1-4', de: 'Wochen 1-4' },
        icon: 'search',
      }, // À CONFIRMER
      {
        label: {
          fr: 'API Django & schéma OpenAPI',
          en: 'Django API & OpenAPI schema',
          de: 'Django-API & OpenAPI-Schema',
        },
        window: { fr: 'Semaines 5-11', en: 'Weeks 5-11', de: 'Wochen 5-11' },
        icon: 'box',
      },
      {
        label: {
          fr: 'Front Next.js & app mobile',
          en: 'Next.js front end & mobile app',
          de: 'Next.js-Frontend & Mobile App',
        },
        window: { fr: 'Semaines 12-18', en: 'Weeks 12-18', de: 'Wochen 12-18' },
        icon: 'devices',
      },
      {
        label: {
          fr: 'Paiements, QR & mise en prod',
          en: 'Payments, QR codes & go-live',
          de: 'Zahlungen, QR-Codes & Livegang',
        },
        window: { fr: 'Semaines 19-22', en: 'Weeks 19-22', de: 'Wochen 19-22' },
        icon: 'code',
      },
    ],
    metrics: [
      {
        value: '2',
        label: { fr: 'Modes de collecte', en: 'Collection modes', de: 'Erfassungsarten' },
        note: {
          fr: 'Billetterie payante et inscription libre.',
          en: 'Paid ticketing and free registration.',
          de: 'Kostenpflichtiges Ticketing und freie Anmeldung.',
        },
        tone: 'orange',
      },
      {
        value: '3',
        label: { fr: 'Applications', en: 'Applications', de: 'Anwendungen' },
        note: {
          fr: 'API Django, front Next.js, mobile Expo.',
          en: 'Django API, Next.js front end, Expo mobile.',
          de: 'Django-API, Next.js-Frontend, Expo-Mobile.',
        },
        tone: 'paper',
      },
      {
        value: '15',
        suffix: 'min',
        label: { fr: 'Durée du token', en: 'Token lifetime', de: 'Token-Laufzeit' },
        note: {
          fr: 'JWT court, refresh 7 jours.',
          en: 'Short-lived JWT, 7-day refresh.',
          de: 'Kurzlebiges JWT, Refresh nach 7 Tagen.',
        },
        tone: 'blue',
      },
      {
        value: '24',
        suffix: '/7',
        label: { fr: 'Temps réel', en: 'Real time', de: 'Echtzeit' },
        note: {
          fr: 'Messagerie WebSocket via Django Channels.',
          en: 'WebSocket messaging via Django Channels.',
          de: 'WebSocket-Nachrichten über Django Channels.',
        },
        tone: 'outline',
      },
    ],
    palette: [
      { name: { fr: 'Violet marque', en: 'Brand purple', de: 'Markenviolett' }, hex: '#6D28D9' },
      { name: { fr: 'Rose accent', en: 'Pink accent', de: 'Pink-Akzent' }, hex: '#EC4899' },
      { name: { fr: 'Encre nuit', en: 'Night ink', de: 'Nachttinte' }, hex: '#111827' },
      { name: { fr: 'Lavande', en: 'Lavender', de: 'Lavendel' }, hex: '#EDE9FE' },
      { name: { fr: 'Surface', en: 'Surface', de: 'Fläche' }, hex: '#FAFAFA' },
    ],
    stack: [
      {
        label: { fr: 'Back-end', en: 'Back end', de: 'Backend' },
        items: {
          fr: ['Django 5.1', 'Django REST Framework', 'PostgreSQL', 'Celery + Redis', 'Django Channels', 'Daphne (ASGI)'],
          en: ['Django 5.1', 'Django REST Framework', 'PostgreSQL', 'Celery + Redis', 'Django Channels', 'Daphne (ASGI)'],
          de: ['Django 5.1', 'Django REST Framework', 'PostgreSQL', 'Celery + Redis', 'Django Channels', 'Daphne (ASGI)'],
        },
      },
      {
        label: { fr: 'Front-end', en: 'Front end', de: 'Frontend' },
        items: {
          fr: ['Next.js 15', 'Axios + intercepteurs JWT', 'i18n FR / EN', 'Sentry'],
          en: ['Next.js 15', 'Axios + JWT interceptors', 'i18n FR / EN', 'Sentry'],
          de: ['Next.js 15', 'Axios + JWT-Interceptors', 'i18n FR / EN', 'Sentry'],
        },
      },
      {
        label: { fr: 'Mobile', en: 'Mobile', de: 'Mobile' },
        items: {
          fr: ['Expo', 'React Native'],
          en: ['Expo', 'React Native'],
          de: ['Expo', 'React Native'],
        },
      },
      {
        label: { fr: 'Services', en: 'Services', de: 'Dienste' },
        items: {
          fr: ['NotchPay (paiements)', 'QR codes billets', 'ReportLab (factures PDF)', 'drf-spectacular (OpenAPI)'],
          en: ['NotchPay (payments)', 'Ticket QR codes', 'ReportLab (PDF invoices)', 'drf-spectacular (OpenAPI)'],
          de: ['NotchPay (Zahlungen)', 'Ticket-QR-Codes', 'ReportLab (PDF-Rechnungen)', 'drf-spectacular (OpenAPI)'],
        },
      },
    ],
    deliverables: {
      fr: [
        'Billetterie multi-types avec QR codes',
        'Générateur de formulaires d’inscription dynamiques',
        'Messagerie temps réel organisateur ↔ participant',
        'Facturation PDF et exports analytiques',
        'Application mobile de contrôle d’accès',
        'Documentation API Swagger publique',
      ],
      en: [
        'Multi-tier ticketing with QR codes',
        'Dynamic registration form builder',
        'Real-time organiser ↔ attendee messaging',
        'PDF invoicing and analytics exports',
        'Mobile access-control application',
        'Public Swagger API documentation',
      ],
      de: [
        'Ticketing mit mehreren Ticketarten und QR-Codes',
        'Generator für dynamische Anmeldeformulare',
        'Echtzeit-Nachrichten zwischen Veranstalter und Teilnehmer',
        'PDF-Rechnungen und Analyse-Exporte',
        'Mobile Anwendung zur Zutrittskontrolle',
        'Öffentliche Swagger-API-Dokumentation',
      ],
    },
    outcomes: [
      {
        title: {
          fr: 'Deux produits, une base',
          en: 'Two products, one foundation',
          de: 'Zwei Produkte, eine Basis',
        },
        body: {
          fr: "Billetterie et inscription libre partagent le même modèle d'événement, la même authentification et le même moteur de notifications. Un organisateur bascule d'un mode à l'autre sans changer d'outil, et l'équipe ne maintient qu'un seul back-end.",
          en: 'Ticketing and free registration share one event model, one authentication layer and one notification engine. An organiser switches between modes without changing tool, and the team maintains a single back end.',
          de: 'Ticketing und freie Anmeldung teilen sich ein Event-Modell, eine Authentifizierung und eine Benachrichtigungs-Engine. Ein Veranstalter wechselt zwischen beiden Modi ohne Werkzeugwechsel, und das Team pflegt nur ein Backend.',
        },
        tone: 'blue',
      },
      {
        title: {
          fr: 'Asynchrone par défaut',
          en: 'Asynchronous by default',
          de: 'Asynchron als Standard',
        },
        body: {
          fr: "Génération des QR codes, envoi des confirmations, calcul des exports analytiques et facturation PDF passent tous par Celery. Les requêtes web restent courtes même lors des pics d'ouverture de billetterie, quand des centaines d'achats arrivent en quelques minutes.",
          en: 'QR code generation, confirmation emails, analytics exports and PDF invoicing all run through Celery. Web requests stay short even at ticket-release peaks, when hundreds of purchases land within minutes.',
          de: 'QR-Code-Erzeugung, Bestätigungs-E-Mails, Analyse-Exporte und PDF-Rechnungen laufen alle über Celery. Web-Anfragen bleiben auch bei Spitzen zum Verkaufsstart kurz, wenn innerhalb weniger Minuten Hunderte Käufe eingehen.',
        },
        tone: 'orange',
      },
    ],
    credits: [
      {
        role: {
          fr: 'Architecture & back-end',
          en: 'Architecture & back end',
          de: 'Architektur & Backend',
        },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      },
      {
        role: { fr: 'Front-end & mobile', en: 'Front end & mobile', de: 'Frontend & Mobile' },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      }, // À CONFIRMER
    ],
  },

  {
    slug: 'tkams',
    ref: 'CS-06',
    kind: 'produit',
    titleLead: { fr: 'TK', en: 'TK', de: 'TK' },
    titleTrail: { fr: 'AMS.', en: 'AMS.', de: 'AMS.' },
    title: 'TKAMS',
    client: {
      fr: 'OverBrand — produit interne',
      en: 'OverBrand — in-house product',
      de: 'OverBrand — eigenes Produkt',
    },
    year: '2026',
    services: {
      fr: ['SIS académique', 'Architecture', 'Design produit', 'Site vitrine'],
      en: ['Student information system', 'Architecture', 'Product design', 'Marketing site'],
      de: ['Studierendenverwaltung', 'Architektur', 'Produktdesign', 'Marketing-Website'],
    },
    duration: { fr: '30 semaines', en: '30 weeks', de: '30 Wochen' }, // À CONFIRMER
    url: 'https://tkams.com',
    urlLabel: 'tkams.com',
    category: {
      fr: 'SIS · EdTech · Plateforme',
      en: 'SIS · EdTech · Platform',
      de: 'SIS · EdTech · Plattform',
    },
    cover: '/projets/tkams-01.jpg',
    gallery: ['/projets/tkams-01.jpg', '/projets/tkams-02.jpg'],
    mandate: {
      fr: "TKAMS — Tefoye and Kana Academic Management System — est un système d'information étudiant conçu pour les institutions LMD d'Afrique francophone. Il couvre l'intégralité du cycle académique : admissions, quitus, emplois du temps, assiduité, examens, délibérations, documents officiels et promotion.",
      en: 'TKAMS — Tefoye and Kana Academic Management System — is a student information system built for Bologna-model institutions in francophone Africa. It covers the whole academic cycle: admissions, clearance, timetables, attendance, exams, grade boards, official documents and progression.',
      de: 'TKAMS — Tefoye and Kana Academic Management System — ist ein Studierenden-Informationssystem für Hochschulen im Bologna-Modell im frankophonen Afrika. Es deckt den gesamten akademischen Zyklus ab: Zulassung, Freigabe, Stundenpläne, Anwesenheit, Prüfungen, Notenkonferenzen, offizielle Dokumente und Versetzung.',
    },
    challenge: {
      fr: "Remplacer des semaines de délibérations manuelles — notes dispersées entre papier, Excel et WhatsApp, sans traçabilité — par une plateforme où modifier une note recalcule immédiatement la moyenne, la décision et le procès-verbal.",
      en: 'Replace weeks of manual grade boards — marks scattered across paper, Excel and WhatsApp with no audit trail — with a platform where changing one mark immediately recalculates the average, the decision and the minutes.',
      de: 'Wochenlange manuelle Notenkonferenzen ersetzen — Noten verteilt auf Papier, Excel und WhatsApp, ohne Nachvollziehbarkeit — durch eine Plattform, auf der eine geänderte Note sofort Durchschnitt, Entscheidung und Protokoll neu berechnet.',
    },
    phases: [
      {
        label: {
          fr: 'Modélisation du cycle LMD',
          en: 'Modelling the academic cycle',
          de: 'Modellierung des Studienzyklus',
        },
        window: { fr: 'Semaines 1-6', en: 'Weeks 1-6', de: 'Wochen 1-6' },
        icon: 'search',
      }, // À CONFIRMER
      {
        label: {
          fr: 'Schéma Drizzle & API tRPC',
          en: 'Drizzle schema & tRPC API',
          de: 'Drizzle-Schema & tRPC-API',
        },
        window: { fr: 'Semaines 7-16', en: 'Weeks 7-16', de: 'Wochen 7-16' },
        icon: 'box',
      },
      {
        label: { fr: 'Portails multi-rôles', en: 'Role-based portals', de: 'Rollenbasierte Portale' },
        window: { fr: 'Semaines 17-25', en: 'Weeks 17-25', de: 'Wochen 17-25' },
        icon: 'devices',
      },
      {
        label: {
          fr: 'Exports officiels & vitrine',
          en: 'Official exports & marketing site',
          de: 'Offizielle Exporte & Marketing-Website',
        },
        window: { fr: 'Semaines 26-30', en: 'Weeks 26-30', de: 'Wochen 26-30' },
        icon: 'code',
      },
    ],
    metrics: [
      {
        value: '45',
        suffix: '+',
        label: { fr: 'Modules métier', en: 'Business modules', de: 'Fachmodule' },
        note: {
          fr: "De l'admission à la diplomation.",
          en: 'From admission through to graduation.',
          de: 'Von der Zulassung bis zum Abschluss.',
        },
        tone: 'orange',
      },
      {
        value: '30',
        suffix: '+',
        label: { fr: 'Exports officiels', en: 'Official exports', de: 'Offizielle Exporte' },
        note: {
          fr: 'PV, bulletins, relevés, attestations…',
          en: 'Minutes, reports, transcripts, certificates…',
          de: 'Protokolle, Zeugnisse, Notenübersichten, Bescheinigungen…',
        },
        tone: 'paper',
      },
      {
        value: '5',
        label: { fr: 'Portails', en: 'Portals', de: 'Portale' },
        note: {
          fr: 'Étudiant, enseignant, scolarité, tuteurs, DSI.',
          en: 'Student, lecturer, registry, guardians, IT.',
          de: 'Studierende, Lehrende, Verwaltung, Erziehungsberechtigte, IT.',
        },
        tone: 'blue',
      },
      {
        value: '2',
        label: { fr: 'Langues', en: 'Languages', de: 'Sprachen' },
        note: {
          fr: 'Français et anglais via i18next.',
          en: 'French and English via i18next.',
          de: 'Französisch und Englisch über i18next.',
        },
        tone: 'outline',
      },
    ],
    palette: [
      { name: { fr: 'Indigo marque', en: 'Brand indigo', de: 'Markenindigo' }, hex: '#4F46E5' },
      { name: { fr: 'Encre', en: 'Ink', de: 'Tinte' }, hex: '#0B0B0F' },
      { name: { fr: 'Papier', en: 'Paper', de: 'Papier' }, hex: '#F2F0EA' },
      { name: { fr: 'Surface', en: 'Surface', de: 'Fläche' }, hex: '#FBFAF7' },
      { name: { fr: 'Succès', en: 'Success', de: 'Erfolg' }, hex: '#10B981' },
    ],
    stack: [
      {
        label: { fr: 'API', en: 'API', de: 'API' },
        items: {
          fr: ['Hono', 'tRPC (bout-en-bout typé)', 'Bun', 'Drizzle ORM', 'PostgreSQL'],
          en: ['Hono', 'tRPC (end-to-end typed)', 'Bun', 'Drizzle ORM', 'PostgreSQL'],
          de: ['Hono', 'tRPC (durchgängig typisiert)', 'Bun', 'Drizzle ORM', 'PostgreSQL'],
        },
      },
      {
        label: { fr: 'Auth & i18n', en: 'Auth & i18n', de: 'Auth & i18n' },
        items: {
          fr: ['Better-Auth', 'i18next FR / EN', 'Séparation auth ↔ profils métier'],
          en: ['Better-Auth', 'i18next FR / EN', 'Auth separated from domain profiles'],
          de: ['Better-Auth', 'i18next FR / EN', 'Auth getrennt von Fachprofilen'],
        },
      },
      {
        label: { fr: 'Site & contenu', en: 'Site & content', de: 'Website & Inhalte' },
        items: {
          fr: ['Next.js', 'Payload CMS', 'next-sitemap'],
          en: ['Next.js', 'Payload CMS', 'next-sitemap'],
          de: ['Next.js', 'Payload CMS', 'next-sitemap'],
        },
      },
      {
        label: { fr: 'Qualité', en: 'Quality', de: 'Qualität' },
        items: {
          fr: ['Vitest', 'Playwright', 'Cypress', 'Biome'],
          en: ['Vitest', 'Playwright', 'Cypress', 'Biome'],
          de: ['Vitest', 'Playwright', 'Cypress', 'Biome'],
        },
      },
    ],
    deliverables: {
      fr: [
        'Système d’information étudiant complet (45+ modules)',
        '5 portails distincts par rôle',
        '30+ documents officiels générés',
        'Moteur de délibérations avec recalcul en direct',
        'Seeding YAML reproductible pour démos et tests',
        'Site vitrine et blog sous Payload CMS',
      ],
      en: [
        'Complete student information system (45+ modules)',
        '5 distinct role-based portals',
        '30+ official documents generated',
        'Grade-board engine with live recalculation',
        'Reproducible YAML seeding for demos and tests',
        'Marketing site and blog on Payload CMS',
      ],
      de: [
        'Vollständiges Studierenden-Informationssystem (45+ Module)',
        '5 getrennte rollenbasierte Portale',
        '30+ generierte offizielle Dokumente',
        'Notenkonferenz-Engine mit Neuberechnung in Echtzeit',
        'Reproduzierbares YAML-Seeding für Demos und Tests',
        'Marketing-Website und Blog mit Payload CMS',
      ],
    },
    outcomes: [
      {
        title: {
          fr: 'Des semaines ramenées à des heures',
          en: 'Weeks brought down to hours',
          de: 'Wochen auf Stunden verkürzt',
        },
        body: {
          fr: "Le moteur de délibération recalcule moyennes, décisions et procès-verbaux à chaque modification de note. Ce qui occupait des semaines de réunions de commission se traite désormais en séance, document officiel généré à la fin.",
          en: 'The grade-board engine recalculates averages, decisions and minutes on every mark change. What used to take weeks of committee meetings is now settled within the session, with the official document generated at the end.',
          de: 'Die Notenkonferenz-Engine berechnet Durchschnitte, Entscheidungen und Protokolle bei jeder Notenänderung neu. Was früher wochenlange Gremiensitzungen erforderte, wird nun in der Sitzung erledigt — das offizielle Dokument entsteht am Ende.',
        },
        tone: 'blue',
      },
      {
        title: {
          fr: 'Un modèle pensé pour le LMD',
          en: 'A model built for the academic cycle',
          de: 'Ein Modell für den Studienzyklus',
        },
        body: {
          fr: "Les inscriptions sont atomiques — un étudiant s'inscrit à des cours, pas seulement à une classe — avec historique complet des tentatives, redoublements et reprises de notes. La hiérarchie faculté → filière → option → niveau supporte les règles de promotion réelles des institutions.",
          en: 'Enrolments are atomic — a student registers for courses, not just a class — with a full history of attempts, repeats and resits. The faculty → programme → option → level hierarchy supports the progression rules institutions actually use.',
          de: 'Einschreibungen sind atomar — Studierende belegen Kurse, nicht nur eine Klasse — mit vollständiger Historie von Versuchen, Wiederholungen und Nachprüfungen. Die Hierarchie Fakultät → Studiengang → Schwerpunkt → Niveau bildet die tatsächlichen Versetzungsregeln der Hochschulen ab.',
        },
        tone: 'orange',
      },
    ],
    credits: [
      {
        role: { fr: 'Architecture & produit', en: 'Architecture & product', de: 'Architektur & Produkt' },
        people: [{ name: 'Cédric Tefoye', lead: true }, { name: 'Kana' }],
      },
      {
        role: { fr: 'Ingénierie', en: 'Engineering', de: 'Entwicklung' },
        people: [{ name: 'Cédric Tefoye', lead: true }],
      }, // À CONFIRMER
    ],
  },
]

function resolveCase(c: LocalizedCaseStudy, locale: string): CaseStudy {
  const l = <T,>(v: Localized<T>) => pick(v, locale)
  return {
    ...c,
    titleLead: l(c.titleLead),
    titleTrail: l(c.titleTrail),
    client: l(c.client),
    services: l(c.services),
    duration: l(c.duration),
    category: l(c.category),
    mandate: l(c.mandate),
    challenge: l(c.challenge),
    deliverables: l(c.deliverables),
    phases: c.phases.map((p) => ({ ...p, label: l(p.label), window: l(p.window) })),
    metrics: c.metrics.map((m) => ({ ...m, label: l(m.label), note: l(m.note) })),
    palette: c.palette.map((p) => ({ ...p, name: l(p.name) })),
    stack: c.stack.map((s) => ({ ...s, label: l(s.label), items: l(s.items) })),
    outcomes: c.outcomes.map((o) => ({ ...o, title: l(o.title), body: l(o.body) })),
    credits: c.credits.map((cr) => ({ ...cr, role: l(cr.role) })),
    quote: c.quote && { ...c.quote, text: l(c.quote.text), role: l(c.quote.role) },
  }
}

/** Every case study, resolved to one locale, in display order. */
export function getCaseStudies(locale: string): CaseStudy[] {
  return LOCALIZED_CASE_STUDIES.map((c) => resolveCase(c, locale))
}

/** Projets livrés pour des tiers — ce que la home et le hub mettent en avant. */
export function getClientCases(locale: string): CaseStudy[] {
  return getCaseStudies(locale).filter((c) => c.kind === 'client')
}

/** Solutions éditées par OverBrand (EventEz, TKAMS). */
export function getProductCases(locale: string): CaseStudy[] {
  return getCaseStudies(locale).filter((c) => c.kind === 'produit')
}

export function getCaseStudy(slug: string, locale: string): CaseStudy | undefined {
  const found = LOCALIZED_CASE_STUDIES.find((c) => c.slug === slug)
  return found && resolveCase(found, locale)
}

export function getNextCaseStudy(slug: string, locale: string): CaseStudy {
  const i = LOCALIZED_CASE_STUDIES.findIndex((c) => c.slug === slug)
  const next = LOCALIZED_CASE_STUDIES[(i + 1) % LOCALIZED_CASE_STUDIES.length]
  return resolveCase(next, locale)
}

/** Language-neutral lookups — for `generateStaticParams`, sitemap, and kind checks. */
export const CASE_SLUGS = LOCALIZED_CASE_STUDIES.map((c) => c.slug)
export const PRODUCT_CASE_SLUGS = new Set(
  LOCALIZED_CASE_STUDIES.filter((c) => c.kind === 'produit').map((c) => c.slug),
)
