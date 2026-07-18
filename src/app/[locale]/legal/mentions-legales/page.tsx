import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description: "Mentions légales d'OverBrand — agence digitale créative. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation du site.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://overbrand.net'}/fr/legal/mentions-legales`,
  },
}

export default function MentionsLegales() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="w-8 h-px mb-4" style={{ background: 'var(--primary)' }} />
            <h1 className="font-display text-5xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
              MENTIONS LÉGALES
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>Dernière mise à jour : mars 2025</p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>1. Éditeur du site</h2>
              <p>Le site <strong style={{ color: 'var(--text)' }}>overbrand.net</strong> est édité par OverBrand, agence digitale créative.</p>
              <ul className="mt-3 space-y-1">
                <li><strong style={{ color: 'var(--text)' }}>Dénomination :</strong> OverBrand</li>
                <li><strong style={{ color: 'var(--text)' }}>Siège social :</strong> Douala, Cameroun</li>
                <li><strong style={{ color: 'var(--text)' }}>Email :</strong>{' '}
                  <a href="mailto:contact@overbrand.net" style={{ color: 'var(--primary)' }}>contact@overbrand.net</a>
                </li>
                <li><strong style={{ color: 'var(--text)' }}>Téléphone :</strong> +237 652 761 931 (Cameroun) · +41 79 360 36 49 (Europe)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>2. Directeur de publication</h2>
              <p>Le directeur de la publication est le représentant légal d'OverBrand.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>3. Hébergement</h2>
              <p>Ce site est hébergé par <strong style={{ color: 'var(--text)' }}>Vercel Inc.</strong>, 340 Pine Street, Suite 900, San Francisco, CA 94104, États-Unis.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>4. Propriété intellectuelle</h2>
              <p>L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels) est la propriété exclusive d'OverBrand ou de ses partenaires. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, est strictement interdite sans l'accord écrit d'OverBrand.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>5. Responsabilité</h2>
              <p>OverBrand s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Cependant, OverBrand ne peut garantir l'exactitude, la complétude et l'actualité des informations diffusées sur ce site. En conséquence, l'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>6. Liens hypertextes</h2>
              <p>Les liens hypertextes mis en place dans le cadre du présent site internet en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité d'OverBrand.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>7. Droit applicable</h2>
              <p>Le présent site et ses contenus sont régis par le droit en vigueur. Tout litige relatif à l'utilisation du site sera soumis à la juridiction compétente.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
