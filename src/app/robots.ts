import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Private surfaces — never index these, whatever the crawler.
const PRIVATE = ['/api/', '/admin/', '/dashboard/', '/auth/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE,
      },
      // Generative-engine optimisation: these crawlers feed ChatGPT, Claude,
      // Perplexity and Google's AI surfaces. GPTBot was previously blocked
      // outright, which kept OverBrand out of every AI-generated answer and
      // citation. Allowing them is the point of GEO — revert by moving an agent
      // back to `disallow: ['/']` if the content-training trade-off is not wanted.
      { userAgent: 'GPTBot', allow: '/', disallow: PRIVATE },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: PRIVATE },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: PRIVATE },
      { userAgent: 'ClaudeBot', allow: '/', disallow: PRIVATE },
      { userAgent: 'Claude-User', allow: '/', disallow: PRIVATE },
      { userAgent: 'PerplexityBot', allow: '/', disallow: PRIVATE },
      { userAgent: 'Google-Extended', allow: '/', disallow: PRIVATE },
      { userAgent: 'Applebot-Extended', allow: '/', disallow: PRIVATE },
      { userAgent: 'Bingbot', allow: '/', disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
