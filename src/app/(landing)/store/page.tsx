import type { Metadata } from 'next'
import { getDday } from '@/lib/products'
import { listProductsForStore } from '@/lib/products-db'
import { StoreBanner } from '@/components/store/store-banner'
import { StoreProductGrid } from '@/components/store/store-product-grid'
import { V3Header } from '@/components/landing/v3-header'

export const metadata: Metadata = {
  title: '상품',
  description: 'AI 바이브 코딩부터 수익화 전략, 자서전 출판까지. 직접 설계한 콘텐츠를 확인하고 구매하세요.',
}

export const dynamic = 'force-dynamic'

// 상품 카드(배너)용 신규 V3 썸네일 — 슬러그 기준 매핑
// 강의/책 목록은 정사각형 카드 → -square 파일을 사용 (홈 CLASS는 가로 배너 유지)
const STORE_CARD_THUMB: Record<string, string> = {
  'vibe-coding-101': '/landing-v3/course-vibe-101-square.png',
  'vibe-coding-advanced': '/landing-v3/course-vibe-advanced-square.png',
  'online-business-class': '/landing-v3/course-business-square.png',
}

// 상세 페이지 대신 외부 폼/링크로 직행하는 상품
const EXTERNAL_LINK_OVERRIDE: Record<string, string> = {
  'online-business-class': 'https://docs.google.com/forms/d/e/1FAIpQLSdzkHyHk_yBi_tzH1mdJwZkzcK5taLYYoSm0abdRMr_jv0SUw/viewform?usp=header',
}

export default async function StorePage() {
  const products = await listProductsForStore()

  const bannerItems = products.map(p => ({
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    thumbnail: p._dbThumbnailUrl || `/store/${p.slug}/thumbnail.${p.imageExt || 'png'}`,
    category: p.category || '',
    price: p.price,
    priceLabel: p.priceLabel,
  }))

  return (
    <div className="min-h-screen bg-white">
      <V3Header />
      <section className="pt-32 md:pt-40 pb-24 px-6">
        <div className="max-w-[1200px] mx-auto">

          {/* 배너 슬라이드 */}
          <StoreBanner items={bannerItems} />

          {/* 상품 카드 그리드 */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-8">전체 콘텐츠</h2>
          <StoreProductGrid
            products={products.map((p) => {
              const ext = p.imageExt || 'png'
              return {
                slug: p.slug,
                title: p.title,
                shortDescription: p.shortDescription,
                category: p.category || '',
                displayCategory: p._dbDisplayCategory || p.type || 'class',
                price: p.price,
                originalPrice: p.originalPrice,
                priceLabel: p.priceLabel,
                thumbnail: STORE_CARD_THUMB[p.slug] || p._dbThumbnailUrl || `/store/${p.slug}/thumbnail.${ext}`,
                dday: getDday(p.discountUntil),
                externalLink: EXTERNAL_LINK_OVERRIDE[p.slug],
              }
            })}
          />
        </div>
      </section>
    </div>
  )
}
