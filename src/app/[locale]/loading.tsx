import type { CSSProperties } from 'react'

// ─── 800×400 coordinate space — shared between SVG and CSS offset-path ───────
const PATH =
  'M400,200 C430,108 548,72 622,138 C696,200 696,200 622,262 C548,328 430,292 400,200 C370,108 252,72 178,138 C104,200 104,200 178,262 C252,328 370,292 400,200 Z'

const DUR = '3.5s'
const PATH_LEN = 1560 // approximate total path length for dashoffset

// ─── Lead orb: bright white-cyan head + tapering comet trail ──────────────────
const HEAD: { s: number; c: string; o: number; sh: string; d: string }[] = [
  { s: 22, c: '#ffffff', o: 1,    sh: '0 0 16px 8px #d6eeff, 0 0 40px 16px #6b9fd4, 0 0 80px 28px rgba(58,111,216,0.55)', d: '0s'      },
  { s: 14, c: '#c0e0ff', o: 0.80, sh: '0 0 12px 5px #6b9fd4',                                                               d: '-0.09s'  },
  { s:  9, c: '#3a6fd8', o: 0.50, sh: 'none',                                                                                d: '-0.18s'  },
  { s:  6, c: '#2855a0', o: 0.28, sh: 'none',                                                                                d: '-0.27s'  },
  { s:  3, c: '#1a3a6b', o: 0.12, sh: 'none',                                                                                d: '-0.36s'  },
]

// ─── Chase orb: medium blue, half-cycle behind ────────────────────────────────
const ECHO: typeof HEAD = [
  { s: 16, c: '#6b9fd4', o: 0.90, sh: '0 0 12px 6px #3a6fd8, 0 0 32px 12px rgba(40,85,160,0.5)',                            d: '-1.75s'  },
  { s: 10, c: '#3a6fd8', o: 0.64, sh: '0 0 8px 3px #2855a0',                                                                d: '-1.84s'  },
  { s:  7, c: '#2855a0', o: 0.38, sh: 'none',                                                                                d: '-1.93s'  },
  { s:  4, c: '#1a3a6b', o: 0.17, sh: 'none',                                                                                d: '-2.02s'  },
]

