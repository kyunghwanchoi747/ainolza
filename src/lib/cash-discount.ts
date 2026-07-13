/**
 * VOD 런칭 기념 현금 할인 이벤트.
 *
 * 계좌이체(TRANSFER)/무통장 입금(DIRECT_BANK) 선택 시 이벤트가 적용.
 * 결제 UI(checkout)와 서버 금액 검증(/api/payments)이 이 함수 하나를 같이 쓴다 —
 * 규칙을 수정할 때 양쪽이 1원이라도 어긋나면 결제가 409로 거부되므로 반드시 여기서만 수정.
 *
 * 이벤트 종료 시 CASH_EVENT_PRICES에서 해당 slug 항목을 지우면 끝.
 */
export const CASH_EVENT_PRICES: Record<string, number> = {
  // 정상가 119,000원 → 현금 결제 89,000원 (약 25% 할인)
  'vibe-coding-101-vod': 89000,
  // 6주 풀패키지: 카드 338,000원(입문 119,000 + 심화 패키지가 219,000)
  // → 현금 결제 308,000원(입문 현금가 89,000 + 심화 패키지가 219,000)
  // admin에서 번들 판매가를 338,000원으로 설정해야 적용됨 (기준가가 현금가보다 낮으면 미적용)
  'vibe-coding-bundle-2': 308000,
}

const CASH_EVENT_METHODS = ['TRANSFER', 'DIRECT_BANK']

export function cashEventAmount(
  productSlug: string,
  payMethod: string | undefined | null,
  baseAmount: number,
): { amount: number; discount: number } {
  const eventPrice = CASH_EVENT_PRICES[productSlug]
  if (
    !eventPrice ||
    !payMethod ||
    !CASH_EVENT_METHODS.includes(payMethod) ||
    baseAmount <= eventPrice
  ) {
    return { amount: baseAmount, discount: 0 }
  }
  return { amount: eventPrice, discount: baseAmount - eventPrice }
}
