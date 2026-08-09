import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { sendVirtualAccountReminder } from '@/lib/email-templates'

/**
 * 무통장 입금 마감 자동 취소 및 임박 알림 메일 발송.
 *
 * 호출 방식:
 *  - GET 또는 POST. 인증: ?key=<CRON_KEY> (환경변수)
 *  - 매시간 호출 권장 (GitHub Actions 또는 외부 cron)
 *
 * 동작:
 *  1. pgProvider='direct-bank' AND status='pending' AND vbankDate < now + 3h AND vbankReminderSent != true
 *     → 알림 메일 발송 및 vbankReminderSent=true
 *  2. pgProvider='direct-bank' AND status='pending' AND vbankDate < now
 *     → status='cancelled' 로 일괄 변경
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
    const now = new Date()
    const nowIso = now.toISOString()
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString()

    // 1. 취소 대상 찾기 및 취소
    const expiredResult = await payload.find({
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
    for (const o of expiredResult.docs as any[]) {
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

    // 2. 리마인드 발송 대상 찾기 및 발송
    const reminderResult = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { pgProvider: { equals: 'direct-bank' } },
          { status: { equals: 'pending' } },
          { vbankDate: { greater_than: nowIso } },
          { vbankDate: { less_than_equal: threeHoursLater } },
          { vbankReminderSent: { not_equals: true } },
        ],
      },
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })

    let reminded = 0
    for (const o of reminderResult.docs as any[]) {
      try {
        await sendVirtualAccountReminder(payload, o)
        
        await payload.update({
          collection: 'orders',
          id: o.id,
          data: { vbankReminderSent: true },
          overrideAccess: true,
          context: { skipNotify: true },
        })
        reminded++
      } catch (e) {
        console.error('[expire-direct-bank] reminder failed', o.orderNumber, (e as Error).message)
      }
    }

    return NextResponse.json({ ok: true, expiredChecked: expiredResult.docs.length, cancelled, reminderChecked: reminderResult.docs.length, reminded })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
