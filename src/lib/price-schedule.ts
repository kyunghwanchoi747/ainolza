/**
 * 가격 스케줄 — 단계별 가격 인상 자동화.
 *
 * 사용처:
 *  - 결제 시 정확한 현재 가격 결정 (서버 사이드)
 *  - 카드/상세 페이지에 현재 가격 + 다음 인상 카운트다운 표시
 *
 * priceSchedule 배열이 있고 현재 시각 >= 시작일시인 항목들 중
 * 가장 마지막(최신) 항목을 적용. 모두 미래면 product.price 사용.
 */

export type PriceScheduleEntry = {
  startAt: string // ISO8601
  price: number
  label?: string | null
}

export type PriceScheduleInput = {
  price?: number | null
  originalPrice?: number | null
  priceSchedule?: PriceScheduleEntry[] | null | undefined
}

export type CurrentPrice = {
  price: number
  originalPrice?: number
  label?: string
  // 다음 인상 정보 (카운트다운/긴급성 카피용)
  nextChange?: {
    startAt: string
    price: number
    label?: string
  }
}

/**
 * 현재 시각에 적용되는 가격을 결정.
 * - schedule이 비어있거나 모두 미래면 product.price 사용
 * - schedule 항목 중 startAt <= now 인 것들의 가장 늦은 항목 채택
 * - now < schedule[0].startAt 인 경우(첫 인상 전): product.price를 그대로 사용하고 nextChange만 알려줌
 */
export function resolveCurrentPrice(
  product: PriceScheduleInput,
  now: Date = new Date(),
): CurrentPrice {
  const basePrice = product.price ?? 0
  const originalPrice = product.originalPrice ?? undefined

  const schedule = (product.priceSchedule || [])
    .filter((s) => s && typeof s.startAt === 'string' && typeof s.price === 'number')
    .map((s) => ({
      startAt: s.startAt,
      price: s.price,
      label: s.label || undefined,
      _t: new Date(s.startAt).getTime(),
    }))
    .filter((s) => !isNaN(s._t))
    .sort((a, b) => a._t - b._t)

  if (schedule.length === 0) {
    return { price: basePrice, originalPrice }
  }

  const nowMs = now.getTime()
  // 가장 마지막 적용된 항목
  let activeIdx = -1
  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i]._t <= nowMs) activeIdx = i
    else break
  }

  const next = activeIdx + 1 < schedule.length ? schedule[activeIdx + 1] : undefined
  const nextChange = next
    ? { startAt: next.startAt, price: next.price, label: next.label }
    : undefined

  if (activeIdx === -1) {
    // 아직 첫 단계 시작 전 — 기본가 + 다음 인상 안내
    return { price: basePrice, originalPrice, nextChange }
  }

  const active = schedule[activeIdx]
  return {
    price: active.price,
    originalPrice,
    label: active.label,
    nextChange,
  }
}
