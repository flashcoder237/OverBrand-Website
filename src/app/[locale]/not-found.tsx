'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const pathname = usePathname() ?? ''
  const locale = pathname.match(/^\/(fr|en)/)?.[1] ?? 'fr'

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
      {/* Scan lines */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(40,85,160,0.025) 3px, rgba(40,85,160,0.025) 4px)',
        }}
      />

      {/* Sweep line */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          pointerEvents: 'none', zIndex: 2,
          background:
            'linear-gradient(90deg, transparent, rgba(58,111,216,0.55) 30%, rgba(107,159,212,0.9) 50%, rgba(58,111,216,0.55) 70%, transparent)',
          boxShadow: '0 0 14px rgba(58,111,216,0.5)',
          animation: 'sweep 5.5s linear infinite',
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(40,85,160,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(40,85,160,0.07) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Corner brackets */}
      {([
        { top: 28, left: 28, borderTop: true, borderLeft: true },
        { top: 28, right: 28, borderTop: true, borderRight: true },
        { bottom: 28, left: 28, borderBottom: true, borderLeft: true },
        { bottom: 28, right: 28, borderBottom: true, borderRight: true },
      ] as const).map((corner, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 36, height: 36,
            top: 'top' in corner ? corner.top : undefined,
            bottom: 'bottom' in corner ? corner.bottom : undefined,
            left: 'left' in corner ? corner.left : undefined,
            right: 'right' in corner ? corner.right : undefined,
            borderTop: 'borderTop' in corner ? '1.5px solid #3a6fd8' : undefined,
            borderBottom: 'borderBottom' in corner ? '1.5px solid #3a6fd8' : undefined,
            borderLeft: 'borderLeft' in corner ? '1.5px solid #3a6fd8' : undefined,
            borderRight: 'borderRight' in corner ? '1.5px solid #3a6fd8' : undefined,
            opacity: 0.5,
          }}
        />
      ))}

      {/* Radial glow behind the 404 */}
      <div
        style={{
          position: 'absolute',
          width: 700, height: 450,
          background: 'radial-gradient(ellipse at center, rgba(40,85,160,0.18) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 24px' }}>

        {/* Status badge */}
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px',
            border: '1px solid rgba(58,111,216,0.35)',
            borderRadius: 4,
            marginBottom: 20,
            background: 'rgba(40,85,160,0.1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#ef4444',
              animation: 'blink 1.2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-sans)', fontSize: 10,
              fontWeight: 700, letterSpacing: '0.18em', color: '#6b9fd4',
            }}
          >
            ERROR_PAGE_NOT_FOUND
          </span>
        </div>

        {/* 404 */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(96px, 22vw, 260px)',
            lineHeight: 0.85,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            userSelect: 'none',
            animation: 'glitch 7s ease-in-out infinite',
            marginBottom: 20,
          }}
        >
          404
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(16px, 3.5vw, 30px)',
            letterSpacing: '0.28em',
            color: '#3a6fd8',
            marginBottom: 20,
            animation: 'glitch 7s ease-in-out infinite',
            animationDelay: '0.06s',
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
            maxWidth: 360,
            margin: '0 auto 40px',
          }}
        >
          La page que vous recherchez n&apos;existe pas ou a été déplacée vers une autre adresse.
        </p>

        {/* CTA */}
        <Link
          href={`/${locale}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px',
            background: 'var(--primary)',
            color: 'white',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: '0.05em',
            borderRadius: 10,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <ArrowLeft size={15} />
          Retour à l&apos;accueil
        </Link>
      </div>

      <style>{`
        @keyframes sweep {
          0%   { top: -1px; }
          100% { top: 100%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.2; }
        }
        @keyframes glitch {
          0%, 80%, 100% {
            text-shadow: none;
            transform: translate(0, 0);
          }
          82% {
            text-shadow: -3px 0 #3a6fd8, 3px 0 #ef4444;
            transform: translate(-2px, 0);
          }
          84% {
            text-shadow: 3px 0 #3a6fd8, -3px 0 #ef4444;
            transform: translate(2px, 0);
          }
          86% {
            text-shadow: -2px 0 #6b9fd4, 2px 0 #f59e0b;
            transform: translate(0, 1px);
          }
          88% {
            text-shadow: none;
            transform: translate(-1px, 0);
          }
          90% {
            text-shadow: 2px 0 #3a6fd8;
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  )
}
