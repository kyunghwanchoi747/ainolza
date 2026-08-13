import type { ComponentType } from 'react'
import { VodDetailContent } from '@/components/store/vod-detail-content'
import { MemoirDetailContent } from '@/components/store/memoir-detail-content'

/**
 * 상품 slug → 커스텀 상세 본문 컴포넌트.
 * 이 맵에 있는 상품은 표준 상세 이미지 나열(detailImages) 대신 이 컴포넌트를 렌더링한다.
 * 새 상품에 커스텀 디자인이 필요하면 컴포넌트 만들고 여기 한 줄만 추가할 것.
 * store/[slug]/page.tsx 는 건드리지 않는다.
 */
export const CUSTOM_DETAIL_COMPONENTS: Record<string, ComponentType> = {
  'vibe-coding-101-vod': VodDetailContent,
  'memoir-full': MemoirDetailContent,
  'memoir-basic': MemoirDetailContent,
}
