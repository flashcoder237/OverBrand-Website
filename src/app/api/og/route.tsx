import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Editorial OG card, matching the site's paper/ink system rather than the old
// dark-navy gradient.
//
// Two modes:
//  - no `image`  → typographic card on paper (services, generic pages)
//  - `image=…`   → the real screenshot, darkened, with the title over it
//                  (case studies, so the card shows the actual product)
//
// Deliberately no webfont fetch: a failed Google Fonts request inside the edge
// runtime would break OG generation for every crawler, and the fallback stack
// is close enough at this size.
const PAPER = '#F4F4F0'
const INK = '#0A0A0A'
const ORANGE = '#FF4D00'
const BLUE = '#2855A0'

function Wordmark({ onDark }: { onDark: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span
        style={{
          color: onDark ? PAPER : INK,
          fontWeight: 900,
          fontSize: '26px',
          letterSpacing: '-0.5px',
          textTransform: 'uppercase',
        }}
      >
        OverBrand
      </span>
      <span style={{ color: ORANGE, fontWeight: 900, fontSize: '26px' }}>.</span>
    </div>
  )
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const title = searchParams.get('title') || 'OverBrand — Agence Digitale Créative'
  const description = searchParams.get('description') || 'Sites web, branding, applications, SEO'
  const eyebrow = searchParams.get('eyebrow') || 'Agence digitale · Douala & Yaoundé'

  const rawImage = searchParams.get('image')
  // Only accept same-origin paths — this endpoint is public, and rendering an
  // arbitrary remote URL would let anyone mint images on the site's domain.
  const image = rawImage && rawImage.startsWith('/') ? `${origin}${rawImage}` : null

  const titleSize = title.length > 46 ? 60 : title.length > 26 ? 76 : 92

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background: image ? INK : PAPER,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        {image && (
          <>
            <img
              src={image}
              width={1200}
              height={630}
              style={{
                position: 'absolute',
                inset: 0,
                width: '1200px',
                height: '630px',
                objectFit: 'cover',
                objectPosition: 'top',
              }}
            />
            {/* Keeps the title legible whatever the screenshot underneath. */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,10,10,0.94) 22%, rgba(10,10,10,0.55) 62%, rgba(10,10,10,0.35) 100%)',
              }}
            />
          </>
        )}

        {/* Top rule + wordmark */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Wordmark onDark={!!image} />
            <span
              style={{
                color: image ? 'rgba(244,244,240,0.6)' : 'rgba(10,10,10,0.45)',
                fontSize: '16px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              overbrand.net
            </span>
          </div>
          <div
            style={{
              height: '1px',
              marginTop: '22px',
              background: image ? 'rgba(244,244,240,0.25)' : 'rgba(10,10,10,0.18)',
            }}
          />
        </div>

        {/* Title block */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '3px', background: ORANGE }} />
            <span
              style={{
                color: ORANGE,
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '4px',
                textTransform: 'uppercase',
              }}
            >
              {eyebrow}
            </span>
          </div>

          <h1
            style={{
              color: image ? PAPER : INK,
              fontSize: `${titleSize}px`,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-2px',
              textTransform: 'uppercase',
              margin: 0,
              maxWidth: '1000px',
            }}
          >
            {title}
          </h1>

          <p
            style={{
              color: image ? 'rgba(244,244,240,0.75)' : 'rgba(10,10,10,0.62)',
              fontSize: '24px',
              lineHeight: 1.35,
              margin: '22px 0 0 0',
              maxWidth: '860px',
              borderLeft: `3px solid ${image ? ORANGE : BLUE}`,
              paddingLeft: '18px',
            }}
          >
            {description.length > 150 ? `${description.slice(0, 150).trimEnd()}…` : description}
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
