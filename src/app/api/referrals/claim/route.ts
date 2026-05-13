import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * 추천 링크로 진입한 회원에게 자동 쿠폰 발급.
 *
 * POST { code: 'CHOI23' }
 *
 * 동작:
 *  - 로그인 필요. 비로그인은 401 → 클라이언트가 추천 코드를 쿠키에만 저장하고
 *    로그인 후 재호출하도록 안내.
 *  - 본인이 본인 추천 코드 사용 시 거부 (자기 추천 차단).
 *  - 같은 추천 코드의 active 쿠폰이 이미 있으면 그대로 반환 (재발급 X).
 *  - 새로 발급 시 10% 정률 할인 쿠폰, 만료 30일.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { code?: string }
    const code = (body.code || '').trim().toUpperCase()
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 })

    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.', loginRequired: true }, { status: 401 })
    }

    // 추천 코드 유효성
    const refRes = await payload.find({
      collection: 'referrals' as any,
      where: { and: [{ code: { equals: code } }, { status: { equals: 'active' } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const referral = refRes.docs[0] as any
    if (!referral) {
      return NextResponse.json({ error: '유효하지 않은 추천 코드입니다.' }, { status: 404 })
    }

    // 본인 추천 금지
    const referrerId = typeof referral.user === 'object' ? referral.user?.id : referral.user
    if (String(referrerId) === String(user.id)) {
      return NextResponse.json({ error: '본인의 추천 코드는 사용할 수 없습니다.' }, { status: 400 })
    }

    // 같은 추천 코드의 active 쿠폰이 이미 있으면 그대로
    const existing = await payload.find({
      collection: 'coupons' as any,
      where: {
        and: [
          { user: { equals: user.id } },
          { referralCode: { equals: code } },
          { status: { equals: 'active' } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      const c = existing.docs[0] as any
      return NextResponse.json({
        ok: true,
        alreadyIssued: true,
        coupon: { code: c.code, discountPercent: c.discountPercent, expiresAt: c.expiresAt },
      })
    }

    // 신규 발급 — 랜덤 코드 + 만료 30일
    const couponCode = `RF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const created = await payload.create({
      collection: 'coupons' as any,
      data: {
        code: couponCode,
        user: user.id,
        discountType: 'percent',
        discountPercent: 10,
        source: 'referral',
        referralCode: code,
        status: 'active',
        expiresAt,
      } as any,
      overrideAccess: true,
    })

    return NextResponse.json({
      ok: true,
      alreadyIssued: false,
      coupon: {
        code: (created as any).code,
        discountPercent: 10,
        expiresAt,
      },
    })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
