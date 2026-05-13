import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import * as PortOne from '@portone/server-sdk'
import { getPayloadClient } from '@/lib/payload'
import { resolveGrantedClassrooms } from '@/lib/classroom-grant'

/**
 * PortOne V2 결제 웹훅 — 정공법 설계
 *
 * 설계 원칙:
 *  1) Idempotency — webhook-id 헤더를 PK로 dedup. 같은 이벤트가 N번 와도 한 번만 처리.
 *  2) 빠른 200 — 서명 검증 + dedup 기록까지만 동기 처리하고, 실제 결제 검증/주문 갱신은
 *     after()로 백그라운드 실행. 포트원의 5초 SLA를 확실히 지킴.
 *  3) 응답 코드 의미 명확화 — 200/4xx/5xx의 의미를 PortOne 재시도 정책 기준으로 분리.
 *     - 200: 정상 처리 / 이미 처리됨 / 우리가 무시하기로 한 이벤트 (재시도 안 함)
 *     - 4xx: 영구 실패 — 서명 위조 등 재시도해도 결과 안 바뀌는 케이스 (재시도 안 함)
 *     - 5xx: 일시 장애 — 우리가 다음 시도 때 성공 가능성이 있을 때만 (재시도 받음)
 *  4) 최상위 try/catch — 어떤 throw도 빈 500으로 빠져나가지 않게 보장.
 *  5) 관측성 — webhook_events 컬렉션에 모든 수신 이벤트를 영구 기록 (재처리/디버깅 자산).
 *
 * 등록: PortOne 대시보드 → 결제연동 → 결제알림(Webhook) 관리
 *      URL: https://ainolza.kr/api/payments/webhook
 *      PORTONE_WEBHOOK_SECRET / PORTONE_API_SECRET 환경변수 필수
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.PORTONE_WEBHOOK_SECRET
  const apiSecret = process.env.PORTONE_API_SECRET

  // === 환경변수 누락은 명백한 일시 장애(배포 설정 오류) — 5xx로 재시도 받음 ===
  if (!webhookSecret || !apiSecret) {
    console.error('[WEBHOOK CONFIG]', {
      hasWebhookSecret: !!webhookSecret,
      hasApiSecret: !!apiSecret,
    })
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  // === 1. 헤더 + 원본 body 추출 ===
  const webhookId = request.headers.get('webhook-id') || ''
  const webhookTs = request.headers.get('webhook-timestamp') || ''
  const webhookSig = request.headers.get('webhook-signature') || ''
  const rawBody = await request.text()

  // webhook-id가 없으면 PortOne 정식 요청이 아님 — 영구 실패
  if (!webhookId) {
    console.error('[WEBHOOK] missing webhook-id header')
    return NextResponse.json({ error: 'Missing webhook-id' }, { status: 400 })
  }

  // === 2. 서명 검증 — 위조 차단. 실패는 영구 4xx. ===
  let webhook: Awaited<ReturnType<typeof PortOne.Webhook.verify>>
  try {
    webhook = await PortOne.Webhook.verify(webhookSecret, rawBody, {
      'webhook-id': webhookId,
      'webhook-timestamp': webhookTs,
      'webhook-signature': webhookSig,
    })
  } catch (e) {
    if (e instanceof PortOne.Webhook.WebhookVerificationError) {
      console.error('[WEBHOOK VERIFY]', { webhookId, message: e.message })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
    console.error('[WEBHOOK VERIFY UNKNOWN]', { webhookId, message: (e as Error).message })
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
  }

  const wh = webhook as { type?: string; data?: { paymentId?: string } }
  const eventType = typeof wh.type === 'string' ? wh.type : null
  const paymentId = wh.data?.paymentId ?? null

  // === 3. dedup — 이미 본 webhookId면 즉시 200 ===
  // 여기부터 최상위 try/catch로 감싸서 DB 장애 등 unhandled throw 차단.
  try {
    const payload = await getPayloadClient()

    const existing = await payload.find({
      collection: 'webhook_events',
      where: { webhookId: { equals: webhookId } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) {
      const prev = existing.docs[0] as any
      // 재시도 카운트만 증가시키고 즉시 200 — 같은 이벤트를 두 번 처리하지 않음.
      await payload.update({
        collection: 'webhook_events',
        id: prev.id,
        data: { attempts: (prev.attempts ?? 1) + 1 },
        overrideAccess: true,
      }).catch((e) => {
        // attempts 업데이트 실패는 본질이 아니므로 로그만.
        console.error('[WEBHOOK DEDUP UPDATE]', { webhookId, message: (e as Error).message })
      })
      return NextResponse.json({ ok: true, dedup: true, status: prev.status })
    }

    // === 4. 처리 불필요한 이벤트는 'ignored'로 기록하고 200 ===
    // Transaction.* 이외(BillingKey 등)는 우리 도메인에서 처리할 이유 없음.
    if (!eventType || !eventType.startsWith('Transaction.')) {
      await payload.create({
        collection: 'webhook_events',
        data: {
          webhookId,
          source: 'portone',
          eventType: eventType ?? null,
          paymentId,
          status: 'ignored',
          processedAt: new Date().toISOString(),
          rawPayload: rawBody,
        } as any,
        overrideAccess: true,
      })
      return NextResponse.json({ ok: true, ignored: 'non-transaction event' })
    }

    if (!paymentId) {
      await payload.create({
        collection: 'webhook_events',
        data: {
          webhookId,
          source: 'portone',
          eventType,
          paymentId: null,
          status: 'ignored',
          lastError: 'paymentId missing',
          processedAt: new Date().toISOString(),
          rawPayload: rawBody,
        } as any,
        overrideAccess: true,
      })
      // paymentId 없이 온 Transaction 이벤트는 우리가 할 게 없음 — 영구 무시(200).
      return NextResponse.json({ ok: true, ignored: 'no paymentId' })
    }

    // === 5. 'pending' 으로 즉시 기록 → 200 응답 → 백그라운드 처리 ===
    // 같은 이벤트가 응답 중 또 들어와도 4번 분기(dedup)에 걸려 중복 처리되지 않음.
    const eventRecord = await payload.create({
      collection: 'webhook_events',
      data: {
        webhookId,
        source: 'portone',
        eventType,
        paymentId,
        status: 'pending',
        rawPayload: rawBody,
      } as any,
      overrideAccess: true,
    })

    // 백그라운드 — 5초 SLA 보장
    after(async () => {
      await processTransactionEvent({
        eventRecordId: (eventRecord as any).id,
        paymentId,
        apiSecret,
      })
    })

    return NextResponse.json({ ok: true, accepted: true })
  } catch (error) {
    // dedup/기록 단계에서 throw — DB 일시 장애 가능성. 5xx로 포트원 재시도 받음.
    const message = error instanceof Error ? error.message : 'unknown'
    console.error('[WEBHOOK FATAL]', { webhookId, paymentId, message })
    return NextResponse.json({ error: 'Internal error', message }, { status: 500 })
  }
}

/**
 * 실제 결제 검증 + 주문 상태 업데이트 — 응답 후 백그라운드에서 수행.
 *
 * 여기서 throw가 나도 응답에는 영향 없음. webhook_events 레코드의 status를
 * 'failed'로 마킹하고 lastError를 남겨서 어드민이 사후 재처리할 수 있게 함.
 */
