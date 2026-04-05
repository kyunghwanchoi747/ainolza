import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// 결제 검증 (PortOne 연동 후 활성화)
export async function POST(request: NextRequest) {
  try {
    const { impUid, merchantUid } = await request.json() as { impUid: string; merchantUid: string }

    if (!impUid || !merchantUid) {
      return NextResponse.json({ error: '결제 정보가 누락되었습니다.' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // 주문 찾기
    const orders = await payload.find({
      collection: 'orders',
      where: { merchantUid: { equals: merchantUid } },
      limit: 1,
    })

    if (orders.totalDocs === 0) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
    }

    const order = orders.docs[0] as any

    // TODO: PortOne API로 실제 결제 검증
    // const portoneSecret = process.env.PORTONE_API_SECRET
    // const verifyRes = await fetch(`https://api.portone.io/v2/payments/${impUid}`, {
    //   headers: { Authorization: `PortOne ${portoneSecret}` }
    // })
    // const paymentData = await verifyRes.json()
    // if (paymentData.amount !== order.amount) → 위변조 감지

    // 임시: 주문 상태 업데이트 (PortOne 연동 전까지)
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        impUid,
        status: 'paid',
      },
    })

    return NextResponse.json({ ok: true, status: 'paid', orderNumber: order.orderNumber })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
