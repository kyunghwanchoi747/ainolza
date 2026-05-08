'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Props = {
  /** 검증할 productSlug — prerequisite 매핑이 없으면 그냥 children 렌더 */
  productSlug: string
  /** 자격 충족 시 보여줄 일반 CTA */
  children: React.ReactNode
  /** 자격 미달 시 안내 박스 옆에 보여줄 fallback CTA href (예: 입문 강의 페이지) */
  fallbackHref?: string
  /** 자격 미달 시 fallback CTA 라벨 */
  fallbackLabel?: string
}

/**
 * 상세 페이지의 결제 CTA를 prerequisite 자격에 따라 분기.
 * - 자격 충족 / 비대상 상품 → children 그대로
 * - 자격 미달 → 안내 박스 + fallback CTA
 *
 * 클라이언트 fetch라 약간의 깜빡임 있지만, 페이지 자체 SSR 캐시는 유지됨.
 */
export function EligibilityGatedCta({ productSlug, children, fallbackHref, fallbackLabel }: Props) {
  const [state, setState] = useState<{ checked: boolean; eligible: boolean; reason?: string }>({
    checked: false,
    eligible: true,
  })

  useEffect(() => {
    let cancelled = false
    fetch(`/api/eligibility?slug=${encodeURIComponent(productSlug)}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: any) => {
        if (cancelled || !data) return
        setState({ checked: true, eligible: !!data.eligible, reason: data.reason })
      })
      .catch(() => {
        if (!cancelled) setState({ checked: true, eligible: true })
      })
    return () => {
      cancelled = true
    }
  }, [productSlug])

  // 첫 렌더 — 깜빡임 최소화 위해 자격 충족 가정으로 children 노출
  if (!state.checked || state.eligible) {
    return <>{children}</>
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
        <div className="font-bold text-amber-800 mb-1.5">⚠️ 입문 수강생만 신청 가능</div>
        <p className="text-sm text-amber-900 leading-relaxed">
          {state.reason || '이 강의는 입문 수강을 먼저 결제해야 신청할 수 있습니다.'}
        </p>
      </div>
      {fallbackHref && (
        <Link
          href={fallbackHref}
          className="block w-full py-5 bg-brand text-white font-extrabold rounded-2xl text-center hover:bg-brand-dark transition text-base md:text-lg shadow-md"
        >
          {fallbackLabel || '입문 강의 보러가기 →'}
        </Link>
      )}
    </div>
  )
}
