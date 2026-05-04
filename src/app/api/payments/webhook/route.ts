import { NextRequest, NextResponse } from 'next/server'
import * as PortOne from '@portone/server-sdk'
import { getPayloadClient } from '@/lib/payload'

/**
 * PortOne V2 결제 웹훅
 *
 * 처리 흐름:
 *  1) Standard Webhooks 스펙에 따라 헤더 서명 검증 (HMAC-SHA256)
 *  2) PortOne API로 실제 결제 상태 재조회 (위변조 방지)
 *  3) 우리 DB 주문 상태 업데이트 (paid/failed/cancelled)
 *
 * 등록: PortOne 대시보드 → 결제 연동 → 결제알림(Webhook) 관리
 *      URL: https://ainolza.kr/api/payments/webhook
 *      WEBHOOK_SECRET 환경변수에 발급된 시크릿 입력 필수
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.PORTONE_WEBHOOK_SECRET
  const apiSecret = process.env.PORTONE_API_SECRET

  if (!webhookSecret) {
    console.error('[WEBHOOK] PORTONE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }
  if (!apiSecret) {
    console.error('[WEBHOOK] PORTONE_API_SECRET not set')
    return NextResponse.json({ error: 'API not configured' }, { status: 500 })
  }

  // 1. 서명 검증 — 원본 raw body 필요
  const rawBody = await request.text()
  const headers = {
    'webhook-id': request.headers.get('webhook-id') || '',
    'webhook-timestamp': request.headers.get('webhook-timestamp') || '',
    'webhook-signature': request.headers.get('webhook-signature') || '',
  }

  let webhook: Awaited<ReturnType<typeof PortOne.Webhook.verify>>
  try {
    webhook = await PortOne.Webhook.verify(webhookSecret, rawBody, headers)
  } catch (e) {
    if (e instanceof PortOne.Webhook.WebhookVerificationError) {
      console.error('[WEBHOOK VERIFY]', e.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
    console.error('[WEBHOOK VERIFY UNKNOWN]', (e as Error).message)
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
  }

  // 2. 결제 관련 이벤트만 처리 (Transaction.* 만, BillingKey/Unrecognized는 무시)
  const wh = webhook as { type?: string; data?: { paymentId?: string } }
  if (typeof wh.type !== 'string' || !wh.type.startsWith('Transaction.')) {
    return NextResponse.json({ ok: true, ignored: 'non-transaction event' })
  }
  const paymentId = wh.data?.paymentId
  if (!paymentId) {
    return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 })
  }

  // 3. PortOne API로 실제 결제 상태 재조회 (서명 통과해도 한 번 더 검증)
  let payment: any
  try {
    const portone = PortOne.PortOneClient({ secret: apiSecret })
    payment = await portone.payment.getPayment({ paymentId })
  } catch (e) {
    console.error('[WEBHOOK GET PAYMENT]', (e as Error).message)
    return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 })
  }

  // 4. 주문 찾기
  const payloadClient = await getPayloadClient()
  const orders = await payloadClient.find({
    collection: 'orders',
    where: { merchantUid: { equals: paymentId } },
    limit: 1,
    overrideAccess: true,
  })
  if (orders.totalDocs === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  const order = orders.docs[0] as any

  // 5. 금액 위변조 검증
  const paidAmount = payment?.amount?.total ?? 0
  if (payment?.status === 'PAID' && paidAmount !== order.amount) {
    console.error(`[WEBHOOK AMOUNT MISMATCH] order=${order.amount} paid=${paidAmount}`)
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
  }

  // 6. 상태 매핑
  const updateData: Record<string, any> = { impUid: paymentId }
  if (payment?.status === 'PAID' && order.status !== 'paid') {
    updateData.status = 'paid'

    // 가상계좌 입금 완료 → 상품의 grantedClassroomSlugs를 Order.classrooms에 자동 부여
    if (order.productSlug) {
      try {
        const productResult = await payloadClient.find({
          collection: 'products',
          where: { slug: { equals: order.productSlug } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const product = productResult.docs[0] as any
        const granted: string[] = Array.isArray(order.classrooms) ? [...order.classrooms] : []
        const arr = Array.isArray(product?.grantedClassroomSlugs) ? product.grantedClassroomSlugs : []
        for (const item of arr) {
          const slug = typeof item === 'object' ? item.slug : item
          if (slug && !granted.includes(slug)) granted.push(slug)
        }
        if (granted.length > 0) updateData.classrooms = granted
      } catch (e) {
        console.error('[WEBHOOK GRANT CLASSROOM]', (e as Error).message)
      }
    }
  } else if (payment?.status === 'FAILED' && order.status !== 'failed') {
    updateData.status = 'failed'
  } else if (payment?.status === 'CANCELLED' && order.status !== 'cancelled') {
    updateData.status = 'cancelled'
  }

  if (Object.keys(updateData).length > 1) {
    await payloadClient.update({
      collection: 'orders',
      id: order.id,
      data: updateData,
      overrideAccess: true,
    })
  }

  return NextResponse.json({ ok: true })
}
