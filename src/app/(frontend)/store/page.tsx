import Link from 'next/link'
import type { Metadata } from 'next'
import { getDday } from '@/lib/products'
import { listProductsForStore } from '@/lib/products-db'

export const metadata: Metadata = {
  title: '강의/전자책',
  description: 'AI 바이브 코딩부터 수익화 전략까지. 직접 설계한 콘텐츠를 확인하고 구매하세요.',
}

export const dynamic = 'force-dynamic'

function formatPrice(p: number): string {
  return p.toLocaleString('ko-KR') + '원'
}

export default async function StorePage() {
  const products = await listProductsForStore()

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10">
            <p className="text-[#D4756E] text-sm font-medium mb-2">AI놀자의 콘텐츠</p>
            <h1 className="text-4xl font-bold tracking-tight text-[#333]">강의 / 전자책</h1>
            <p className="text-[#666] mt-3">
              AI 활용법부터 수익화 전략, 자동화 시스템 구축까지 직접 설계한 콘텐츠입니다.
            </p>
          </div>

          {/* 상품 카드 그리드 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const ext = p.imageExt || 'png'
              // DB 업로드 이미지가 있으면 우선, 없으면 파일 폴백
              const thumbnail = p._dbThumbnailUrl || `/store/${p.slug}/thumbnail.${ext}`
              const dday = getDday(p.discountUntil)
              return (
                <Link
                  key={p.slug}
                  href={`/store/${p.slug}`}
                  className="group rounded-2xl border border-[#e5e5e5] overflow-hidden hover:shadow-lg transition-all bg-white"
                >
                  <div className="relative aspect-[4/3] bg-[#f8f8f8] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {dday !== null && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#D4756E] text-white text-xs font-bold">
                        D-{dday}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-[#999] mb-1.5">{p.category}</p>
                    <h3 className="font-bold text-[#333] mb-2 line-clamp-2 leading-snug whitespace-pre-line">
                      {p.title}
                    </h3>
                    {p.shortDescription && (
                      <p className="text-xs text-[#666] mb-3 line-clamp-2">{p.shortDescription}</p>
                    )}
                    <div className="flex items-baseline gap-2 mt-2">
                      {p.priceLabel ? (
                        <p className="text-[#D4756E] font-bold">{p.priceLabel}</p>
                      ) : p.price ? (
                        <>
                          <p className="text-[#D4756E] font-bold text-lg">{formatPrice(p.price)}</p>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <p className="text-xs text-[#999] line-through">
                              {formatPrice(p.originalPrice)}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-[#999]">가격 정보 준비 중</p>
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
