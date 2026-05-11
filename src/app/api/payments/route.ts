import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit, getClientIP } from '@/lib/rate-limit'
import { resolveCurrentPrice } from '@/lib/price-schedule'
import { checkEligibility } from '@/lib/eligibility'

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
      payMethod?: string
      shippingRecipient?: string
      shippingPhone?: string
      shippingZipcode?: string
      shippingAddress?: string
      shippingAddressDetail?: string
      shippingMessage?: string
    }

    const {
      productName,
      productSlug,
      productType,
      amount,
      buyerName,
      buyerEmail,
      buyerPhone,
      payMethod,
      shippingRecipient,
      shippingPhone,
      shippingZipcode,
      shippingAddress,
      shippingAddressDetail,
      shippingMessage,
    } = body

    if (!productName || !buyerName || !buyerEmail) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
    }
    if (!productSlug) {
      return NextResponse.json({ error: '상품 정보가 없습니다.' }, { status: 400 })
    }

    // 가격은 서버에서 권위적으로 결정 — 클라이언트 amount는 신뢰하지 않음.
    // productSlug로 DB 조회 → priceSchedule 적용 → 현재 시각의 적용 가격 사용.
    const payloadEarly = await getPayloadClient()
    const productResult = await payloadEarly.find({
      collection: 'products',
      where: { slug: { equals: productSlug } },
      limit: 1,
      overrideAccess: true,
    })
    const productDoc = productResult.docs[0] as any
    if (!productDoc) {
      return NextResponse.json({ error: '존재하지 않는 상품입니다.' }, { status: 400 })
    }
    const resolved = resolveCurrentPrice({
      price: productDoc.price ?? null,
      originalPrice: productDoc.originalPrice ?? null,
      priceSchedule: productDoc.priceSchedule || [],
    })
    const authoritativeAmount = resolved.price
    const authoritativeOriginal = resolved.originalPrice ?? authoritativeAmount
    if (!authoritativeAmount || authoritativeAmount <= 0) {
      return NextResponse.json({ error: '가격이 설정되지 않은 상품입니다.' }, { status: 400 })
    }
    // 클라이언트가 보낸 amount와 1원이라도 다르면 거부 → UI 결제버튼/서버 가격 일치 보장
    if (typeof amount === 'number' && amount !== authoritativeAmount) {
      return NextResponse.json(
        { error: '가격이 변경되었습니다. 페이지를 새로고침 후 다시 진행해주세요.' },
        { status: 409 },
      )
    }

    // 주문번호 생성
    const now = new Date()
    const orderNumber = `ORD${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${Date.now().toString(36).toUpperCase()}`

    const payload = payloadEarly

    // 로그인 사용자 확인
    let userId: number | string | null = null
    try {
      const { user } = await payload.auth({ headers: request.headers })
      if (user) userId = user.id
    } catch { /* 비로그인 */ }

    // 선수강 자격 검증 — 심화 단독 등 prerequisite 상품 차단
    const eligibility = await checkEligibility(payload, productSlug, userId)
    if (!eligibility.eligible) {
      return NextResponse.json(
        { error: eligibility.reason || '결제 자격이 없습니다.' },
        { status: 403 },
      )
    }

    const orderData: Record<string, any> = {
      orderNumber,
      productName,
      productSlug: productSlug || '',
      productType: (productType || 'class') as 'class' | 'ebook' | 'book' | 'bundle',
      amount: authoritativeAmount,
      originalAmount: authoritativeOriginal,
      buyerName,
      buyerEmail,
      buyerPhone: buyerPhone || '',
      user: userId,
      status: 'pending',
      merchantUid: orderNumber,
    }

    // 무통장 입금 — payMethod=trans, vbankDate에 24시간 마감 저장.
    // 마감 시각이 지나면 cron이 자동 취소 처리.
    if (payMethod === 'DIRECT_BANK') {
      orderData.payMethod = 'trans'
      orderData.pgProvider = 'direct-bank'
      const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
      orderData.vbankDate = expiry.toISOString()
      orderData.vbankName = '토스뱅크'
      orderData.vbankNum = '1000-1041-3507'
      orderData.adminMemo = `무통장 입금 대기 — 입금자명: 주문번호 끝6자리 (${orderNumber.slice(-6)}), 예금주: 최경환`
    }

    // 배송 정보가 있으면 저장 (종이책 등)
    if (shippingRecipient && shippingAddress) {
      orderData.shippingRecipient = shippingRecipient
      orderData.shippingPhone = shippingPhone
      orderData.shippingZipcode = shippingZipcode
      orderData.shippingAddress = shippingAddress
      orderData.shippingAddressDetail = shippingAddressDetail
      orderData.shippingMessage = shippingMessage
      orderData.shippingStatus = 'pending'
    }

    const order = await payload.create({
      collection: 'orders',
      data: orderData as any,
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
