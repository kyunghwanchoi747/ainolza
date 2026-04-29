import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'

/**
 * 관리자 전용 — 환불 요청 승인 (PortOne API 호출 → 실제 환불 처리)
 *
 * 흐름:
 * 1. 주문 확인 (refund_requested 또는 paid 상태)
 * 2. PortOne API로 결제 취소 요청
 * 3. 성공 시 status='refunded' 업데이트
 */
export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck) return adminCheck

  try {
    const { orderId, reason } = (await request.json()) as { orderId: number; reason?: string }
    if (!orderId) {
      return NextResponse.json({ error: 'orderId 필수' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const order = (await payload.findByID({
      collection: 'orders',
      id: orderId,
      overrideAccess: true,
    })) as any

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
    }

    if (!['paid', 'active', 'refund_requested'].includes(order.status)) {
      return NextResponse.json({ error: '환불 가능한 상태가 아닙니다.' }, { status: 400 })
    }

    // TEST_ 주문은 PortOne 호출 없이 바로 status만 변경
    const isTest = typeof order.orderNumber === 'string' && order.orderNumber.startsWith('TEST_')
    if (!isTest) {
      // PortOne 환불 API 호출
      const portoneSecret = process.env.PORTONE_API_SECRET
      if (!portoneSecret) {
        return NextResponse.json({ error: 'PortOne 설정 오류' }, { status: 500 })
      }

      const paymentId = order.impUid || order.merchantUid
      if (!paymentId) {
        return NextResponse.json({ error: '결제 정보가 없는 주문입니다.' }, { status: 400 })
      }

      const cancelRes = await fetch(
        `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/cancel`,
        {
          method: 'POST',
          headers: {
            Authorization: `PortOne ${portoneSecret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: reason || order.refundReason || '관리자 승인 환불',
          }),
        },
      )

      if (!cancelRes.ok) {
        const errBody = await cancelRes.text()
        console.error('[PORTONE CANCEL]', cancelRes.status, errBody)
        return NextResponse.json(
          { error: `PortOne 환불 실패: ${errBody}` },
          { status: 400 },
        )
      }
    }

    // status = 'refunded' 로 업데이트 (afterChange 훅이 환불 완료 메일 발송)
    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        status: 'refunded',
        refundedAt: new Date().toISOString(),
        refundAmount: order.amount,
        refundReason: reason || order.refundReason || '관리자 승인 환불',
      } as any,
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[APPROVE REFUND]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
