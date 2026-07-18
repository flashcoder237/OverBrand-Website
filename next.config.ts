import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const nextConfig: NextConfig = {
  transpilePackages: ['graphql-request'],
  async redirects() {
    return [
      // `/team` is the legacy route superseded by `/equipe`. Nothing links to it
      // any more, but it may be indexed — a 301 consolidates the signals onto
      // one URL instead of leaving two near-duplicate team pages competing.
      { source: '/:locale(fr|en|de)/team', destination: '/:locale/equipe', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vagvkngqlihgysfdxyxr.supabase.co',
      },
      // allow any https image (external URLs added via admin)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
