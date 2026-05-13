import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * 본인 보유 쿠폰 조회 (active 상태만).
 * GET /api/coupons/my
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) return NextResponse.json({ docs: [] })

    const nowIso = new Date().toISOString()
    const res = await payload.find({
      collection: 'coupons' as any,
      where: {
        and: [
          { user: { equals: user.id } },
          { status: { equals: 'active' } },
          {
            or: [
              { expiresAt: { exists: false } },
              { expiresAt: { greater_than: nowIso } },
            ],
          },
        ],
      },
      limit: 20,
      depth: 0,
      sort: '-createdAt',
      overrideAccess: true,
    })
    return NextResponse.json({ docs: res.docs })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
