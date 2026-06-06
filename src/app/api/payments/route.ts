import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit, getClientIP } from '@/lib/rate-limit'
import { resolveCurrentPrice } from '@/lib/price-schedule'

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
      cashReceiptType?: 'income' | 'expense' | 'none'
      cashReceiptNumber?: string
      couponCode?: string
      referredByCode?: string
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
      cashReceiptType,
      cashReceiptNumber,
      couponCode,
      referredByCode,
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
    const baseAmount = resolved.price // 권위적 기준가 (priceSchedule 적용)
    const authoritativeOriginal = resolved.originalPrice ?? baseAmount
    if (!baseAmount || baseAmount <= 0) {
      return NextResponse.json({ error: '가격이 설정되지 않은 상품입니다.' }, { status: 400 })
    }

    // 쿠폰 검증 — 코드가 들어왔을 때만. 검증 실패하면 무시(쿠폰 없는 것처럼 동작).
    // 결제 시스템 코어 로직(기존 가격 검증)은 그대로, 쿠폰 할인은 외부 함수처럼 적용.
    let couponDiscount = 0
    let validatedCouponCode: string | undefined
    if (couponCode && couponCode.trim()) {
      try {
        const couponRes = await payloadEarly.find({
          collection: 'coupons' as any,
          where: {
            and: [
              { code: { equals: couponCode.trim().toUpperCase() } },
              { status: { equals: 'active' } },
            ],
          },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const coupon = couponRes.docs[0] as any
        if (coupon) {
          // 본인 쿠폰인지 확인 (auth 정보는 아직 잡기 전이므로 여기서 user 조회)
          let currentUserId: number | string | null = null
          try {
            const { user } = await payloadEarly.auth({ headers: request.headers })
            if (user) currentUserId = user.id
          } catch { /* 비로그인 */ }

          const couponOwnerId = typeof coupon.user === 'object' ? coupon.user?.id : coupon.user
          const ownerOk = currentUserId && String(currentUserId) === String(couponOwnerId)
          const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt).getTime() > Date.now()

          if (ownerOk && notExpired) {
            if (coupon.discountType === 'percent' && coupon.discountPercent) {
              couponDiscount = Math.floor((baseAmount * coupon.discountPercent) / 100)
            } else if (coupon.discountType === 'amount' && coupon.discountAmount) {
              couponDiscount = Math.min(coupon.discountAmount, baseAmount)
            }
            if (couponDiscount > 0) validatedCouponCode = coupon.code
          }
        }
      } catch (e) {
        console.error('[COUPON VALIDATE]', (e as Error).message)
      }
    }

    // 최종 결제 금액 = 기준가 - 쿠폰 할인
    const authoritativeAmount = baseAmount - couponDiscount

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

    // 쿠폰 사용 정보 기록
    if (validatedCouponCode && couponDiscount > 0) {
      orderData.couponCode = validatedCouponCode
      orderData.couponDiscountKrw = couponDiscount
    }

    // 추천(파트너스) 정보 — referredByCode가 들어왔으면 유효성 확인 후 기록.
    // 쿠폰의 referralCode와 일치하면 그것 사용, 아니면 클라이언트 전달 코드를 자체 검증.
    let resolvedReferralCode: string | undefined
    let resolvedReferrerUserId: number | string | undefined
    if (referredByCode && referredByCode.trim()) {
      const refCode = referredByCode.trim().toUpperCase()
      try {
        const refRes = await payload.find({
          collection: 'referrals' as any,
          where: { and: [{ code: { equals: refCode } }, { status: { equals: 'active' } }] },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const ref = refRes.docs[0] as any
        if (ref) {
          const referrerId = typeof ref.user === 'object' ? ref.user?.id : ref.user
          // 본인 추천 차단
          if (!userId || String(referrerId) !== String(userId)) {
            resolvedReferralCode = ref.code
            resolvedReferrerUserId = referrerId
          }
        }
      } catch (e) {
        console.error('[REFERRAL VALIDATE]', (e as Error).message)
      }
    }
    if (resolvedReferralCode) {
      orderData.referredByCode = resolvedReferralCode
      if (resolvedReferrerUserId) orderData.referrerUser = resolvedReferrerUserId
      // 보상액 = 최종 결제 금액의 20%
      orderData.referralRewardKrw = Math.floor(authoritativeAmount * 0.2)
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
      // 입금자명 기본값 = 회원 이름. 회원이 안내 화면에서 수정 가능.
      orderData.depositorName = buyerName || ''
      orderData.adminMemo = `무통장 입금 대기 — 입금자명: ${buyerName || '(미설정)'}, 예금주: 최경환`
    }

    // 현금영수증 — 계좌이체/무통장 결제 시에만 의미. 정보 수집만 저장.
    // 실제 발급은 어드민에서 수동 (자동 발급은 이니시스 부가서비스 활성화 후 별도 작업).
    if (cashReceiptType === 'income' || cashReceiptType === 'expense') {
      const num = (cashReceiptNumber || '').replace(/[^0-9]/g, '')
      // 형식 재검증
      const valid =
        cashReceiptType === 'income'
          ? /^01[016789]\d{7,8}$/.test(num) || /^\d{13}$/.test(num)
          : /^\d{10}$/.test(num)
      if (!valid) {
        return NextResponse.json(
          { error: '현금영수증 번호 형식이 올바르지 않습니다.' },
          { status: 400 },
        )
      }
      orderData.cashReceiptType = cashReceiptType
      orderData.cashReceiptNumber = num
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

    // 쿠폰 사용 처리 — 사용 완료로 마킹 (결제 실패 시에도 그대로. 어드민에서 수동 복구).
    if (validatedCouponCode && couponDiscount > 0) {
      try {
        const c = await payload.find({
          collection: 'coupons' as any,
          where: { code: { equals: validatedCouponCode } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const coupon = c.docs[0] as any
        if (coupon) {
          await payload.update({
            collection: 'coupons' as any,
            id: coupon.id,
            data: {
              status: 'redeemed',
              redeemedAt: new Date().toISOString(),
              redeemedOrderNumber: orderNumber,
            } as any,
            overrideAccess: true,
          })
        }
      } catch (e) {
        console.error('[COUPON REDEEM]', (e as Error).message)
      }
    }

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
