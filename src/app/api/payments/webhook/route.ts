import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// 결제 웹훅 (가상계좌 입금 확인 등)
// PortOne 대시보드에서 이 URL을 웹훅으로 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      imp_uid: string
      merchant_uid: string
      status: string
    }

    const { imp_uid, merchant_uid, status } = body

    if (!imp_uid || !merchant_uid) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // 주문 찾기
    const orders = await payload.find({
      collection: 'orders',
      where: { merchantUid: { equals: merchant_uid } },
      limit: 1,
    })

    if (orders.totalDocs === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orders.docs[0] as any

    // TODO: PortOne API로 실제 결제 검증 후 상태 업데이트
    // 가상계좌 입금 확인: status === 'paid'
    // 가상계좌 입금 기한 초과: status === 'cancelled'

    if (status === 'paid') {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: { impUid: imp_uid, status: 'paid' },
      })
    } else if (status === 'cancelled') {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'cancelled' },
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
