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

  const productName = searchParams.get('product') || 'AI 바이브 코딩 클래스'
  const productSlug = searchParams.get('slug') || 'vibe-coding'
  const productType = searchParams.get('type') || 'class'
  const amount = parseInt(searchParams.get('amount') || '390000', 10)
  const originalAmount = parseInt(searchParams.get('original') || String(amount), 10)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then((data: any) => {
        if (data?.user) setUser(data.user)
        else router.push('/login')
      })
      .catch(() => router.push('/login'))
  }, [router])

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

      const orderData = await orderRes.json()
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

  if (!user) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-[#999]">로딩 중...</p></div>
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-3xl font-bold text-[#333] mb-8">주문서</h1>

          {/* 상품 정보 */}
          <div className="p-5 rounded-xl bg-[#f8f8f8] border border-[#e5e5e5] mb-6">
            <h3 className="font-bold text-[#333] mb-1">{productName}</h3>
            <p className="text-sm text-[#999]">{productType === 'class' ? '온라인 강의' : productType === 'ebook' ? '전자책' : '상품'}</p>
            <div className="flex items-end gap-2 mt-3">
              <span className="text-2xl font-bold text-[#D4756E]">{amount.toLocaleString()}원</span>
              {originalAmount > amount && (
                <span className="text-sm text-[#999] line-through">{originalAmount.toLocaleString()}원</span>
              )}
            </div>
          </div>

          {/* 구매자 정보 */}
          <div className="p-5 rounded-xl border border-[#e5e5e5] mb-6">
            <h3 className="font-bold text-[#333] mb-4">구매자 정보</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#999]">이름</span>
                <span className="text-[#333]">{user.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#999]">이메일</span>
                <span className="text-[#333]">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-[#999]">연락처</span>
                  <span className="text-[#333]">{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* 결제수단 (PortOne 연동 후 선택 가능) */}
          <div className="p-5 rounded-xl border border-[#e5e5e5] mb-6">
            <h3 className="font-bold text-[#333] mb-4">결제수단</h3>
            <p className="text-sm text-[#999]">결제 시스템 연동 후 카드/계좌이체/카카오페이 등을 선택할 수 있습니다.</p>
          </div>

          {/* 동의 체크박스 */}
          <div className="space-y-3 mb-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed.terms} onChange={e => setAgreed({...agreed, terms: e.target.checked})} className="mt-1 accent-[#D4756E]" />
              <span className="text-sm text-[#333]">주문 내용을 확인하였으며 결제에 동의합니다 <span className="text-[#D4756E]">*</span></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed.refund} onChange={e => setAgreed({...agreed, refund: e.target.checked})} className="mt-1 accent-[#D4756E]" />
              <span className="text-sm text-[#666]">디지털 콘텐츠 특성상 이용 후 환불이 제한될 수 있음에 동의합니다 <span className="text-[#D4756E]">*</span></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed.privacy} onChange={e => setAgreed({...agreed, privacy: e.target.checked})} className="mt-1 accent-[#D4756E]" />
              <span className="text-sm text-[#666]">개인정보 제3자 제공에 동의합니다 (결제 대행사) <span className="text-[#D4756E]">*</span></span>
            </label>
          </div>

          {/* 결제 버튼 */}
          <button
            onClick={handlePayment}
            disabled={!allAgreed || loading}
            className="w-full py-4 bg-[#D4756E] text-white font-bold rounded-xl hover:bg-[#c0625b] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg"
          >
            {loading ? '처리 중...' : `${amount.toLocaleString()}원 결제하기`}
          </button>

          <p className="text-center text-xs text-[#999] mt-4">
            결제 시스템은 곧 오픈 예정입니다. 현재는 주문 접수만 가능합니다.
          </p>
        </div>
      </section>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-[#999]">로딩 중...</p></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
