'use client'

import { useEffect } from 'react'

/**
 * /moving 랜딩 진입 시 GA4 landing_view를 1회 전송.
 * - page.tsx(서버 컴포넌트)에서 window.gtag를 못 쓰므로 분리. (ViewItemTracker와 동일한 패턴)
 * - sessionStorage로 새로고침 시 중복 전송 방지.
 * - UTM은 광고 매체별 유입을 구분하려는 것이며, 개인정보(연락처·이메일)는 넣지 않는다.
 *
 * 목적: 당근 광고 클릭 → 랜딩 도달 → CTA 클릭 → 실제 접수(generate_lead)의
 *   어느 단계에서 끊기는지 진단. landing_view가 없으면 광고비 대비 유입 자체를 알 수 없다.
 */
export function MovingTracker(): null {
  useEffect(() => {
    const key = 'ga_landing_view_moving'
    try {
      if (sessionStorage.getItem(key)) return
    } catch {
      // sessionStorage 접근 불가(시크릿 등) 시 그냥 진행
    }

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function') return

    const params = new URLSearchParams(window.location.search)
    gtag('event', 'landing_view', {
      service: 'moving',
      utm_source: params.get('utm_source') || '(none)',
      utm_medium: params.get('utm_medium') || '(none)',
      utm_campaign: params.get('utm_campaign') || '(none)',
      utm_content: params.get('utm_content') || '(none)',
    })

    try {
      sessionStorage.setItem(key, '1')
    } catch {
      // 기록 실패해도 이벤트 자체는 전송됨
    }
  }, [])

  return null
}

/**
 * 상단 CTA(구성과 가격 확인하기) 클릭 측정용 앵커.
 * 클릭은 '관심 표시'일 뿐 상담 완료가 아니므로 generate_lead와 반드시 구분한다.
 */
export function MovingCtaLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      className={className}
      href={href}
      onClick={() => {
        const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
        gtag?.('event', 'consultation_cta_click', { service: 'moving', location: 'hero' })
      }}
    >
      {children}
    </a>
  )
}
