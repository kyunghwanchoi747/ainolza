import LandingPageV3, { type ReviewItem } from '@/components/landing/LandingPageV3'
import { listProductsForStore } from '@/lib/products-db'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

// 슬러그별 강의 카드 배경 이미지 매핑 (홈 CLASS 섹션 — 기존 V3 스타일 유지)
const COURSE_BG_MAP: Record<string, string> = {
  'vibe-coding-101': '/landing-v3/course-vibe-101.png',
  'vibe-coding-advanced': '/landing-v3/course-vibe-advanced.png',
  'online-business-class': '/landing-v3/course-business.png',
}

// 상세 페이지 대신 외부 폼/링크로 직행하는 상품
const EXTERNAL_HREF: Record<string, string> = {
  'online-business-class': 'https://docs.google.com/forms/d/e/1FAIpQLSdzkHyHk_yBi_tzH1mdJwZkzcK5taLYYoSm0abdRMr_jv0SUw/viewform?usp=header',
}

const REVIEW_COLORS = ['#6366F1', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#06B6D4']

function maskName(raw: string): { name: string; initial: string } {
  const trimmed = (raw || '').trim()
  if (!trimmed) return { name: '익명', initial: '?' }
  const first = Array.from(trimmed)[0]
  return { name: `${first}**`, initial: first }
}

function hostFromUrl(url?: string): string {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

async function listApprovedReviews(): Promise<ReviewItem[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'reviews',
      where: { status: { equals: 'approved' } },
      sort: 'order',
      limit: 12,
      depth: 1,
    })

    return (result.docs || []).map((r: any, i: number) => {
      const user = typeof r.user === 'object' ? r.user : null
      const rawName = r.displayName || user?.name || user?.email?.split('@')[0] || '익명'
      const { name, initial } = maskName(rawName)
      return {
        quote: r.content || '',
        name,
        meta: hostFromUrl(r.siteUrl) || '수강생',
        initial,
        color: REVIEW_COLORS[i % REVIEW_COLORS.length],
        siteUrl: r.siteUrl || undefined,
      }
    })
  } catch (e) {
    console.error('[home reviews]', (e as Error).message)
    return []
  }
}

export default async function Home() {
  const [products, reviews] = await Promise.all([
    listProductsForStore(),
    listApprovedReviews(),
  ])

  // class 타입 + featured 우선, 최대 3개 (홈 노출용)
  const classProducts = products
    .filter((p) => p.type === 'class')
    .sort((a, b) => {
      const fa = (a as any)._dbFeatured ? 0 : 1
      const fb = (b as any)._dbFeatured ? 0 : 1
      if (fa !== fb) return fa - fb
      return (a.order ?? 999) - (b.order ?? 999)
    })
    .slice(0, 3)

  const homeCourses = classProducts.map((p, i) => {
    const isHotByFeatured = !!(p as any)._dbFeatured
    const externalHref = EXTERNAL_HREF[p.slug]
    return {
      href: externalHref || `/store/${p.slug}`,
      external: !!externalHref,
      bg: COURSE_BG_MAP[p.slug] || `/landing-v3/course-vibe-101.png`,
      badge: p.category || '강의',
      title: p.title.replace(/\n/g, ' '),
      desc: p.shortDescription || '',
      meta: (p as any)._dbTags || [],
      priceOld: p.originalPrice ? p.originalPrice.toLocaleString('ko-KR') : '',
      price: p.price ? p.price.toLocaleString('ko-KR') : '',
      priceLabel: p.priceLabel,
      hot: isHotByFeatured && i === 0,
    }
  })

  return <LandingPageV3 courses={homeCourses} reviews={reviews} />
}
