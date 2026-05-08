'use client'

import { useEffect, useState } from 'react'

type Props = {
  /** 카운트할 productSlug 목록 — 입문/번들 둘 다 합산하려면 배열로 전달 */
  slugs: string[]
  /** 정원 (예: 100) */
  capacity: number
  /** 라벨 (기본: "정원") */
  label?: string
  /** 0% 진행 상태에서 표시할 fallback 카피 (예: "곧 모집 시작") */
  emptyText?: string
  /** 30초마다 자동 갱신 */
  refreshSec?: number
  /** 결제 시작 전 사용 — 시작 전엔 가짜 카운트 표시 안 함 */
  startedAt?: string
}

export function EnrollCounter({
  slugs,
  capacity,
  label = '정원',
  emptyText,
  refreshSec = 30,
  startedAt,
}: Props) {
  const [data, setData] = useState<{ count: number; percent: number } | null>(null)
  const [loading, setLoading] = useState(true)

  const beforeStart = startedAt ? new Date(startedAt).getTime() > Date.now() : false

  useEffect(() => {
    if (beforeStart) {
      setLoading(false)
      return
    }
    let cancelled = false
    const url = `/api/enroll-count?slugs=${encodeURIComponent(slugs.join(','))}&capacity=${capacity}`
    const fetchOnce = async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as { count: number; percent: number }
        if (!cancelled) setData({ count: json.count, percent: json.percent })
      } catch {
        /* 무시 */
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchOnce()
    const id = setInterval(fetchOnce, refreshSec * 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [slugs.join(','), capacity, refreshSec, beforeStart])

  if (beforeStart) {
    return (
      <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-center text-sm font-medium text-orange-700">
        {emptyText || '곧 모집 시작 — 알림 받기'}
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="rounded-xl border bg-gray-50 px-4 py-3 text-center text-sm text-gray-500 animate-pulse">
        정원 집계 중…
      </div>
    )
  }

  const remaining = Math.max(0, capacity - data.count)
  const isAlmostFull = data.percent >= 70
  const isFull = data.count >= capacity

  return (
    <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-3.5">
      <div className="flex items-center justify-between text-sm font-bold mb-2">
        <span className="flex items-center gap-1.5">
          <span aria-hidden>🔥</span>
          <span>{label} {capacity}명 중 <span className="text-red-600">{data.count}명</span> 신청</span>
        </span>
        <span className={isAlmostFull ? 'text-red-600' : 'text-gray-600'}>
          {isFull ? '마감' : `잔여 ${remaining}석`}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-white overflow-hidden border border-red-100">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-700"
          style={{ width: `${data.percent}%` }}
        />
      </div>
      {isAlmostFull && !isFull && (
        <div className="mt-2 text-xs font-semibold text-red-600">
          ⚠️ 마감 임박 — 지금 신청하지 않으면 다음 기수를 기다리셔야 합니다
        </div>
      )}
    </div>
  )
}
