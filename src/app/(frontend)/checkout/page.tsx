'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import * as PortOne from '@portone/browser-sdk/v2'
import { resolveCurrentPrice } from '@/lib/price-schedule'
import { cashEventAmount } from '@/lib/cash-discount'
import { BundleUpsell } from '@/components/checkout/bundle-upsell'

const PORTONE_STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || ''
const PORTONE_CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || ''

// UI 키
//  - KAKAOPAY: PortOne 호출 시 EASY_PAY + easyPayProvider 로 분기
//  - DIRECT_BANK: PortOne 미호출. 사용자 토스뱅크 계좌로 직접 입금받는 무통장.
//                주문번호 끝 6자리를 입금자명으로 사용하여 매칭.
type PayMethod = 'CARD' | 'TRANSFER' | 'DIRECT_BANK' | 'KAKAOPAY'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const payMethodSectionRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState({ terms: false, refund: false, privacy: false })
  const [payMethod, setPayMethod] = useState<PayMethod>('CARD')
  // 휴대폰 — KG이니시스 V2 일반결제는 phoneNumber 필수.
  // 회원 프로필에 있으면 자동 채움(자동 확정), 없으면 직접 입력 후 [확인] 눌러야 확정.
  const [buyerPhone, setBuyerPhone] = useState('')
  const [phoneConfirmed, setPhoneConfirmed] = useState(false)

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

  // 현금영수증 — 계좌이체/무통장 결제 시에만 노출
  const [cashReceipt, setCashReceipt] = useState<{
    requested: boolean
    type: 'income' | 'expense' // 개인소득공제 / 사업자지출증빙
    number: string
  }>({ requested: false, type: 'income', number: '' })

  // 본인 쿠폰 목록 + 선택된 쿠폰
  type CouponDoc = {
    id: number
    code: string
    discountType: 'percent' | 'amount'
    discountPercent?: number
    discountAmount?: number
    referralCode?: string
  }
  const [coupons, setCoupons] = useState<CouponDoc[]>([])
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>('')

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
  const baseAmount = dbProduct?.price ?? 0
  const originalAmount = dbProduct?.originalPrice ?? baseAmount
  const requiresShipping = !!dbProduct?.requiresShipping

  // VOD 런칭 현금 할인 — 계좌이체/무통장 선택 시 이벤트가 (서버와 동일 규칙)
  const cashEvent = cashEventAmount(productSlug, payMethod, baseAmount)

  // 선택된 쿠폰에 따른 할인 계산 — 현금 할인 적용 후 금액 기준
  const selectedCoupon = coupons.find((c) => c.code === selectedCouponCode)
  const couponDiscount = (() => {
    if (!selectedCoupon || cashEvent.amount <= 0) return 0
    if (selectedCoupon.discountType === 'percent' && selectedCoupon.discountPercent) {
      return Math.floor((cashEvent.amount * selectedCoupon.discountPercent) / 100)
    }
    if (selectedCoupon.discountType === 'amount' && selectedCoupon.discountAmount) {
      return Math.min(selectedCoupon.discountAmount, cashEvent.amount)
    }
    return 0
  })()
  // 서버 검증과 동일 — 기준가에서 현금 할인·쿠폰 할인 차감한 최종 결제 금액
  const amount = cashEvent.amount - couponDiscount

  // 추천 코드 — 쿠키에서 읽기 (ReferralTracker가 저장)
  const referredByCode = (() => {
    if (typeof document === 'undefined') return ''
    const m = document.cookie.match(/(?:^|;\s*)ainolza_ref=([^;]+)/)
    return m ? decodeURIComponent(m[1]) : ''
  })()

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then((data: any) => {
        if (data?.user) {
          setUser(data.user)
          const existingPhone = data.user.phone || ''
          setBuyerPhone(existingPhone)
          // 회원 프로필에 이미 휴대폰이 있으면 별도 확인 없이 확정 상태
          if (existingPhone) setPhoneConfirmed(true)
          setShipping((s) => ({
            ...s,
            recipient: s.recipient || data.user.name || '',
            phone: s.phone || data.user.phone || '',
          }))
        } else {
          const next = encodeURIComponent(window.location.pathname + window.location.search)
          router.push('/login?next=' + next)
        }
      })
      .catch(() => {
        const next = encodeURIComponent(window.location.pathname + window.location.search)
        router.push('/login?next=' + next)
      })
  }, [router])

  useEffect(() => {
    fetch(`/api/products?where[slug][equals]=${encodeURIComponent(productSlug)}&depth=1&limit=1`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then((data: any) => {
        const doc = data?.docs?.[0]
        // 대기 신청 모드 상품은 결제 페이지로 들어오지 못하게 — 대기 신청 폼으로
        if (doc?.waitlistMode) {
          router.replace(`/waitlist/${encodeURIComponent(productSlug)}`)
          return
        }
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
          // 가격 스케줄 적용 — 현재 시각 기준 자동 결정
          const resolved = resolveCurrentPrice({
            price: doc.price,
            originalPrice: doc.originalPrice,
            priceSchedule: doc.priceSchedule || [],
          })
          setDbProduct({
            title: doc.title,
            subtitle: doc.subtitle,
            price: resolved.price,
            originalPrice: resolved.originalPrice,
            productType: doc.productType,
            requiresShipping: !!doc.requiresShipping,
            thumbnailUrl,
          })
        }
      })
      .catch(() => {})
      .finally(() => setProductLoading(false))
  }, [productSlug])

  // 이벤트 버튼 경유 진입(?pay=transfer) — 계좌이체 사전 선택 + 결제수단 섹션으로 스크롤
  useEffect(() => {
    if (searchParams.get('pay') === 'transfer' && !productLoading) {
      setPayMethod('TRANSFER')
      setTimeout(() => {
        payMethodSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 400)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, productLoading])

  // 본인 보유 쿠폰 로드 (active만)
  useEffect(() => {
    if (!user?.id) return
    fetch('/api/coupons/my', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: any) => {
        if (Array.isArray(data?.docs)) setCoupons(data.docs as CouponDoc[])
      })
      .catch(() => {})
  }, [user?.id])

  const allAgreed = agreed.terms && agreed.refund && agreed.privacy
  // 휴대폰 형식 검증: 010(또는 011/016/017/018/019)-3~4자리-4자리
  const phoneNormalized = buyerPhone.replace(/[^0-9]/g, '')
  const phoneValid = /^01[016789]\d{7,8}$/.test(phoneNormalized)
  const shippingValid =
    !requiresShipping ||
    (shipping.recipient.trim() &&
      shipping.phone.trim() &&
      shipping.zipcode.trim() &&
      shipping.address.trim())

  // 현금영수증 — 계좌이체/무통장일 때만 의미. 신청했으면 번호 형식 검증.
  const needsCashReceiptUi = payMethod === 'TRANSFER' || payMethod === 'DIRECT_BANK'
  const cashReceiptNumberRaw = cashReceipt.number.replace(/[^0-9]/g, '')
  const cashReceiptValid =
    !needsCashReceiptUi ||
    !cashReceipt.requested ||
    (cashReceipt.type === 'income'
      ? /^01[016789]\d{7,8}$/.test(cashReceiptNumberRaw) || /^\d{13}$/.test(cashReceiptNumberRaw)
      : /^\d{10}$/.test(cashReceiptNumberRaw))

  const handlePayment = async () => {
    if (!allAgreed) return
    if (!phoneValid) {
      alert('휴대폰 번호를 정확히 입력해주세요. (예: 010-1234-5678)')
      return
    }
    if (!phoneConfirmed) {
      alert('휴대폰 번호 옆 [확인] 버튼을 눌러주세요.')
      return
    }
    if (requiresShipping && !shippingValid) {
      alert('배송지 정보를 모두 입력해주세요.')
      return
    }
    if (needsCashReceiptUi && cashReceipt.requested && !cashReceiptValid) {
      alert(
        cashReceipt.type === 'income'
          ? '현금영수증 번호는 휴대폰번호(11자리) 또는 현금영수증 카드번호(13자리)로 입력해주세요.'
          : '사업자등록번호 10자리를 정확히 입력해주세요.',
      )
      return
    }
    setLoading(true)

    // 휴대폰을 회원 프로필에도 저장 (다음 결제 자동 채움). 실패해도 결제 진행.
    if (user?.id && phoneNormalized && phoneNormalized !== (user.phone || '').replace(/[^0-9]/g, '')) {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ phone: phoneNormalized }),
        })
      } catch {
        // 프로필 저장 실패는 결제에 영향 없음
      }
    }

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
          buyerPhone: phoneNormalized,
          payMethod, // 'CARD' | 'TRANSFER' | 'DIRECT_BANK' | 'KAKAOPAY'
          // 쿠폰·추천(파트너스) 정보
          ...(selectedCouponCode ? { couponCode: selectedCouponCode } : {}),
          ...(referredByCode ? { referredByCode } : {}),
          // 현금영수증 (계좌이체/무통장 신청 시에만 의미)
          ...(needsCashReceiptUi && cashReceipt.requested
            ? {
                cashReceiptType: cashReceipt.type, // 'income' | 'expense'
                cashReceiptNumber: cashReceiptNumberRaw,
              }
            : {}),
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

      // 무통장 입금: PortOne 미호출, 입금 안내 페이지로 이동
      if (payMethod === 'DIRECT_BANK') {
        router.push(`/checkout/bank?orderNumber=${orderData.orderNumber}`)
        return
      }

      if (!PORTONE_STORE_ID || !PORTONE_CHANNEL_KEY) {
        alert('결제 시스템 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.')
        setLoading(false)
        return
      }

      // 2. PortOne V2 결제창 호출 — KAKAOPAY는 EASY_PAY + 카카오페이 provider로 분기
      const portoneArgs: any = {
        storeId: PORTONE_STORE_ID,
        channelKey: PORTONE_CHANNEL_KEY,
        paymentId: orderData.merchantUid,
        orderName: productName,
        totalAmount: amount,
        currency: 'CURRENCY_KRW',
        payMethod: payMethod === 'KAKAOPAY' ? 'EASY_PAY' : payMethod,
        customer: {
          ...(user?.name ? { fullName: user.name } : {}),
          ...(user?.email ? { email: user.email } : {}),
          phoneNumber: phoneNormalized,
        },
        redirectUrl: `${window.location.origin}/checkout/complete?orderNumber=${orderData.orderNumber}`,
      }
      if (payMethod === 'KAKAOPAY') {
        portoneArgs.easyPay = { easyPayProvider: 'KAKAOPAY' }
      }
      const paymentResponse = await PortOne.requestPayment(portoneArgs)

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
    } catch (e) {
      const err = e as { code?: string; message?: string; pgCode?: string; pgMessage?: string }
      console.error('[CHECKOUT ERROR]', err)
      const detail = err?.pgMessage || err?.message || err?.code || ''
      alert(`결제 처리 중 오류가 발생했습니다.${detail ? `\n\n원인: ${detail}` : ''}`)
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
  // 상품 자체 할인(정가 대비) — 현금 할인·쿠폰은 별도 줄로 표시하므로 여기서 제외
  const discount = Math.max(0, originalAmount - baseAmount)

  const handleEventBannerClick = () => {
    setPayMethod('TRANSFER')
    setTimeout(() => {
      payMethodSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <section className="pt-12 md:pt-16 pb-20 px-4 md:px-6">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8 text-center">결제하기</h1>

          {/* VOD 런칭 기념 이벤트 배너 */}
          {productSlug === 'vibe-coding-101-vod' && (
            <div className="mb-6 p-4 md:p-5 rounded-2xl bg-brand-light border-2 border-brand cursor-pointer hover:shadow-lg transition-shadow" onClick={handleEventBannerClick}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-brand text-base md:text-lg mb-1">VOD 런칭 기념 현금 할인 이벤트</h3>
                  <p className="text-sm text-sub">계좌이체·무통장 입금 선택 시 25% 할인이 적용됩니다</p>
                </div>
                <div className="shrink-0 px-4 py-2 bg-brand text-white rounded-lg font-bold text-sm whitespace-nowrap hover:bg-brand-dark transition-colors">
                  자세히 보기 →
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* ─── 좌측: 주문 상품 + 주문자 + 배송지 ─── */}
            <div className="space-y-6">
              {/* 번들 업셀 — 입문 단독 슬러그일 때만 자동 표시.
                  VOD 상품은 제외 (심화반 VOD 미녹화로 6주 풀패키지 판매 불가) */}
              {productSlug !== 'vibe-coding-101-vod' && (
                <BundleUpsell
                  currentSlug={productSlug}
                  bundleSlug="vibe-coding-bundle-2"
                  currentPrice={amount}
                />
              )}

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
                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <span className="text-sub w-20 shrink-0">이름</span>
                    <span className="text-ink">{user.name || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-sub w-20 shrink-0">이메일</span>
                    <span className="text-ink break-all">{user.email}</span>
                  </div>
                  <div>
                    <div className="flex items-start gap-2 mb-1.5">
                      <span className="text-sub w-20 shrink-0 pt-2">
                        휴대폰 <span className="text-brand">*</span>
                      </span>
                      {phoneConfirmed ? (
                        // 확정 상태 — 표시 + 수정 버튼
                        <div className="flex-1 flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                          <span className="text-ink font-medium">
                            {buyerPhone}
                          </span>
                          <span className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-green-600 font-medium">✓ 확인됨</span>
                            <button
                              type="button"
                              onClick={() => setPhoneConfirmed(false)}
                              className="text-xs text-sub hover:text-brand underline"
                            >
                              수정
                            </button>
                          </span>
                        </div>
                      ) : (
                        // 미확정 — 입력 + 확인 버튼
                        <div className="flex-1 flex gap-2">
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={buyerPhone}
                            onChange={(e) => setBuyerPhone(e.target.value)}
                            placeholder="010-1234-5678"
                            className={`flex-1 px-3 py-2 border rounded-lg text-ink focus:outline-none ${
                              buyerPhone && !phoneValid
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-line focus:border-brand'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => phoneValid && setPhoneConfirmed(true)}
                            disabled={!phoneValid}
                            className="shrink-0 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition-colors disabled:bg-[#ddd] disabled:cursor-not-allowed"
                          >
                            확인
                          </button>
                        </div>
                      )}
                    </div>
                    {!phoneConfirmed && (
                      <p className="text-xs text-sub ml-20">
                        결제 진행과 주문 안내를 위해 필요합니다. 입력 후 <strong>확인</strong> 버튼을 눌러주세요.
                      </p>
                    )}
                    {!phoneConfirmed && buyerPhone && !phoneValid && (
                      <p className="text-xs text-red-500 ml-20 mt-1">
                        올바른 휴대폰 번호 형식이 아닙니다.
                      </p>
                    )}
                  </div>
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
                    {cashEvent.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sub">VOD 런칭 현금 할인</span>
                        <span className="text-brand">- {cashEvent.discount.toLocaleString()}원</span>
                      </div>
                    )}
                    {couponDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sub">쿠폰 할인</span>
                        <span className="text-brand">- {couponDiscount.toLocaleString()}원</span>
                      </div>
                    )}
                  </div>
                  <hr className="my-4 border-line" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-ink">총 주문금액</span>
                    <span className="text-2xl font-extrabold text-brand">{amount.toLocaleString()}원</span>
                  </div>
                </div>

                {/* 쿠폰 — 보유 쿠폰이 있을 때만 노출 */}
                {coupons.length > 0 && (
                  <div className="p-5 md:p-6 rounded-2xl bg-white border border-line">
                    <h2 className="text-base font-bold text-ink mb-4">쿠폰 적용</h2>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-line cursor-pointer hover:bg-surface">
                        <input
                          type="radio"
                          name="coupon"
                          checked={!selectedCouponCode}
                          onChange={() => setSelectedCouponCode('')}
                          className="accent-ink"
                        />
                        <span className="text-sm text-sub">사용 안 함</span>
                      </label>
                      {coupons.map((c) => (
                        <label
                          key={c.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                            selectedCouponCode === c.code
                              ? 'border-ink bg-surface'
                              : 'border-line hover:border-sub'
                          }`}
                        >
                          <input
                            type="radio"
                            name="coupon"
                            checked={selectedCouponCode === c.code}
                            onChange={() => setSelectedCouponCode(c.code)}
                            className="accent-ink"
                          />
                          <span className="text-sm text-ink">
                            {c.discountType === 'percent'
                              ? `${c.discountPercent}% 할인`
                              : `${(c.discountAmount || 0).toLocaleString()}원 할인`}
                            {c.referralCode ? (
                              <span className="ml-2 text-xs text-sub">(파트너 추천)</span>
                            ) : null}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 결제수단 */}
                <div ref={payMethodSectionRef} className="p-5 md:p-6 rounded-2xl bg-white border border-line">
                  <h2 className="text-base font-bold text-ink mb-4">결제수단</h2>
                  <div className="space-y-2">
                    {([
                      // 카카오페이 활성화 대기 중 — PortOne 신청 진행중. 활성화되면 주석 해제.
                      // { key: 'KAKAOPAY', label: '카카오페이' },
                      { key: 'CARD', label: '신용카드' },
                      { key: 'TRANSFER', label: '계좌이체' },
                      { key: 'DIRECT_BANK', label: '무통장 입금 (직접 입금)' },
                    ] as { key: PayMethod; label: string }[]).map((m) => {
                      const isKakao = m.key === 'KAKAOPAY'
                      const selected = payMethod === m.key
                      return (
                        <label
                          key={m.key}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isKakao
                              ? selected
                                ? 'border-[#FEE500] bg-[#FEE500]/30'
                                : 'border-[#FEE500]/60 bg-[#FEE500]/10 hover:bg-[#FEE500]/20'
                              : selected
                                ? 'border-[#D4756E] bg-brand/5'
                                : 'border-line hover:border-brand/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payMethod"
                            checked={selected}
                            onChange={() => setPayMethod(m.key)}
                            className={isKakao ? 'accent-[#191919]' : 'accent-[#D4756E]'}
                          />
                          {isKakao && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                              <path fill="#191919" d="M12 3C6.48 3 2 6.48 2 10.8c0 2.78 1.85 5.22 4.63 6.6-.2.72-.73 2.65-.84 3.06-.13.5.18.49.39.36.16-.1 2.59-1.76 3.63-2.47.72.1 1.45.15 2.19.15 5.52 0 10-3.48 10-7.7S17.52 3 12 3z" />
                            </svg>
                          )}
                          <span className={`text-sm font-bold ${isKakao ? 'text-[#191919]' : selected ? 'text-brand' : 'text-ink'}`}>
                            {m.label}
                          </span>
                          {isKakao && (
                            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#191919] text-[#FEE500]">
                              빠른 결제
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* 현금영수증 — 계좌이체/무통장 결제 시에만 노출 */}
                {(payMethod === 'TRANSFER' || payMethod === 'DIRECT_BANK') && (
                  <div className="p-5 md:p-6 rounded-2xl bg-white border border-line">
                    <div className="flex items-baseline justify-between mb-4">
                      <h2 className="text-base font-bold text-ink">현금영수증</h2>
                      <div className="flex items-center gap-3 text-sm">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="cashReceipt"
                            checked={cashReceipt.requested}
                            onChange={() => setCashReceipt((c) => ({ ...c, requested: true }))}
                            className="accent-ink"
                          />
                          <span className={cashReceipt.requested ? 'text-ink font-bold' : 'text-sub'}>신청</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="cashReceipt"
                            checked={!cashReceipt.requested}
                            onChange={() => setCashReceipt((c) => ({ ...c, requested: false, number: '' }))}
                            className="accent-ink"
                          />
                          <span className={!cashReceipt.requested ? 'text-ink font-bold' : 'text-sub'}>미신청</span>
                        </label>
                      </div>
                    </div>

                    {cashReceipt.requested && (
                      <div className="space-y-3">
                        {/* 발급 유형 선택 */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <label
                            className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition ${
                              cashReceipt.type === 'income'
                                ? 'border-ink bg-surface'
                                : 'border-line hover:border-sub'
                            }`}
                          >
                            <input
                              type="radio"
                              name="cashReceiptType"
                              checked={cashReceipt.type === 'income'}
                              onChange={() => setCashReceipt((c) => ({ ...c, type: 'income', number: '' }))}
                              className="accent-ink"
                            />
                            <span className={`text-sm ${cashReceipt.type === 'income' ? 'text-ink font-bold' : 'text-sub'}`}>
                              개인소득공제용
                            </span>
                          </label>
                          <label
                            className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition ${
                              cashReceipt.type === 'expense'
                                ? 'border-ink bg-surface'
                                : 'border-line hover:border-sub'
                            }`}
                          >
                            <input
                              type="radio"
                              name="cashReceiptType"
                              checked={cashReceipt.type === 'expense'}
                              onChange={() => setCashReceipt((c) => ({ ...c, type: 'expense', number: '' }))}
                              className="accent-ink"
                            />
                            <span className={`text-sm ${cashReceipt.type === 'expense' ? 'text-ink font-bold' : 'text-sub'}`}>
                              사업자지출증빙용(세금계산서 대용)
                            </span>
                          </label>
                        </div>

                        {/* 번호 입력 */}
                        <div>
                          <label className="block text-xs text-sub mb-1.5">
                            {cashReceipt.type === 'income'
                              ? '휴대폰번호 또는 현금영수증 카드번호'
                              : '사업자등록번호'}
                          </label>
                          <input
                            value={cashReceipt.number}
                            onChange={(e) =>
                              setCashReceipt((c) => ({
                                ...c,
                                number: e.target.value.replace(/[^\d-]/g, ''),
                              }))
                            }
                            placeholder={
                              cashReceipt.type === 'income'
                                ? '010-0000-0000'
                                : '000-00-00000'
                            }
                            inputMode="numeric"
                            maxLength={20}
                            className="w-full px-4 py-3 border border-line rounded-lg text-sm focus:outline-none focus:border-ink font-mono"
                          />
                        </div>

                        <p className="text-xs text-sub leading-relaxed pt-1">
                          입금 확인 후 입력하신 정보로 현금영수증이 발급됩니다.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 약관 동의 */}
                <div className="p-5 md:p-6 rounded-2xl bg-white border border-line">
                  <h2 className="text-base font-bold text-ink mb-3">이용 및 정보 제공 약관</h2>
                  <p className="text-xs text-sub leading-relaxed mb-4">
                    결제 전 이용 및 정보 제공 약관 등의 내용을 확인했으며 이에 동의합니다.
                  </p>

                  {/* 전체 동의 */}
                  <label className="flex items-center gap-2 cursor-pointer mb-3 pb-3 border-b border-line">
                    <input
                      type="checkbox"
                      checked={allAgreed}
                      onChange={(e) => {
                        const v = e.target.checked
                        setAgreed({ terms: v, refund: v, privacy: v })
                      }}
                      className="accent-[#D4756E] w-4 h-4"
                    />
                    <span className="text-sm font-bold text-ink">전체 동의</span>
                  </label>

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
                  disabled={
                    !allAgreed ||
                    !phoneConfirmed ||
                    !phoneValid ||
                    loading ||
                    (requiresShipping && !shippingValid)
                  }
                  className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed text-base md:text-lg shadow-md"
                >
                  {loading
                    ? '처리 중...'
                    : `${amount.toLocaleString()}원 결제하기`}
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
