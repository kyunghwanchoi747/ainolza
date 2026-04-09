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
    return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-[#999]">로딩 중...</p></div>
  }

  if (isLoggedIn === false) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-[400px] text-center">
          <h2 className="text-2xl font-bold text-[#333] mb-4">로그인이 필요합니다</h2>
          <p className="text-[#666] text-sm mb-6">수강 신청을 하려면 먼저 로그인해주세요.</p>
          <div className="flex flex-col gap-3">
            <Link href={`/login?next=/programs/vibe-coding/enroll?slug=${slug}`} className="py-3 bg-[#D4756E] text-white font-bold rounded-xl text-center hover:bg-[#c0625b] transition-all">로그인</Link>
            <Link href="/signup" className="py-3 border border-[#e5e5e5] text-[#333] font-bold rounded-xl text-center hover:bg-[#f8f8f8] transition-all">회원가입</Link>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">&#10003;</div>
          <h1 className="text-3xl font-bold mb-4">신청이 접수되었습니다</h1>
          <p className="text-foreground/50 mb-2">입력하신 연락처로 상세 안내를 보내드립니다.</p>
          <p className="text-foreground/40 text-sm mb-8">문의사항은 카카오톡 오픈채팅으로 연락해주세요.</p>
          <Link href={`/store/${slug}`} className="text-sm text-foreground/50 hover:text-foreground transition-colors underline">
            상품 상세로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-xl mx-auto">

          <Link href={`/store/${slug}`} className="text-sm text-foreground/40 hover:text-foreground transition-colors mb-8 inline-block">
            &larr; 상품 상세
          </Link>

          <h1 className="text-4xl font-bold tracking-tight mb-2">수강 신청</h1>
          <p className="text-foreground/50 mb-10 whitespace-pre-line">{product?.title || '강의'}</p>

          {/* 상품 요약 */}
          <div className="p-6 rounded-2xl border border-foreground/10 bg-foreground/5 mb-10">
            <div className="flex justify-between items-start mb-4 gap-4">
              <div className="min-w-0">
                <h3 className="font-bold text-lg whitespace-pre-line">{product?.title || '상품'}</h3>
                {product?.duration && (
                  <p className="text-foreground/40 text-sm mt-1">{product.duration}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                {product?.priceLabel ? (
                  <p className="text-lg font-bold text-[#D4756E]">{product.priceLabel}</p>
                ) : product?.price ? (
                  <>
                    <p className="text-2xl font-bold text-[#D4756E]">{formatPrice(product.price)}</p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-foreground/30 text-xs line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-foreground/40">가격 문의</p>
                )}
              </div>
            </div>
            {product?.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-foreground/10 text-foreground/60 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 결제 안내 */}
          <div className="mb-6 p-4 rounded-xl bg-[#FFF8F1] border border-[#FFD8A8]">
            <p className="text-[#B45309] text-sm font-bold mb-1">📢 결제 안내</p>
            <p className="text-[#92400E] text-xs leading-relaxed">
              현재 홈페이지 이전 작업 중으로 카드 결제를 일시 중단했습니다.
              <br />
              <strong>계좌이체로만 결제 가능</strong>하며, 신청 접수 후 카카오톡으로 상세 안내드립니다.
            </p>
          </div>

          {/* 신청 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">이름 <span className="text-red-400">*</span></label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors" placeholder="홍길동" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">연락처 <span className="text-red-400">*</span></label>
              <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors" placeholder="010-0000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">이메일 <span className="text-red-400">*</span></label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors" placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">문의사항 <span className="text-foreground/30">(선택)</span></label>
              <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors resize-none" placeholder="궁금한 점이 있으시면 적어주세요" />
            </div>
            <div className="pt-4 space-y-3">
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-all text-base disabled:opacity-50">
                {loading ? '접수 중...' : '신청 접수하기'}
              </button>
              <p className="text-center text-foreground/30 text-xs">
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
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-[#999]">로딩 중...</p></div>}>
      <EnrollFormContent />
    </Suspense>
  )
}
