import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'

/**
 * 매니저 — 파트너 개별 작업.
 * PATCH  /api/manager/referrals/{id} { status?, payoutBank?, payoutAccountNum?, payoutHolder?, memo? }
 * POST   /api/manager/referrals/{id}/payout   (별도 라우트로 분리)
 */
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin(request)
  if (authError) return authError
  try {
    const { id } = await ctx.params
    const body = (await request.json()) as Record<string, any>
    const allowed = ['status', 'payoutBank', 'payoutAccountNum', 'payoutHolder', 'memo']
    const data: Record<string, any> = {}
    for (const k of allowed) {
      if (k in body && body[k] !== undefined) data[k] = body[k]
    }
    if (data.payoutAccountNum) {
      data.payoutAccountNum = String(data.payoutAccountNum).replace(/[^0-9]/g, '')
    }
    const payload = await getPayloadClient()
    const updated = await payload.update({
      collection: 'referrals' as any,
      id,
      data: data as any,
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true, referral: updated })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
