import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

// 주문 생성 (결제 전)
export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  const { allowed } = rateLimit(`payment:${ip}`, 10, 60000)
  if (!allowed) {
    return NextResponse.json({ error: '요청이 너무 많습니다.' }, { status: 429 })
  }

  try {
    const body = await request.json() as {
      productName: string
      productSlug: string
      productType: string
      amount: number
      originalAmount?: number
      buyerName: string
      buyerEmail: string
      buyerPhone?: string
    }

    const { productName, productSlug, productType, amount, originalAmount, buyerName, buyerEmail, buyerPhone } = body

    if (!productName || !amount || !buyerName || !buyerEmail) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
    }

    // 주문번호 생성
    const now = new Date()
    const orderNumber = `ORD${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${Date.now().toString(36).toUpperCase()}`

    const payload = await getPayloadClient()

    // 로그인 사용자 확인
    let userId = null
    try {
      const { user } = await payload.auth({ headers: request.headers })
      if (user) userId = user.id
    } catch { /* 비로그인 */ }

    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        productName,
        productSlug: productSlug || '',
        productType: productType || 'class',
        amount,
        originalAmount: originalAmount || amount,
        buyerName,
        buyerEmail,
        buyerPhone: buyerPhone || '',
        user: userId,
        status: 'pending',
        merchantUid: orderNumber,
      },
    })

    return NextResponse.json({
      ok: true,
      orderNumber,
      orderId: order.id,
      merchantUid: orderNumber,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// 주문 내역 조회 (로그인 사용자)
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const orders = await payload.find({
      collection: 'orders',
      where: { user: { equals: user.id } },
      sort: '-createdAt',
      limit: 50,
    })

    return NextResponse.json({ orders: orders.docs })
  } catch {
    return NextResponse.json({ orders: [] })
  }
}
