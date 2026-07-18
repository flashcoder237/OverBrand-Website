'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Code2,
  Cpu,
  LayoutGrid,
  MonitorSmartphone,
  Search,
  Target,
} from 'lucide-react'
import type { CasePhase, CaseStudy } from '@/lib/projects-data'
import { getNextCaseStudy } from '@/lib/projects-data'

const PHASE_ICONS: Record<CasePhase['icon'], typeof Search> = {
  search: Search,
  box: Box,
  devices: MonitorSmartphone,
  code: Code2,
}

// Written out in full so Tailwind's scanner sees the literals — a template
// string like `delay-${i * 100}` would never be generated.
const DELAY = ['', 'delay-100', 'delay-200', 'delay-300'] as const
const delay = (i: number) => DELAY[i % DELAY.length]

const METRIC_TONE: Record<string, React.CSSProperties> = {
  orange: { color: 'var(--accent-warm)' },
  paper: { color: 'var(--paper)' },
  blue: { color: 'var(--primary-light)' },
  outline: { color: 'transparent', WebkitTextStroke: '1.5px var(--paper)' },
}

/** Sticky chapter label that opens each solution section. */
function Chapter({
  n,
  title,
  label,
  tone = 'blue',
}: {
  n: string
  title: string
  label: string
  tone?: 'blue' | 'orange' | 'ink'
}) {
  const dot =
    tone === 'orange' ? 'var(--accent-warm)' : tone === 'ink' ? 'var(--text)' : 'var(--primary)'
  return (
    <div
      className="flex items-center gap-3 px-6 py-4 text-[11px] font-mono uppercase tracking-wider sticky top-16 md:top-20 z-30 backdrop-blur-md"
      style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--line)', color: 'var(--text-subtle)' }}
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
      {label}_{n} <span className="opacity-40">/</span> <span style={{ color: 'var(--text-muted)' }}>{title}</span>
    </div>
  )
}

