'use client'

/**
 * 리드마그넷 링크 — 클릭 시 구글 애즈/GA4에 리드 전환을 전송한다.
 *
 * 왜 클릭을 측정하는가:
 *   구글 폼은 docs.google.com 도메인이라 우리 태그를 심을 수 없다.
 *   (폼 페이지도, 제출 완료 화면도 구글 소유)
 *   따라서 "폼 제출"은 직접 측정 불가 → **우리 사이트를 떠나는 클릭**을 리드 신호로 삼는다.
 *
 * 목적:
 *   구매 전환만 측정하면 신호가 너무 적고 늦다(폼 작성 → 메일 3회차 → 구매까지 2~3일).
 *   중간 신호를 주어야 구글 입찰 알고리즘이 빨리 학습한다.
 *
 * 주의:
 *   클릭했지만 폼을 채우지 않은 사람도 포함되므로 구매 전환보다 정밀도가 낮다.
 *   → 애즈에서 **보조 전환**('전환' 열에 포함하지 않음)으로 설정할 것.
 */

import { useCallback } from 'react'

type Props = {
  href: string
  children: React.ReactNode
  className?: string
  /** 애즈 전환 라벨. 'AW-XXXX/YYYY' 형식. 없으면 GA4 이벤트만 전송 */
  adsSendTo?: string
  /** 어느 페이지의 리드마그넷인지 구분 (GA4 분석용) */
  source?: string
}

export function LeadMagnetLink({ href, children, className, adsSendTo, source }: Props) {
  const handleClick = useCallback(() => {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function') return

    // GA4 — 리드 생성 이벤트 (권장 이벤트명 generate_lead)
    gtag('event', 'generate_lead', {
      currency: 'KRW',
      value: 0,
      lead_source: source || 'lead_magnet',
    })

    // Google Ads — 보조 전환
    if (adsSendTo) {
      gtag('event', 'conversion', { send_to: adsSendTo })
    }
    // 링크 이동은 막지 않는다. 이벤트 전송은 beacon 방식이라 이탈해도 전달된다.
  }, [adsSendTo, source])

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