const orbCss = (p: typeof HEAD[number]): CSSProperties =>
  ({
    position: 'absolute', top: 0, left: 0,
    width: p.s, height: p.s,
    borderRadius: '50%',
    background: p.c,
    opacity: p.o,
    boxShadow: p.sh,
    offsetPath: `path('${PATH}')`,
    offsetDistance: '0%',
    offsetRotate: '0deg',
    offsetAnchor: '50% 50%',
    animation: `ov-orbit ${DUR} linear infinite`,
    animationDelay: p.d,
    willChange: 'offset-distance',
  } as CSSProperties)

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Fine grid ────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(26,58,107,0.11) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(26,58,107,0.11) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Radial vignette ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 72% 72% at 50% 50%, transparent 18%, var(--bg) 88%)',
        }}
      />

      {/* ── Central nebula ───────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          width: 920, height: 560,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(40,85,160,0.26) 0%, rgba(58,111,216,0.07) 48%, transparent 72%)',
          animation: 'ov-breathe 5s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* ── Main scene (800×400, scaled for small screens) ───────────────────── */}
      <div
        className="ov-scene"
        style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 52,
        }}
      >
        {/* Infinity container */}
        <div style={{ position: 'relative', width: 800, height: 400 }}>

          {/* SVG: neon tube + traveling stroke pulse */}
          <svg
            viewBox="0 0 800 400"
            width="800"
            height="400"
            style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
          >
            <defs>
              <filter id="ov-xxl" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="32" />
              </filter>
              <filter id="ov-xl" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
              <filter id="ov-md" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id="ov-sm" x="-18%" y="-18%" width="136%" height="136%">
                <feGaussianBlur stdDeviation="2.5" />
              </filter>
              {/* Gradient for lead scan streak */}
              <linearGradient id="ov-scan-g" gradientUnits="userSpaceOnUse" x1="104" y1="200" x2="696" y2="200">
                <stop offset="0%"   stopColor="#2855a0" stopOpacity="0.1" />
                <stop offset="50%"  stopColor="#c0e0ff" stopOpacity="1"   />
                <stop offset="100%" stopColor="#2855a0" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* L1 — atmospheric halo */}
            <path d={PATH} fill="none" stroke="#3a6fd8" strokeWidth="110" opacity="0.016" filter="url(#ov-xxl)" />

            {/* L2 — wide glow ring */}
            <path d={PATH} fill="none" stroke="#2855a0" strokeWidth="32"  opacity="0.13"  filter="url(#ov-xl)" />

            {/* L3 — inner soft glow */}
            <path d={PATH} fill="none" stroke="#3a6fd8" strokeWidth="12"  opacity="0.24"  filter="url(#ov-md)" />

            {/* L4 — tube body (very dark blue-black) */}
            <path d={PATH} fill="none" stroke="#05101f" strokeWidth="7"   strokeLinecap="round" />

            {/* L5 — tube rim */}
            <path d={PATH} fill="none" stroke="#13274d" strokeWidth="4.5" opacity="0.95" />

            {/* L6 — inner edge highlight (static, dim) */}
            <path d={PATH} fill="none" stroke="#1e3f75" strokeWidth="2"   opacity="0.45" />

            {/* L7 — TRAVELING PULSE (lead) — stroke-dashoffset animation */}
            <path
              d={PATH}
              fill="none"
              stroke="url(#ov-scan-g)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`110 ${PATH_LEN}`}
              style={{
                animation: `ov-scan ${DUR} linear infinite`,
                animationDelay: '0s',
              }}
            />

            {/* L8 — TRAVELING PULSE (echo) — half-cycle offset */}
            <path
              d={PATH}
              fill="none"
              stroke="#3a6fd8"
              strokeWidth="2.5"
              strokeOpacity="0.42"
              strokeLinecap="round"
              strokeDasharray={`75 ${PATH_LEN}`}
              style={{
                animation: `ov-scan ${DUR} linear infinite`,
                animationDelay: '-1.75s',
              }}
            />

            {/* Crossover node — where the two lobes meet */}
            <circle cx="400" cy="200" r="8"   fill="#3a6fd8" opacity="0.12" filter="url(#ov-sm)" />
            <circle cx="400" cy="200" r="4.5" fill="#3a6fd8" opacity="0.4"  />
            <circle cx="400" cy="200" r="2.5" fill="#6b9fd4" opacity="0.75" />
            <circle cx="400" cy="200" r="1.2" fill="#d0eeff" opacity="1"    />
          </svg>

          {/* CSS particles — orbit immediately, no SVG timing */}
          {HEAD.map((p, i) => <div key={`h${i}`} style={orbCss(p)} />)}
          {ECHO.map((p, i) => <div key={`e${i}`} style={orbCss(p)} />)}
        </div>

        {/* ── Brand + loader ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 20,
          }}
        >
          {/* Wordmark with shimmer sweep */}
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 58,
              letterSpacing: '0.26em',
              background:
                'linear-gradient(90deg, rgba(140,180,230,0.7) 0%, #c8e4ff 30%, #3a6fd8 55%, rgba(140,180,230,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '250% auto',
              animation: 'ov-shimmer 4.2s linear infinite',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            OVERBRAND
          </span>

          {/* Thin rule */}
          <div
            style={{
              width: 260, height: 1,
              background:
                'linear-gradient(90deg, transparent, rgba(58,111,216,0.5) 30%, rgba(107,159,212,0.5) 70%, transparent)',
            }}
          />

          {/* Loading dots */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 5, height: 5,
                  borderRadius: '50%',
                  background: i === 1 || i === 2 ? '#3a6fd8' : '#2855a0',
                  animation: 'ov-dot 1.6s ease-in-out infinite',
                  animationDelay: `${i * 0.22}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Corner brackets ──────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 28,    left: 28,  width: 22, height: 22, borderTop: '1px solid rgba(40,85,160,0.45)', borderLeft:  '1px solid rgba(40,85,160,0.45)' }} />
      <div style={{ position: 'absolute', top: 28,    right: 28, width: 22, height: 22, borderTop: '1px solid rgba(40,85,160,0.45)', borderRight: '1px solid rgba(40,85,160,0.45)' }} />
      <div style={{ position: 'absolute', bottom: 28, left: 28,  width: 22, height: 22, borderBottom: '1px solid rgba(40,85,160,0.45)', borderLeft:  '1px solid rgba(40,85,160,0.45)' }} />
      <div style={{ position: 'absolute', bottom: 28, right: 28, width: 22, height: 22, borderBottom: '1px solid rgba(40,85,160,0.45)', borderRight: '1px solid rgba(40,85,160,0.45)' }} />

      <style>{`
        /* Orb travels the lemniscate via CSS offset-path — starts immediately */
        @keyframes ov-orbit {
          from { offset-distance:   0%; }
          to   { offset-distance: 100%; }
        }

        /* Energy pulse travels the SVG tube via stroke-dashoffset */
        @keyframes ov-scan {
          from { stroke-dashoffset: ${PATH_LEN}; }
          to   { stroke-dashoffset: 0; }
        }

        /* Nebula breathes */
        @keyframes ov-breathe {
          0%, 100% { transform: scale(1);    opacity: 0.9; }
          50%       { transform: scale(1.20); opacity: 1;   }
        }

        /* Bouncing dots */
        @keyframes ov-dot {
          0%, 80%, 100% { transform: scale(0.45); opacity: 0.18; }
          40%            { transform: scale(1.6);  opacity: 1;    }
        }

        /* Wordmark shimmer sweep */
        @keyframes ov-shimmer {
          0%   { background-position: 220% center; }
          100% { background-position: -220% center; }
        }

        /* Responsive scale — preserves CSS offset-path alignment */
        .ov-scene { transform-origin: center center; }
        @media (max-width: 900px)  { .ov-scene { transform: scale(0.72); } }
        @media (max-width: 600px)  { .ov-scene { transform: scale(0.48); } }
        @media (max-width: 400px)  { .ov-scene { transform: scale(0.38); } }
      `}</style>
    </div>
  )
}
