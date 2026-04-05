import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { orderId, reason } = await request.json() as { orderId: string; reason: string }

    if (!orderId || !reason) {
      return NextResponse.json({ error: '환불 사유를 입력해주세요.' }, { status: 400 })
    }

    // 주문 확인
    const order = await payload.findByID({ collection: 'orders', id: orderId }) as any
    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 본인 주문인지 확인
    const orderUserId = typeof order.user === 'object' ? order.user?.id : order.user
    if (orderUserId !== user.id && (user as any).role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    // 환불 가능 상태 확인
    if (!['paid', 'active'].includes(order.status)) {
      return NextResponse.json({ error: '환불할 수 없는 주문 상태입니다.' }, { status: 400 })
    }

    // 환불 요청 상태로 변경
    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        status: 'refund_requested',
        refundReason: reason,
      },
    })

    return NextResponse.json({ ok: true, message: '환불 요청이 접수되었습니다.' })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
