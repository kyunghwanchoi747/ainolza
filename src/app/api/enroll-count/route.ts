import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * 모집 정원 카운터.
 * GET /api/enroll-count?slugs=vibe-coding-101-2,vibe-coding-bundle-2&capacity=100
 *
 * 응답: { count, capacity, percent, perSlug }
 *  - count    : 결제완료(paid|completed|active) 주문 합계 — 중복 회원은 1로 계산
 *  - capacity : 정원
 *  - percent  : 0~100
 *  - perSlug  : 슬러그별 카운트 (디버그/세부 표시용)
 *
 * 캐시: 30초 ISR — 사용자 한 명이 새로고침 폭주해도 D1 부하 무시 가능 수준.
 */
export const dynamic = 'force-dynamic'
export const revalidate = 30

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const slugsParam = url.searchParams.get('slugs') || ''
    const capacity = Math.max(1, parseInt(url.searchParams.get('capacity') || '100', 10) || 100)
    const slugs = slugsParam.split(',').map((s) => s.trim()).filter(Boolean)
    if (slugs.length === 0) {
      return NextResponse.json({ error: 'slugs param required' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // 결제완료 처리된 상태들 — paid/active/completed 모두 "수강 진행 중 또는 완료"
    const result = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { productSlug: { in: slugs } },
          { status: { in: ['paid', 'active', 'completed'] } },
        ],
      },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    })

    const docs = result.docs as Array<{
      productSlug?: string
      buyerEmail?: string
      user?: number | string | null
    }>

    // 슬러그별 카운트
    const perSlug: Record<string, number> = {}
    for (const s of slugs) perSlug[s] = 0
    // 중복 제거 — 같은 회원이 같은 상품 여러 번 결제해도 1로
    const seen = new Set<string>()
    let count = 0
    for (const o of docs) {
      const slug = o.productSlug || ''
      if (!perSlug.hasOwnProperty(slug)) continue
      const key = `${slug}::${o.user || o.buyerEmail || Math.random()}`
      if (seen.has(key)) continue
      seen.add(key)
      perSlug[slug]++
      count++
    }

    const percent = Math.min(100, Math.round((count / capacity) * 100))

    return NextResponse.json(
      { count, capacity, percent, perSlug },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
    )
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
