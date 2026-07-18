'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Radio } from 'lucide-react'
import { routing } from '@/i18n/routing'

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)

// Compact infinity path for the decorative divider (200×80 space)
// Two perfect circles, radius=30, k = 0.5523 × 30 ≈ 17
// Right lobe: centre (130,40), Left lobe: centre (70,40), touching at (100,40)
const INF_PATH =
  'M100,40 ' +
  'C100,23 113,10 130,10 C147,10 160,23 160,40 ' +
  'C160,57 147,70 130,70 C113,70 100,57 100,40 ' +
  'C100,57 87,70 70,70 C53,70 40,57 40,40 ' +
  'C40,23 53,10 70,10 C87,10 100,23 100,40 Z'

export default function NotFound() {
  const pathname = usePathname() ?? ''
  const locale = pathname.match(LOCALE_PREFIX)?.[1] ?? routing.defaultLocale

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(40,85,160,0.08) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(40,85,160,0.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Vignette ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 20%, var(--bg) 90%)',
        }}
      />

      {/* ── Horizontal scan lines ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(40,85,160,0.022) 3px, rgba(40,85,160,0.022) 4px)',
        }}
      />

      {/* ── Radar sweep ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          width: 900, height: 900,
          borderRadius: '50%',
          border: '1px solid rgba(40,85,160,0.08)',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Concentric rings */}
        {[600, 300].map((size) => (
          <div
            key={size}
            style={{
              position: 'absolute',
              width: size, height: size,
              borderRadius: '50%',
              border: '1px solid rgba(40,85,160,0.07)',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Rotating sweep wedge */}
        <div
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background:
              'conic-gradient(from 0deg, rgba(58,111,216,0.14) 0deg, rgba(58,111,216,0.02) 50deg, transparent 80deg, transparent 360deg)',
            animation: 'nf-radar 7s linear infinite',
          }}
        />

        {/* Sweep trailing dot */}
        <div
          style={{
            position: 'absolute',
            width: 4, height: 450,
            top: '50%', left: '50%',
            transformOrigin: '50% 0%',
            background: 'linear-gradient(to bottom, transparent, rgba(58,111,216,0.4) 60%, rgba(107,159,212,0.7))',
            animation: 'nf-radar 7s linear infinite',
          }}
        />
      </div>

      {/* ── Radial glow ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          width: 700, height: 500,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(40,85,160,0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
          animation: 'nf-breathe 5s ease-in-out infinite',
        }}
      />

      {/* ── Sweep line ───────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          pointerEvents: 'none', zIndex: 2,
          background:
            'linear-gradient(90deg, transparent, rgba(58,111,216,0.45) 25%, rgba(107,159,212,0.85) 50%, rgba(58,111,216,0.45) 75%, transparent)',
          boxShadow: '0 0 12px rgba(58,111,216,0.4)',
          animation: 'nf-sweep 6s linear infinite',
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative', zIndex: 3,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          padding: '0 24px',
          gap: 0,
        }}
      >
        {/* Status badge */}
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 16px',
            border: '1px solid rgba(58,111,216,0.3)',
            background: 'rgba(40,85,160,0.09)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
            clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
          }}
        >
          <Radio size={10} color="#6b9fd4" />
          <span
            style={{
              fontFamily: 'var(--font-sans)', fontSize: 10,
              fontWeight: 700, letterSpacing: '0.2em', color: '#6b9fd4',
            }}
          >
            ERR_404 // SIGNAL_NOT_FOUND
          </span>
          <div
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#ef4444',
              animation: 'nf-blink 1.1s ease-in-out infinite',
            }}
          />
        </div>

        {/* 404 — enormous, glitch-animated */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(110px, 24vw, 300px)',
            lineHeight: 0.82,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            userSelect: 'none',
            animation: 'nf-glitch 6s ease-in-out infinite',
            marginBottom: 6,
          }}
        >
          404
        </div>

        {/* ── Decorative mini infinity SVG ─────────────────────────────────── */}
        <div style={{ position: 'relative', margin: '18px 0', width: 200, height: 80 }}>
          <svg
            viewBox="0 0 200 80"
            width="200"
            height="80"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="nf-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            {/* Glow layer */}
            <path d={INF_PATH} fill="none" stroke="#3a6fd8" strokeWidth="14" opacity="0.12" filter="url(#nf-glow)" />
            {/* Tube */}
            <path d={INF_PATH} fill="none" stroke="#050d1a" strokeWidth="5" />
            <path d={INF_PATH} fill="none" stroke="#1a3a6b" strokeWidth="3" opacity="0.8" />
            {/* Animated core pulse */}
            <path
              d={INF_PATH}
              fill="none"
              stroke="#3a6fd8"
              strokeWidth="1.5"
              opacity="0.6"
              style={{ animation: 'nf-core 3s ease-in-out infinite' }}
            />
            {/* Broken gap — "signal lost" — erases the crossover */}
            <rect x="90" y="30" width="20" height="20" fill="var(--bg)" />
            {/* Break marks */}
            <line x1="90"  y1="32" x2="85"  y2="26" stroke="#3a6fd8" strokeWidth="1.2" opacity="0.5" />
            <line x1="110" y1="32" x2="115" y2="26" stroke="#3a6fd8" strokeWidth="1.2" opacity="0.5" />
            <line x1="90"  y1="48" x2="85"  y2="54" stroke="#3a6fd8" strokeWidth="1.2" opacity="0.5" />
            <line x1="110" y1="48" x2="115" y2="54" stroke="#3a6fd8" strokeWidth="1.2" opacity="0.5" />
            {/* Center node (behind the gap — hint of what was there) */}
            <circle cx="100" cy="40" r="3.5" fill="#3a6fd8" opacity="0.2" filter="url(#nf-glow)" />
            <circle cx="100" cy="40" r="1.5" fill="#3a6fd8" opacity="0.35" />
          </svg>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 3.5vw, 32px)',
            letterSpacing: '0.28em',
            color: '#3a6fd8',
            marginBottom: 16,
            animation: 'nf-glitch 6s ease-in-out infinite',
            animationDelay: '0.08s',
          }}
        >
          SIGNAL PERDU
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            lineHeight: 1.75,
            color: 'var(--text-muted)',
            maxWidth: 380,
            margin: '0 auto 36px',
          }}
        >
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
          <br />
          La boucle continue — retrouvez votre chemin.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href={`/${locale}`} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <ArrowLeft size={14} />
            Retour à l&apos;accueil
          </Link>
          <Link href={`/${locale}#contact`} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            Nous contacter
          </Link>
        </div>

        {/* Coordinate readout */}
        <div
          style={{
            marginTop: 48,
            display: 'flex', gap: 24, alignItems: 'center',
            fontFamily: 'var(--font-sans)', fontSize: 10,
            letterSpacing: '0.18em', color: 'rgba(107,159,212,0.4)',
            fontWeight: 600,
          }}
        >
          <span>X: 404.000</span>
          <div style={{ width: 1, height: 12, background: 'rgba(58,111,216,0.25)' }} />
          <span>Y: VOID</span>
          <div style={{ width: 1, height: 12, background: 'rgba(58,111,216,0.25)' }} />
          <span>∞ OVERBRAND</span>
        </div>
      </div>

      {/* ── Corner brackets ──────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 28,    left: 28,  width: 26, height: 26, borderTop: '1.5px solid rgba(58,111,216,0.55)', borderLeft:  '1.5px solid rgba(58,111,216,0.55)' }} />
      <div style={{ position: 'absolute', top: 28,    right: 28, width: 26, height: 26, borderTop: '1.5px solid rgba(58,111,216,0.55)', borderRight: '1.5px solid rgba(58,111,216,0.55)' }} />
      <div style={{ position: 'absolute', bottom: 28, left: 28,  width: 26, height: 26, borderBottom: '1.5px solid rgba(58,111,216,0.55)', borderLeft:  '1.5px solid rgba(58,111,216,0.55)' }} />
      <div style={{ position: 'absolute', bottom: 28, right: 28, width: 26, height: 26, borderBottom: '1.5px solid rgba(58,111,216,0.55)', borderRight: '1.5px solid rgba(58,111,216,0.55)' }} />

      <style>{`
        @keyframes nf-sweep {
          0%   { top: -1px; }
          100% { top: 100%; }
        }
        @keyframes nf-radar {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes nf-breathe {
          0%, 100% { transform: scale(1);    opacity: 0.9; }
          50%       { transform: scale(1.15); opacity: 1;   }
        }
        @keyframes nf-blink {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.2; }
        }
        @keyframes nf-core {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.9;  }
        }
        @keyframes nf-glitch {
          0%, 78%, 100% {
            text-shadow: none;
            transform: translate(0, 0);
            clip-path: none;
          }
          80% {
            text-shadow: -4px 0 #3a6fd8, 4px 0 #ef4444;
            transform: translate(-3px, 0);
            clip-path: polygon(0 15%, 100% 15%, 100% 35%, 0 35%);
          }
          81% {
            text-shadow: 4px 0 #6b9fd4, -4px 0 #ef4444;
            transform: translate(3px, 0);
            clip-path: none;
          }
          82% {
            text-shadow: -3px 0 #2855a0, 3px 0 #f59e0b;
            transform: translate(0, 1px);
            clip-path: polygon(0 55%, 100% 55%, 100% 75%, 0 75%);
          }
          84% {
            text-shadow: 2px 0 #3a6fd8;
            transform: translate(-1px, 0);
            clip-path: none;
          }
          86% {
            text-shadow: none;
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  )
}
