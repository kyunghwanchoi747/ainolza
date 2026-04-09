import Link from 'next/link'
import type { Metadata } from 'next'
import { getDday } from '@/lib/products'
import { listProductsForStore } from '@/lib/products-db'

export const metadata: Metadata = {
  title: '강의/책',
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
      <section className="pt-20 md:pt-28 pb-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16 text-center">
            <p className="text-[#D4756E] text-sm md:text-base font-bold mb-3 tracking-wide">
              AI놀자의 콘텐츠
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#333] leading-tight">
              강의 / 책
            </h1>
            <p className="text-[#666] mt-5 text-base md:text-lg max-w-[600px] mx-auto">
              AI 활용법부터 수익화 전략, 자동화 시스템 구축까지<br />
              직접 설계한 콘텐츠입니다.
            </p>
          </div>

          {/* 상품 카드 그리드 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const ext = p.imageExt || 'png'
              const thumbnail = p._dbThumbnailUrl || `/store/${p.slug}/thumbnail.${ext}`
              const dday = getDday(p.discountUntil)
              return (
                <Link
                  key={p.slug}
                  href={`/store/${p.slug}`}
                  className="group rounded-3xl border-2 border-[#e5e5e5] overflow-hidden hover:border-[#D4756E]/40 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all bg-white cursor-pointer"
                >
                  <div className="relative aspect-square bg-[#f8f8f8] overflow-hidden flex items-center justify-center p-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnail}
                      alt={p.title}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {dday !== null && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-[#D4756E] text-white text-xs font-extrabold shadow-md">
                        D-{dday}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-[#999] mb-2 font-bold tracking-wide uppercase">
                      {p.category}
                    </p>
                    <h3 className="font-extrabold text-lg md:text-xl text-[#333] mb-3 line-clamp-2 leading-snug whitespace-pre-line group-hover:text-[#D4756E] transition-colors">
                      {p.title}
                    </h3>
                    {p.shortDescription && (
                      <p className="text-sm text-[#666] mb-4 line-clamp-2 leading-relaxed">
                        {p.shortDescription}
                      </p>
                    )}
                    <div className="flex items-baseline gap-2 mt-3">
                      {p.priceLabel ? (
                        <p className="text-[#D4756E] font-extrabold text-base">{p.priceLabel}</p>
                      ) : p.price ? (
                        <>
                          <p className="text-[#D4756E] font-extrabold text-2xl">
                            {formatPrice(p.price)}
                          </p>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <p className="text-sm text-[#999] line-through">
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
