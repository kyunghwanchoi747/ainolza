import type { MetadataRoute } from 'next'

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ainolza.kr').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/manager/', '/admin/'],
    },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
