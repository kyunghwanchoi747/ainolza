import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: '/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: '/programs', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: '/programs/vibe-coding', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: '/labs', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: '/community', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: '/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: '/store', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: '/store/uncomfortable-ai', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: '/store/personal-intelligence', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: '/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: '/signup', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: '/labs/daily-quiz.html', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: '/labs/prompt-challenge.html', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: '/labs/ai-vs-me.html', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: '/labs/prompt-builder.html', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: '/labs/career-explorer.html', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: '/labs/ai-word-quiz.html', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: '/labs/ai-or-human.html', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