async function processTransactionEvent(args: {
  eventRecordId: string | number
  paymentId: string
  apiSecret: string
}) {
  const { eventRecordId, paymentId, apiSecret } = args

  const payload = await getPayloadClient()

  const markFailed = async (stage: string, message: string) => {
    console.error(`[WEBHOOK BG ${stage}]`, { paymentId, message })
    await payload.update({
      collection: 'webhook_events',
      id: eventRecordId as any,
      data: {
        status: 'failed',
        lastError: `[${stage}] ${message}`,
        processedAt: new Date().toISOString(),
      } as any,
      overrideAccess: true,
    }).catch(() => {})
  }

  const markDone = async (note: 'processed' | 'ignored', message?: string) => {
    await payload.update({
      collection: 'webhook_events',
      id: eventRecordId as any,
      data: {
        status: note,
        lastError: message ?? null,
        processedAt: new Date().toISOString(),
      } as any,
      overrideAccess: true,
    }).catch(() => {})
  }

  // 1. PortOne API로 결제 상태 재조회 (서명 통과해도 위변조 방지 차원에서 한 번 더)
  let payment: any
  try {
    const portone = PortOne.PortOneClient({ secret: apiSecret })
    payment = await portone.payment.getPayment({ paymentId })
  } catch (e) {
    await markFailed('GET_PAYMENT', (e as Error).message)
    return
  }

  // 2. 주문 조회
  let orders: Awaited<ReturnType<typeof payload.find>>
  try {
    orders = await payload.find({
      collection: 'orders',
      where: { merchantUid: { equals: paymentId } },
      limit: 1,
      overrideAccess: true,
    })
  } catch (e) {
    await markFailed('FIND_ORDER', (e as Error).message)
    return
  }

  if (orders.totalDocs === 0) {
    // 우리가 모르는 주문 — 영구 무시. PortOne 측 테스트 결제나 외부 결제일 수 있음.
    await markDone('ignored', 'order not found for paymentId')
    return
  }
  const order = orders.docs[0] as any

  // 3. 금액 검증 — PAID 상태에서만 의미 있음
  const paidAmount = payment?.amount?.total ?? 0
  if (payment?.status === 'PAID' && paidAmount !== order.amount) {
    await markFailed('AMOUNT_MISMATCH', `order=${order.amount} paid=${paidAmount}`)
    return
  }

  // 4. 상태 전이 — 이미 같은 상태면 아무것도 안 함(idempotent)
  const updateData: Record<string, any> = { impUid: paymentId }

  if (payment?.status === 'PAID' && order.status !== 'paid') {
    updateData.status = 'paid'

    // 강의실 권한 자동 부여
    if (order.productSlug) {
      const existing = Array.isArray(order.classrooms) ? [...order.classrooms] : []
      try {
        const productResult = await payload.find({
          collection: 'products',
          where: { slug: { equals: order.productSlug } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const product = productResult.docs[0] as any
        const granted = resolveGrantedClassrooms(
          order.productSlug,
          product?.grantedClassroomSlugs,
          existing,
        )
        if (granted.length > 0) updateData.classrooms = granted
      } catch (e) {
        console.error('[WEBHOOK BG GRANT_CLASSROOM]', { paymentId, message: (e as Error).message })
        const granted = resolveGrantedClassrooms(order.productSlug, null, existing)
        if (granted.length > 0) updateData.classrooms = granted
      }
    }
  } else if (payment?.status === 'FAILED' && order.status !== 'failed') {
    updateData.status = 'failed'
  } else if (payment?.status === 'CANCELLED' && order.status !== 'cancelled') {
    updateData.status = 'cancelled'
  }

  if (Object.keys(updateData).length > 1) {
    try {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: updateData,
        overrideAccess: true,
      })
    } catch (e) {
      await markFailed('UPDATE_ORDER', (e as Error).message)
      return
    }
  }

  await markDone('processed')
}
