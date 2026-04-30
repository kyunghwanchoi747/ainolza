'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import * as PortOne from '@portone/browser-sdk/v2'

const PORTONE_STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || ''
const PORTONE_CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || ''

type PayMethod = 'CARD' | 'TRANSFER' | 'VIRTUAL_ACCOUNT' | 'EASY_PAY'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState({ terms: false, refund: false, privacy: false })
  const [payMethod, setPayMethod] = useState<PayMethod>('CARD')

  // slug 만 받고 나머지는 DB에서 조회 (URL의 amount/product 등은 무시 — 위변조 방지)
  const productSlug = searchParams.get('slug') || 'vibe-coding-101'
  const [dbProduct, setDbProduct] = useState<{
    title: string
    subtitle?: string
    price?: number
    originalPrice?: number
    productType?: string
    requiresShipping?: boolean
    thumbnailUrl?: string
  } | null>(null)
  const [productLoading, setProductLoading] = useState(true)

  // 배송지 정보 (종이책 등)
  const [shipping, setShipping] = useState({
    recipient: '',
    phone: '',
    zipcode: '',
    address: '',
    addressDetail: '',
    message: '',
  })

  // 폴백 표시값 — DB 로드 전에 사용
  const productName = dbProduct?.title || '강의'
  const productType = dbProduct?.productType || 'class'
  const amount = dbProduct?.price ?? 0
  const originalAmount = dbProduct?.originalPrice ?? amount
  const requiresShipping = !!dbProduct?.requiresShipping

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then((data: any) => {
        if (data?.user) {
          setUser(data.user)
          setShipping((s) => ({
            ...s,
            recipient: s.recipient || data.user.name || '',
            phone: s.phone || data.user.phone || '',
          }))
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
  }, [router])

  useEffect(() => {
    fetch(`/api/products?where[slug][equals]=${encodeURIComponent(productSlug)}&depth=1&limit=1`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then((data: any) => {
        const doc = data?.docs?.[0]
        if (doc) {
          const thumb = doc.thumbnail
          let thumbnailUrl: string | undefined
          if (thumb && typeof thumb === 'object') {
            thumbnailUrl = thumb.url || thumb.thumbnailURL
          }
          if (!thumbnailUrl) {
            // 폴백 — public 이미지 규칙
            const ext = doc.imageExt || 'png'
            thumbnailUrl = `/store/${doc.slug}/thumbnail.${ext}`
          }
          setDbProduct({
            title: doc.title,
            subtitle: doc.subtitle,
            price: doc.price,
            originalPrice: doc.originalPrice,
            productType: doc.productType,
            requiresShipping: !!doc.requiresShipping,
            thumbnailUrl,
          })
        }
      })
      .catch(() => {})
      .finally(() => setProductLoading(false))
  }, [productSlug])

  const allAgreed = agreed.terms && agreed.refund && agreed.privacy
  const shippingValid =
    !requiresShipping ||
    (shipping.recipient.trim() &&
      shipping.phone.trim() &&
      shipping.zipcode.trim() &&
      shipping.address.trim())

  const handlePayment = async () => {
    if (!allAgreed) return
    if (requiresShipping && !shippingValid) {
      alert('배송지 정보를 모두 입력해주세요.')
      return
    }
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
          ...(requiresShipping
            ? {
                shippingRecipient: shipping.recipient.trim(),
                shippingPhone: shipping.phone.trim(),
                shippingZipcode: shipping.zipcode.trim(),
                shippingAddress: shipping.address.trim(),
                shippingAddressDetail: shipping.addressDetail.trim(),
                shippingMessage: shipping.message.trim(),
              }
            : {}),
        }),
      })

      const orderData = await orderRes.json() as any
      if (!orderData.ok) {
        alert(orderData.error || '주문 생성에 실패했습니다.')
        setLoading(false)
        return
      }

      if (!PORTONE_STORE_ID || !PORTONE_CHANNEL_KEY) {
        alert('결제 시스템 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.')
        setLoading(false)
        return
      }

      // 2. PortOne V2 결제창 호출
      const paymentResponse = await PortOne.requestPayment({
        storeId: PORTONE_STORE_ID,
        channelKey: PORTONE_CHANNEL_KEY,
        paymentId: orderData.merchantUid,
        orderName: productName,
        totalAmount: amount,
        currency: 'CURRENCY_KRW',
        payMethod,
        customer: {
          fullName: user?.name || '',
          email: user?.email || '',
          phoneNumber: user?.phone || '',
        },
        redirectUrl: `${window.location.origin}/checkout/complete?orderNumber=${orderData.orderNumber}`,
      } as any)

      if (paymentResponse?.code !== undefined) {
        // 결제 실패 / 취소
        alert(`결제 실패: ${paymentResponse.message || '취소되었습니다.'}`)
        setLoading(false)
        return
      }

      // 3. 서버에서 결제 검증
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          paymentId: paymentResponse?.paymentId || orderData.merchantUid,
          merchantUid: orderData.merchantUid,
        }),
      })
      const verifyData = await verifyRes.json() as { ok?: boolean; error?: string; orderNumber?: string }

      if (!verifyData.ok) {
        alert(verifyData.error || '결제 검증에 실패했습니다.')
        setLoading(false)
        return
      }

      router.push(`/checkout/complete?orderNumber=${verifyData.orderNumber || orderData.orderNumber}`)
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

  const productTypeLabel =
    productType === 'class' ? '온라인 강의' :
    productType === 'ebook' ? '전자책' :
    productType === 'book' ? '종이책' : '상품'
  const discount = Math.max(0, originalAmount - amount)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <section className="pt-12 md:pt-16 pb-20 px-4 md:px-6">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8 text-center">결제하기</h1>

          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* ─── 좌측: 주문 상품 + 주문자 + 배송지 ─── */}
            <div className="space-y-6">
              {/* 주문 상품 정보 */}
              <div className="p-5 md:p-6 rounded-2xl bg-white border border-line">
                <h2 className="text-base font-bold text-ink mb-4">주문 상품 정보</h2>
                <div className="flex gap-4">
                  {dbProduct.thumbnailUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={dbProduct.thumbnailUrl}
                      alt={productName}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover bg-surface border border-line shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-sub mb-1">{productTypeLabel}</p>
                    <p className="font-bold text-ink text-sm md:text-base mb-2 leading-snug">{productName}</p>
                    {dbProduct.subtitle && (
                      <p className="text-xs text-sub mb-3 line-clamp-2">{dbProduct.subtitle}</p>
                    )}
                    <p className="text-xs text-sub mb-1">수량 1개</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg font-bold text-brand">{amount.toLocaleString()}원</span>
                      {originalAmount > amount && (
                        <span className="text-xs text-sub line-through">{originalAmount.toLocaleString()}원</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 주문자 정보 */}
              <div className="p-5 md:p-6 rounded-2xl bg-white border border-line">
                <h2 className="text-base font-bold text-ink mb-4">주문자 정보</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-sub w-20 shrink-0">이름</span>
                    <span className="text-ink">{user.name || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-sub w-20 shrink-0">이메일</span>
                    <span className="text-ink break-all">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex">
                      <span className="text-sub w-20 shrink-0">연락처</span>
                      <span className="text-ink">{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 배송지 입력 (종이책 등) */}
              {requiresShipping && (
                <div className="p-5 md:p-6 rounded-2xl bg-white border border-line">
                  <h2 className="text-base font-bold text-ink mb-4">
                    배송지 정보 <span className="text-brand">*</span>
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <label className="block text-sub text-xs mb-1">받는 사람</label>
                      <input
                        type="text"
                        value={shipping.recipient}
                        onChange={(e) => setShipping({ ...shipping, recipient: e.target.value })}
                        className="w-full px-3 py-2 border border-line rounded-lg text-ink focus:outline-none focus:border-brand"
                        placeholder="홍길동"
                      />
                    </div>
                    <div>
                      <label className="block text-sub text-xs mb-1">연락처</label>
                      <input
                        type="tel"
                        value={shipping.phone}
                        onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-line rounded-lg text-ink focus:outline-none focus:border-brand"
                        placeholder="010-1234-5678"
                      />
                    </div>
                    <div>
                      <label className="block text-sub text-xs mb-1">우편번호</label>
                      <input
                        type="text"
                        value={shipping.zipcode}
                        onChange={(e) => setShipping({ ...shipping, zipcode: e.target.value })}
                        className="w-full px-3 py-2 border border-line rounded-lg text-ink focus:outline-none focus:border-brand"
                        placeholder="12345"
                      />
                    </div>
                    <div>
                      <label className="block text-sub text-xs mb-1">주소</label>
                      <input
                        type="text"
                        value={shipping.address}
                        onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                        className="w-full px-3 py-2 border border-line rounded-lg text-ink focus:outline-none focus:border-brand"
                        placeholder="서울시 강남구 테헤란로 123"
                      />
                    </div>
                    <div>
                      <label className="block text-sub text-xs mb-1">상세 주소 (선택)</label>
                      <input
                        type="text"
                        value={shipping.addressDetail}
                        onChange={(e) => setShipping({ ...shipping, addressDetail: e.target.value })}
                        className="w-full px-3 py-2 border border-line rounded-lg text-ink focus:outline-none focus:border-brand"
                        placeholder="101동 202호"
                      />
                    </div>
                    <div>
                      <label className="block text-sub text-xs mb-1">배송 메시지 (선택)</label>
                      <input
                        type="text"
                        value={shipping.message}
                        onChange={(e) => setShipping({ ...shipping, message: e.target.value })}
                        className="w-full px-3 py-2 border border-line rounded-lg text-ink focus:outline-none focus:border-brand"
                        placeholder="문 앞에 놓아주세요"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── 우측: 주문 요약 + 결제수단 + 약관 + 결제 버튼 ─── */}
            <div className="space-y-6">
              <div className="lg:sticky lg:top-20 space-y-6">
                {/* 주문 요약 */}
                <div className="p-5 md:p-6 rounded-2xl bg-white border border-line">
                  <h2 className="text-base font-bold text-ink mb-4">주문 요약</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-sub">상품가격</span>
                      <span className="text-ink">{originalAmount.toLocaleString()}원</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sub">상품 할인금액</span>
                        <span className="text-brand">- {discount.toLocaleString()}원</span>
                      </div>
                    )}
                  </div>
                  <hr className="my-4 border-line" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-ink">총 주문금액</span>
                    <span className="text-2xl font-extrabold text-brand">{amount.toLocaleString()}원</span>
                  </div>
                </div>

                {/* 결제수단 */}
                <div className="p-5 md:p-6 rounded-2xl bg-white border border-line">
                  <h2 className="text-base font-bold text-ink mb-4">결제수단</h2>
                  <div className="space-y-2">
                    {([
                      { key: 'CARD', label: '신용카드' },
                      { key: 'TRANSFER', label: '계좌이체' },
                      { key: 'VIRTUAL_ACCOUNT', label: '가상계좌(무통장입금)' },
                    ] as { key: PayMethod; label: string }[]).map((m) => (
                      <label
                        key={m.key}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          payMethod === m.key
                            ? 'border-[#D4756E] bg-brand/5'
                            : 'border-line hover:border-brand/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payMethod"
                          checked={payMethod === m.key}
                          onChange={() => setPayMethod(m.key)}
                          className="accent-[#D4756E]"
                        />
                        <span className={`text-sm font-medium ${payMethod === m.key ? 'text-brand' : 'text-ink'}`}>
                          {m.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 약관 동의 */}
                <div className="p-5 md:p-6 rounded-2xl bg-white border border-line">
                  <h2 className="text-base font-bold text-ink mb-3">이용 및 정보 제공 약관</h2>
                  <p className="text-xs text-sub leading-relaxed mb-4">
                    결제 전 이용 및 정보 제공 약관 등의 내용을 확인했으며 이에 동의합니다.
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed.terms}
                        onChange={(e) => setAgreed({ ...agreed, terms: e.target.checked })}
                        className="mt-0.5 accent-[#D4756E]"
                      />
                      <span className="text-xs text-ink">
                        주문 내용을 확인하였으며 결제에 동의합니다 <span className="text-brand">*</span>
                      </span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed.refund}
                        onChange={(e) => setAgreed({ ...agreed, refund: e.target.checked })}
                        className="mt-0.5 accent-[#D4756E]"
                      />
                      <span className="text-xs text-body">
                        디지털 콘텐츠 특성상 이용 후 환불이 제한될 수 있음에 동의합니다 <span className="text-brand">*</span>
                      </span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed.privacy}
                        onChange={(e) => setAgreed({ ...agreed, privacy: e.target.checked })}
                        className="mt-0.5 accent-[#D4756E]"
                      />
                      <span className="text-xs text-body">
                        개인정보 제3자 제공에 동의합니다 (결제 대행사) <span className="text-brand">*</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* 결제 버튼 */}
                <button
                  onClick={handlePayment}
                  disabled={!allAgreed || loading || (requiresShipping && !shippingValid)}
                  className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed text-base md:text-lg shadow-md"
                >
                  {loading ? '처리 중...' : `${amount.toLocaleString()}원 결제하기`}
                </button>
              </div>
            </div>
          </div>
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
