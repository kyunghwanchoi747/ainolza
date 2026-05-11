import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDday, PRODUCTS } from '@/lib/products'
import { getProductForStore } from '@/lib/products-db'
import { ProductFaqList } from '@/components/store/product-faq-list'
import { ReviewSection } from '@/components/store/review-section'
import { V3Header } from '@/components/landing/v3-header'
import { EligibilityGatedCta } from '@/components/store/eligibility-gated-cta'
import { PriceStageCountdown } from '@/components/store/price-stage-countdown'

export const dynamic = 'force-dynamic'

function formatPrice(p: number): string {
  return p.toLocaleString('ko-KR') + '원'
}

/**
 * 액션 URL을 결제 페이지(/checkout)로 변환.
 * - enroll 경로 → /checkout?slug=... 으로 자동 변경 (PortOne 결제 연동 후)
 * - 외부 링크 / 다른 내부 경로는 그대로
 */
function withSlug(url: string, slug: string): string {
  if (!url) return url
  // 외부 링크는 그대로
  if (/^https?:/.test(url)) return url
  // enroll 경로 → /checkout 경로로 변경 (PortOne 결제 연동 완료)
  if (url.includes('/enroll')) {
    return `/checkout?slug=${encodeURIComponent(slug)}`
  }
  // /checkout 경로면 slug 자동 추가
  if (url.includes('/checkout')) {
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
      <V3Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 헤더 — 좌측 썸네일 큰 이미지 + 우측 정보 */}
      <section className="pt-32 md:pt-40 pb-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <Link
            href="/store"
            className="text-base md:text-lg text-ink hover:text-brand transition-colors mb-8 inline-block cursor-pointer font-bold"
          >
            ← 강의/책 목록
          </Link>

          <div className="grid md:grid-cols-2 gap-12 mt-4">
            {/* 좌측 — 썸네일 + 통계 박스 */}
            <div>
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
            </div>

            {/* 정보 영역 */}
            <div className="flex flex-col justify-start">
              <p className="text-brand text-xs md:text-sm font-bold mb-3 tracking-[0.18em] uppercase">
                {product.category}
              </p>
              <h1 className="text-2xl md:text-[33px] font-extrabold text-ink leading-[1.2] mb-4 whitespace-pre-line tracking-tight">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-ink text-base md:text-lg mb-1.5 font-semibold">
                  {product.subtitle}
                </p>
              )}
              {product.shortDescription && (
                <p className="text-sub text-sm mb-7 font-medium">{product.shortDescription}</p>
              )}

              {/* 가격 */}
              {product.priceLabel ? (
                <div className="mb-6">
                  <p className="text-2xl md:text-3xl text-brand font-extrabold">
                    {product.priceLabel}
                  </p>
                </div>
              ) : product.price ? (
                <div className="mb-6 p-5 rounded-2xl border border-line bg-white">
                  {/* 단계 라벨 + 할인율 */}
                  {(product._dbStageLabel || (product.originalPrice && product.originalPrice > product.price)) && (
                    <div className="flex items-center gap-2 mb-3">
                      {product._dbStageLabel && (
                        <span
                          className="inline-flex px-3 py-1 rounded-full bg-white text-red-600 text-[13px] font-extrabold"
                          style={{
                            border: '1px solid #FCA5A5',
                            borderTopColor: '#DC2626',
                            borderTopWidth: '1.5px',
                          }}
                        >
                          {product._dbStageLabel}
                        </span>
                      )}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-ink text-base font-semibold">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% 할인
                        </span>
                      )}
                    </div>
                  )}
                  {/* 큰 가격 + 정가 strike */}
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <p className="text-4xl md:text-[44px] text-ink font-extrabold tracking-tight">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-lg md:text-xl text-hint line-through font-semibold">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>
                  {/* 다음 인상 카운트다운 */}
                  {product._dbNextChange && (
                    <div className="mt-4">
                      <PriceStageCountdown
                        nextStartAt={product._dbNextChange.startAt}
                        nextPrice={product._dbNextChange.price}
                        nextLabel={product._dbNextChange.label}
                        currentLabel={product._dbStageLabel}
                        variant="full"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="mb-6 text-base text-sub">가격 정보 준비 중</p>
              )}

              {/* 상품 유형별 안내 박스 — 무채색 톤으로 통일 */}
              {product.type === 'class' && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-surface border border-line">
                  <p className="text-ink text-xs font-extrabold mb-1">서비스 제공기간</p>
                  <p className="text-sub text-xs leading-relaxed">
                    결제일로부터 <strong className="text-ink">100일</strong>간 수강 가능 · 예: 1월 1일 결제 → 4월 11일까지
                  </p>
                </div>
              )}
              {product.type === 'ebook' && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-surface border border-line">
                  <p className="text-ink text-xs font-extrabold mb-1">즉시 다운로드</p>
                  <p className="text-sub text-xs leading-relaxed">
                    결제 완료 즉시 마이페이지에서 PDF 다운로드 가능. 저작권 보호를 위해 무단 복제·배포는 금지됩니다.
                  </p>
                </div>
              )}
              {product.type === 'book' && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-surface border border-line">
                  <p className="text-ink text-xs font-extrabold mb-1">배송 안내</p>
                  <p className="text-sub text-xs leading-relaxed">
                    결제 후 <strong className="text-ink">2~3 영업일 이내</strong> 발송 (도서·산간 지역은 1~2일 추가 소요)
                  </p>
                </div>
              )}
              {product.type === 'bundle' && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-surface border border-line">
                  <p className="text-ink text-xs font-extrabold mb-1">번들 구성 안내</p>
                  <p className="text-sub text-xs leading-relaxed">
                    강의는 결제일로부터 <strong className="text-ink">100일간 수강</strong>, 전자책은 즉시 다운로드 가능합니다.
                  </p>
                </div>
              )}

              {/* 액션 버튼들 — 시안: 수강 신청하기(흰+검정 보더)가 위, 카카오톡(노랑)이 아래 */}
              <div className="space-y-3">
                <EligibilityGatedCta
                  productSlug={product.slug}
                  fallbackHref="/store/vibe-coding-101"
                  fallbackLabel="입문 강의 보러가기 →"
                >
                  {product.actions.map((a, i) => {
                    // 시안 스타일: primary 버튼은 흰 배경 + 보더 없음 + 부드러운 shadow로 떠 있는 감각.
                    const baseCls = a.primary
                      ? 'block w-full py-5 bg-white text-ink font-extrabold rounded-2xl text-center text-lg md:text-xl tracking-tight cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-[1px]'
                      : 'block w-full py-5 border border-line text-ink font-extrabold rounded-2xl text-center text-base md:text-lg cursor-pointer hover:bg-surface transition-all'
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
                          {a.label} {a.primary ? '→' : ''}
                        </a>
                      )
                    }
                    return (
                      <Link key={i} href={finalUrl} className={baseCls}>
                        {a.label} {a.primary ? '→' : ''}
                      </Link>
                    )
                  })}
                </EligibilityGatedCta>

                <a
                  href="https://open.kakao.com/o/s7kkWTfh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-5 bg-[#FEE500] text-[#191919] font-extrabold rounded-2xl hover:bg-[#FFE000] transition-all text-base md:text-lg cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded bg-[#191919] text-[#FEE500] text-[10px] font-extrabold">K</span>
                  카카오톡으로 문의하기
                </a>
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
          <EligibilityGatedCta
            productSlug={product.slug}
            fallbackHref="/store/vibe-coding-101"
            fallbackLabel="입문 강의 보러가기 →"
          >
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
          </EligibilityGatedCta>
        </div>
      </section>
    </div>
  )
}

// 정적 빌드 시 미리 알려진 slug 노출
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}
