import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDday, PRODUCTS } from '@/lib/products'
import { getProductForStore } from '@/lib/products-db'
import { ProductFaqList } from '@/components/store/product-faq-list'
import { ReviewSection } from '@/components/store/review-section'

export const dynamic = 'force-dynamic'

function formatPrice(p: number): string {
  return p.toLocaleString('ko-KR') + '원'
}

/**
 * 액션 URL이 enroll 페이지면 slug 쿼리 파라미터를 자동으로 붙여줌.
 * (admin에서 URL에 slug를 안 적어도 자동 처리)
 */
function withSlug(url: string, slug: string): string {
  if (!url) return url
  // 외부 링크는 그대로
  if (/^https?:/.test(url)) return url
  // enroll 경로일 때만 slug 자동 추가
  if (url.includes('/enroll')) {
    if (url.includes('slug=')) return url
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}slug=${encodeURIComponent(slug)}`
  }
  return url
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
      <section className="pt-16 md:pt-20 pb-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <Link
            href="/store"
            className="text-sm text-sub hover:text-brand transition-colors mb-8 inline-block cursor-pointer font-medium"
          >
            ← 강의/책 목록
          </Link>

          <div className="grid md:grid-cols-2 gap-12 mt-4">
            {/* 썸네일 영역 */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface border-2 border-line flex items-center justify-center p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
              />
              {dday !== null && (
                <div className="absolute top-5 right-5 px-4 py-2 rounded-xl bg-brand text-white text-base font-extrabold shadow-lg">
                  D-{dday}
                </div>
              )}
            </div>

            {/* 정보 영역 */}
            <div className="flex flex-col justify-center">
              <p className="text-brand text-sm md:text-base font-bold mb-3 tracking-wide uppercase">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-5xl font-extrabold text-ink leading-[1.2] mb-5 whitespace-pre-line">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-body text-lg md:text-xl mb-2 font-medium">
                  {product.subtitle}
                </p>
              )}
              {product.shortDescription && (
                <p className="text-sub text-base mb-8">{product.shortDescription}</p>
              )}

              {/* 가격 */}
              <div className="mb-8">
                {product.priceLabel ? (
                  <p className="text-2xl md:text-3xl text-brand font-extrabold">
                    {product.priceLabel}
                  </p>
                ) : product.price ? (
                  <div className="flex items-baseline gap-4">
                    <p className="text-4xl md:text-5xl text-brand font-extrabold">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-lg text-sub line-through font-medium">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-base text-sub">가격 정보 준비 중</p>
                )}
              </div>

              {/* 서비스 제공기간 */}
              <div className="mb-4 p-4 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD]">
                <p className="text-[#0369A1] text-sm font-extrabold mb-1">📅 서비스 제공기간</p>
                <p className="text-[#0C4A6E] text-sm leading-relaxed">
                  결제일로부터 <strong>100일</strong>간 수강 가능합니다.<br />
                  (예: 1월 1일 결제 → 4월 11일까지 이용)
                </p>
              </div>

              {/* 결제 안내 */}
              <div className="mb-6 p-5 rounded-2xl bg-[#FFF8F1] border-2 border-[#FFD8A8]">
                <p className="text-[#B45309] text-sm md:text-base font-extrabold mb-2">
                  📢 결제 안내
                </p>
                <p className="text-[#92400E] text-sm leading-relaxed">
                  현재 홈페이지 이전 작업 중으로 카드 결제를 일시 중단했습니다.
                  <br />
                  <strong>계좌이체로만 결제 가능</strong>하며, 카카오톡으로 문의 주시면 안내드립니다.
                </p>
              </div>

              {/* 액션 버튼들 */}
              <div className="space-y-3">
                <a
                  href="https://open.kakao.com/o/s7kkWTfh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-5 bg-[#FEE500] text-[#191919] font-extrabold rounded-2xl hover:bg-[#FFE000] hover:scale-[1.02] active:scale-[0.98] transition-all text-base md:text-lg cursor-pointer shadow-md"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#191919" d="M12 3C6.48 3 2 6.48 2 10.8c0 2.78 1.85 5.22 4.63 6.6-.2.72-.73 2.65-.84 3.06-.13.5.18.49.39.36.16-.1 2.59-1.76 3.63-2.47.72.1 1.45.15 2.19.15 5.52 0 10-3.48 10-7.7S17.52 3 12 3z" />
                  </svg>
                  카카오톡으로 문의하기
                </a>

                {product.actions.map((a, i) => {
                  const baseCls = a.primary
                    ? 'block w-full py-5 bg-brand text-white font-extrabold rounded-2xl text-center hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.98] transition-all text-base md:text-lg cursor-pointer shadow-md'
                    : 'block w-full py-5 border-2 border-[#333] text-ink font-extrabold rounded-2xl text-center hover:bg-ink hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all text-base md:text-lg cursor-pointer'
                  const finalUrl = withSlug(a.url, product.slug)
                  if (a.external || /^https?:/.test(a.url)) {
                    return (
                      <a
                        key={i}
                        href={finalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={baseCls}
                      >
                        {a.label}
                      </a>
                    )
                  }
                  return (
                    <Link key={i} href={finalUrl} className={baseCls}>
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
                className="w-full rounded-2xl overflow-hidden border border-line"
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

      {/* 수강생 후기 */}
      {product._dbId && (
        <ReviewSection productSlug={product.slug} productId={Number(product._dbId)} />
      )}

      {/* 상품별 FAQ */}
      {product._dbFaq && product._dbFaq.length > 0 && (
        <section className="py-20 px-6 bg-surface border-t border-line">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-brand text-sm md:text-base font-bold mb-3 tracking-wide">
                자주 묻는 질문
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">FAQ</h2>
              <p className="text-body mt-3 text-base">
                이 강의에 대해 궁금한 점을 정리했습니다.
              </p>
            </div>
            <ProductFaqList items={product._dbFaq} />
          </div>
        </section>
      )}

      {/* 하단 다시 한 번 액션 버튼 */}
      <section className="py-16 px-6 border-t border-line">
        <div className="max-w-[600px] mx-auto space-y-3">
          <p className="text-center text-body mb-6 text-base md:text-lg">
            궁금한 점이 있으시면 카카오톡으로 편하게 문의주세요.
          </p>
          <a
            href="https://open.kakao.com/o/s7kkWTfh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-5 bg-[#FEE500] text-[#191919] font-extrabold rounded-2xl hover:bg-[#FFE000] hover:scale-[1.02] active:scale-[0.98] transition-all text-base md:text-lg cursor-pointer shadow-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#191919" d="M12 3C6.48 3 2 6.48 2 10.8c0 2.78 1.85 5.22 4.63 6.6-.2.72-.73 2.65-.84 3.06-.13.5.18.49.39.36.16-.1 2.59-1.76 3.63-2.47.72.1 1.45.15 2.19.15 5.52 0 10-3.48 10-7.7S17.52 3 12 3z" />
            </svg>
            카카오톡으로 문의하기
          </a>
          {product.actions.map((a, i) => {
            const baseCls = a.primary
              ? 'block w-full py-5 bg-brand text-white font-extrabold rounded-2xl text-center hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.98] transition-all text-base md:text-lg cursor-pointer shadow-md'
              : 'block w-full py-5 border-2 border-[#333] text-ink font-extrabold rounded-2xl text-center hover:bg-ink hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all text-base md:text-lg cursor-pointer'
            const finalUrl = withSlug(a.url, product.slug)
            if (a.external || /^https?:/.test(a.url)) {
              return (
                <a
                  key={i}
                  href={finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseCls}
                >
                  {a.label}
                </a>
              )
            }
            return (
              <Link key={i} href={finalUrl} className={baseCls}>
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
