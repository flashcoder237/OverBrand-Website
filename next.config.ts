import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const nextConfig: NextConfig = {
  transpilePackages: ['graphql-request'],
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
