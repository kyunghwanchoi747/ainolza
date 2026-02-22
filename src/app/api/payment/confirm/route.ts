import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const { paymentId, userId, items, shippingInfo, isFree } = (await req.json()) as {
      paymentId: string
      userId?: string
      items?: any[]
      shippingInfo?: any
      isFree?: boolean
    }

    if (!paymentId) {
      return NextResponse.json({ message: '결제 ID 누락' }, { status: 400 })
    }

    let amount = 0
    let payMethod = 'card'

    if (isFree) {
      // Free order: verify all items have price 0
      const allFree = (items || []).every((item: any) => (item.price ?? 0) === 0)
      if (!allFree) {
        return NextResponse.json({ message: '무료 주문 처리 오류' }, { status: 400 })
      }
      amount = 0
    } else {
      const secret = process.env.PORTONE_API_SECRET || ''

      // PortOne v2 결제 정보 조회 (서버사이드 검증)
      const portoneRes = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
        headers: {
          Authorization: `PortOne ${secret}`,
        },
      })

      const payment = (await portoneRes.json()) as {
        status?: string
        amount?: { total?: number }
        method?: { type?: string }
        orderName?: string
        message?: string
      }

      if (!portoneRes.ok) {
        return NextResponse.json(
          { message: payment.message || '결제 정보 조회 실패' },
          { status: portoneRes.status },
        )
      }

      if (payment.status !== 'PAID') {
        return NextResponse.json(
          { message: `결제 상태 오류: ${payment.status}` },
          { status: 400 },
        )
      }

      amount = payment.amount?.total ?? 0

      const methodMap: Record<string, string> = {
        PaymentMethodCard: 'card',
        PaymentMethodVirtualAccount: 'vbank',
        PaymentMethodTransfer: 'trans',
        PaymentMethodMobile: 'card',
        PaymentMethodGiftCertificate: 'card',
        PaymentMethodEasyPay: 'card',
      }
      payMethod = methodMap[payment.method?.type || ''] || 'card'
    }

    // Create order in Payload
    const payload = await getPayload()

    const orderData: any = {
      status: 'paid',
      amount,
      paymentInfo: {
        method: payMethod,
        transactionID: paymentId,
      },
      items: (items || []).map((item: any) => ({
        product: { value: item.id, relationTo: item.productType || 'products' },
        quantity: item.quantity,
        price: item.price,
      })),
    }

    if (userId) orderData.customer = userId
    if (shippingInfo?.receiverName) {
      orderData.shippingInfo = {
        receiverName: shippingInfo.receiverName,
        receiverPhone: shippingInfo.receiverPhone,
        address: `${shippingInfo.address} ${shippingInfo.addressDetail || ''}`.trim(),
        memo: shippingInfo.memo,
      }
    }

    const order = await payload.create({
      collection: 'orders',
      data: orderData,
    })

    // Update user's cumulative purchase amount
    if (userId && amount > 0) {
      try {
        const userDoc = await payload.findByID({ collection: 'users', id: userId })
        await payload.update({
          collection: 'users',
          id: userId,
          data: {
            purchaseAmount: ((userDoc.purchaseAmount as number) || 0) + amount,
          },
        })
      } catch {}
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err: any) {
    console.error('[Payment Confirm]', err)
    return NextResponse.json({ message: err.message || '서버 오류' }, { status: 500 })
  }
}
