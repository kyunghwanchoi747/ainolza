import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'

/**
 * 매니저 — 파트너 보상 일괄 지급 처리.
 *
 * POST /api/manager/referrals/{id}/payout
 *
 * 동작:
 *  - 해당 추천 코드로 들어온 paid/active/completed 상태 Order 중
 *    referralPaidOutAt이 비어 있는(미지급) 건들을 모두 지급 완료 처리.
 *  - 각 주문에 referralPaidOutAt = now 기록.
 *  - referral.paidOutKrw 누적.
 *  - 실제 송금은 관리자가 토스뱅크에서 수동으로 진행 후 이 버튼 클릭.
 */
export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin(request)
  if (authError) return authError
  try {
    const { id } = await ctx.params
    const payload = await getPayloadClient()
    const referral = (await payload.findByID({
      collection: 'referrals' as any,
      id,
      overrideAccess: true,
    })) as any
    if (!referral) {
      return NextResponse.json({ error: 'referral not found' }, { status: 404 })
    }

    const orders = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { referredByCode: { equals: referral.code } },
          { status: { in: ['paid', 'active', 'completed'] } },
          { referralPaidOutAt: { exists: false } },
        ],
      },
      limit: 500,
      depth: 0,
      overrideAccess: true,
    })

    const nowIso = new Date().toISOString()
    let payoutSum = 0
    for (const o of orders.docs as any[]) {
      const reward = o.referralRewardKrw || 0
      try {
        await payload.update({
          collection: 'orders',
          id: o.id,
          data: { referralPaidOutAt: nowIso } as any,
          overrideAccess: true,
          context: { skipNotify: true },
        })
        payoutSum += reward
      } catch (e) {
        console.error('[PAYOUT ORDER]', o.orderNumber, (e as Error).message)
      }
    }

    // referral 캐시 갱신
    const newPaidOut = (referral.paidOutKrw || 0) + payoutSum
    await payload.update({
      collection: 'referrals' as any,
      id,
      data: { paidOutKrw: newPaidOut } as any,
      overrideAccess: true,
    })

    return NextResponse.json({
      ok: true,
      processedOrders: orders.docs.length,
      payoutSum,
      newPaidOutTotal: newPaidOut,
    })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