export function CaseStudyView({ study, locale }: { study: CaseStudy; locale: string }) {
  const t = useTranslations('caseStudy')
  const next = getNextCaseStudy(study.slug, locale)

  return (
    <main className="lg:pl-16" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      {/* pt offsets the fixed navbar so the breadcrumb strip clears it. */}
      <header className="flex flex-col min-h-[90vh] pt-16 md:pt-20">
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 text-[11px] font-mono uppercase tracking-wider"
          style={{ borderBottom: '1px solid var(--line)' }}
        >
          <div className="flex gap-2 items-center" style={{ color: 'var(--text-subtle)' }}>
            <Link href="/" className="hover:opacity-60 transition-opacity">{t('breadcrumb_home')}</Link>
            <span>/</span>
            <Link href="/projets" className="hover:opacity-60 transition-opacity">{t('all_projects')}</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>{study.title}</span>
          </div>
          <div className="mt-2 sm:mt-0 font-bold flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--primary)' }} />
            {t('case_study_ref')} · {study.ref}
          </div>
        </div>

        <div className="px-6 py-12 md:py-20 lg:py-28 flex flex-col justify-center reveal">
          <h1 className="font-display uppercase leading-[0.85] tracking-tight w-full flex flex-col">
            <span className="block" style={{ fontSize: 'clamp(3.5rem, 12vw, 11rem)' }}>{study.titleLead}</span>
            <span
              className="block text-outline ml-0 md:ml-24 flex items-center gap-4"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 11rem)' }}
            >
              <span className="font-body font-black" style={{ color: 'var(--accent-warm)', WebkitTextStroke: '0' }}>/</span>
              {study.titleTrail}
            </span>
          </h1>
        </div>

        {/* Metadata strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          {[
            { k: t('meta_client'), v: <span className="font-display text-2xl md:text-3xl uppercase">{study.client}</span> },
            { k: t('meta_year'), v: <span className="font-display text-2xl md:text-3xl">{study.year}</span> },
            {
              k: t('meta_services'),
              v: (
                <span className="font-bold text-sm leading-tight">
                  {study.services.map((s) => (<span key={s} className="block">{s}</span>))}
                </span>
              ),
            },
            {
              k: t('meta_duration'),
              v: <span className="font-display text-2xl md:text-3xl" style={{ color: 'var(--primary)' }}>{study.duration}</span>,
            },
          ].map((cell, i) => (
            <div
              key={cell.k}
              className={`p-4 md:p-6 flex flex-col justify-between min-h-[130px] reveal ${delay(i)}`}
              style={{
                borderRight: i % 2 === 0 || i < 3 ? '1px solid var(--line)' : undefined,
                borderBottom: i < 2 ? '1px solid var(--line)' : undefined,
              }}
            >
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>{cell.k}</span>
              <span className="mt-4">{cell.v}</span>
            </div>
          ))}
        </div>

        {/* Hero image */}
        <div className="flex-1 w-full relative min-h-[50vh] lg:min-h-[70vh] overflow-hidden" style={{ background: 'var(--ink)', borderBottom: '1px solid var(--line)' }}>
          <Image
            src={study.cover}
            alt={`${study.title} — page d'accueil`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top transition-transform duration-1000 hover:scale-[1.03]"
          />
        </div>
      </header>

      {/* ── 2. LE MANDAT ────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-12" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="md:col-span-4 p-8 md:p-12 lg:p-16 reveal" style={{ borderRight: '1px solid var(--line)' }}>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight leading-none uppercase">
            {t('mandate_1')} <br />{t('mandate_2')}<span style={{ color: 'var(--accent-warm)' }}>.</span>
          </h2>
          <a
            href={study.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 text-sm font-mono accent-underline"
            style={{ color: 'var(--text-muted)' }}
          >
            {study.urlLabel} <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="md:col-span-8 p-8 md:p-12 lg:p-16 reveal delay-100" style={{ background: 'var(--surface)' }}>
          <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl">{study.mandate}</p>
          <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl mt-6">
            <strong className="font-bold" style={{ color: 'var(--primary)' }}>{t('challenge_label')}</strong>
            {study.challenge}
          </p>
        </div>
      </section>

      {/* ── 3. PHASES ───────────────────────────────────────────────────── */}
      <section className="flex flex-col lg:flex-row text-sm font-mono" style={{ borderBottom: '1px solid var(--line)' }}>
        {study.phases.map((p, i) => {
          const Icon = PHASE_ICONS[p.icon]
          return (
            <div
              key={p.label}
              className={`flex-1 p-6 flex flex-col md:flex-row lg:flex-col justify-between gap-4 reveal ${delay(i)}`}
              style={{
                borderRight: i < study.phases.length - 1 ? '1px solid var(--line)' : undefined,
                borderBottom: '1px solid var(--line)',
              }}
            >
              <div className="flex items-center gap-2">
                <Icon size={18} style={{ color: 'var(--primary)' }} />
                {t('phase')} {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <strong className="block text-base font-body uppercase">{p.label}</strong>
                <span style={{ color: 'var(--text-subtle)' }}>{p.window}</span>
              </div>
            </div>
          )
        })}
      </section>

      {/* ── 4. MÉTRIQUES (dark) ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6" style={{ background: 'var(--ink)', color: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-[10px] font-mono tracking-widest uppercase mb-12 flex items-center gap-4" style={{ color: 'rgba(244,244,240,0.5)' }}>
            <span className="h-px flex-1" style={{ background: 'rgba(244,244,240,0.2)' }} />
            <Target size={14} /> {t('impact')}
            <span className="h-px flex-1" style={{ background: 'rgba(244,244,240,0.2)' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {study.metrics.map((m, i) => (
              <div
                key={m.label}
                className={`flex flex-col pt-8 lg:pt-0 lg:pl-8 reveal ${delay(i)}`}
                style={{ borderLeft: i > 0 ? '1px solid rgba(244,244,240,0.2)' : undefined }}
              >
                <span className="font-display tracking-tight leading-none" style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)', ...METRIC_TONE[m.tone] }}>
                  {m.value}
                  {m.suffix && <span className="text-4xl">{m.suffix}</span>}
                </span>
                <span className="font-bold text-sm tracking-wide mt-4 uppercase">{m.label}</span>
                <p className="text-sm font-light mt-2" style={{ color: 'rgba(244,244,240,0.6)' }}>{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CHAPITRE 01 — L'interface livrée ─────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--line)' }}>
        <Chapter n="01" label={t('chapter')} title={t('chapter_01')} />
        <div className="p-4 md:p-8">
          <div className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden rounded-[2rem] reveal" style={{ background: 'var(--surface-2)' }}>
            <Image src={study.gallery[0]} alt={t('alt_interface', { title: study.title })} fill sizes="100vw" className="object-cover object-top" />
          </div>
          <p className="text-center text-sm font-mono mt-6 max-w-2xl mx-auto reveal" style={{ color: 'var(--text-subtle)' }}>
            {t('fig_caption', { url: study.urlLabel })}
          </p>
        </div>
      </section>

      {/* ── 6. CHAPITRE 02 — Système de couleur ─────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--line)' }}>
        <Chapter n="02" label={t('chapter')} title={t('chapter_02')} tone="orange" />
        <div className="p-8 md:p-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 reveal">
            {study.palette.map((c) => (
              <div key={c.hex} className="flex flex-col group">
                <div
                  className="aspect-square rounded-xl mb-4 transition-transform duration-500 group-hover:-translate-y-2"
                  style={{ background: c.hex, border: '1px solid var(--line-strong)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                />
                <span className="font-bold text-sm">{c.name}</span>
                <span className="font-mono text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>{c.hex}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CHAPITRE 03 — Galerie ────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg-secondary)' }}>
        <Chapter n="03" label={t('chapter')} title={t('chapter_03')} tone="ink" />
        <div className="p-6 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {study.gallery.map((src, i) => (
              <div
                key={src}
                className={`${i === 0 ? 'md:col-span-8' : 'md:col-span-4'} relative aspect-[16/10] rounded-[2rem] overflow-hidden shadow-lg reveal ${delay(i)}`}
                style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}
              >
                <Image src={src} alt={t('alt_screen', { title: study.title, n: i + 1 })} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CITATION (optionnelle) ───────────────────────────────────── */}
      {study.quote && (
        <section className="py-24 md:py-40 px-6 max-w-5xl mx-auto flex flex-col items-center text-center" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 className="serif-italic text-4xl md:text-6xl leading-[1.1] mb-12 reveal">“{study.quote.text}”</h2>
          <div className="flex flex-col items-center reveal delay-100">
            <span className="font-bold text-lg">{study.quote.author}</span>
            <span className="text-sm font-mono uppercase mt-1" style={{ color: 'var(--text-subtle)' }}>{study.quote.role}</span>
          </div>
        </section>
      )}

      {/* ── 9. FICHE TECHNIQUE ──────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-between" style={{ borderRight: '1px solid var(--line)' }}>
          <h3 className="font-display text-4xl uppercase">{t('spec_1')} <br />{t('spec_2')}.</h3>
          <Cpu size={40} className="mt-8" style={{ color: 'var(--text-subtle)' }} />
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 font-mono text-sm">
          {study.stack.map((group, i) => (
            <div
              key={group.label}
              className={`p-8 flex flex-col gap-2 reveal ${delay(i)}`}
              style={{
                borderBottom: i < study.stack.length - 2 ? '1px solid var(--line)' : undefined,
                borderRight: i % 2 === 0 ? '1px solid var(--line)' : undefined,
              }}
            >
              <span className="block uppercase mb-1 text-xs" style={{ color: 'var(--text-subtle)' }}>{group.label}</span>
              <div className="font-bold flex flex-col gap-1">
                {group.items.map((it) => (<span key={it}>{it}</span>))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. LIVRABLES ───────────────────────────────────────────────── */}
      <section className="p-8 md:p-16" style={{ borderBottom: '1px solid var(--line)' }}>
        <h3 className="font-display text-2xl uppercase tracking-widest mb-8" style={{ color: 'var(--text-subtle)' }}>{t('deliverables')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
          {study.deliverables.map((d, i) => (
            <div key={d} className="flex items-baseline gap-4 py-3 reveal" style={{ borderTop: '1px solid var(--line)' }}>
              <span className="font-mono text-xs shrink-0" style={{ color: 'var(--accent-warm)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span className="text-base font-light">{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11. BILAN ───────────────────────────────────────────────────── */}
      <section className="p-8 md:p-16 max-w-7xl mx-auto w-full" style={{ borderBottom: '1px solid var(--line)' }}>
        <h3 className="font-display text-4xl md:text-5xl uppercase mb-16 text-center">{t('outcomes_title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {study.outcomes.map((o, i) => (
            <div key={o.title} className={`flex flex-col reveal ${delay(i)}`}>
              <div
                className="flex items-start gap-6 pl-6"
                style={{ borderLeft: `4px solid ${o.tone === 'orange' ? 'var(--accent-warm)' : 'var(--primary)'}` }}
              >
                <span
                  className="font-display text-5xl leading-none mt-1"
                  style={{ color: o.tone === 'orange' ? 'var(--accent-warm)' : 'var(--primary)' }}
                >
                  {i + 1}.
                </span>
                <div>
                  <h4 className="font-bold text-xl uppercase tracking-wide mb-2">{o.title}</h4>
                  <p className="font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>{o.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 12. CRÉDITS ─────────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--line)' }}>
        <Chapter n="04" label={t('chapter')} title={t('chapter_04')} tone="ink" />
        <div className="flex flex-col">
          {study.credits.map((row) => (
            <div
              key={row.role}
              className="flex flex-col md:flex-row items-start md:items-center p-6 md:p-8 transition-colors group reveal"
              style={{ borderBottom: '1px solid var(--line)' }}
            >
              <div className="w-full md:w-1/4 font-mono text-xs uppercase mb-4 md:mb-0" style={{ color: 'var(--text-subtle)' }}>
                {row.role}
              </div>
              <div className="w-full md:w-3/4 flex flex-wrap gap-6">
                {row.people.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="font-bold text-lg">{p.name}</span>
                    {p.lead && (
                      <span className="text-xs rounded-full px-2 py-0.5 font-mono" style={{ border: '1px solid var(--line-strong)', color: 'var(--text-subtle)' }}>
                        {t('lead_badge')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 13. PROJET SUIVANT ──────────────────────────────────────────── */}
      <Link href={`/projets/${next.slug}` as never} className="block relative w-full h-[60vh] lg:h-[80vh] overflow-hidden group">
        <Image
          src={next.cover}
          alt={next.title}
          fill
          sizes="100vw"
          className="object-cover object-top transition-transform duration-1000 group-hover:scale-105 brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 z-10" style={{ color: 'var(--paper)' }}>
          <span className="font-mono text-sm tracking-widest uppercase mb-4 opacity-70">{t('next_project')}</span>
          <h4 className="font-display uppercase leading-none tracking-tight text-center" style={{ fontSize: 'clamp(3rem, 9vw, 9rem)' }}>
            <span className="text-outline-paper">{next.titleLead}</span>
            <span className="transition-colors duration-500 group-hover:text-[var(--accent-warm)]">{next.titleTrail}</span>
          </h4>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
          <ArrowRight size={24} />
        </div>
      </Link>

      {/* ── 14. CTA INTERSTITIEL ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: '1px solid var(--line)' }}>
        <Link
          href="/projets"
          className="p-8 md:p-12 lg:p-16 flex justify-center items-center group transition-colors"
          style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--line)' }}
        >
          <span className="font-display uppercase tracking-widest flex items-center gap-4 text-xl">
            <LayoutGrid size={22} className="group-hover:-rotate-90 transition-transform duration-500" />
            {t('all_projects')}
          </span>
        </Link>
        <Link
          href="/contact"
          className="p-8 md:p-12 lg:p-16 flex justify-center items-center group overflow-hidden relative"
          style={{ background: 'var(--accent-warm)', color: 'var(--ink)' }}
        >
          <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" style={{ background: 'var(--ink)' }} />
          <span className="font-display uppercase tracking-widest flex items-center gap-4 text-2xl md:text-3xl relative z-10 transition-colors duration-500 group-hover:text-[var(--paper)]">
            {t('start_project')} <ArrowUpRight size={28} />
          </span>
        </Link>
      </div>
    </main>
  )
}
