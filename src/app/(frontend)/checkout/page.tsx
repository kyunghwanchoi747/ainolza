'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState({ terms: false, refund: false, privacy: false })

  // slug 만 받고 나머지는 DB에서 조회 (URL의 amount/product 등은 무시 — 위변조 방지)
  const productSlug = searchParams.get('slug') || 'vibe-coding-101'
  const [dbProduct, setDbProduct] = useState<{
    title: string
    price?: number
    originalPrice?: number
    productType?: string
  } | null>(null)
  const [productLoading, setProductLoading] = useState(true)

  // 폴백 표시값 — DB 로드 전에 사용
  const productName = dbProduct?.title || '강의'
  const productType = dbProduct?.productType || 'class'
  const amount = dbProduct?.price ?? 0
  const originalAmount = dbProduct?.originalPrice ?? amount

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then((data: any) => {
        if (data?.user) setUser(data.user)
        else router.push('/login')
      })
      .catch(() => router.push('/login'))
  }, [router])

  useEffect(() => {
    fetch(`/api/products?where[slug][equals]=${encodeURIComponent(productSlug)}&depth=0&limit=1`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then((data: any) => {
        const doc = data?.docs?.[0]
        if (doc) {
          setDbProduct({
            title: doc.title,
            price: doc.price,
            originalPrice: doc.originalPrice,
            productType: doc.productType,
          })
        }
      })
      .catch(() => {})
      .finally(() => setProductLoading(false))
  }, [productSlug])

  const allAgreed = agreed.terms && agreed.refund && agreed.privacy

  const handlePayment = async () => {
    if (!allAgreed) return
    setLoading(true)

    try {
      // 1. 주문 생성
      const orderRes = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productName,
          productSlug,
          productType,
          amount,
          originalAmount,
          buyerName: user?.name || '',
          buyerEmail: user?.email || '',
          buyerPhone: user?.phone || '',
        }),
      })

      const orderData = await orderRes.json() as any
      if (!orderData.ok) {
        alert(orderData.error || '주문 생성에 실패했습니다.')
        setLoading(false)
        return
      }

      // 2. PortOne 결제 (도메인 연결 후 활성화)
      // TODO: PortOne SDK 연동
      // IMP.request_pay({
      //   pg: 'tosspayments',
      //   pay_method: 'card',
      //   merchant_uid: orderData.merchantUid,
      //   name: productName,
      //   amount: amount,
      //   buyer_email: user?.email,
      //   buyer_name: user?.name,
      //   buyer_tel: user?.phone,
      // }, callback)

      // 임시: 결제 완료 페이지로 이동 (테스트용)
      router.push(`/checkout/complete?orderNumber=${orderData.orderNumber}`)
    } catch {
      alert('결제 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!user || productLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-sub">로딩 중...</p></div>
  }

  if (!dbProduct) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg text-ink mb-2">상품을 찾을 수 없습니다.</p>
          <Link href="/store" className="text-sm text-brand hover:underline">강의/책 목록으로 돌아가기</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-3xl font-bold text-ink mb-8">주문서</h1>

          {/* 상품 정보 */}
          <div className="p-5 rounded-xl bg-surface border border-line mb-6">
            <h3 className="font-bold text-ink mb-1">{productName}</h3>
            <p className="text-sm text-sub">{productType === 'class' ? '온라인 강의' : productType === 'ebook' ? '전자책' : '상품'}</p>
            <div className="flex items-end gap-2 mt-3">
              <span className="text-2xl font-bold text-brand">{amount.toLocaleString()}원</span>
              {originalAmount > amount && (
                <span className="text-sm text-sub line-through">{originalAmount.toLocaleString()}원</span>
              )}
            </div>
          </div>

          {/* 구매자 정보 */}
          <div className="p-5 rounded-xl border border-line mb-6">
            <h3 className="font-bold text-ink mb-4">구매자 정보</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-sub">이름</span>
                <span className="text-ink">{user.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sub">이메일</span>
                <span className="text-ink">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-sub">연락처</span>
                  <span className="text-ink">{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* 결제수단 */}
          <div className="p-5 rounded-xl border border-line mb-6">
            <h3 className="font-bold text-ink mb-4">결제수단</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-lg border-2 border-[#D4756E] bg-brand/5 text-center text-sm font-medium text-brand">카드</div>
              <div className="p-3 rounded-lg border border-line text-center text-sm text-sub">계좌이체</div>
              <div className="p-3 rounded-lg border border-line text-center text-sm text-sub">카카오페이</div>
            </div>
          </div>

          {/* 동의 체크박스 */}
          <div className="space-y-3 mb-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed.terms} onChange={e => setAgreed({...agreed, terms: e.target.checked})} className="mt-1 accent-[#D4756E]" />
              <span className="text-sm text-ink">주문 내용을 확인하였으며 결제에 동의합니다 <span className="text-brand">*</span></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed.refund} onChange={e => setAgreed({...agreed, refund: e.target.checked})} className="mt-1 accent-[#D4756E]" />
              <span className="text-sm text-body">디지털 콘텐츠 특성상 이용 후 환불이 제한될 수 있음에 동의합니다 <span className="text-brand">*</span></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed.privacy} onChange={e => setAgreed({...agreed, privacy: e.target.checked})} className="mt-1 accent-[#D4756E]" />
              <span className="text-sm text-body">개인정보 제3자 제공에 동의합니다 (결제 대행사) <span className="text-brand">*</span></span>
            </label>
          </div>

          {/* 결제 버튼 */}
          <button
            onClick={handlePayment}
            disabled={!allAgreed || loading}
            className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg"
          >
            {loading ? '처리 중...' : `${amount.toLocaleString()}원 결제하기`}
          </button>

        </div>
      </section>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-sub">로딩 중...</p></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
