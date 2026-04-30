import Link from 'next/link'
import type { Metadata } from 'next'
import { getDday } from '@/lib/products'
import { listProductsForStore } from '@/lib/products-db'
import { StoreBanner } from '@/components/store/store-banner'
import { V3Header } from '@/components/landing/v3-header'

export const metadata: Metadata = {
  title: '강의/책',
  description: 'AI 바이브 코딩부터 수익화 전략까지. 직접 설계한 콘텐츠를 확인하고 구매하세요.',
}

export const dynamic = 'force-dynamic'

function formatPrice(p: number): string {
  return p.toLocaleString('ko-KR') + '원'
}

// 상품 카드(배너)용 신규 V3 썸네일 — 슬러그 기준 매핑
// 이 이미지는 /store 목록 페이지 카드에만 사용. 상세 페이지 썸네일은 그대로(상세는 DB 값 유지).
const STORE_CARD_THUMB: Record<string, string> = {
  'vibe-coding-101': '/landing-v3/course-vibe-101.png',
  'vibe-coding-advanced': '/landing-v3/course-vibe-advanced.png',
  'online-business-class': '/landing-v3/course-business.png',
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const ext = p.imageExt || 'png'
              // 슬러그 매핑이 있으면 새 V3 이미지를 우선 사용 (강의/책 카드 배너만)
              const thumbnail = STORE_CARD_THUMB[p.slug] || p._dbThumbnailUrl || `/store/${p.slug}/thumbnail.${ext}`
              const dday = getDday(p.discountUntil)
              return (
                <Link
                  key={p.slug}
                  href={`/store/${p.slug}`}
                  className="group rounded-3xl border-2 border-line overflow-hidden hover:border-[#D4756E]/40 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all bg-white cursor-pointer"
                >
                  <div className="relative aspect-square bg-surface overflow-hidden flex items-center justify-center p-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnail}
                      alt={p.title}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {dday !== null && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-extrabold shadow-md">
                        D-{dday}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-sub mb-2 font-bold tracking-wide uppercase">
                      {p.category}
                    </p>
                    <h3 className="font-extrabold text-lg md:text-xl text-ink mb-3 line-clamp-2 leading-snug whitespace-pre-line group-hover:text-brand transition-colors">
                      {p.title}
                    </h3>
                    {p.shortDescription && (
                      <p className="text-sm text-body mb-4 line-clamp-2 leading-relaxed">
                        {p.shortDescription}
                      </p>
                    )}
                    <div className="flex items-baseline gap-2 mt-3">
                      {p.priceLabel ? (
                        <p className="text-brand font-extrabold text-base">{p.priceLabel}</p>
                      ) : p.price ? (
                        <>
                          <p className="text-brand font-extrabold text-2xl">
                            {formatPrice(p.price)}
                          </p>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <p className="text-sm text-sub line-through">
                              {formatPrice(p.originalPrice)}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-sub">가격 정보 준비 중</p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
