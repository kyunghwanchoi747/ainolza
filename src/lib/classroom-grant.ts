/**
 * 결제 완료 시 강의실 권한 부여 — 단일 진입점.
 *
 * 정책:
 *  1) Products.grantedClassroomSlugs 배열이 우선
 *  2) 비어 있으면 아래 fallback 매핑으로 강의실 부여
 *
 * fallback이 존재하는 이유:
 *  - 어드민에서 grantedClassroomSlugs 입력을 빠뜨려도 권한 누수 안 일어나게
 *  - "현재 운영 중인 기수"를 코드 한 곳에서 관리 → 새 기수 시작할 때 이 파일만 수정
 *
 * 새 기수(예: 3기) 시작할 때:
 *   FALLBACK_CLASSROOMS의 값만 vibe-coding-101-3 식으로 일괄 변경.
 */

/** 결제 시 productSlug → 부여될 강의실 슬러그 fallback. */
const FALLBACK_CLASSROOMS: Record<string, string[]> = {
  // 입문 VOD — 상시 판매
  'vibe-coding-101-vod': ['vibe-coding-101-vod'],
  // (구) 입문 라이브 — 현재 운영 중인 기수의 강의실로 부여
  'vibe-coding-101': ['vibe-coding-101-2'],
  // 심화 강의 (라이브 녹화본)
  'vibe-coding-advanced': ['vibe-coding-advanced-2'],
  // 번들 — 입문 VOD + 심화(라이브 녹화본. 심화 VOD 완성 시 교체)
  'vibe-coding-bundle-2': ['vibe-coding-101-vod', 'vibe-coding-advanced-2'],
}

/**
 * 부여할 강의실 슬러그 목록을 결정.
 * @param productSlug 결제된 상품의 slug
 * @param productGranted 상품 컬렉션의 grantedClassroomSlugs 배열 (raw)
 * @param existing 이미 order.classrooms에 들어있던 슬러그 (관리자 수동 추가 등)
 */
export function resolveGrantedClassrooms(
  productSlug: string | null | undefined,
  productGranted: unknown,
  existing: string[] = [],
): string[] {
  const result: string[] = [...existing]
  const push = (slug: string) => {
    if (slug && !result.includes(slug)) result.push(slug)
  }

  // 1) 상품에 명시된 강의실 우선 적용
  if (Array.isArray(productGranted)) {
    for (const item of productGranted) {
      const slug = typeof item === 'object' && item !== null ? (item as any).slug : item
      if (typeof slug === 'string' && slug) push(slug)
    }
  }

  // 2) 빈 경우 fallback 매핑
  if (result.length === existing.length && productSlug && FALLBACK_CLASSROOMS[productSlug]) {
    for (const slug of FALLBACK_CLASSROOMS[productSlug]) push(slug)
  }

  return result
}

