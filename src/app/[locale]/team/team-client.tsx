'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { TeamMember } from '@/lib/graphql/queries'

function LinkedinIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function XIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function GlobeIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65 } },
}

function TeamCard({ member }: { member: TeamMember }) {
  const socials = [
    { href: member.linkedin_url, Icon: LinkedinIcon, label: 'LinkedIn' },
    { href: member.twitter_url, Icon: XIcon, label: 'X / Twitter' },
    { href: member.website_url, Icon: GlobeIcon, label: 'Site web' },
  ].filter((s) => s.href)

  return (
    <motion.div
      variants={fadeUp}
      className="group relative flex flex-col"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
      }}
      whileHover={{ y: -6 }}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}
      />

      <div className="p-8 flex flex-col flex-1">
        {member.tag && (
          <span
            className="self-start text-xs font-bold uppercase tracking-widest px-3 py-1 mb-6"
            style={{
              background: 'var(--primary-glow)',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
            }}
          >
            {member.tag}
          </span>
        )}

        <div className="mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden relative">
            {member.photo_url ? (
              <Image src={member.photo_url} alt={member.name} fill className="object-cover" style={{ objectPosition: member.photo_position ?? 'center top' }} />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-dark), var(--accent))',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.05em',
                }}
              >
                {member.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <h3
          className="font-display leading-tight mb-1"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)' }}
        >
          {member.name}
        </h3>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--primary)' }}>
          {member.role}
        </p>
        {member.bio && (
          <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
            {member.bio}
          </p>
        )}

        <div className="flex items-center gap-2 mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          {socials.length > 0 ? (
            socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="w-8 h-8 flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-subtle)',
                }}
              >
                <Icon size={13} />
              </a>
            ))
          ) : (
            <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>OverBrand</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function TeamGrid({ members, locale }: { members: TeamMember[]; locale: string }) {
  if (members.length === 0) {
    return (
      <div className="text-center py-24" style={{ color: 'var(--text-subtle)' }}>
        <p className="text-sm uppercase tracking-widest">Équipe bientôt disponible</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {members.map((member) => (
        <TeamCard key={member.id} member={member} />
      ))}
    </motion.div>
  )
}

export function TeamHero({ locale }: { locale: string }) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: 0.4,
        }}
      />
      <div
        className="absolute top-10 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(40,85,160,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>
              {locale === 'fr' ? 'Qui sommes-nous' : 'Who we are'}
            </span>
          </div>
          <h1
            className="font-display leading-none mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 14vw, 12rem)',
              color: 'var(--text)',
              letterSpacing: '0.02em',
            }}
          >
            {locale === 'fr' ? "L'ÉQUIPE" : 'THE TEAM'}
          </h1>
          <p className="max-w-xl text-base leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
            {locale === 'fr'
              ? "Derrière chaque projet OverBrand, une équipe de passionnés qui allie créativité, expertise technique et vision stratégique. Rencontrez les architectes de votre présence digitale."
              : "Behind every OverBrand project is a passionate team combining creativity, technical expertise and strategic vision. Meet the architects of your digital presence."}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export function TeamJoinCTA({ locale }: { locale: string }) {
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>
              {locale === 'fr' ? 'On recrute' : "We're hiring"}
            </span>
            <div className="w-8 h-px" style={{ background: 'var(--primary)' }} />
          </div>
          <h2
            className="font-display leading-none mb-6"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 6rem)', color: 'var(--text)' }}
          >
            {locale === 'fr' ? "REJOIGNEZ\nL'AVENTURE" : 'JOIN THE\nADVENTURE'}
          </h2>
          <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>
            {locale === 'fr'
              ? "Vous êtes passionné(e) par le digital, le design ou le développement ? Faites-nous parvenir votre candidature spontanée."
              : "Are you passionate about digital, design or development? Send us your spontaneous application."}
          </p>
          <Link href={`/${locale}#contact`}>
            <button className="btn-primary text-xs px-10 py-4 inline-flex items-center gap-3">
              {locale === 'fr' ? 'Postuler maintenant' : 'Apply now'}
              <ArrowRight size={16} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
