import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDday, PRODUCTS } from '@/lib/products'
import { getProductForStore } from '@/lib/products-db'

export const dynamic = 'force-dynamic'

function formatPrice(p: number): string {
  return p.toLocaleString('ko-KR') + '원'
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductForStore(slug)
  if (!product) return { title: '상품을 찾을 수 없습니다' }
  return {
    title: `${product.title} | AI놀자`,
    description: product.shortDescription || product.subtitle || product.title,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductForStore(slug)
  if (!product || product.hidden) return notFound()

  const ext = product.imageExt || 'png'
  // DB 업로드 이미지가 있으면 우선, 없으면 파일 폴백
  const detailImages: string[] = product._dbDetailUrls && product._dbDetailUrls.length > 0
    ? product._dbDetailUrls
    : Array.from({ length: product.detailImageCount ?? 1 }, (_, i) =>
        `/store/${product.slug}/detail-${i + 1}.${ext}`,
      )
  const thumbnailUrl = product._dbThumbnailUrl || `/store/${product.slug}/thumbnail.${ext}`
  const dday = getDday(product.discountUntil)

  // SEO JSON-LD
  const seoType = product.seo?.type || 'Product'
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': seoType,
    name: product.title,
    description: product.shortDescription || product.subtitle,
  }
  if (product.seo?.author) {
    jsonLd.author = { '@type': 'Person', name: product.seo.author }
  }
  if (product.price) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'KRW',
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 헤더 — 좌측 썸네일 큰 이미지 + 우측 정보 */}
      <section className="pt-12 pb-10 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Link href="/store" className="text-sm text-[#999] hover:text-[#333] transition-colors mb-6 inline-block">
            ← 강의/책 목록
          </Link>

          <div className="grid md:grid-cols-2 gap-10 mt-4">
            {/* 썸네일 영역 */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f8f8f8] border border-[#e5e5e5] flex items-center justify-center p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
              />
              {dday !== null && (
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-[#D4756E] text-white text-sm font-bold">
                  D-{dday}
                </div>
              )}
            </div>

            {/* 정보 영역 */}
            <div className="flex flex-col justify-center">
              <p className="text-[#D4756E] text-sm font-medium mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#333] leading-tight mb-3 whitespace-pre-line">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-[#666] text-lg mb-2">{product.subtitle}</p>
              )}
              {product.shortDescription && (
                <p className="text-[#999] text-sm mb-6">{product.shortDescription}</p>
              )}

              {/* 가격 */}
              <div className="mb-8">
                {product.priceLabel ? (
                  <p className="text-2xl text-[#D4756E] font-bold">{product.priceLabel}</p>
                ) : product.price ? (
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl text-[#D4756E] font-bold">{formatPrice(product.price)}</p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-base text-[#999] line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-base text-[#999]">가격 정보 준비 중</p>
                )}
              </div>

              {/* 결제 안내 문구 (현재 카드 결제 미연동) */}
              <div className="mb-4 p-4 rounded-xl bg-[#FFF8F1] border border-[#FFD8A8]">
                <p className="text-[#B45309] text-sm font-bold mb-1">📢 결제 안내</p>
                <p className="text-[#92400E] text-xs leading-relaxed">
                  현재 홈페이지 이전 작업 중으로 카드 결제를 일시 중단했습니다.
                  <br />
                  <strong>계좌이체로만 결제 가능</strong>하며, 카카오톡으로 문의 주시면 안내드립니다.
                </p>
              </div>

              {/* 액션 버튼들 */}
              <div className="space-y-3">
                {/* 카카오톡 문의 (가장 위, 강조) */}
                <a
                  href="https://open.kakao.com/o/s7kkWTfh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#FEE500] text-[#191919] font-bold rounded-xl hover:bg-[#FFE000] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#191919" d="M12 3C6.48 3 2 6.48 2 10.8c0 2.78 1.85 5.22 4.63 6.6-.2.72-.73 2.65-.84 3.06-.13.5.18.49.39.36.16-.1 2.59-1.76 3.63-2.47.72.1 1.45.15 2.19.15 5.52 0 10-3.48 10-7.7S17.52 3 12 3z"/></svg>
                  카카오톡으로 문의하기
                </a>

                {product.actions.map((a, i) => {
                  const baseCls = a.primary
                    ? 'block w-full py-4 bg-[#D4756E] text-white font-bold rounded-xl text-center hover:bg-[#c0625b] transition-all'
                    : 'block w-full py-4 border border-[#333] text-[#333] font-bold rounded-xl text-center hover:bg-[#333] hover:text-white transition-all'
                  if (a.external || /^https?:/.test(a.url)) {
                    return (
                      <a
                        key={i}
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={baseCls}
                      >
                        {a.label}
                      </a>
                    )
                  }
                  return (
                    <Link key={i} href={a.url} className={baseCls}>
                      {a.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 상세 이미지 — public/store/{slug}/detail-1~N.{ext} */}
      {detailImages.length > 0 && (
        <section className="py-10 px-6">
          <div className="max-w-[900px] mx-auto flex flex-col gap-4">
            {detailImages.map((src, i) => (
              <div
                key={src}
                className="w-full rounded-2xl overflow-hidden border border-[#e5e5e5]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${product.title} 상세 ${i + 1}`}
                  className="w-full h-auto block"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 하단 다시 한 번 액션 버튼 */}
      <section className="py-12 px-6 border-t border-[#e5e5e5]">
        <div className="max-w-[600px] mx-auto space-y-3">
          {product.actions.map((a, i) => {
            const baseCls = a.primary
              ? 'block w-full py-4 bg-[#D4756E] text-white font-bold rounded-xl text-center hover:bg-[#c0625b] transition-all'
              : 'block w-full py-4 border border-[#333] text-[#333] font-bold rounded-xl text-center hover:bg-[#333] hover:text-white transition-all'
            if (a.external || /^https?:/.test(a.url)) {
              return (
                <a
                  key={i}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseCls}
                >
                  {a.label}
                </a>
              )
            }
            return (
              <Link key={i} href={a.url} className={baseCls}>
                {a.label}
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

// 정적 빌드 시 미리 알려진 slug 노출
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}
