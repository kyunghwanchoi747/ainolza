import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * 무통장 입금 마감 자동 취소.
 *
 * 호출 방식:
 *  - GET 또는 POST. 인증: ?key=<CRON_KEY> (환경변수)
 *  - 매시간 호출 권장 (GitHub Actions 또는 외부 cron)
 *
 * 동작:
 *  pgProvider='direct-bank' AND status='pending' AND vbankDate < now
 *  → status='cancelled' 로 일괄 변경
 */
export const dynamic = 'force-dynamic'

async function handle(request: NextRequest) {
  const url = new URL(request.url)
  const providedKey = url.searchParams.get('key') || request.headers.get('x-cron-key') || ''
  const expectedKey = process.env.CRON_KEY || ''
  if (!expectedKey || providedKey !== expectedKey) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const nowIso = new Date().toISOString()

    const result = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { pgProvider: { equals: 'direct-bank' } },
          { status: { equals: 'pending' } },
          { vbankDate: { less_than: nowIso } },
        ],
      },
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })

    let cancelled = 0
    for (const o of result.docs as any[]) {
      try {
        await payload.update({
          collection: 'orders',
          id: o.id,
          data: { status: 'cancelled' },
          overrideAccess: true,
          context: { skipNotify: true },
        })
        cancelled++
      } catch (e) {
        console.error('[expire-direct-bank] update failed', o.orderNumber, (e as Error).message)
      }
    }

    return NextResponse.json({ ok: true, checked: result.docs.length, cancelled })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
