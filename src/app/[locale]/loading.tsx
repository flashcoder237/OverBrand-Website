import type { CSSProperties } from 'react'

// Infinity path in 400×200 coordinate space
const PATH =
  'M200,100 C200,44 156,10 110,10 C64,10 20,44 20,100 C20,156 64,190 110,190 C156,190 200,156 200,100 C200,44 244,10 290,10 C336,10 380,44 380,100 C380,156 336,190 290,190 C244,190 200,156 200,100 Z'

// Particle definitions — orb A (cyan), orb B (blue), each with trailing dots
// animationDelay negative = starts mid-cycle = appears "behind" on the path
const ORB_A: { size: number; opacity: number; color: string; shadow: string; delay: string }[] = [
  { size: 16, opacity: 1,    color: '#c8eaff', shadow: '0 0 10px 5px #c8eaff, 0 0 28px 10px #6b9fd4, 0 0 56px 18px rgba(58,111,216,0.45)', delay: '0s'     },
  { size: 11, opacity: 0.7,  color: '#6b9fd4', shadow: '0 0 8px 3px #6b9fd4',                                                                  delay: '-0.1s'  },
  { size: 7,  opacity: 0.38, color: '#3a6fd8', shadow: 'none',                                                                                  delay: '-0.2s'  },
  { size: 4,  opacity: 0.16, color: '#2855a0', shadow: 'none',                                                                                  delay: '-0.3s'  },
]

const ORB_B: typeof ORB_A = [
  { size: 13, opacity: 1,    color: '#3a6fd8', shadow: '0 0 8px 4px #3a6fd8, 0 0 22px 8px rgba(40,85,160,0.5)',                                 delay: '-1.6s'  },
  { size: 9,  opacity: 0.6,  color: '#2855a0', shadow: '0 0 6px 2px #2855a0',                                                                   delay: '-1.7s'  },
  { size: 5,  opacity: 0.28, color: '#1a3a6b', shadow: 'none',                                                                                  delay: '-1.8s'  },
]

function dot(
  p: typeof ORB_A[number],
  key: string,
): CSSProperties {
  return {
    position: 'absolute',
    width: p.size,
    height: p.size,
    borderRadius: '50%',
    background: p.color,
    opacity: p.opacity,
    boxShadow: p.shadow,
    // CSS offset-path: starts IMMEDIATELY, no SVG timing dependency
    offsetPath: `path('${PATH}')`,
    offsetDistance: '0%',
    offsetRotate: '0deg',
    offsetAnchor: '50% 50%',
    animation: `ov-orbit 3.2s linear infinite`,
    animationDelay: p.delay,
    willChange: 'offset-distance',
  } as CSSProperties
}

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
      {/* ── Background grid ── */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, #1e3050 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px',
          opacity: 0.38,
        }}
      />

      {/* ── Deep ambient glow ── */}
      <div
        style={{
          position: 'absolute',
          width: 760, height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(40,85,160,0.2) 0%, transparent 62%)',
          pointerEvents: 'none',
          animation: 'ov-breathe 4.5s ease-in-out infinite',
        }}
      />

      {/* ── Main scene ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Container: both SVG and CSS particles share 400×200 coordinate space */}
        <div style={{ position: 'relative', width: 400, height: 200 }}>

          {/* SVG — neon tube visual only (no animation here) */}
          <svg
            viewBox="0 0 400 200"
            width="400"
            height="200"
            style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
          >
            <defs>
              <filter id="ov-blur-xl" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
              <filter id="ov-blur-md" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>

            {/* Layer 1 — wide outer glow */}
            <path d={PATH} fill="none" stroke="#3a6fd8" strokeWidth="22" opacity="0.07" filter="url(#ov-blur-xl)" />
            {/* Layer 2 — mid glow */}
            <path d={PATH} fill="none" stroke="#2855a0" strokeWidth="8"  opacity="0.22" filter="url(#ov-blur-md)" />
            {/* Layer 3 — dark tube body */}
            <path d={PATH} fill="none" stroke="#0e1f38" strokeWidth="4"  strokeLinecap="round" />
            {/* Layer 4 — rim light */}
            <path d={PATH} fill="none" stroke="#1a3a6b" strokeWidth="2.5" opacity="0.8" />
            {/* Layer 5 — thin inner highlight, pulses */}
            <path
              d={PATH} fill="none" stroke="#3a6fd8" strokeWidth="1"
              opacity="0.5"
              style={{ animation: 'ov-rim 4s ease-in-out infinite' }}
            />
          </svg>

          {/* CSS particles — offset-path, start immediately */}
          {ORB_A.map((p, i) => (
            <div key={`a${i}`} style={dot(p, `a${i}`)} />
          ))}
          {ORB_B.map((p, i) => (
            <div key={`b${i}`} style={dot(p, `b${i}`)} />
          ))}
        </div>

        {/* ── Text ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            marginTop: 36,
          }}
        >
          {/* Brand */}
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.45em',
              color: 'var(--text-subtle)',
              opacity: 0.5,
            }}
          >
            OVERBRAND
          </span>

          {/* Dots animation */}
          <div style={{ display: 'flex', gap: 7 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#3a6fd8',
                  animation: 'ov-dot 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.22}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ov-orbit {
          from { offset-distance:   0%; }
          to   { offset-distance: 100%; }
        }
        @keyframes ov-breathe {
          0%, 100% { transform: scale(1);    opacity: 0.65; }
          50%       { transform: scale(1.18); opacity: 1;    }
        }
        @keyframes ov-rim {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.8; }
        }
        @keyframes ov-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.25; }
          40%            { transform: scale(1.3); opacity: 1;    }
        }
      `}</style>
    </div>
  )
}
