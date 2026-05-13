import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'

/**
 * 매니저 — 파트너스 발급/관리.
 *
 * GET    /api/manager/referrals             — 목록 (집계 포함)
 * POST   /api/manager/referrals             — 신규 발급 { userId, payoutBank, payoutAccountNum, payoutHolder, customCode? }
 * PATCH  /api/manager/referrals/{id}        — 정보 수정 (별도 라우트 필요 시 추가)
 *
 * 정책:
 *  - 코드는 영숫자 6~12자, 대문자. customCode 미지정 시 회원 이름·이메일에서 추출하여 생성.
 *  - 이미 활성 코드가 있는 회원에게 또 발급하지 않음.
 */
const sanitize = (s: string) =>
  s
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8)

function randSuffix(len = 3): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'referrals' as any,
      limit: 200,
      depth: 1,
      sort: '-createdAt',
      overrideAccess: true,
    })
    // 각 추천 코드별 실제 결제 전환 수 + 누적 보상액 집계
    const codes = (res.docs as any[]).map((r) => r.code).filter(Boolean)
    const stats: Record<string, { paidCount: number; totalReward: number; pendingPayout: number }> = {}
    if (codes.length > 0) {
      const orders = await payload.find({
        collection: 'orders',
        where: {
          and: [
            { referredByCode: { in: codes } },
            { status: { in: ['paid', 'active', 'completed'] } },
          ],
        },
        limit: 1000,
        depth: 0,
        overrideAccess: true,
      })
      for (const o of orders.docs as any[]) {
        const c = o.referredByCode
        if (!c) continue
        if (!stats[c]) stats[c] = { paidCount: 0, totalReward: 0, pendingPayout: 0 }
        stats[c].paidCount++
        stats[c].totalReward += o.referralRewardKrw || 0
        if (!o.referralPaidOutAt) stats[c].pendingPayout += o.referralRewardKrw || 0
      }
    }
    return NextResponse.json({ docs: res.docs, stats })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError
  try {
    const body = (await request.json()) as {
      userId: number
      payoutBank?: string
      payoutAccountNum?: string
      payoutHolder?: string
      customCode?: string
      memo?: string
    }
    if (!body.userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    const payload = await getPayloadClient()
    const user = (await payload.findByID({ collection: 'users', id: body.userId })) as any
    if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 })

    // 기존 active 코드 있으면 그대로 반환
    const existing = await payload.find({
      collection: 'referrals' as any,
      where: { and: [{ user: { equals: body.userId } }, { status: { equals: 'active' } }] },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      return NextResponse.json({ ok: true, alreadyIssued: true, referral: existing.docs[0] })
    }

    // 코드 생성 — 사용자 지정 OR 자동
    let code = body.customCode ? sanitize(body.customCode) : ''
    if (!code) {
      const base = sanitize(user.name || user.email.split('@')[0])
      code = (base + randSuffix(3)).slice(0, 10)
    }

    // 중복 검사 — 최대 5회 재시도
    for (let i = 0; i < 5; i++) {
      const dup = await payload.find({
        collection: 'referrals' as any,
        where: { code: { equals: code } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (dup.totalDocs === 0) break
      code = (sanitize(user.name || user.email.split('@')[0]) + randSuffix(3)).slice(0, 10)
    }

    const created = await payload.create({
      collection: 'referrals' as any,
      data: {
        code,
        user: body.userId,
        status: 'active',
        payoutBank: body.payoutBank,
        payoutAccountNum: (body.payoutAccountNum || '').replace(/[^0-9]/g, '') || undefined,
        payoutHolder: body.payoutHolder,
        memo: body.memo,
      } as any,
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true, alreadyIssued: false, referral: created })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
