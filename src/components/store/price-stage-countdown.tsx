'use client'

import { useEffect, useState } from 'react'

type Props = {
  /** 다음 가격 인상 시작 일시 (ISO) */
  nextStartAt: string
  /** 다음 가격 (예: 119000) */
  nextPrice: number
  /** 다음 단계 라벨 (예: '얼리버드 2차') */
  nextLabel?: string
  /** 현재 단계 라벨 — 함께 표시 */
  currentLabel?: string
  /** 다음 인상까지 남은 시간 표시 형식: 'compact' | 'full' */
  variant?: 'compact' | 'full'
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return '곧 인상'
  const totalSec = Math.floor(ms / 1000)
  const d = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (d > 0) return `${d}일 ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * 다음 가격 인상까지의 카운트다운 + 인상 후 가격 안내.
 * 시각적으로 긴급성을 만들기 위한 컴포넌트.
 */
export function PriceStageCountdown({
  nextStartAt,
  nextPrice,
  nextLabel,
  currentLabel,
  variant = 'compact',
}: Props) {
  const [now, setNow] = useState<number>(() => Date.now())
  const target = new Date(nextStartAt).getTime()

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = target - now
  if (isNaN(target) || remaining <= 0) return null

  const remainingText = formatRemaining(remaining)

  if (variant === 'full') {
    return (
      <div className="rounded-xl border border-ink bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="font-extrabold text-red-600 text-base">
            {currentLabel ? `${currentLabel} 마감까지` : '가격 인상까지'}
          </span>
          <span className="font-extrabold text-ink tabular-nums tracking-wide">
            {remainingText}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-sub leading-relaxed">
          이후 {nextLabel ? <span className="font-semibold text-ink">{nextLabel}</span> : '다음 단계'}{' '}
          <span className="font-bold text-red-600">{nextPrice.toLocaleString()}원</span>으로 인상됩니다.
        </p>
      </div>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
      <span>⏰ {remainingText} 후 인상</span>
      <span className="text-red-500">→ {nextPrice.toLocaleString()}원</span>
    </span>
  )
}
