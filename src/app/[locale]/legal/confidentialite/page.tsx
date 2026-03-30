import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: "Politique de confidentialité d'OverBrand — comment nous collectons, utilisons et protégeons vos données personnelles.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://overbrand.net'}/fr/legal/confidentialite`,
  },
}

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="w-8 h-px mb-4" style={{ background: 'var(--primary)' }} />
            <h1 className="font-display text-5xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
              POLITIQUE DE CONFIDENTIALITÉ
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>Dernière mise à jour : mars 2025</p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>1. Responsable du traitement</h2>
              <p>OverBrand est responsable du traitement de vos données personnelles collectées via le site overbrand.net. Contact : <a href="mailto:contact@overbrand.net" style={{ color: 'var(--primary)' }}>contact@overbrand.net</a></p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>2. Données collectées</h2>
              <p>Nous collectons les données suivantes :</p>
              <ul className="mt-3 space-y-1 list-disc list-inside">
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Nom de votre entreprise (optionnel)</li>
                <li>Contenu des messages envoyés via le formulaire de contact</li>
                <li>Données de navigation (cookies techniques)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>3. Finalités du traitement</h2>
              <p>Vos données sont utilisées pour :</p>
              <ul className="mt-3 space-y-1 list-disc list-inside">
                <li>Répondre à vos demandes de contact et de devis</li>
                <li>Gérer votre espace client</li>
                <li>Assurer le suivi de vos projets</li>
                <li>Améliorer notre site et nos services</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>4. Base légale</h2>
              <p>Le traitement de vos données repose sur votre consentement (formulaire de contact) et sur l'exécution d'un contrat (espace client, suivi de projets).</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>5. Durée de conservation</h2>
              <p>Vos données sont conservées pendant la durée nécessaire à la finalité pour laquelle elles ont été collectées, et au maximum 3 ans après notre dernier contact.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>6. Partage des données</h2>
              <p>Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec nos prestataires techniques (hébergement Vercel, base de données Supabase) dans le cadre strict de la fourniture du service.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>7. Vos droits</h2>
              <p>Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
              <ul className="mt-3 space-y-1 list-disc list-inside">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement ("droit à l'oubli")</li>
                <li>Droit d'opposition</li>
                <li>Droit à la portabilité</li>
              </ul>
              <p className="mt-3">Pour exercer ces droits, contactez-nous à <a href="mailto:contact@overbrand.net" style={{ color: 'var(--primary)' }}>contact@overbrand.net</a>.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>8. Cookies</h2>
              <p>Ce site utilise des cookies techniques essentiels au bon fonctionnement du site (préférences de thème, langue). Aucun cookie publicitaire tiers n'est utilisé.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
