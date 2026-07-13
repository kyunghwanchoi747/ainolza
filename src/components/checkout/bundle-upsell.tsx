'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { resolveCurrentPrice } from '@/lib/price-schedule'

type Props = {
  /** 현재 결제 중인 상품 슬러그 (입문 단독) */
  currentSlug: string
  /** 업셀 대상 번들 슬러그 (예: vibe-coding-bundle-2) */
  bundleSlug: string
  /** 현재 결제 가격 (할인 차액 계산용) */
  currentPrice: number
  /** 입문 단독 슬러그 패턴 — 이 슬러그에서만 업셀 노출 */
  enabledSlugPattern?: RegExp
  /** 제공 형태 고지 등 안내 문구 — 비교 카드 아래 작은 글씨로 표시 */
  note?: string
}

/**
 * 입문 단독 결제 페이지에서 노출되는 번들 업셀 배너.
 * - 번들 상품의 현재 적용 가격을 자동으로 가져와 차액 계산
 * - "번들로 변경" 클릭 시 결제 페이지를 번들 슬러그로 교체
 * - 사용자가 닫으면 24h sessionStorage 기억하여 재노출 안 함
 */
export function BundleUpsell({
  currentSlug,
  bundleSlug,
  currentPrice,
  enabledSlugPattern = /^vibe-coding-101/,
  note,
}: Props) {
  const router = useRouter()
  const [bundle, setBundle] = useState<{
    title: string
    price: number
    nextChangeAt?: string
    nextPrice?: number
  } | null>(null)
  const [dismissed, setDismissed] = useState(false)

  // 입문 단독 슬러그가 아닐 땐 노출 안 함
  const enabled = enabledSlugPattern.test(currentSlug)

  useEffect(() => {
    if (!enabled) return
    try {
      if (sessionStorage.getItem('bundle-upsell-dismissed') === '1') {
        setDismissed(true)
        return
      }
    } catch {}
    fetch(`/api/products?where[slug][equals]=${encodeURIComponent(bundleSlug)}&depth=0&limit=1`, {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: any) => {
        const doc = data?.docs?.[0]
        if (!doc) return
        const resolved = resolveCurrentPrice({
          price: doc.price,
          originalPrice: doc.originalPrice,
          priceSchedule: doc.priceSchedule || [],
        })
        setBundle({
          title: doc.title || '번들',
          price: resolved.price,
          nextChangeAt: resolved.nextChange?.startAt,
          nextPrice: resolved.nextChange?.price,
        })
      })
      .catch(() => {})
  }, [enabled, bundleSlug])

  if (!enabled || dismissed || !bundle) return null

  // "번들 가격 - 입문 가격 = 심화 추가 비용" 표시
  const additionalForUpgrade = bundle.price - currentPrice
  if (additionalForUpgrade <= 0) return null

  const handleSwitch = () => {
    router.push(`/checkout?slug=${encodeURIComponent(bundleSlug)}`)
  }

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('bundle-upsell-dismissed', '1')
    } catch {}
    setDismissed(true)
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-5 mb-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <p className="text-ink font-bold text-base mb-1">
            심화까지 같이 들으면 더 이득입니다
          </p>
          <p className="text-sm text-sub leading-relaxed">
            1기 입문 수강생 80명 중 <strong className="text-ink">절반인 40명이 심화까지 진행</strong>했습니다.
            처음부터 6주 풀패키지로 신청하면 단독 합산 대비 <strong className="text-ink">최대 170,000원 절약</strong>됩니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-sub hover:text-ink text-xs shrink-0 underline underline-offset-2"
          aria-label="닫기"
        >
          닫기
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg border border-line bg-surface p-3">
          <div className="text-xs text-sub mb-1">현재 선택 — 입문만</div>
          <div className="font-bold text-ink">{currentPrice.toLocaleString()}원</div>
          <div className="text-xs text-sub mt-1">입문 전 회차 VOD</div>
        </div>
        <div className="rounded-lg border border-[#D4756E] bg-brand-light p-3">
          <div className="text-xs text-brand font-bold mb-1">6주 풀패키지</div>
          <div className="font-extrabold text-ink">
            {bundle.price.toLocaleString()}원
            <span className="text-xs font-normal ml-1 text-sub">
              (+{additionalForUpgrade.toLocaleString()}원)
            </span>
          </div>
          <div className="text-xs text-sub mt-1">입문 + 심화 = 풀코스</div>
        </div>
      </div>

      {note && (
        <p className="text-xs text-sub leading-relaxed mb-3 pt-3 border-t border-line">{note}</p>
      )}

      <button
        type="button"
        onClick={handleSwitch}
        className="w-full py-3 rounded-xl bg-brand hover:bg-brand-dark transition-colors text-white font-bold"
      >
        6주 풀패키지로 변경하기 →
      </button>
    </div>
  )
}
