'use client'

import { useEffect } from 'react'

/**
 * 결제 완료 화면 로드 시 GA4 purchase 이벤트를 1회 전송.
 * - complete/page.tsx(서버 컴포넌트)는 window.gtag를 직접 못 쓰므로 이 클라이언트 컴포넌트로 분리.
 * - gtag 로드 여부를 확인한 뒤에만 실행.
 * - sessionStorage로 주문당 중복 전송 방지(새로고침해도 재전송 안 됨).
 */
export function PurchaseTracker({
  orderNumber,
  amount,
  productName,
  productSlug,
}: {
  orderNumber: string
  amount: number
  /** 주문의 실제 상품명. 없으면 일반 라벨로 대체 — 상품별 매출 분석에 사용 */
  productName?: string
  productSlug?: string
}): null {
  useEffect(() => {
    if (!orderNumber) return

    const key = `ga_purchase_sent_${orderNumber}`
    try {
      if (sessionStorage.getItem(key)) return
    } catch {
      // sessionStorage 접근 불가(시크릿 등) 시 그냥 진행
    }

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function') return

    // GA4 purchase — 실제 결제 금액 + 실제 상품명
    // (하드코딩하면 심화반이 팔려도 입문으로 찍혀 상품별 분석이 불가능해진다)
    gtag('event', 'purchase', {
      transaction_id: orderNumber,
      value: amount,
      currency: 'KRW',
      items: [
        {
          item_id: productSlug || orderNumber,
          item_name: productName || '바이브코딩 VOD',
          price: amount,
          quantity: 1,
        },
      ],
    })

    // Google Ads 전환 이벤트
    gtag('event', 'conversion', {
      send_to: 'AW-17032214512/a-qyCIenx9QcEPDvy7k_',
      value: amount,
      currency: 'KRW',
      transaction_id: orderNumber,
    })

    try {
      sessionStorage.setItem(key, '1')
    } catch {
      // 기록 실패해도 이벤트 자체는 전송됨
    }
  }, [orderNumber, amount, productName, productSlug])

  return null
}
