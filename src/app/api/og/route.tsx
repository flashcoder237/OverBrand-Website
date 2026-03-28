import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'OverBrand — Agence Digitale Créative'
  const description = searchParams.get('description') || 'Sites web, branding, applications, SEO'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '64px',
          background: '#050d1a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Blue slab */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '45%',
            background: 'linear-gradient(160deg, #1a3a6b 0%, #2855a0 60%, #3a6fd8 100%)',
            clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(40,85,160,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(40,85,160,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Brand */}
        <div style={{ position: 'absolute', top: '48px', left: '64px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#2855a0', fontWeight: 900, fontSize: '16px' }}>OB</span>
          </div>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '22px', letterSpacing: '1px' }}>
            Over<span style={{ color: '#3a6fd8' }}>Brand</span>
          </span>
        </div>

        {/* Badge */}
        <div style={{ marginBottom: '20px', display: 'flex' }}>
          <span style={{
            background: 'rgba(40,85,160,0.4)',
            border: '1px solid rgba(58,111,216,0.5)',
            color: '#6b9fd4',
            padding: '6px 16px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            AGENCE DIGITALE
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          color: 'white',
          fontSize: title.length > 30 ? '56px' : '72px',
          fontWeight: 900,
          lineHeight: 1,
          margin: '0 0 16px 0',
          maxWidth: '600px',
        }}>
          {title}
        </h1>

        {/* Description */}
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '22px', margin: 0, maxWidth: '540px' }}>
          {description}
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
