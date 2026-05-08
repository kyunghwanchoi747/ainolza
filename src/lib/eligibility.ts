/**
 * 상품 결제 자격 검증 — "선수강 상품" 정책.
 *
 * 예: 심화 단독(vibe-coding-advanced)은 입문(vibe-coding-101) 결제완료자만 가능.
 * - 메인 페이지 / 결제 페이지 / API 모두 같은 함수를 사용해서 정책 일관성 보장.
 */
import type { Payload } from 'payload'
import { PREREQUISITE_MAP } from './classroom-grant'

const VALID_PAID_STATUSES = ['paid', 'active', 'completed']

export type EligibilityResult = {
  eligible: boolean
  reason?: string
  prerequisiteSlug?: string
}

/**
 * 사용자가 productSlug 상품을 결제할 자격이 있는지 검증.
 * - 선수강 상품 매핑이 없으면 항상 eligible=true
 * - 매핑이 있으면 사용자가 선수강 상품을 결제완료(paid/active/completed)했는지 확인
 * - 비로그인은 자동으로 eligible=false
 */
export async function checkEligibility(
  payload: Payload,
  productSlug: string,
  userId: number | string | null | undefined,
): Promise<EligibilityResult> {
  const prereqs = PREREQUISITE_MAP[productSlug]
  if (!prereqs || prereqs.length === 0) {
    return { eligible: true }
  }

  if (!userId) {
    return {
      eligible: false,
      reason: '이 강의는 입문 수강생만 신청 가능합니다. 로그인 후 다시 시도해 주세요.',
      prerequisiteSlug: prereqs[0],
    }
  }

  // 어느 한 선수강 상품이라도 결제완료 이력이 있으면 통과
  const found = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { user: { equals: userId } },
        { productSlug: { in: prereqs } },
        { status: { in: VALID_PAID_STATUSES } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (found.totalDocs > 0) {
    return { eligible: true }
  }

  return {
    eligible: false,
    reason: '이 강의는 입문 수강생만 신청 가능합니다. 입문 수강을 먼저 결제해주세요.',
    prerequisiteSlug: prereqs[0],
  }
}
