import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: '/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: '/programs', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: '/community', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: '/store', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: '/labs/prompt-challenge.html', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
