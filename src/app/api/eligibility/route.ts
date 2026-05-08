import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { checkEligibility } from '@/lib/eligibility'

/**
 * 결제 자격 사전 확인.
 * GET /api/eligibility?slug=vibe-coding-advanced
 *
 * 응답: { eligible, reason?, prerequisiteSlug? }
 *  - 클라이언트는 결제 페이지 진입 시 호출하여 UI를 자격 안내로 전환할 수 있음
 *  - 실제 차단은 /api/payments POST에서 다시 수행하므로 클라이언트 우회 시도는 불가능
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug') || ''
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

    const payload = await getPayloadClient()
    let userId: number | string | null = null
    try {
      const { user } = await payload.auth({ headers: request.headers })
      if (user) userId = user.id
    } catch { /* 비로그인 */ }

    const result = await checkEligibility(payload, slug, userId)
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
