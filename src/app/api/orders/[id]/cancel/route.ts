import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * 회원이 무통장(direct-bank) 미결제 주문에 대해 취소를 요청.
 * POST /api/orders/{id}/cancel  body: { reason?: string }
 *
 * 동작:
 *  - status: pending → cancel_requested
 *  - 관리자 알림 메일 발송
 *  - 실제 취소 처리는 관리자가 어드민에서 승인 (cancel_requested → cancelled)
 */
export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params
    const body = (await request.json().catch(() => ({}))) as { reason?: string }
    const reason = (body.reason || '').trim().slice(0, 500)

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

    const ownerId = typeof order.user === 'object' ? order.user?.id : order.user
    if (String(ownerId) !== String(user.id)) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: '이미 처리된 주문은 취소 요청할 수 없습니다. 환불 절차로 진행해주세요.' },
        { status: 409 },
      )
    }

    const prevMemo = order.adminMemo || ''
    const reasonLine = reason ? `\n[취소 요청 사유] ${reason}` : ''
    const newMemo = `${prevMemo}${reasonLine}`.trim()

    await payload.update({
      collection: 'orders',
      id,
      data: {
        status: 'cancel_requested' as any,
        adminMemo: newMemo,
      } as any,
      overrideAccess: true,
      context: { skipNotify: true },
    })

    // 관리자 알림
    try {
      const adminTo = process.env.ADMIN_EMAIL || 'rex39@naver.com'
      await payload.sendEmail({
        to: adminTo,
        subject: `[AI놀자] 주문 취소 요청: ${order.orderNumber}`,
        html: `
          <div style="font-family:sans-serif;color:#333;line-height:1.6;">
            <h3 style="margin:0 0 12px;">주문 취소 요청</h3>
            <table cellpadding="4" cellspacing="0" style="font-size:13px;">
              <tr><td style="color:#999;width:90px;">주문번호</td><td>${order.orderNumber}</td></tr>
              <tr><td style="color:#999;">구매자</td><td>${order.buyerName || '-'} (${order.buyerEmail || '-'})</td></tr>
              <tr><td style="color:#999;">상품</td><td>${order.productName}</td></tr>
              <tr><td style="color:#999;">금액</td><td>${(order.amount || 0).toLocaleString()}원</td></tr>
              <tr><td style="color:#999;">사유</td><td>${reason || '(미입력)'}</td></tr>
            </table>
            <div style="margin-top:12px;font-size:13px;color:#555;">
              어드민에서 [취소 승인] 버튼을 눌러 처리해 주세요.
            </div>
          </div>
        `,
      })
    } catch (e) {
      console.error('[CANCEL REQUEST NOTIFY]', (e as Error).message)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
