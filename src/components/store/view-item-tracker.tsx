'use client'

import { useEffect } from 'react'

/**
 * 상품 상세(랜딩) 페이지 로드 시 GA4 view_item 이벤트를 1회 전송.
 * - store/[slug]/page.tsx(서버 컴포넌트)는 window.gtag를 직접 못 쓰므로 이 클라이언트 컴포넌트로 분리.
 *   (PurchaseTracker와 동일한 패턴)
 * - gtag 로드 여부를 확인한 뒤에만 실행.
 * - sessionStorage로 슬러그당 중복 전송 방지(새로고침해도 재전송 안 됨).
 *
 * 목적: 광고 유입자가 상품 페이지를 실제로 봤는지 측정.
 *   view_item이 없으면 GA4 "구매 여정"의 '제품 보기'가 항상 0으로 찍혀
 *   광고 클릭 이후 어디서 이탈하는지 진단할 수 없다.
 */
export function ViewItemTracker({
  productSlug,
  productName,
  price,
}: {
  productSlug: string
  productName: string
  /** 현재 판매가(할인 적용가). 없으면 0 */
  price?: number
}): null {
  useEffect(() => {
    if (!productSlug) return

    const key = `ga_view_item_sent_${productSlug}`
    try {
      if (sessionStorage.getItem(key)) return
    } catch {
      // sessionStorage 접근 불가(시크릿 등) 시 그냥 진행
    }

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function') return

    gtag('event', 'view_item', {
      currency: 'KRW',
      value: price || 0,
      items: [
        {
          item_id: productSlug,
          item_name: productName,
          price: price || 0,
          quantity: 1,
        },
      ],
    })

    try {
      sessionStorage.setItem(key, '1')
    } catch {
      // 기록 실패해도 이벤트 자체는 전송됨
    }
  }, [productSlug, productName, price])

  return null
}
