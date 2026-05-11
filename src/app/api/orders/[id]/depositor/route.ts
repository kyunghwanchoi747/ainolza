import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * 입금자명 변경 + 관리자 알림.
 * PATCH /api/orders/{id}/depositor  body: { depositorName: string }
 *
 * 권한: 본인 주문만 변경 가능 (user.id 일치).
 * status가 'pending'일 때만 변경 가능.
 */
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params
    const body = (await request.json()) as { depositorName?: string }
    const newName = (body.depositorName || '').trim()
    if (!newName) {
      return NextResponse.json({ error: '입금자명을 입력해주세요.' }, { status: 400 })
    }
    if (newName.length > 20) {
      return NextResponse.json({ error: '입금자명은 20자 이내로 입력해주세요.' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const order = (await payload.findByID({
      collection: 'orders',
      id,
      depth: 0,
      overrideAccess: true,
    })) as any
    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 본인 주문인지 확인
    const ownerId = typeof order.user === 'object' ? order.user?.id : order.user
    if (String(ownerId) !== String(user.id)) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    // pending 상태에서만 변경 허용
    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: '이미 결제 처리가 시작된 주문은 입금자명을 변경할 수 없습니다.' },
        { status: 409 },
      )
    }

    const oldName = order.depositorName || order.buyerName || ''
    if (oldName === newName) {
      return NextResponse.json({ ok: true, depositorName: newName })
    }

    await payload.update({
      collection: 'orders',
      id,
      data: { depositorName: newName } as any,
      overrideAccess: true,
      context: { skipNotify: true }, // afterChange 메일 차단 (별도 알림 발송)
    })

    // 관리자 알림 — 입금자명 변경
    try {
      const adminTo = process.env.ADMIN_EMAIL || 'rex39@naver.com'
      await payload.sendEmail({
        to: adminTo,
        subject: `[AI놀자] 입금자명 변경: ${order.orderNumber}`,
        html: `
          <div style="font-family:sans-serif;color:#333;line-height:1.6;">
            <h3 style="margin:0 0 12px;">입금자명 변경 안내</h3>
            <table cellpadding="4" cellspacing="0" style="font-size:13px;">
              <tr><td style="color:#999;width:90px;">주문번호</td><td>${order.orderNumber}</td></tr>
              <tr><td style="color:#999;">구매자</td><td>${order.buyerName || '-'} (${order.buyerEmail || '-'})</td></tr>
              <tr><td style="color:#999;">상품</td><td>${order.productName}</td></tr>
              <tr><td style="color:#999;">금액</td><td>${(order.amount || 0).toLocaleString()}원</td></tr>
              <tr><td style="color:#999;">이전 입금자명</td><td>${oldName || '(미설정)'}</td></tr>
              <tr><td style="color:#999;">새 입금자명</td><td><strong>${newName}</strong></td></tr>
            </table>
          </div>
        `,
      })
    } catch (e) {
      console.error('[DEPOSITOR CHANGE NOTIFY]', (e as Error).message)
    }

    return NextResponse.json({ ok: true, depositorName: newName })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
