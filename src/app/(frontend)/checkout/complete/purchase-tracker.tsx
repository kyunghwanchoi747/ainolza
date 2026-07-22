'use client'

import { useEffect } from 'react'

/**
 * 결제 완료 화면 로드 시 GA4 purchase 이벤트를 1회 전송.
 * - complete/page.tsx(서버 컴포넌트)는 window.gtag를 직접 못 쓰므로 이 클라이언트 컴포넌트로 분리.
 * - gtag 로드 여부를 확인한 뒤에만 실행.
 * - sessionStorage로 주문당 중복 전송 방지(새로고침해도 재전송 안 됨).
 */
export function PurchaseTracker({ orderNumber }: { orderNumber: string }): null {
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

    gtag('event', 'purchase', {
      transaction_id: orderNumber,
      value: 89000,
      currency: 'KRW',
      items: [{ item_name: '바이브코딩 입문 VOD' }],
    })

    try {
      sessionStorage.setItem(key, '1')
    } catch {
      // 기록 실패해도 이벤트 자체는 전송됨
    }
  }, [orderNumber])

  return null
}
