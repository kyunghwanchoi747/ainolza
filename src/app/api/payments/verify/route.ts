import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * PortOne V2 결제 검증
 * 1. PortOne API로 실제 결제 정보 조회
 * 2. 주문 금액과 결제 금액 비교 (위변조 방지)
 * 3. 검증 통과 시 주문 status 'paid'로 업데이트
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentId, merchantUid } = (await request.json()) as {
      paymentId: string
      merchantUid: string
    }

    if (!paymentId || !merchantUid) {
      return NextResponse.json({ error: '결제 정보가 누락되었습니다.' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // 1. 주문 조회
    const orders = await payload.find({
      collection: 'orders',
      where: { merchantUid: { equals: merchantUid } },
      limit: 1,
      overrideAccess: true,
    })

    if (orders.totalDocs === 0) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
    }

    const order = orders.docs[0] as any

    // 2. PortOne API로 실제 결제 정보 조회
    const portoneSecret = process.env.PORTONE_API_SECRET
    if (!portoneSecret) {
      return NextResponse.json({ error: '결제 서버 설정 오류입니다.' }, { status: 500 })
    }

    const verifyRes = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `PortOne ${portoneSecret}` },
    })

    if (!verifyRes.ok) {
      const errBody = await verifyRes.text()
      console.error('[PORTONE VERIFY]', verifyRes.status, errBody)
      return NextResponse.json({ error: '결제 검증 실패' }, { status: 400 })
    }

    const paymentData = (await verifyRes.json()) as {
      status: string
      amount?: { total: number }
      pgProvider?: string
      pgTxId?: string
      method?: { type?: string }
      receiptUrl?: string
      virtualAccount?: {
        bank: string
        accountNumber: string
        expiredAt: string
      }
    }

    // 3. 금액 검증 (위변조 방지)
    const paidAmount = paymentData.amount?.total ?? 0
    if (paidAmount !== order.amount) {
      console.error(`[PORTONE VERIFY] 금액 불일치: 주문 ${order.amount}, 결제 ${paidAmount}`)
      return NextResponse.json({ error: '결제 금액이 일치하지 않습니다.' }, { status: 400 })
    }

    // 4. 상태 매핑
    let newStatus: 'paid' | 'pending' | 'failed' = 'pending'
    if (paymentData.status === 'PAID') newStatus = 'paid'
    else if (paymentData.status === 'VIRTUAL_ACCOUNT_ISSUED') newStatus = 'pending'
    else if (paymentData.status === 'FAILED' || paymentData.status === 'CANCELLED') newStatus = 'failed'

    // 5. 결제수단 매핑 (Payload Orders 스키마 기준)
    const methodType = paymentData.method?.type || ''
    const payMethodMap: Record<string, string> = {
      PaymentMethodCard: 'card',
      PaymentMethodTransfer: 'trans',
      PaymentMethodVirtualAccount: 'vbank',
      PaymentMethodEasyPay: 'kakaopay',
      PaymentMethodMobile: 'phone',
    }
    const payMethod = payMethodMap[methodType] || undefined

    // 6. 결제 완료 시 — 상품에 연결된 강의실 권한 자동 부여
    const grantedClassroomSlugs: string[] = Array.isArray(order.classrooms) ? [...order.classrooms] : []
    if (newStatus === 'paid' && order.productSlug) {
      try {
        const productResult = await payload.find({
          collection: 'products',
          where: { slug: { equals: order.productSlug } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const product = productResult.docs[0] as any
        const arr = Array.isArray(product?.grantedClassroomSlugs) ? product.grantedClassroomSlugs : []
        for (const item of arr) {
          const slug = typeof item === 'object' ? item.slug : item
          if (slug && !grantedClassroomSlugs.includes(slug)) {
            grantedClassroomSlugs.push(slug)
          }
        }
      } catch (e) {
        console.error('[VERIFY GRANT CLASSROOM]', (e as Error).message)
      }
    }

    // 7. 주문 업데이트
    const updateData: Record<string, any> = {
      impUid: paymentId,
      status: newStatus,
      pgProvider: paymentData.pgProvider || undefined,
      receiptUrl: paymentData.receiptUrl || undefined,
    }
    if (grantedClassroomSlugs.length > 0) {
      updateData.classrooms = grantedClassroomSlugs
    }
    if (payMethod) updateData.payMethod = payMethod
    if (paymentData.virtualAccount) {
      updateData.vbankName = paymentData.virtualAccount.bank
      updateData.vbankNum = paymentData.virtualAccount.accountNumber
      updateData.vbankDate = paymentData.virtualAccount.expiredAt
    }

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: updateData,
      overrideAccess: true,
    })

    return NextResponse.json({
      ok: true,
      status: newStatus,
      orderNumber: order.orderNumber,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[PORTONE VERIFY ERROR]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
