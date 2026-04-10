'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type ProductInfo = {
  slug: string
  title: string
  subtitle?: string
  duration?: string
  price?: number
  originalPrice?: number
  priceLabel?: string
  tags?: string[]
}

function formatPrice(p: number): string {
  return p.toLocaleString('ko-KR') + '원'
}

function EnrollFormContent() {
  const params = useSearchParams()
  // ?slug=... 없으면 기본값으로 vibe-coding-101 (입문)
  const slug = params.get('slug') || 'vibe-coding-101'

  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [_error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  // 로그인 상태 + 사용자 정보
  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then((data: any) => {
        if (data?.user) {
          setIsLoggedIn(true)
          setForm(prev => ({
            ...prev,
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
          }))
        } else {
          setIsLoggedIn(false)
        }
      })
      .catch(() => setIsLoggedIn(false))
  }, [])

  // 상품 정보 로드 (DB)
  useEffect(() => {
    fetch(`/api/products?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then((data: any) => {
        const doc = data?.docs?.[0]
        if (doc) {
          setProduct({
            slug: doc.slug,
            title: doc.title,
            subtitle: doc.subtitle,
            duration: doc.duration,
            price: doc.price,
            originalPrice: doc.originalPrice,
            priceLabel: doc.priceLabel,
            tags: Array.isArray(doc.tags) ? doc.tags.map((t: any) => t.label).filter(Boolean) : [],
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProduct(false))
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, program: slug }),
      })
      if (!res.ok) throw new Error('신청 처리 중 오류가 발생했습니다.')
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (isLoggedIn === null || loadingProduct) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-sub">로딩 중...</p></div>
  }

  if (isLoggedIn === false) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-[400px] text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">로그인이 필요합니다</h2>
          <p className="text-body text-sm mb-6">수강 신청을 하려면 먼저 로그인해주세요.</p>
          <div className="flex flex-col gap-3">
            <Link href={`/login?next=/programs/vibe-coding/enroll?slug=${slug}`} className="py-3 bg-brand text-white font-bold rounded-xl text-center hover:bg-brand-dark transition-all">로그인</Link>
            <Link href="/signup" className="py-3 border border-line text-ink font-bold rounded-xl text-center hover:bg-surface transition-all">회원가입</Link>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="bg-white text-ink min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-6">&#10003;</div>
            <h1 className="text-3xl font-extrabold mb-4">신청이 접수되었습니다</h1>
            <p className="text-body mb-2">아래 계좌로 입금해 주시면 수강 안내를 보내드립니다.</p>
          </div>

          <div className="p-6 rounded-2xl border-2 border-brand bg-brand-light mb-6">
            <p className="text-brand font-extrabold text-sm mb-3">💳 입금 안내</p>
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="text-sub py-1.5 w-20">은행</td><td className="text-ink font-bold">토스뱅크</td></tr>
                <tr><td className="text-sub py-1.5">계좌번호</td><td className="text-ink font-bold text-lg">1000-1041-3507</td></tr>
                <tr><td className="text-sub py-1.5">예금주</td><td className="text-ink font-bold">에이아이놀자</td></tr>
                {product?.price && (
                  <tr><td className="text-sub py-1.5">금액</td><td className="text-brand font-extrabold text-lg">{formatPrice(product.price)}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-line text-sm text-body mb-6">
            <p className="mb-1">• 입금자명은 <strong className="text-ink">신청자 본인 이름</strong>으로 부탁드립니다.</p>
            <p className="mb-1">• 입금 확인 후 카카오톡 또는 메일로 수강 안내를 보내드립니다.</p>
            <p>• 문의사항은 카카오톡 오픈채팅으로 연락해 주세요.</p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://open.kakao.com/o/s7kkWTfh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#FEE500] text-[#191919] font-extrabold rounded-2xl hover:bg-[#FFE000] transition-all cursor-pointer text-base"
            >
              카카오톡으로 입금 확인 요청
            </a>
            <Link href={`/store/${slug}`} className="text-center text-sm text-sub hover:text-brand transition-colors">
              상품 상세로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white text-ink min-h-screen">
      <section className="pt-20 md:pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">

          <Link href={`/store/${slug}`} className="text-sm text-sub hover:text-brand transition-colors mb-10 inline-block cursor-pointer font-medium">
            &larr; 상품 상세로
          </Link>

          <p className="text-brand text-sm md:text-base font-bold mb-3 tracking-wide">수강 신청</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 whitespace-pre-line leading-[1.2]">
            {product?.title || '강의'}
          </h1>
          {product?.subtitle && (
            <p className="text-body text-lg mb-12">{product.subtitle}</p>
          )}

          {/* 상품 요약 카드 */}
          <div className="p-7 rounded-3xl border-2 border-line bg-surface mb-10">
            <div className="flex justify-between items-start mb-5 gap-4">
              <div className="min-w-0">
                <p className="text-sub text-xs font-bold uppercase tracking-wide mb-2">
                  {product?.duration || '강의'}
                </p>
                <h3 className="font-extrabold text-lg md:text-xl whitespace-pre-line leading-tight">
                  {product?.title || '상품'}
                </h3>
              </div>
              <div className="text-right shrink-0">
                {product?.priceLabel ? (
                  <p className="text-lg font-extrabold text-brand">{product.priceLabel}</p>
                ) : product?.price ? (
                  <>
                    <p className="text-2xl md:text-3xl font-extrabold text-brand">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-sub text-sm line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-sub">가격 문의</p>
                )}
              </div>
            </div>
            {product?.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full bg-white border border-line text-body text-xs font-bold">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 결제 안내 */}
          <div className="mb-8 p-5 rounded-2xl bg-[#FFF8F1] border-2 border-[#FFD8A8]">
            <p className="text-[#B45309] text-base font-extrabold mb-2">📢 결제 안내</p>
            <p className="text-[#92400E] text-sm md:text-base leading-relaxed">
              현재 홈페이지 이전 작업 중으로 카드 결제를 일시 중단했습니다.
              <br />
              <strong>계좌이체로만 결제 가능</strong>하며, 신청 접수 후 카카오톡으로 상세 안내드립니다.
            </p>
          </div>

          {/* 카카오톡 문의 */}
          <a
            href="https://open.kakao.com/o/s7kkWTfh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-5 mb-10 bg-[#FEE500] text-[#191919] font-extrabold rounded-2xl hover:bg-[#FFE000] hover:scale-[1.02] active:scale-[0.98] transition-all text-base md:text-lg cursor-pointer shadow-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#191919" d="M12 3C6.48 3 2 6.48 2 10.8c0 2.78 1.85 5.22 4.63 6.6-.2.72-.73 2.65-.84 3.06-.13.5.18.49.39.36.16-.1 2.59-1.76 3.63-2.47.72.1 1.45.15 2.19.15 5.52 0 10-3.48 10-7.7S17.52 3 12 3z" />
            </svg>
            카카오톡으로 문의하기
          </a>

          {/* 신청 폼 */}
          <div className="text-center mb-6">
            <p className="text-sub text-sm">또는 신청서를 남기시면 개별 안내드립니다</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">이름 <span className="text-red-500">*</span></label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border-2 border-line bg-white text-ink placeholder-hint focus:outline-none focus:border-[#D4756E] transition-colors text-base" placeholder="홍길동" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">연락처 <span className="text-red-500">*</span></label>
              <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border-2 border-line bg-white text-ink placeholder-hint focus:outline-none focus:border-[#D4756E] transition-colors text-base" placeholder="010-0000-0000" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">이메일 <span className="text-red-500">*</span></label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border-2 border-line bg-white text-ink placeholder-hint focus:outline-none focus:border-[#D4756E] transition-colors text-base" placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">문의사항 <span className="text-sub font-normal">(선택)</span></label>
              <textarea rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border-2 border-line bg-white text-ink placeholder-hint focus:outline-none focus:border-[#D4756E] transition-colors resize-none text-base" placeholder="궁금한 점이 있으시면 적어주세요" />
            </div>
            <div className="pt-4 space-y-3">
              <button type="submit" disabled={loading}
                className="w-full py-5 bg-dark-blue text-white font-extrabold rounded-2xl hover:bg-dark hover:scale-[1.02] active:scale-[0.98] transition-all text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md">
                {loading ? '접수 중...' : '신청 접수하기'}
              </button>
              <p className="text-center text-sub text-xs">
                신청 접수 후 개별 안내드립니다.
              </p>
            </div>
          </form>

        </div>
      </section>
    </div>
  )
}

export default function EnrollPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-sub">로딩 중...</p></div>}>
      <EnrollFormContent />
    </Suspense>
  )
}
