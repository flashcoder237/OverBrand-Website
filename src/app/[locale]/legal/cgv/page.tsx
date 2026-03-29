import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function CGV() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="w-8 h-px mb-4" style={{ background: 'var(--primary)' }} />
            <h1 className="font-display text-5xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
              CONDITIONS GÉNÉRALES DE VENTE
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>Dernière mise à jour : mars 2025</p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>1. Objet</h2>
              <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre OverBrand et ses clients dans le cadre de la fourniture de services digitaux (création de sites web, développement d'applications, branding, SEO, publicité en ligne).</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>2. Formation du contrat</h2>
              <p>Tout projet débute par une consultation gratuite suivie de l'émission d'un devis détaillé. Le contrat est formé dès la signature du devis et le versement de l'acompte prévu. Toute commande vaut acceptation des présentes CGV.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>3. Tarifs et modalités de paiement</h2>
              <p>Les tarifs sont indiqués en euros hors taxes dans les devis. Les modalités de paiement standard sont :</p>
              <ul className="mt-3 space-y-1 list-disc list-inside">
                <li><strong style={{ color: 'var(--text)' }}>40 %</strong> à la commande (acompte)</li>
                <li><strong style={{ color: 'var(--text)' }}>40 %</strong> à la livraison de la maquette validée</li>
                <li><strong style={{ color: 'var(--text)' }}>20 %</strong> à la livraison finale</li>
              </ul>
              <p className="mt-3">Les paiements sont réalisables par virement bancaire ou tout autre moyen convenu par écrit. Tout retard de paiement entraîne des pénalités de 1,5 % par mois.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>4. Délais de livraison</h2>
              <p>Les délais sont définis dans le devis et courent à partir de la réception de l'acompte et de tous les éléments nécessaires à la réalisation du projet. OverBrand s'engage à respecter les délais convenus, sauf cas de force majeure ou retard imputable au client.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>5. Obligations du client</h2>
              <p>Le client s'engage à :</p>
              <ul className="mt-3 space-y-1 list-disc list-inside">
                <li>Fournir tous les éléments nécessaires dans les délais convenus</li>
                <li>Valider ou rejeter les livrables dans un délai de 7 jours ouvrés</li>
                <li>Désigner un interlocuteur unique pour les échanges</li>
                <li>Régler les factures dans les délais prévus</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>6. Propriété intellectuelle</h2>
              <p>Les droits de propriété intellectuelle sur les créations réalisées sont transférés au client à réception du solde final. Jusqu'au paiement intégral, OverBrand reste propriétaire de toutes les créations.</p>
              <p className="mt-2">OverBrand se réserve le droit de mentionner la réalisation dans son portfolio, sauf accord contraire explicite du client.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>7. Révisions et modifications</h2>
              <p>Chaque devis inclut un nombre de révisions définies. Toute modification substantielle du cahier des charges en cours de projet fera l'objet d'un avenant tarifaire.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>8. Résiliation</h2>
              <p>En cas de résiliation à l'initiative du client après signature, l'acompte versé reste acquis à OverBrand. Le travail réalisé jusqu'à la date de résiliation sera facturé au prorata.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>9. Limitation de responsabilité</h2>
              <p>La responsabilité d'OverBrand est limitée au montant du contrat. OverBrand ne saurait être tenu responsable des dommages indirects, pertes d'exploitation ou manque à gagner.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>10. Droit applicable et litiges</h2>
              <p>Les présentes CGV sont soumises au droit applicable. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire.</p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 uppercase tracking-widest" style={{ color: 'var(--text)' }}>11. Contact</h2>
              <p>Pour toute question relative aux présentes CGV : <a href="mailto:contact@overbrand.net" style={{ color: 'var(--primary)' }}>contact@overbrand.net</a></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
