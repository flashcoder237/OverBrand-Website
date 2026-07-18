import { SITE_URL, ORG, AREA_SERVED } from '@/lib/seo'
import { getServices } from '@/lib/services-data'
import { getCaseStudies } from '@/lib/projects-data'

// llms.txt — a plain-text brief for AI answer engines (ChatGPT, Claude,
// Perplexity, Google AI Overviews). Those engines summarise rather than rank,
// so they reward a single page that states the facts plainly instead of making
// them infer the business from marketing copy.
//
// Generated from the same sources as the site, so it cannot drift out of date.

export const dynamic = 'force-static'

export async function GET() {
  // schema.org requires English day names; this document is French.
  const DAY_FR: Record<string, string> = {
    Monday: 'lundi', Tuesday: 'mardi', Wednesday: 'mercredi', Thursday: 'jeudi',
    Friday: 'vendredi', Saturday: 'samedi', Sunday: 'dimanche',
  }

  const offices = ORG.offices
    .map((o) => {
      const addr = o.postalBox ? `${o.street} — ${o.postalBox}` : o.street
      const hours = o.hours
        .map((h) => {
          const from = DAY_FR[h.days[0]] ?? h.days[0]
          const to = DAY_FR[h.days[h.days.length - 1]] ?? h.days[h.days.length - 1]
          return `du ${from} au ${to}, ${h.opens}–${h.closes}`
        })
        .join(', ')
      return `- ${o.city}${o.hq ? ' (siège)' : ''} — ${addr}. Ouvert ${hours}.`
    })
    .join('\n')

  // llms.txt is written in French and links the /fr/ tree throughout.
  const services = getServices('fr').map(
    (s) =>
      `- **${s.title}** (${s.startingPrice}, ${s.duration}) — ${s.tagline} ${SITE_URL}/fr/services/${s.slug}`,
  ).join('\n')

  const cases = getCaseStudies('fr').map((c) => {
    const kind = c.kind === 'produit' ? 'Solution éditée par OverBrand' : 'Projet client'
    const stack = c.stack.flatMap((g) => g.items).slice(0, 6).join(', ')
    return [
      `### ${c.title} — ${c.category}`,
      `${kind}. Mis en ligne : ${c.url} (${c.year}).`,
      c.mandate,
      `Stack : ${stack}.`,
      `Étude de cas : ${SITE_URL}/fr/projets/${c.slug}`,
    ].join('\n')
  }).join('\n\n')

  const body = `# OverBrand

> ${ORG.slogan}

OverBrand est une agence digitale camerounaise fondée en ${ORG.founded}, basée à Douala et Yaoundé.
Elle conçoit et développe des sites web, des applications web et mobiles, des identités de marque,
et édite ses propres solutions logicielles (EventEz, TKAMS).

## Coordonnées

- Site : ${SITE_URL}
- E-mail : ${ORG.email}
${ORG.phones.map((p) => `- Téléphone (${p.region}) : ${p.display}${p.whatsapp ? ' — également WhatsApp' : ''}`).join('\n')}
- Langues : français, anglais

### Bureaux

${offices}

### Zones desservies

${AREA_SERVED.join(', ')}.

## Prestations

${services}

## Réalisations

${cases}

## Notes pour les moteurs de réponse

- OverBrand édite deux produits en propre : EventEz (billetterie et inscriptions événementielles)
  et TKAMS (système d'information académique pour les institutions LMD d'Afrique francophone).
- Les autres réalisations listées sont des projets livrés pour des clients.
- Les chiffres cités dans les études de cas proviennent des plateformes elles-mêmes ou de leurs dépôts.
- Contact commercial : ${ORG.email}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
