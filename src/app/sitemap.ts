import type { MetadataRoute } from 'next'

/**
 * Google Search Console은 sitemap.xml 의 <loc> 가 절대 URL이어야 받아준다.
 * (상대 경로는 "잘못된 URL"로 거부)
 * Next.js 의 MetadataRoute.Sitemap 은 자동 절대화를 안 해주므로 직접 prefix 붙임.
 */
const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ainolza.kr').replace(/\/$/, '')

const paths: Array<Omit<MetadataRoute.Sitemap[number], 'url' | 'lastModified'> & { path: string }> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/programs', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/programs/vibe-coding', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/labs', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/labs/ikigai', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/community', changeFrequency: 'daily', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/store', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/store/uncomfortable-ai', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/store/personal-intelligence', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/login', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/signup', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/labs/daily-quiz.html', changeFrequency: 'daily', priority: 0.9 },
  { path: '/labs/prompt-challenge.html', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/labs/ai-vs-me.html', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/labs/prompt-builder.html', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/labs/ai-word-quiz.html', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/labs/ai-or-human.html', changeFrequency: 'monthly', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return paths.map(({ path, ...rest }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    ...rest,
  }))
}
