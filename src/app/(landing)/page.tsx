import LandingPageV3 from '@/components/landing/LandingPageV3'
import { listProductsForStore } from '@/lib/products-db'

export const dynamic = 'force-dynamic'

// 슬러그별 강의 카드 배경 이미지 매핑 (홈 CLASS 섹션 — 기존 V3 스타일 유지)
const COURSE_BG_MAP: Record<string, string> = {
  'vibe-coding-101': '/landing-v3/course-vibe-101.png',
  'vibe-coding-advanced': '/landing-v3/course-vibe-advanced.png',
  'online-business-class': '/landing-v3/course-business.png',
}

export default async function Home() {
  const products = await listProductsForStore()

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
    return {
      href: `/store/${p.slug}`,
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

  return <LandingPageV3 courses={homeCourses} />
}
