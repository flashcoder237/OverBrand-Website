import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Globe, AtSign, ExternalLink, Share2 } from 'lucide-react'

const LINKS = {
  services: [
    { label: 'Création de sites web', href: '#services' },
    { label: 'Applications mobiles', href: '#services' },
    { label: 'Hébergement', href: '#services' },
    { label: 'Publicité en ligne', href: '#services' },
    { label: 'SEO & Visibilité', href: '#services' },
    { label: 'Identité de marque', href: '#services' },
  ],
  company: [
    { label: 'À propos', href: '#about' },
    { label: 'Notre processus', href: '#process' },
    { label: 'Devis gratuit', href: '#contact' },
    { label: 'Espace client', href: '/dashboard' },
  ],
  legal: [
    { label: 'Mentions légales', href: '#' },
    { label: 'Politique de confidentialité', href: '#' },
    { label: 'CGV', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
                <Image src="/logo.png" alt="OverBrand" fill className="object-contain" />
              </div>
              <span className="text-xl font-black" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>
                Over<span style={{ color: 'var(--primary)' }}>Brand</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Votre partenaire digital pour créer, développer et faire rayonner votre présence en ligne.
            </p>
            <div className="space-y-2">
              <a href="mailto:contact@overbrand.com" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                <Mail size={14} />
                contact@overbrand.com
              </a>
              <a href="tel:+000000000" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                <Phone size={14} />
                +00 00 00 00 00
              </a>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={14} />
                Votre ville, Pays
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[Globe, AtSign, ExternalLink, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>Services</h4>
            <ul className="space-y-2.5">
              {LINKS.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>Entreprise</h4>
            <ul className="space-y-2.5">
              {LINKS.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>Légal</h4>
            <ul className="space-y-2.5">
              {LINKS.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            © 2024 OverBrand. Tous droits réservés.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            Conçu et développé avec ❤️ par OverBrand
          </p>
        </div>
      </div>
    </footer>
  )
}
