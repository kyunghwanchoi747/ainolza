import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'
import { resolveGrantedClassrooms } from '@/lib/classroom-grant'
import {
  sendPaymentCompletedToBuyer,
  sendPaymentCompletedToAdmin,
  sendAdvancedClassGroupChat,
} from '@/lib/email-templates'

/**
 * 매니저 전용 — PortOne 결제 상태를 우리 DB로 강제 동기화.
 *
 * 사용 시나리오: 웹훅 일시 장애 등으로 PortOne은 paid인데 우리 DB는 pending인 주문 복구.
 * verify/webhook과 동일한 검증·반영 로직을 매니저 권한으로 한 번에 돌림.
 *
 * 입력: { orderNumber } 또는 { paymentId(=merchantUid) }
 * 출력: 동기화 결과(이전 status → 새 status, 부여된 classrooms, 메일 발송 여부)
 *
 * 인증: admin 권한 OR CRON_KEY (긴급 복구용)
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const providedKey = url.searchParams.get('key') || request.headers.get('x-cron-key') || ''
  const expectedKey = process.env.CRON_KEY || ''
  const hasCronAuth = expectedKey && providedKey === expectedKey
  if (!hasCronAuth) {
    const adminCheck = await requireAdmin(request)
    if (adminCheck) return adminCheck
  }

  const apiSecret = process.env.PORTONE_API_SECRET
  if (!apiSecret) {
    return NextResponse.json({ error: 'PORTONE_API_SECRET not set' }, { status: 500 })
  }

  let body: { orderNumber?: string; paymentId?: string; sendEmail?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
  const orderNumber = body.orderNumber?.trim()
  const paymentId = body.paymentId?.trim() || orderNumber
  const sendEmail = body.sendEmail !== false

  if (!paymentId) {
    return NextResponse.json({ error: 'orderNumber 또는 paymentId 필요' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  // 1. 우리 DB의 주문 조회
  const orders = await payload.find({
    collection: 'orders',
    where: { merchantUid: { equals: paymentId } },
    limit: 1,
    overrideAccess: true,
  })
  if (orders.totalDocs === 0) {
    return NextResponse.json({ error: 'order not found', paymentId }, { status: 404 })
  }
  const order = orders.docs[0] as any
  const prevStatus = order.status

  // 2. PortOne API로 실제 결제 상태 조회
  let paymentData: any
  try {
    const res = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `PortOne ${apiSecret}` },
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json(
        { error: 'PortOne fetch failed', status: res.status, body: errText },
        { status: 502 },
      )
    }
    paymentData = await res.json()
  } catch (e) {
    return NextResponse.json({ error: 'PortOne fetch threw', message: (e as Error).message }, { status: 502 })
  }

  // 3. 금액 검증 (PAID 일 때만 의미)
  const paidAmount = paymentData?.amount?.total ?? 0
  if (paymentData?.status === 'PAID' && paidAmount !== order.amount) {
    return NextResponse.json(
      { error: 'amount mismatch', orderAmount: order.amount, paidAmount },
      { status: 409 },
    )
  }

  // 4. 상태 매핑
  let newStatus: 'paid' | 'pending' | 'failed' | 'cancelled' = order.status
  if (paymentData?.status === 'PAID') newStatus = 'paid'
  else if (paymentData?.status === 'VIRTUAL_ACCOUNT_ISSUED') newStatus = 'pending'
  else if (paymentData?.status === 'FAILED') newStatus = 'failed'
  else if (paymentData?.status === 'CANCELLED') newStatus = 'cancelled'

  // 5. paid 전이일 때만 강의실 권한 부여
  const existing = Array.isArray(order.classrooms) ? [...order.classrooms] : []
  let grantedClassroomSlugs: string[] = existing
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
      grantedClassroomSlugs = resolveGrantedClassrooms(order.productSlug, product?.grantedClassroomSlugs, existing)
    } catch {
      grantedClassroomSlugs = resolveGrantedClassrooms(order.productSlug, null, existing)
    }
  }

  // 6. 결제수단 매핑
  const methodType = paymentData?.method?.type || ''
  const payMethodMap: Record<string, string> = {
    PaymentMethodCard: 'card',
    PaymentMethodTransfer: 'trans',
    PaymentMethodVirtualAccount: 'vbank',
    PaymentMethodEasyPay: 'kakaopay',
    PaymentMethodMobile: 'phone',
  }
  const payMethod = payMethodMap[methodType] || undefined

  // 7. 업데이트 데이터 조립
  const updateData: Record<string, any> = {
    impUid: paymentId,
    status: newStatus,
  }
  if (paymentData?.pgProvider) updateData.pgProvider = paymentData.pgProvider
  if (paymentData?.receiptUrl) updateData.receiptUrl = paymentData.receiptUrl
  if (payMethod) updateData.payMethod = payMethod
  if (grantedClassroomSlugs.length > 0) updateData.classrooms = grantedClassroomSlugs
  if (paymentData?.virtualAccount) {
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

  // 8. 결제완료 메일 발송 (옵션, paid 전이일 때만)
  const mailResults: Record<string, string> = {}
  if (sendEmail && newStatus === 'paid' && prevStatus !== 'paid') {
    try {
      await sendPaymentCompletedToBuyer(payload, {
        orderNumber: order.orderNumber,
        buyerName: order.buyerName,
        buyerEmail: order.buyerEmail,
        productName: order.productName,
        productType: order.productType,
        productSlug: order.productSlug,
        amount: order.amount,
        classrooms: grantedClassroomSlugs,
        shippingRecipient: order.shippingRecipient,
        shippingAddress: order.shippingAddress,
        shippingAddressDetail: order.shippingAddressDetail,
        shippingZipcode: order.shippingZipcode,
      })
      mailResults.buyer = 'sent'
    } catch (e) {
      mailResults.buyer = `failed: ${(e as Error).message}`
    }
    try {
      await sendPaymentCompletedToAdmin(payload, {
        id: order.id,
        orderNumber: order.orderNumber,
        buyerName: order.buyerName,
        buyerEmail: order.buyerEmail,
        productName: order.productName,
        amount: order.amount,
      })
      mailResults.admin = 'sent'
    } catch (e) {
      mailResults.admin = `failed: ${(e as Error).message}`
    }
    if (grantedClassroomSlugs.some((s) => typeof s === 'string' && s.startsWith('vibe-coding-advanced'))) {
      try {
        await sendAdvancedClassGroupChat(payload, { ...order, classrooms: grantedClassroomSlugs })
        mailResults.advancedGroupChat = 'sent'
      } catch (e) {
        mailResults.advancedGroupChat = `failed: ${(e as Error).message}`
      }
    }
  }

  return NextResponse.json({
    ok: true,
    orderNumber: order.orderNumber,
    prevStatus,
    newStatus,
    portoneStatus: paymentData?.status,
    classrooms: grantedClassroomSlugs,
    mailResults,
  })
}
